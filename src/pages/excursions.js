import { card } from "../components/card.js";
import { button, linkButton } from "../components/button.js";
import { mascotCat } from "../components/mascotCat.js";
import { formatMinutes } from "../utils/time.js";
import { formatTransportMode } from "../utils/labels.js";

/**
 * @param {any} ctx
 */
export async function excursionsPage(ctx) {
  const { contentService, store } = ctx;
  const state = store.getState();
  const routes = await contentService.getRoutes();

  const body = `
    ${mascotCat({
      variant: "excursions",
      compact: true,
      message: "Выбирайте маршрут по настроению: каждый раскрывает финансовую историю города через реальные места.",
    })}

    <div class="stack">
      ${routes
        .map((route) => {
          const isActive = route.id === state.selectedRouteId;
          const duration = route.transportDurations[state.selectedTransport];

          return `
            <article class="route-card ${isActive ? "is-active" : ""}">
              <div class="route-card__content">
                <h3>${route.title}</h3>
                <p class="text-muted">${route.description}</p>
                <div class="tag-row">
                  <span class="tag">${route.points.length} точек</span>
                  <span class="tag">${formatMinutes(duration)} · ${formatTransportMode(state.selectedTransport)}</span>
                </div>
              </div>
              <div class="inline-actions">
                ${button({
                  label: isActive ? "Выбран" : "Выбрать",
                  variant: "primary",
                  attrs: `data-select-route="${route.id}" ${isActive ? "disabled" : ""}`,
                })}
                ${linkButton({ label: "Транспорт", href: "#/transport" })}
              </div>
            </article>
          `;
        })
        .join("")}
    </div>
  `;

  return {
    activeNav: "excursions",
    html: card({
      title: "Экскурсии",
      subtitle: "Выберите маршрут и начните расследование финансовых историй Нижнего.",
      body,
      footer: `
        <div class="inline-actions">
          ${linkButton({ label: "На главную", href: "#/home" })}
          ${linkButton({ label: "Перейти к маршруту", href: "#/run", variant: "primary" })}
        </div>
      `,
    }),
    mount(root) {
      const clickHandler = (event) => {
        const target = /** @type {HTMLElement} */ (event.target);
        const routeId = target.getAttribute("data-select-route");
        if (!routeId) {
          return;
        }

        store.selectRoute(routeId);
        ctx.router.navigate("/transport");
      };

      root.addEventListener("click", clickHandler);
      return () => root.removeEventListener("click", clickHandler);
    },
  };
}
