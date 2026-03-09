import { navbar } from "./navbar.js";

/**
 * @param {{ activeNav?: string, content: string }} options
 */
export function layout({ activeNav = "home", content }) {
  return `
    <div class="app-layout">
      ${navbar({ active: activeNav })}
      <main class="app-content" data-page-root>
        ${content}
      </main>
    </div>
  `;
}
