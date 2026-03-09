import { card } from "../components/card.js";
import { linkButton } from "../components/button.js";

/**
 * @param {any} _ctx
 */
export async function aboutPage(_ctx) {
  const body = `
    <section class="stack">
      <p>
        "Financial Code" is a mobile-first self-guided tour about financial literacy,
        scams, banking institutions and economic behavior in Nizhny Novgorod.
      </p>
      <p>
        This MVP runs as a static SPA and is deployable on GitHub Pages.
        Content is stored in JSON, while user progress is saved in localStorage.
      </p>
      <p>
        Architecture is intentionally backend-ready: service layer and route engine can be
        replaced with API calls without rewriting the UI.
      </p>
    </section>
  `;

  return {
    activeNav: "about",
    html: card({
      title: "About project",
      body,
      footer: `
        <div class="inline-actions">
          ${linkButton({ label: "Home", href: "#/home" })}
          ${linkButton({ label: "Choose route", href: "#/excursions", variant: "primary" })}
        </div>
      `,
    }),
  };
}
