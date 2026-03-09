/**
 * @typedef {"walk" | "scooter" | "car"} TransportMode
 */

/**
 * @typedef AppState
 * @property {{ name: string, age: number | null }} profile
 * @property {string | null} selectedRouteId
 * @property {TransportMode} selectedTransport
 * @property {number} currentPointIndex
 * @property {string[]} reachedPoints
 * @property {string[]} unlockedTasks
 * @property {string[]} completedTasks
 * @property {string[]} unlockedArticles
 * @property {string[]} finishedRoutes
 * @property {number} audioSpeed
 * @property {[number, number] | null} lastKnownPosition
 */

/** @type {AppState} */
export const DEFAULT_STATE = {
  profile: {
    name: "",
    age: null,
  },
  selectedRouteId: null,
  selectedTransport: "walk",
  currentPointIndex: 0,
  reachedPoints: [],
  unlockedTasks: [],
  completedTasks: [],
  unlockedArticles: [],
  finishedRoutes: [],
  audioSpeed: 1,
  lastKnownPosition: null,
};

/**
 * @param {string[]} list
 * @param {string} value
 */
function addUnique(list, value) {
  if (list.includes(value)) {
    return list;
  }

  return [...list, value];
}

/**
 * @param {AppState} value
 * @returns {AppState}
 */
function cloneState(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
}

/**
 * @typedef Store
 * @property {() => AppState} getState
 * @property {(listener: (state: AppState) => void) => () => void} subscribe
 * @property {(routeId: string) => void} selectRoute
 * @property {(transport: TransportMode) => void} setTransport
 * @property {(index: number) => void} setCurrentPointIndex
 * @property {(payload: { pointId: string, taskId?: string | null, articleId?: string | null }) => void} markPointReached
 * @property {(taskId: string) => void} completeTask
 * @property {(speed: number) => void} setAudioSpeed
 * @property {(position: [number, number], options?: { notify?: boolean }) => void} setLastKnownPosition
 * @property {(routeId: string) => void} finishRoute
 * @property {(profile: { name: string, age: number | null }) => void} setProfile
 * @property {() => void} resetProgress
 */

/**
 * @param {{ storageService: { loadState: (defaultState: AppState) => AppState, saveState: (state: AppState) => void, clear: () => void } }} options
 * @returns {Store}
 */
export function createStore({ storageService }) {
  /** @type {AppState} */
  let state = storageService.loadState(DEFAULT_STATE);
  /** @type {Set<(state: AppState) => void>} */
  const listeners = new Set();

  function notify() {
    const snapshot = cloneState(state);
    for (const listener of listeners) {
      listener(snapshot);
    }
  }

  /**
   * @param {(current: AppState) => AppState} recipe
   * @param {{ notify?: boolean }} [options]
   */
  function update(recipe, options = {}) {
    state = recipe(state);
    storageService.saveState(state);

    if (options.notify !== false) {
      notify();
    }
  }

  function getState() {
    return cloneState(state);
  }

  function subscribe(listener) {
    listeners.add(listener);
    listener(cloneState(state));

    return () => {
      listeners.delete(listener);
    };
  }

  function selectRoute(routeId) {
    update((current) => ({
      ...current,
      selectedRouteId: routeId,
      currentPointIndex: 0,
    }));
  }

  function setTransport(transport) {
    update((current) => ({
      ...current,
      selectedTransport: transport,
    }));
  }

  function setCurrentPointIndex(index) {
    update((current) => ({
      ...current,
      currentPointIndex: Math.max(0, index),
    }));
  }

  function markPointReached({ pointId, taskId, articleId }) {
    update((current) => ({
      ...current,
      reachedPoints: addUnique(current.reachedPoints, pointId),
      unlockedTasks:
        typeof taskId === "string" && taskId.trim() !== ""
          ? addUnique(current.unlockedTasks, taskId)
          : current.unlockedTasks,
      unlockedArticles:
        typeof articleId === "string" && articleId.trim() !== ""
          ? addUnique(current.unlockedArticles, articleId)
          : current.unlockedArticles,
    }));
  }

  function completeTask(taskId) {
    update((current) => ({
      ...current,
      completedTasks: addUnique(current.completedTasks, taskId),
    }));
  }

  function setAudioSpeed(speed) {
    if (![0.75, 1, 1.25, 1.5].includes(speed)) {
      return;
    }

    update((current) => ({
      ...current,
      audioSpeed: speed,
    }), { notify: false });
  }

  function setLastKnownPosition(position, options = {}) {
    update((current) => ({
      ...current,
      lastKnownPosition: position,
    }), { notify: options.notify });
  }

  function finishRoute(routeId) {
    update((current) => ({
      ...current,
      finishedRoutes: addUnique(current.finishedRoutes, routeId),
    }));
  }

  function setProfile(profile) {
    update((current) => ({
      ...current,
      profile: {
        name: profile.name,
        age: profile.age,
      },
    }));
  }

  function resetProgress() {
    state = cloneState(DEFAULT_STATE);
    storageService.clear();
    notify();
  }

  return {
    getState,
    subscribe,
    selectRoute,
    setTransport,
    setCurrentPointIndex,
    markPointReached,
    completeTask,
    setAudioSpeed,
    setLastKnownPosition,
    finishRoute,
    setProfile,
    resetProgress,
  };
}
