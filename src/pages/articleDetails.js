import { card } from "../components/card.js";
import { linkButton } from "../components/button.js";
import { mascotCat } from "../components/mascotCat.js";

/**
 * @param {any} ctx
 */
export async function articleDetailsPage(ctx) {
  const articleId = ctx.route.params.articleId;
  const details = await ctx.routeEngine.getArticleDetails(articleId);

  if (!details) {
    return {
      activeNav: "articles",
      html: card({
        title: "Статья",
        body: `<p class="text-muted">Статья не найдена.</p>`,
        footer: linkButton({ label: "Назад к статьям", href: "#/articles" }),
      }),
    };
  }

  const articleText = details.content
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${paragraph.replaceAll("\n", "<br />")}</p>`)
    .join("");

  const body = details.unlocked
    ? `
      ${mascotCat({
        variant: "article",
        compact: true,
        message: "Сопоставьте факты из истории с тем, как похожие схемы работают в цифровой среде сегодня.",
      })}
      <article class="article-body">
        ${articleText}
      </article>
      ${details.images.length > 0
        ? `
          <div class="image-grid">
            ${details.images
              .map((image) => `
                <img src="${image}" alt="${details.title}" loading="lazy" onerror="this.style.display='none'" />
              `)
              .join("")}
          </div>
        `
        : ""
      }
      ${details.relatedPoint
        ? `
          <article class="point-card">
            <h3>Связанная точка</h3>
            <p><strong>${details.relatedPoint.title}</strong></p>
            <p class="text-muted">${details.relatedPoint.address}</p>
            <p>${details.relatedPoint.shortDescription}</p>
          </article>
        `
        : ""
      }
    `
    : `<p class="text-muted">Статья закрыта. Сначала дойдите до нужной точки.</p>`;

  return {
    activeNav: "articles",
    html: card({
      title: details.title,
      subtitle: `${details.routeTitle} · ${details.pointTitle}`,
      body,
      footer: `
        <div class="inline-actions">
          ${linkButton({ label: "Назад к статьям", href: "#/articles" })}
          ${linkButton({ label: "К маршруту", href: "#/run" })}
        </div>
      `,
    }),
  };
}
