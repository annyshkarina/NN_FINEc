import { ALLOWED_AUDIO_SPEEDS } from "../services/audioService.js";
import { button } from "./button.js";

/**
 * @param {{ pointId: string, audioSrc: string, speed: number }} options
 */
export function audioPlayer({ pointId, audioSrc, speed }) {
  const hasAudioSrc = typeof audioSrc === "string" && audioSrc.trim() !== "";

  return `
    <section class="audio-player" data-audio-player data-point-id="${pointId}" data-audio-src="${audioSrc}">
      <div class="audio-player__controls">
        ${button({
          label: "Слушать аудио",
          variant: "primary",
          attrs: `data-audio-action="play" ${hasAudioSrc ? "" : "disabled"}`,
        })}
        ${button({ label: "Пауза", attrs: 'data-audio-action="pause"' })}
        ${button({ label: "Стоп", attrs: 'data-audio-action="stop"' })}
      </div>
      <div class="audio-player__settings">
        <label class="audio-player__label" for="speed-${pointId}">Скорость</label>
        <select id="speed-${pointId}" class="audio-player__speed" data-audio-speed>
          ${ALLOWED_AUDIO_SPEEDS.map((value) => `
            <option value="${value}" ${value === speed ? "selected" : ""}>${value}x</option>
          `).join("")}
        </select>
      </div>
      <div class="audio-player__status" data-audio-status>${hasAudioSrc ? "Готово" : "Аудио недоступно для этой точки."}</div>
    </section>
  `;
}

/**
 * @param {HTMLElement} root
 * @param {{ audioService: any }} deps
 */
export function bindAudioPlayer(root, { audioService }) {
  const wrapper = root.querySelector("[data-audio-player]");
  if (!wrapper) {
    return () => {};
  }

  const src = (wrapper.getAttribute("data-audio-src") || "").trim();
  const hasAudioSrc = src.trim() !== "";
  const statusNode = wrapper.querySelector("[data-audio-status]");
  const speedNode = /** @type {HTMLSelectElement | null} */ (wrapper.querySelector("[data-audio-speed]"));

  const handleClick = async (event) => {
    const target = /** @type {HTMLElement} */ (event.target);
    const actionNode = target.closest("[data-audio-action]");
    const action = actionNode?.getAttribute("data-audio-action");
    if (!action) {
      return;
    }

    if (action === "play") {
      if (!src) {
        if (statusNode) {
          statusNode.textContent = "Аудио недоступно для этой точки.";
        }
        return;
      }

      try {
        await audioService.play(src);
      } catch {
        if (statusNode) {
          statusNode.textContent = "Аудио недоступно для этой точки.";
        }
      }
      return;
    }

    if (action === "pause") {
      audioService.pause();
      return;
    }

    if (action === "stop") {
      audioService.stop();
    }
  };

  const handleSpeedChange = () => {
    if (!speedNode) {
      return;
    }

    const value = Number(speedNode.value);
    audioService.setSpeed(value);
  };

  const unsubscribe = audioService.subscribe((snapshot) => {
    if (!statusNode) {
      return;
    }

    if (snapshot.hasError) {
      statusNode.textContent = snapshot.errorMessage || "Аудио недоступно.";
      return;
    }

    if (!snapshot.src) {
      if (!hasAudioSrc) {
        statusNode.textContent = "Аудио недоступно для этой точки.";
        return;
      }

      statusNode.textContent = `Готово · ${snapshot.speed}x`;
      return;
    }

    const nowPlaying = snapshot.isPlaying ? "Играет" : "Пауза";
    const hasDuration = snapshot.duration > 0;
    const timeline = hasDuration
      ? ` · ${formatTime(snapshot.currentTime)}/${formatTime(snapshot.duration)}`
      : "";

    statusNode.textContent = `${nowPlaying} ${snapshot.speed}x${timeline}`;
  });

  wrapper.addEventListener("click", handleClick);
  speedNode?.addEventListener("change", handleSpeedChange);

  return () => {
    unsubscribe();
    wrapper.removeEventListener("click", handleClick);
    speedNode?.removeEventListener("change", handleSpeedChange);
  };
}

/**
 * @param {number} seconds
 */
function formatTime(seconds) {
  const safe = Math.max(0, Math.floor(seconds || 0));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}
