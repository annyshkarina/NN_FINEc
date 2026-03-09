import { button, linkButton } from "../components/button.js";
import { card } from "../components/card.js";

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
        Name
        <input type="text" name="name" value="${escapeHtml(state.profile.name)}" placeholder="Your name" maxlength="80" />
      </label>
      <label>
        Age
        <input type="number" name="age" value="${state.profile.age ?? ""}" min="7" max="120" placeholder="Age" />
      </label>
      ${button({ label: "Save profile", type: "submit", variant: "primary" })}
    </form>

    <section class="profile-metrics">
      <div class="stats-grid">
        <article class="stat-card">
          <span class="stat-card__value">${state.completedTasks.length}</span>
          <span class="stat-card__label">Completed tasks</span>
        </article>
        <article class="stat-card">
          <span class="stat-card__value">${state.reachedPoints.length}</span>
          <span class="stat-card__label">Reached points</span>
        </article>
        <article class="stat-card">
          <span class="stat-card__value">${state.finishedRoutes.length}</span>
          <span class="stat-card__label">Finished routes</span>
        </article>
      </div>
      <p class="text-muted">Current route: ${selectedRoute?.title || "Not selected"}</p>
      ${button({ label: "Reset all progress", variant: "danger", attrs: "data-reset-progress" })}
    </section>
  `;

  return {
    activeNav: "profile",
    html: card({
      title: "Profile",
      subtitle: "Stored locally on your device.",
      body,
      footer: `
        <div class="inline-actions">
          ${linkButton({ label: "Home", href: "#/home" })}
          ${linkButton({ label: "Run", href: "#/run", variant: "primary" })}
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
