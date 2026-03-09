import { button, linkButton } from "../components/button.js";
import { card } from "../components/card.js";
import { DEMO_MODE_STORAGE_KEY } from "../utils/storageKeys.js";

/**
 * @param {any} ctx
 */
export async function profilePage(ctx) {
  const { store, contentService } = ctx;
  const state = store.getState();

  const selectedRoute = state.selectedRouteId
    ? await contentService.getRouteById(state.selectedRouteId)
    : null;

  const body = `
    <form class="profile-form" data-profile-form>
      <label>
        Имя
        <input type="text" name="name" value="${escapeHtml(state.profile.name)}" placeholder="Ваше имя" maxlength="80" />
      </label>
      <label>
        Возраст
        <input type="number" name="age" value="${state.profile.age ?? ""}" min="7" max="120" placeholder="Возраст" />
      </label>
      ${button({ label: "Сохранить профиль", type: "submit", variant: "primary" })}
    </form>

    <section class="profile-metrics">
      <div class="stats-grid">
        <article class="stat-card">
          <span class="stat-card__value">${state.completedTasks.length}</span>
          <span class="stat-card__label">Выполнено заданий</span>
        </article>
        <article class="stat-card">
          <span class="stat-card__value">${state.reachedPoints.length}</span>
          <span class="stat-card__label">Пройдено точек</span>
        </article>
        <article class="stat-card">
          <span class="stat-card__value">${state.finishedRoutes.length}</span>
          <span class="stat-card__label">Завершено маршрутов</span>
        </article>
      </div>
      <p class="text-muted">Текущий маршрут: ${selectedRoute?.title || "не выбран"}</p>
      ${button({ label: "Сбросить весь прогресс", variant: "danger", attrs: "data-reset-progress" })}
    </section>
  `;

  return {
    activeNav: "profile",
    html: card({
      title: "Профиль",
      subtitle: "Данные сохраняются локально на вашем устройстве.",
      body,
      footer: `
        <div class="inline-actions">
          ${linkButton({ label: "На главную", href: "#/home" })}
          ${linkButton({ label: "К маршруту", href: "#/run", variant: "primary" })}
        </div>
      `,
    }),
    mount(root) {
      const form = /** @type {HTMLFormElement | null} */ (root.querySelector("[data-profile-form]"));
      const resetButton = /** @type {HTMLButtonElement | null} */ (root.querySelector("[data-reset-progress]"));

      const handleSubmit = (event) => {
        event.preventDefault();
        if (!form) {
          return;
        }

        const formData = new FormData(form);
        const rawAge = formData.get("age");
        const age = typeof rawAge === "string" && rawAge.trim() !== "" ? Number(rawAge) : null;

        store.setProfile({
          name: String(formData.get("name") || "").trim(),
          age: Number.isFinite(age) ? age : null,
        });
      };

      const handleReset = () => {
        store.resetProgress();
        try {
          window.localStorage.removeItem(DEMO_MODE_STORAGE_KEY);
        } catch {
          // Ignore storage access failures.
        }
        ctx.router.navigate("/home");
      };

      form?.addEventListener("submit", handleSubmit);
      resetButton?.addEventListener("click", handleReset);

      return () => {
        form?.removeEventListener("submit", handleSubmit);
        resetButton?.removeEventListener("click", handleReset);
      };
    },
  };
}

/**
 * @param {string} value
 */
function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
