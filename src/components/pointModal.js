import { fromHtml, qs } from "../utils/dom.js";

/**
 * @param {{ title: string, summary: string, insight: string }} payload
 */
export function showPointModal(payload) {
  const existing = document.querySelector("[data-point-modal]");
  existing?.remove();

  const modal = fromHtml(`
    <div class="point-modal" data-point-modal>
      <div class="point-modal__overlay" data-close-modal></div>
      <article class="point-modal__content" role="dialog" aria-modal="true" aria-label="Точка достигнута">
        <header>
          <h3>${payload.title}</h3>
          <p>${payload.summary}</p>
        </header>
        <p><strong>Финансовый вывод:</strong> ${payload.insight}</p>
        <button class="btn btn--primary" type="button" data-close-modal>Продолжить</button>
      </article>
    </div>
  `);

  const close = () => {
    modal.remove();
  };

  qs(modal, ".point-modal__overlay")?.addEventListener("click", close);
  qs(modal, "button[data-close-modal]")?.addEventListener("click", close);
  document.body.append(modal);
}
