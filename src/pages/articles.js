import { card } from "../components/card.js";
import { linkButton } from "../components/button.js";

/**
 * @param {any} ctx
 */
export async function articlesPage(ctx) {
  const items = await ctx.routeEngine.getArticlesOverview();

  const body = `
    <div class="stack">
      ${items
        .map((article) => {
          return `
            <article class="article-card">
              <header>
                <h3>${article.title}</h3>
                <p class="text-muted">${article.routeTitle} · ${article.pointTitle}</p>
              </header>
              <p>${article.summary}</p>
              <div class="tag-row">
                <span class="tag ${article.status === "available" ? "status-available" : "status-locked"}">${article.status}</span>
              </div>
              <div class="inline-actions">
                ${linkButton({ label: "Read", href: `#/articles/${article.id}` })}
              </div>
            </article>
          `;
        })
        .join("")}
    </div>
  `;

  return {
    activeNav: "articles",
    html: card({
      title: "Articles",
      subtitle: "Articles unlock when route points are reached.",
      body,
      footer: `
        <div class="inline-actions">
          ${linkButton({ label: "Run", href: "#/run" })}
          ${linkButton({ label: "Tasks", href: "#/tasks" })}
        </div>
      `,
    }),
  };
}
