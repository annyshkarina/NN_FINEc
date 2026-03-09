/**
 * Formats minutes into Russian label.
 * @param {number} minutes
 * @returns {string}
 */
export function formatMinutes(minutes) {
  const safe = Number.isFinite(minutes) ? Math.max(0, Math.round(minutes)) : 0;
  const hours = Math.floor(safe / 60);
  const mins = safe % 60;

  if (hours === 0) {
    return `${mins} мин`;
  }

  if (mins === 0) {
    return `${hours} ч`;
  }

  return `${hours} ч ${mins} мин`;
}
