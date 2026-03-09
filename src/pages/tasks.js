import { card } from "../components/card.js";
import { linkButton } from "../components/button.js";
import { mascotCat } from "../components/mascotCat.js";
import { formatTaskStatus, formatTaskType } from "../utils/labels.js";

/**
 * @param {any} ctx
 */
export async function tasksPage(ctx) {
  const items = await ctx.routeEngine.getTasksOverview();

  const body = `
    ${mascotCat({
      variant: "task",
      compact: true,
      message: "Задания открываются после достижения точки. Выполняйте их, чтобы закрепить финансовые выводы.",
    })}

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
                <span class="tag">${formatTaskType(task.type)}</span>
                <span class="tag">${task.rewardPoints} баллов</span>
                <span class="tag status-${task.status}">${formatTaskStatus(task.status)}</span>
              </div>
              <div class="inline-actions">
                ${linkButton({ label: "Открыть", href: `#/tasks/${task.id}` })}
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
      title: "Задания",
      subtitle: "Состояния: закрыто → доступно → выполнено.",
      body,
      footer: `
        <div class="inline-actions">
          ${linkButton({ label: "К маршруту", href: "#/run" })}
          ${linkButton({ label: "Статьи", href: "#/articles" })}
        </div>
      `,
    }),
  };
}
