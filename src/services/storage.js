import { TOUR_STATE_STORAGE_KEY } from "../utils/storageKeys.js";

/** @typedef {import("../state/store.js").AppState} AppState */

/**
 * @param {AppState} state
 * @returns {AppState}
 */
function sanitizeState(state) {
  const toStringArray = (value) => (
    Array.isArray(value)
      ? Array.from(new Set(value.filter((item) => typeof item === "string")))
      : []
  );

  const validLastKnownPosition = (
    Array.isArray(state.lastKnownPosition) &&
    state.lastKnownPosition.length === 2 &&
    Number.isFinite(state.lastKnownPosition[0]) &&
    Number.isFinite(state.lastKnownPosition[1])
  )
    ? /** @type {[number, number]} */ (state.lastKnownPosition)
    : null;

  return {
    profile: {
      name: typeof state.profile?.name === "string" ? state.profile.name.trim() : "",
      age: Number.isInteger(state.profile?.age) && state.profile.age >= 0 ? state.profile.age : null,
    },
    selectedRouteId: typeof state.selectedRouteId === "string" ? state.selectedRouteId : null,
    selectedTransport: ["walk", "scooter", "car"].includes(state.selectedTransport)
      ? state.selectedTransport
      : "walk",
    currentPointIndex: Number.isInteger(state.currentPointIndex)
      ? Math.max(0, state.currentPointIndex)
      : 0,
    reachedPoints: toStringArray(state.reachedPoints),
    unlockedTasks: toStringArray(state.unlockedTasks),
    completedTasks: toStringArray(state.completedTasks),
    unlockedArticles: toStringArray(state.unlockedArticles),
    finishedRoutes: toStringArray(state.finishedRoutes),
    audioSpeed: [0.75, 1, 1.25, 1.5].includes(state.audioSpeed) ? state.audioSpeed : 1,
    lastKnownPosition: validLastKnownPosition,
  };
}

/**
 * Creates localStorage persistence service.
 * @param {{ storageKey?: string }} [options]
 */
export function createStorageService({ storageKey = TOUR_STATE_STORAGE_KEY } = {}) {
  /**
   * @param {AppState} defaultState
   * @returns {AppState}
   */
  function loadState(defaultState) {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        return sanitizeState(defaultState);
      }

      const parsed = JSON.parse(raw);
      return sanitizeState({ ...defaultState, ...parsed });
    } catch {
      return sanitizeState(defaultState);
    }
  }

  /**
   * @param {AppState} state
   */
  function saveState(state) {
    try {
      const payload = sanitizeState(state);
      window.localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      // Ignore write errors in private mode or restricted environments.
    }
  }

  function clear() {
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // Ignore
    }
  }

  return {
    loadState,
    saveState,
    clear,
  };
}
