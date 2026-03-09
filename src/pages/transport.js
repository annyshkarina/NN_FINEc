import { card } from "../components/card.js";
import { button, linkButton } from "../components/button.js";
import { mascotCat } from "../components/mascotCat.js";
import { formatMinutes } from "../utils/time.js";
import { TRANSPORT_LABELS } from "../utils/labels.js";

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
        title: "Транспорт",
        body: `<p class="text-muted">Сначала выберите маршрут.</p>`,
        footer: linkButton({ label: "К выбору маршрута", href: "#/excursions", variant: "primary" }),
      }),
    };
  }

  const selectedRoute = await contentService.getRouteById(state.selectedRouteId);

  if (!selectedRoute) {
    return {
      activeNav: "excursions",
      html: card({
        title: "Транспорт",
        body: `<p class="text-muted">Выбранный маршрут недоступен.</p>`,
        footer: linkButton({ label: "Выбрать маршрут", href: "#/excursions", variant: "primary" }),
      }),
    };
  }

  const modes = contentService.getTransportModes();

  const body = `
    ${mascotCat({
      variant: "transport",
      compact: true,
      message: "Темп экскурсии влияет на длительность. Выберите удобный способ передвижения.",
    })}

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
                <p class="text-muted">Примерная длительность: ${formatMinutes(duration)}</p>
              </div>
              ${button({
                label: isActive ? "Выбрано" : "Выбрать",
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
      title: "Выбор транспорта",
      subtitle: "Маршрут и время пересчитываются автоматически.",
      body,
      footer: `
        <div class="inline-actions">
          ${linkButton({ label: "Назад", href: "#/excursions" })}
          ${linkButton({ label: "К маршруту", href: "#/run", variant: "primary" })}
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
