/**
 * @param {{ label: string, variant?: "primary" | "secondary" | "danger", attrs?: string, type?: "button" | "submit" }} options
 */
export function button({ label, variant = "secondary", attrs = "", type = "button" }) {
  const variantClass = variant === "secondary" ? "" : ` btn--${variant}`;
  return `<button type="${type}" class="btn${variantClass}" ${attrs}>${label}</button>`;
}

/**
 * @param {{ label: string, href: string, variant?: "primary" | "secondary" | "danger", attrs?: string }} options
 */
export function linkButton({ label, href, variant = "secondary", attrs = "" }) {
  const variantClass = variant === "secondary" ? "" : ` btn--${variant}`;
  return `<a class="btn${variantClass}" href="${href}" ${attrs}>${label}</a>`;
}
