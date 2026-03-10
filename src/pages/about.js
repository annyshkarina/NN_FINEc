import { card } from "../components/card.js";
import { linkButton } from "../components/button.js";

/**
 * @param {any} _ctx
 */
export async function aboutPage(_ctx) {
  const body = `
    <section class="stack">
      <p>
        «ФинКод — Нижний Новгород: по стопам мошенника» — мобильный маршрут о том, как
        в городской истории переплетались деньги, доверие, аферы и ответственность.
      </p>
      <p>
        Формат экскурсии самостоятельный: карта, аудиогид, задания и статьи открываются
        по мере прохождения точек.
      </p>
      <p>
        Проект работает как статическое SPA-приложение: контент хранится в JSON,
        а прогресс пользователя — в localStorage. Это позволяет запускать его на GitHub Pages.
      </p>
      <p>
        Архитектура разделяет UI, данные и сервисы, поэтому в будущем можно подключить
        API без переписывания интерфейса.
      </p>
    </section>
  `;

  return {
    activeNav: "about",
    html: card({
      title: "О проекте",
      body,
      footer: `
        <div class="inline-actions">
          ${linkButton({ label: "На главную", href: "#/home" })}
          ${linkButton({ label: "Выбрать маршрут", href: "#/excursions", variant: "primary" })}
        </div>
      `,
    }),
  };
}
