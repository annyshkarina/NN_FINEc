import { button, linkButton } from "../components/button.js";
import { card } from "../components/card.js";

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
        title: "Task",
        body: `<p class="text-muted">Task not found.</p>`,
        footer: linkButton({ label: "Back to tasks", href: "#/tasks" }),
      }),
    };
  }

  const body = details.status === "locked"
    ? `<p class="text-muted">Task is locked. Reach the related point first.</p>`
    : `
      <p>${details.description}</p>
      <div class="tag-row">
        <span class="tag">Reward: ${details.rewardPoints}</span>
        <span class="tag">Skip allowed: ${details.canSkip ? "yes" : "no"}</span>
        <span class="tag status-${details.status}">${details.status}</span>
      </div>
      ${button({
        label: details.status === "completed" ? "Completed" : "Mark as completed",
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
          ${linkButton({ label: "Back to tasks", href: "#/tasks" })}
          ${linkButton({ label: "Go to run", href: "#/run" })}
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
