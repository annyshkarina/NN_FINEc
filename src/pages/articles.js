import { card } from "../components/card.js";
import { linkButton } from "../components/button.js";
import { mascotCat } from "../components/mascotCat.js";
import { formatArticleStatus } from "../utils/labels.js";

/**
 * @param {any} ctx
 */
export async function articlesPage(ctx) {
  const items = await ctx.routeEngine.getArticlesOverview();

  const body = `
    ${mascotCat({
      variant: "article",
      compact: true,
      message: "Статьи открываются по мере прохождения маршрута и помогают связать историю места с рисками сегодняшнего дня.",
    })}

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
                <span class="tag ${article.status === "available" ? "status-available" : "status-locked"}">${formatArticleStatus(article.status)}</span>
              </div>
              <div class="inline-actions">
                ${linkButton({ label: "Читать", href: `#/articles/${article.id}` })}
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
      title: "Статьи",
      subtitle: "Исторические материалы открываются после достижения точек.",
      body,
      footer: `
        <div class="inline-actions">
          ${linkButton({ label: "К маршруту", href: "#/run" })}
          ${linkButton({ label: "Задания", href: "#/tasks" })}
        </div>
      `,
    }),
  };
}
