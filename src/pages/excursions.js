import { card } from "../components/card.js";
import { button, linkButton } from "../components/button.js";
import { formatMinutes } from "../utils/time.js";

/**
 * @param {any} ctx
 */
export async function excursionsPage(ctx) {
  const { contentService, store } = ctx;
  const state = store.getState();
  const routes = await contentService.getRoutes();

  const body = `
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
                  <span class="tag">${route.points.length} points</span>
                  <span class="tag">${formatMinutes(duration)} by ${state.selectedTransport}</span>
                </div>
              </div>
              <div class="inline-actions">
                ${button({
                  label: isActive ? "Selected" : "Select",
                  variant: "primary",
                  attrs: `data-select-route="${route.id}" ${isActive ? "disabled" : ""}`,
                })}
                ${linkButton({ label: "Transport", href: "#/transport" })}
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
      title: "Choose an excursion",
      subtitle: "Select a route to start a self-guided walking tour.",
      body,
      footer: `
        <div class="inline-actions">
          ${linkButton({ label: "Back home", href: "#/home" })}
          ${linkButton({ label: "Start run", href: "#/run", variant: "primary" })}
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
