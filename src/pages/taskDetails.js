import { button, linkButton } from "../components/button.js";
import { card } from "../components/card.js";
import { mascotCat } from "../components/mascotCat.js";
import { formatTaskStatus } from "../utils/labels.js";

/**
 * @param {any} ctx
 */
export async function taskDetailsPage(ctx) {
  const taskId = ctx.route.params.taskId;
  const details = await ctx.routeEngine.getTaskDetails(taskId);

  if (!details) {
    return {
      activeNav: "tasks",
      html: card({
        title: "Задание",
        body: `<p class="text-muted">Задание не найдено.</p>`,
        footer: linkButton({ label: "Назад к заданиям", href: "#/tasks" }),
      }),
    };
  }

  const body = details.status === "locked"
    ? `<p class="text-muted">Задание закрыто. Сначала дойдите до связанной точки.</p>`
    : `
      ${mascotCat({
        variant: "task",
        compact: true,
        message: "Разберите ситуацию как детектив: где риск, где доверие и где ошибка в решении.",
      })}
      <p>${details.description}</p>
      <div class="tag-row">
        <span class="tag">Награда: ${details.rewardPoints} баллов</span>
        <span class="tag">Можно пропустить: ${details.canSkip ? "да" : "нет"}</span>
        <span class="tag status-${details.status}">${formatTaskStatus(details.status)}</span>
      </div>
      ${button({
        label: details.status === "completed" ? "Выполнено" : "Отметить как выполненное",
        variant: "primary",
        attrs: `data-complete-task ${details.canComplete ? "" : "disabled"}`,
      })}
    `;

  return {
    activeNav: "tasks",
    html: card({
      title: details.title,
      subtitle: `${details.routeTitle} · ${details.pointTitle}`,
      body,
      footer: `
        <div class="inline-actions">
          ${linkButton({ label: "Назад к заданиям", href: "#/tasks" })}
          ${linkButton({ label: "К маршруту", href: "#/run" })}
        </div>
      `,
    }),
    mount(root) {
      const completeButton = root.querySelector("[data-complete-task]");

      const clickHandler = async () => {
        const result = await ctx.routeEngine.completeTask(taskId);
        if (result.ok) {
          ctx.router.navigate("/tasks");
        }
      };

      completeButton?.addEventListener("click", clickHandler);
      return () => completeButton?.removeEventListener("click", clickHandler);
    },
  };
}
