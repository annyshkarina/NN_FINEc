const NAV_ITEMS = [
  { id: "home", label: "Home", href: "#/home" },
  { id: "excursions", label: "Tours", href: "#/excursions" },
  { id: "run", label: "Run", href: "#/run" },
  { id: "tasks", label: "Tasks", href: "#/tasks" },
  { id: "articles", label: "Articles", href: "#/articles" },
  { id: "profile", label: "Profile", href: "#/profile" },
  { id: "about", label: "About", href: "#/about" },
];

/**
 * @param {{ active?: string }} options
 */
export function navbar({ active = "home" } = {}) {
  return `
    <header class="topbar">
      <div class="topbar__brand">
        <span class="topbar__title">Financial Code</span>
        <span class="topbar__subtitle">Walking Tour of Nizhny Novgorod</span>
      </div>
      <nav class="topbar__nav" aria-label="Main navigation">
        ${NAV_ITEMS.map((item) => `
          <a href="${item.href}" class="topbar__link ${item.id === active ? "is-active" : ""}">${item.label}</a>
        `).join("")}
      </nav>
    </header>
  `;
}
