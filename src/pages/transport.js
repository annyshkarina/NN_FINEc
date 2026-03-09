import { card } from "../components/card.js";
import { button, linkButton } from "../components/button.js";
import { formatMinutes } from "../utils/time.js";

const TRANSPORT_LABELS = {
  walk: "Walk",
  scooter: "Scooter",
  car: "Car",
};

/**
 * @param {any} ctx
 */
export async function transportPage(ctx) {
  const { store, contentService } = ctx;
  const state = store.getState();

  if (!state.selectedRouteId) {
    return {
      activeNav: "excursions",
      html: card({
        title: "Transport",
        body: `<p class="text-muted">Choose a route first.</p>`,
        footer: linkButton({ label: "Go to routes", href: "#/excursions", variant: "primary" }),
      }),
    };
  }

  const selectedRoute = await contentService.getRouteById(state.selectedRouteId);

  if (!selectedRoute) {
    return {
      activeNav: "excursions",
      html: card({
        title: "Transport",
        body: `<p class="text-muted">Selected route is unavailable.</p>`,
        footer: linkButton({ label: "Choose route", href: "#/excursions", variant: "primary" }),
      }),
    };
  }

  const modes = contentService.getTransportModes();

  const body = `
    <p class="text-muted"><strong>${selectedRoute.title}</strong></p>
    <div class="stack">
      ${modes
        .map((mode) => {
          const isActive = state.selectedTransport === mode.id;
          const duration = selectedRoute.transportDurations[mode.id];
          return `
            <article class="transport-card ${isActive ? "is-active" : ""}">
              <div>
                <h3>${TRANSPORT_LABELS[mode.id]}</h3>
                <p class="text-muted">Estimated duration: ${formatMinutes(duration)}</p>
              </div>
              ${button({
                label: isActive ? "Selected" : "Use this",
                variant: "primary",
                attrs: `data-transport="${mode.id}" ${isActive ? "disabled" : ""}`,
              })}
            </article>
          `;
        })
        .join("")}
    </div>
  `;

  return {
    activeNav: "excursions",
    html: card({
      title: "Choose transport",
      subtitle: "Duration recalculates for each transport mode.",
      body,
      footer: `
        <div class="inline-actions">
          ${linkButton({ label: "Back", href: "#/excursions" })}
          ${linkButton({ label: "Start run", href: "#/run", variant: "primary" })}
        </div>
      `,
    }),
    mount(root) {
      const clickHandler = (event) => {
        const target = /** @type {HTMLElement} */ (event.target);
        const transport = target.getAttribute("data-transport");
        if (!transport) {
          return;
        }

        store.setTransport(/** @type {import("../state/store.js").TransportMode} */ (transport));
        ctx.router.navigate("/run");
      };

      root.addEventListener("click", clickHandler);
      return () => root.removeEventListener("click", clickHandler);
    },
  };
}
