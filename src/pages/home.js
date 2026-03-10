import { card } from "../components/card.js";
import { linkButton } from "../components/button.js";
import { mascotCat } from "../components/mascotCat.js";
import { progressBar } from "../components/progressBar.js";
import { formatTransportMode } from "../utils/labels.js";

/**
 * @param {any} ctx
 */
export async function homePage(ctx) {
  const { store, contentService, routeEngine } = ctx;
  const state = store.getState();

  const routes = await contentService.getRoutes();
  const selectedRoute = state.selectedRouteId
    ? await contentService.getRouteById(state.selectedRouteId)
    : null;
  const progress = await routeEngine.getProgress();

  const stats = `
    <div class="stats-grid">
      <article class="stat-card">
        <span class="stat-card__value">${state.reachedPoints.length}</span>
        <span class="stat-card__label">Точек пройдено</span>
      </article>
      <article class="stat-card">
        <span class="stat-card__value">${state.completedTasks.length}</span>
        <span class="stat-card__label">Заданий выполнено</span>
      </article>
      <article class="stat-card">
        <span class="stat-card__value">${state.finishedRoutes.length}</span>
        <span class="stat-card__label">Маршрутов завершено</span>
      </article>
    </div>
  `;

  const routeSummary = selectedRoute
    ? `
      <h3>${selectedRoute.title}</h3>
      <p class="text-muted">${selectedRoute.description}</p>
      <p class="text-muted">Текущий режим: ${formatTransportMode(state.selectedTransport)}</p>
      ${progressBar({
        label: "Прогресс по маршруту",
        value: progress.reached,
        max: progress.total,
      })}
      <div class="inline-actions">
        ${linkButton({ label: "Продолжить маршрут", href: "#/run", variant: "primary" })}
        ${linkButton({ label: "Выбрать транспорт", href: "#/transport" })}
      </div>
    `
    : `
      <p class="text-muted">Выберите маршрут, чтобы начать экскурсию.</p>
      <div class="inline-actions">
        ${linkButton({ label: "Выбрать маршрут", href: "#/excursions", variant: "primary" })}
      </div>
    `;

  const content = `
    <section class="hero">
      <p class="hero__kicker">ФинКод</p>
      <h1>Нижний Новгород: по стопам мошенника</h1>
      <p>
        Иммерсивный маршрут по финансовой истории, городским аферам и культуре доверия.
      </p>
      ${mascotCat({
        variant: "hero",
        message: "Я проведу вас по точкам, где история города учит распознавать финансовые риски.",
      })}
      <div class="inline-actions">
        ${linkButton({ label: "Начать маршрут", href: "#/excursions", variant: "primary" })}
        ${linkButton({ label: "О проекте", href: "#/about" })}
      </div>
    </section>

    ${card({
      title: "Ваш маршрут",
      subtitle: `Доступно маршрутов: ${routes.length}`,
      body: routeSummary,
    })}

    ${card({
      title: "Общий прогресс",
      body: stats,
      footer: `
        <div class="inline-actions">
          ${linkButton({ label: "Задания", href: "#/tasks" })}
          ${linkButton({ label: "Статьи", href: "#/articles" })}
          ${linkButton({ label: "Профиль", href: "#/profile" })}
        </div>
      `,
    })}
  `;

  return {
    activeNav: "home",
    html: content,
  };
}
