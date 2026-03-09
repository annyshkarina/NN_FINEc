const MASCOT_VARIANTS = {
  hero: {
    src: "./assets/mascot/cat-guide.png",
    title: "Кот-проводник",
  },
  excursions: {
    src: "./assets/mascot/cat-phone.png",
    title: "Кот-следопыт",
  },
  transport: {
    src: "./assets/mascot/cat-scooter.png",
    title: "Кот в пути",
  },
  run: {
    src: "./assets/mascot/cat-guide.png",
    title: "Кот на маршруте",
  },
  task: {
    src: "./assets/mascot/cat-task.png",
    title: "Кот-аналитик",
  },
  article: {
    src: "./assets/mascot/cat-phone.png",
    title: "Кот-архивист",
  },
};

/**
 * @param {{
 * message: string,
 * variant?: "hero" | "excursions" | "transport" | "run" | "task" | "article",
 * compact?: boolean
 * }} options
 */
export function mascotCat({ message, variant = "hero", compact = false }) {
  const config = MASCOT_VARIANTS[variant];
  const sizeClass = compact ? "mascot--compact" : "";

  return `
    <aside class="mascot ${sizeClass}">
      <div class="mascot__media" data-mascot-media>
        <img
          class="mascot__image"
          src="${config.src}"
          alt="${config.title}"
          loading="lazy"
          onerror="this.closest('[data-mascot-media]')?.classList.add('is-missing')"
        />
        <div class="mascot__fallback" aria-hidden="true">
          <span>Кот</span>
        </div>
      </div>
      <div class="mascot__speech">
        <strong>${config.title}</strong>
        <p>${message}</p>
      </div>
    </aside>
  `;
}
