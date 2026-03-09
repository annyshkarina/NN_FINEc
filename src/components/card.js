/**
 * @param {{ title?: string, subtitle?: string, body: string, footer?: string, className?: string }} options
 */
export function card({ title = "", subtitle = "", body, footer = "", className = "" }) {
  return `
    <section class="card ${className}">
      ${title ? `<header class="card__header"><h2>${title}</h2>${subtitle ? `<p class="text-muted">${subtitle}</p>` : ""}</header>` : ""}
      <div class="card__body">${body}</div>
      ${footer ? `<footer class="card__footer">${footer}</footer>` : ""}
    </section>
  `;
}
