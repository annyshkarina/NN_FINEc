import { audioPlayer, bindAudioPlayer } from "../components/audioPlayer.js";
import { button, linkButton } from "../components/button.js";
import { card } from "../components/card.js";
import { mapPanel } from "../components/mapPanel.js";
import { mascotCat } from "../components/mascotCat.js";
import { showPointModal } from "../components/pointModal.js";
import { progressBar } from "../components/progressBar.js";
import { DEMO_MODE_STORAGE_KEY } from "../utils/storageKeys.js";

/**
 * @param {any} ctx
 */
export async function runPage(ctx) {
  const { routeEngine, store, contentService } = ctx;
  const state = store.getState();

  if (!state.selectedRouteId) {
    return {
      activeNav: "run",
      html: card({
        title: "Маршрут",
        body: `<p class="text-muted">Выберите маршрут и транспорт перед началом.</p>`,
        footer: linkButton({ label: "Выбрать маршрут", href: "#/excursions", variant: "primary" }),
      }),
    };
  }

  const bundle = await routeEngine.getSelectedRouteBundle();
  const config = await contentService.getConfig();

  if (!bundle) {
    return {
      activeNav: "run",
      html: card({
        title: "Маршрут",
        body: `<p class="text-muted">Данные маршрута недоступны.</p>`,
      }),
    };
  }

  const currentPoint = await routeEngine.getCurrentPoint();
  const progress = await routeEngine.getProgress();

  if (!currentPoint) {
    return {
      activeNav: "run",
      html: card({
        title: "Маршрут",
        body: `<p class="text-muted">Для этого маршрута пока не настроены точки.</p>`,
      }),
    };
  }

  const reached = state.reachedPoints.includes(currentPoint.id);
  const hasApiKey = Boolean(config.YANDEX_MAPS_API_KEY.trim());
  const geolocationSupported = ctx.geolocationService.isSupported();
  const demoModeEnabled = isDemoModeEnabled();
  const hasArticleRef = typeof currentPoint.articleId === "string" && currentPoint.articleId.trim() !== "";
  const hasTaskRef = typeof currentPoint.taskId === "string" && currentPoint.taskId.trim() !== "";
  const currentPointIndex = Math.max(0, bundle.points.findIndex((point) => point.id === currentPoint.id));
  const canMoveToNextPoint = reached || demoModeEnabled;

  const body = `
    <article class="run-header">
      <h2>${bundle.route.title}</h2>
      <p class="text-muted">Текущая точка: ${currentPointIndex + 1}/${bundle.points.length}</p>
      ${progressBar({ label: "Пройдено точек", value: progress.reached, max: progress.total })}
    </article>

    ${mascotCat({
      variant: "run",
      compact: true,
      message: "Ищите детали на месте: по ним открываются статьи и задания.",
    })}

    ${mapPanel({ hasApiKey })}

    <section class="run-status" data-run-status>
      Ожидание геолокации...
    </section>

    <article class="point-card">
      <header>
        <h3>${currentPoint.title}</h3>
        <p class="text-muted">${currentPoint.address}</p>
      </header>
      <p>${currentPoint.fullDescription}</p>
      <p><strong>Финансовый вывод:</strong> ${currentPoint.financialInsight}</p>
      <p><strong>Навигация:</strong> ${currentPoint.logistics}</p>

      ${audioPlayer({
        pointId: currentPoint.id,
        audioSrc: currentPoint.audioSrc,
        speed: state.audioSpeed,
      })}

      <div class="inline-actions">
        ${linkButton({
          label: hasArticleRef ? "Открыть статью" : "Статья закрыта",
          href: hasArticleRef ? `#/articles/${currentPoint.articleId}` : "#",
          attrs: (reached && hasArticleRef) ? "" : "aria-disabled=true data-locked-content=true",
        })}
        ${linkButton({
          label: hasTaskRef ? "Открыть задание" : "Задание закрыто",
          href: hasTaskRef ? `#/tasks/${currentPoint.taskId}` : "#",
          attrs: (reached && hasTaskRef) ? "" : "aria-disabled=true data-locked-content=true",
        })}
      </div>

      <div class="inline-actions">
        ${button({
          label: reached ? "Точка достигнута" : "Я на точке",
          variant: "primary",
          attrs: `data-manual-reach ${(geolocationSupported && !demoModeEnabled) ? "hidden" : ""} ${reached ? "disabled" : ""}`,
        })}
        ${button({
          label: "Следующая точка",
          attrs: `data-next-point ${canMoveToNextPoint ? "" : "disabled"}`,
        })}
        ${button({
          label: "Завершить маршрут",
          variant: "danger",
          attrs: "data-finish-route",
        })}
      </div>
      <div class="inline-actions">
        ${button({
          label: demoModeEnabled ? "Выключить демо-режим" : "Включить демо-режим",
          attrs: "data-demo-toggle",
        })}
      </div>
      <p class="text-muted" data-geo-fallback hidden>
        ${demoModeEnabled
          ? "Демо-режим включен. Маршрут можно пройти вручную."
          : "Геолокация недоступна. Вы можете пройти маршрут вручную."
        }
      </p>
    </article>
  `;

  return {
    activeNav: "run",
    html: card({
      title: "Прохождение маршрута",
      body,
      footer: `
        <div class="inline-actions">
          ${linkButton({ label: "Транспорт", href: "#/transport" })}
          ${linkButton({ label: "Задания", href: "#/tasks" })}
          ${linkButton({ label: "Статьи", href: "#/articles" })}
        </div>
      `,
    }),
    mount(root) {
      const statusNode = root.querySelector("[data-run-status]");
      const manualReachButton = /** @type {HTMLButtonElement | null} */ (root.querySelector("[data-manual-reach]"));
      const nextPointButton = /** @type {HTMLButtonElement | null} */ (root.querySelector("[data-next-point]"));
      const finishRouteButton = /** @type {HTMLButtonElement | null} */ (root.querySelector("[data-finish-route]"));
      const demoToggleButton = /** @type {HTMLButtonElement | null} */ (root.querySelector("[data-demo-toggle]"));
      const fallbackNode = root.querySelector("[data-geo-fallback]");
      const mapContainer = /** @type {HTMLElement | null} */ (root.querySelector("[data-map-canvas]"));

      let stopWatching = () => {};
      let mapSession = null;
      let audioCleanup = () => {};
      let teardown = false;

      function setStatus(message) {
        if (statusNode) {
          statusNode.textContent = message;
        }
      }

      function refreshPointMarkers() {
        if (!mapSession) {
          return;
        }

        const currentState = store.getState();
        const point = bundle.points[currentState.currentPointIndex];
        mapSession.updatePointState({
          currentPointId: point?.id,
          reachedPointIds: currentState.reachedPoints,
        });
      }

      async function initMap() {
        if (!hasApiKey || !mapContainer) {
          return;
        }

        try {
          mapSession = await ctx.mapService.createSession({
            container: mapContainer,
            apiKey: config.YANDEX_MAPS_API_KEY,
          });

          if (teardown) {
            mapSession.destroy();
            return;
          }

          mapSession.renderRoute(bundle.points, {
            currentPointId: currentPoint.id,
            reachedPointIds: store.getState().reachedPoints,
            onPointClick(pointId) {
              const index = bundle.points.findIndex((point) => point.id === pointId);
              if (index >= 0) {
                store.setCurrentPointIndex(index);
                ctx.router.refresh();
              }
            },
          });

          const lastKnown = store.getState().lastKnownPosition;
          if (lastKnown) {
            mapSession.updateUserLocation(lastKnown);
          }
        } catch {
          const mapPanelNode = mapContainer.closest(".map-panel");
          if (mapPanelNode) {
            mapPanelNode.classList.add("map-panel--fallback");
            mapPanelNode.innerHTML = "<p>Карта временно недоступна.</p>";
          }
          setStatus("Карта временно недоступна.");
        }
      }

      async function unlockCurrentPoint(showModal) {
        const liveBundle = await routeEngine.getSelectedRouteBundle();
        const liveState = store.getState();
        const livePoint = liveBundle?.points[liveState.currentPointIndex];

        if (!livePoint) {
          return;
        }

        const result = await routeEngine.unlockPoint(livePoint.id);
        refreshPointMarkers();

        if (result && !result.alreadyReached && showModal) {
          showPointModal({
            title: `Точка достигнута: ${result.point.title}`,
            summary: result.point.shortDescription,
            insight: result.point.financialInsight,
          });
          await ctx.router.refresh();
        }
      }

      async function onPosition(coords) {
        mapSession?.updateUserLocation(coords);

        const result = await routeEngine.evaluatePosition(coords);

        if (result.type === "tracking") {
          setStatus(`До точки «${result.currentPoint.title}» — ${Math.round(result.distanceMeters)} м`);
          return;
        }

        if (result.type === "reached") {
          setStatus(`Точка достигнута: ${result.currentPoint.title}`);
          refreshPointMarkers();

          if (result.unlocked && !result.unlocked.alreadyReached) {
            showPointModal({
              title: `Точка достигнута: ${result.currentPoint.title}`,
              summary: result.currentPoint.shortDescription,
              insight: result.currentPoint.financialInsight,
            });
            await ctx.router.refresh();
          }
          return;
        }

        setStatus("Ожидаем координаты...");
      }

      function onGeoError(error) {
        manualReachButton?.removeAttribute("hidden");
        fallbackNode?.removeAttribute("hidden");

        if (error.code === 1) {
          setStatus("Геолокация недоступна. Вы можете пройти маршрут вручную.");
          return;
        }

        if (error.code === 2) {
          setStatus("Не удалось определить местоположение. Можно продолжить вручную.");
          return;
        }

        if (error.code === 3) {
          setStatus("Время ожидания геолокации истекло. Можно продолжить вручную.");
          return;
        }

        setStatus("Геолокация недоступна. Вы можете пройти маршрут вручную.");
      }

      audioCleanup = bindAudioPlayer(root, { audioService: ctx.audioService });

      const lockedContentLinks = Array.from(root.querySelectorAll("[data-locked-content]"));
      const preventLockedNavigation = (event) => event.preventDefault();
      lockedContentLinks.forEach((link) => {
        link.addEventListener("click", preventLockedNavigation);
      });

      const onManualReach = async () => {
        await unlockCurrentPoint(true);
      };

      const onNextPoint = async () => {
        const result = await routeEngine.advanceToNextPoint();
        if (result.routeCompleted) {
          ctx.router.navigate("/profile");
          return;
        }

        await ctx.router.refresh();
      };

      const onFinishRoute = async () => {
        await routeEngine.finishSelectedRoute();
        ctx.router.navigate("/profile");
      };

      const onDemoToggle = async () => {
        setDemoModeEnabled(!demoModeEnabled);
        await ctx.router.refresh();
      };

      manualReachButton?.addEventListener("click", onManualReach);
      nextPointButton?.addEventListener("click", onNextPoint);
      finishRouteButton?.addEventListener("click", onFinishRoute);
      demoToggleButton?.addEventListener("click", onDemoToggle);

      initMap();

      if (demoModeEnabled) {
        manualReachButton?.removeAttribute("hidden");
        fallbackNode?.removeAttribute("hidden");
        setStatus("Демо-режим включен. Маршрут можно пройти вручную.");
      } else if (geolocationSupported) {
        setStatus("Запрашиваем доступ к геолокации...");

        try {
          stopWatching = ctx.geolocationService.watchPosition({
            onPosition,
            onError: onGeoError,
          });
        } catch {
          manualReachButton?.removeAttribute("hidden");
          fallbackNode?.removeAttribute("hidden");
          setStatus("Геолокация недоступна. Вы можете пройти маршрут вручную.");
        }
      } else {
        manualReachButton?.removeAttribute("hidden");
        fallbackNode?.removeAttribute("hidden");
        setStatus("Геолокация недоступна. Вы можете пройти маршрут вручную.");
      }

      return () => {
        teardown = true;
        stopWatching();
        mapSession?.destroy();
        audioCleanup();
        ctx.audioService.stop();
        manualReachButton?.removeEventListener("click", onManualReach);
        nextPointButton?.removeEventListener("click", onNextPoint);
        finishRouteButton?.removeEventListener("click", onFinishRoute);
        demoToggleButton?.removeEventListener("click", onDemoToggle);
        lockedContentLinks.forEach((link) => {
          link.removeEventListener("click", preventLockedNavigation);
        });
      };
    },
  };
}

function isDemoModeEnabled() {
  try {
    const hash = window.location.hash || "";
    const [, queryPart = ""] = hash.split("?");
    const params = new URLSearchParams(queryPart);
    const demoQueryValue = params.get("demo");

    if (demoQueryValue === "1") {
      return true;
    }

    if (demoQueryValue === "0") {
      return false;
    }

    const persisted = window.localStorage.getItem(DEMO_MODE_STORAGE_KEY);
    if (persisted === "1") {
      return true;
    }

    if (persisted === "0") {
      return false;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * @param {boolean} enabled
 */
function setDemoModeEnabled(enabled) {
  try {
    window.localStorage.setItem(DEMO_MODE_STORAGE_KEY, enabled ? "1" : "0");
  } catch {
    // Ignore
  }
}
