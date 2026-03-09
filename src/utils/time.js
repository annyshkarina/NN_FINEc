/**
 * Formats minutes into `Xh Ym` label.
 * @param {number} minutes
 * @returns {string}
 */
export function formatMinutes(minutes) {
  const safe = Number.isFinite(minutes) ? Math.max(0, Math.round(minutes)) : 0;
  const hours = Math.floor(safe / 60);
  const mins = safe % 60;

  if (hours === 0) {
    return `${mins} min`;
  }

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
}
