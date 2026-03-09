/**
 * @param {{ value: number, max: number, label: string }} options
 */
export function progressBar({ value, max, label }) {
  const safeMax = Math.max(max, 1);
  const safeValue = Math.max(0, Math.min(value, safeMax));
  const percent = Math.round((safeValue / safeMax) * 100);

  return `
    <section class="progress">
      <div class="progress__meta">
        <span>${label}</span>
        <span>${safeValue}/${max}</span>
      </div>
      <div class="progress__track" role="progressbar" aria-valuemin="0" aria-valuemax="${max}" aria-valuenow="${safeValue}">
        <span class="progress__fill" style="width:${percent}%"></span>
      </div>
    </section>
  `;
}
