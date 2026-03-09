/** @typedef {import("../state/store.js").Store} Store */

export const ALLOWED_AUDIO_SPEEDS = [0.75, 1, 1.25, 1.5];

/**
 * @param {{ store: Store }} options
 */
export function createAudioService({ store }) {
  const audio = new Audio();
  audio.preload = "metadata";

  /** @type {Set<(snapshot: ReturnType<typeof getSnapshot>) => void>} */
  const listeners = new Set();
  let currentSrc = "";
  let errorMessage = "";

  function getSnapshot() {
    return {
      src: currentSrc,
      isPlaying: !audio.paused,
      currentTime: audio.currentTime,
      duration: Number.isFinite(audio.duration) ? audio.duration : 0,
      speed: audio.playbackRate,
      hasError: errorMessage !== "",
      errorMessage,
    };
  }

  function emit() {
    const snapshot = getSnapshot();
    for (const listener of listeners) {
      listener(snapshot);
    }
  }

  audio.addEventListener("play", () => {
    errorMessage = "";
    emit();
  });
  audio.addEventListener("pause", emit);
  audio.addEventListener("ended", emit);
  audio.addEventListener("timeupdate", emit);
  audio.addEventListener("error", () => {
    errorMessage = "Аудиофайл недоступен или поврежден.";
    emit();
  });

  setSpeed(store.getState().audioSpeed);

  /**
   * @param {string} src
   */
  async function play(src) {
    if (!src) {
      throw new Error("Источник аудио не настроен.");
    }

    if (src !== currentSrc) {
      currentSrc = src;
      errorMessage = "";
      audio.src = src;
      audio.load();
    }

    audio.playbackRate = store.getState().audioSpeed;
    await audio.play();
    emit();
  }

  function pause() {
    audio.pause();
    emit();
  }

  function stop() {
    audio.pause();
    audio.currentTime = 0;
    emit();
  }

  /**
   * @param {number} speed
   */
  function setSpeed(speed) {
    if (!ALLOWED_AUDIO_SPEEDS.includes(speed)) {
      return false;
    }

    audio.playbackRate = speed;
    store.setAudioSpeed(speed);
    emit();
    return true;
  }

  /**
   * @param {(snapshot: ReturnType<typeof getSnapshot>) => void} listener
   */
  function subscribe(listener) {
    listeners.add(listener);
    listener(getSnapshot());
    return () => listeners.delete(listener);
  }

  return {
    play,
    pause,
    stop,
    setSpeed,
    subscribe,
    getSnapshot,
    getAllowedSpeeds: () => [...ALLOWED_AUDIO_SPEEDS],
  };
}
