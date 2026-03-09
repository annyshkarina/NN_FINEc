/**
 * @param {{ message: string }} options
 */
export function mascotCat({ message }) {
  return `
    <aside class="mascot">
      <div class="mascot__avatar" aria-hidden="true">/\_/\\</div>
      <div class="mascot__speech">
        <strong>Cat Guide</strong>
        <p>${message}</p>
      </div>
    </aside>
  `;
}
