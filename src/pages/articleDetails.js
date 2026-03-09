import { card } from "../components/card.js";
import { linkButton } from "../components/button.js";

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
        title: "Article",
        body: `<p class="text-muted">Article not found.</p>`,
        footer: linkButton({ label: "Back to articles", href: "#/articles" }),
      }),
    };
  }

  const body = details.unlocked
    ? `
      <p>${details.content}</p>
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
            <h3>Related point</h3>
            <p><strong>${details.relatedPoint.title}</strong></p>
            <p class="text-muted">${details.relatedPoint.address}</p>
            <p>${details.relatedPoint.shortDescription}</p>
          </article>
        `
        : ""
      }
    `
    : `<p class="text-muted">Article is locked. Reach its point first.</p>`;

  return {
    activeNav: "articles",
    html: card({
      title: details.title,
      subtitle: `${details.routeTitle} · ${details.pointTitle}`,
      body,
      footer: `
        <div class="inline-actions">
          ${linkButton({ label: "Back to articles", href: "#/articles" })}
          ${linkButton({ label: "Go to run", href: "#/run" })}
        </div>
      `,
    }),
  };
}
