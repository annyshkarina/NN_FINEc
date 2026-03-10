const MASCOT_VARIANTS = {
  hero: {
    src: "assets/mascot/cat-guide.png",
    title: "Кот-проводник",
    alt: "Кот-проводник",
  },
  excursions: {
    src: "assets/mascot/cat-guide.png",
    title: "Кот-проводник",
    alt: "Кот-проводник на странице экскурсий",
  },
  transport: {
    src: "assets/mascot/cat-scooter.png",
    title: "Кот-проводник",
    alt: "Кот-проводник на самокате",
  },
  run: {
    src: "assets/mascot/cat-phone.png",
    title: "Кот-проводник",
    alt: "Кот-проводник на маршруте",
  },
  task: {
    src: "assets/mascot/cat-task.png",
    title: "Кот-проводник",
    alt: "Кот-проводник с заданием",
  },
  article: {
    src: "assets/mascot/cat-phone.png",
    title: "Кот-проводник",
    alt: "Кот-проводник у материалов маршрута",
  },
};

function buildPublicAssetUrl(relativePath) {
  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const cleanPath = relativePath.replace(/^\/+/, "");
  return `${normalizedBase}${cleanPath}`;
}

/**
 * @param {{
 * message: string,
 * variant?: "hero" | "excursions" | "transport" | "run" | "task" | "article",
 * src?: string,
 * alt?: string,
 * compact?: boolean
 * }} options
 */
export function mascotCat({ message, variant = "hero", src = "", alt = "", compact = false }) {
  const config = MASCOT_VARIANTS[variant] || MASCOT_VARIANTS.hero;
  const sizeClass = compact ? "mascot--compact" : "";
  const rawSrc = src.trim() !== "" ? src.trim() : config.src;
  const imageSrc = /^(https?:)?\/\//.test(rawSrc) || rawSrc.startsWith("data:")
    ? rawSrc
    : buildPublicAssetUrl(rawSrc);
  const imageAlt = alt.trim() !== "" ? alt : (config.alt || config.title);

  return `
    <aside class="mascot ${sizeClass}">
      <div class="mascot__media" data-mascot-media>
        <img
          class="mascot__image"
          src="${imageSrc}"
          alt="${imageAlt}"
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
