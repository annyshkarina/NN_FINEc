/**
 * @param {ParentNode} root
 * @param {string} selector
 * @returns {Element | null}
 */
export function qs(root, selector) {
  return root.querySelector(selector);
}

/**
 * @param {ParentNode} root
 * @param {string} selector
 * @returns {Element[]}
 */
export function qsa(root, selector) {
  return Array.from(root.querySelectorAll(selector));
}

/**
 * @param {string} html
 * @returns {HTMLElement}
 */
export function fromHtml(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return /** @type {HTMLElement} */ (template.content.firstElementChild);
}
