const STORAGE_KEY = "financial-code-tour-state-v1";

/** @typedef {import("../state/store.js").AppState} AppState */

/**
 * @param {AppState} state
 * @returns {AppState}
 */
function sanitizeState(state) {
  return {
    profile: {
      name: typeof state.profile?.name === "string" ? state.profile.name : "",
      age: Number.isInteger(state.profile?.age) ? state.profile.age : null,
    },
    selectedRouteId: state.selectedRouteId ?? null,
    selectedTransport: ["walk", "scooter", "car"].includes(state.selectedTransport)
      ? state.selectedTransport
      : "walk",
    currentPointIndex: Number.isInteger(state.currentPointIndex)
      ? Math.max(0, state.currentPointIndex)
      : 0,
    reachedPoints: Array.isArray(state.reachedPoints) ? Array.from(new Set(state.reachedPoints)) : [],
    unlockedTasks: Array.isArray(state.unlockedTasks) ? Array.from(new Set(state.unlockedTasks)) : [],
    completedTasks: Array.isArray(state.completedTasks) ? Array.from(new Set(state.completedTasks)) : [],
    unlockedArticles: Array.isArray(state.unlockedArticles)
      ? Array.from(new Set(state.unlockedArticles))
      : [],
    finishedRoutes: Array.isArray(state.finishedRoutes) ? Array.from(new Set(state.finishedRoutes)) : [],
    audioSpeed: [0.75, 1, 1.25, 1.5].includes(state.audioSpeed) ? state.audioSpeed : 1,
    lastKnownPosition:
      Array.isArray(state.lastKnownPosition) && state.lastKnownPosition.length === 2
        ? state.lastKnownPosition
        : null,
  };
}

/**
 * Creates localStorage persistence service.
 * @param {{ storageKey?: string }} [options]
 */
export function createStorageService({ storageKey = STORAGE_KEY } = {}) {
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
