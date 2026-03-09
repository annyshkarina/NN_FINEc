import { card } from "../components/card.js";
import { linkButton } from "../components/button.js";

/**
 * @param {any} ctx
 */
export async function tasksPage(ctx) {
  const items = await ctx.routeEngine.getTasksOverview();

  const body = `
    <div class="stack">
      ${items
        .map((task) => {
          return `
            <article class="task-card ${task.status === "completed" ? "is-complete" : ""}">
              <header>
                <h3>${task.title}</h3>
                <p class="text-muted">${task.routeTitle} · ${task.pointTitle}</p>
              </header>
              <div class="tag-row">
                <span class="tag">${task.type}</span>
                <span class="tag">${task.rewardPoints} pts</span>
                <span class="tag status-${task.status}">${task.status}</span>
              </div>
              <div class="inline-actions">
                ${linkButton({ label: "Open", href: `#/tasks/${task.id}` })}
              </div>
            </article>
          `;
        })
        .join("")}
    </div>
  `;

  return {
    activeNav: "tasks",
    html: card({
      title: "Tasks",
      subtitle: "State model: locked -> available -> completed.",
      body,
      footer: `
        <div class="inline-actions">
          ${linkButton({ label: "Run", href: "#/run" })}
          ${linkButton({ label: "Articles", href: "#/articles" })}
        </div>
      `,
    }),
  };
}
