import { card } from "../components/card.js";
import { linkButton } from "../components/button.js";
import { mascotCat } from "../components/mascotCat.js";
import { progressBar } from "../components/progressBar.js";

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
        <span class="stat-card__label">Points reached</span>
      </article>
      <article class="stat-card">
        <span class="stat-card__value">${state.completedTasks.length}</span>
        <span class="stat-card__label">Tasks completed</span>
      </article>
      <article class="stat-card">
        <span class="stat-card__value">${state.finishedRoutes.length}</span>
        <span class="stat-card__label">Routes finished</span>
      </article>
    </div>
  `;

  const routeSummary = selectedRoute
    ? `
      <h3>${selectedRoute.title}</h3>
      <p class="text-muted">${selectedRoute.description}</p>
      ${progressBar({
        label: "Current route progress",
        value: progress.reached,
        max: progress.total,
      })}
      <div class="inline-actions">
        ${linkButton({ label: "Continue tour", href: "#/run", variant: "primary" })}
        ${linkButton({ label: "Transport", href: "#/transport" })}
      </div>
    `
    : `
      <p class="text-muted">Choose a route to start the tour.</p>
      <div class="inline-actions">
        ${linkButton({ label: "Choose route", href: "#/excursions", variant: "primary" })}
      </div>
    `;

  const content = `
    <section class="hero">
      <h1>Financial Code: Walking Tour of Nizhny Novgorod</h1>
      <p>
        Learn financial literacy by walking through real city stories about fraud,
        banking institutions and economic risk management.
      </p>
      ${mascotCat({ message: "Tip: reach points physically to unlock articles and tasks." })}
    </section>

    ${card({
      title: "Your session",
      subtitle: `${routes.length} available routes`,
      body: routeSummary,
    })}

    ${card({
      title: "Overall progress",
      body: stats,
      footer: `
        <div class="inline-actions">
          ${linkButton({ label: "Tasks", href: "#/tasks" })}
          ${linkButton({ label: "Articles", href: "#/articles" })}
          ${linkButton({ label: "Profile", href: "#/profile" })}
        </div>
      `,
    })}
  `;

  return {
    activeNav: "home",
    html: content,
  };
}
