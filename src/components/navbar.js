const NAV_ITEMS = [
  { id: "home", label: "Дом", href: "#/home" },
  { id: "excursions", label: "Экскурсии", href: "#/excursions" },
  { id: "run", label: "Маршрут", href: "#/run" },
  { id: "tasks", label: "Задания", href: "#/tasks" },
  { id: "articles", label: "Статьи", href: "#/articles" },
  { id: "profile", label: "Профиль", href: "#/profile" },
  { id: "about", label: "О проекте", href: "#/about" },
];

/**
 * @param {{ active?: string }} options
 */
export function navbar({ active = "home" } = {}) {
  return `
    <header class="topbar">
      <div class="topbar__brand">
        <span class="topbar__title">ФинКод</span>
        <span class="topbar__subtitle">Нижний Новгород: по стопам мошенника</span>
        <span class="topbar__meta">Иммерсивный маршрут по финансовой истории, городским аферам и культуре доверия</span>
      </div>
      <nav class="topbar__nav" aria-label="Навигация">
        ${NAV_ITEMS.map((item) => `
          <a href="${item.href}" class="topbar__link ${item.id === active ? "is-active" : ""}">${item.label}</a>
        `).join("")}
      </nav>
    </header>
  `;
}
