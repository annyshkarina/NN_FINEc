let loaderPromise = null;

/**
 * Loads Yandex Maps script once and resolves after `ymaps.ready`.
 * @param {string} apiKey
 * @returns {Promise<any>}
 */
function loadYandexMaps(apiKey) {
  if (!apiKey) {
    return Promise.reject(new Error("Yandex Maps API key is missing."));
  }

  if (window.ymaps) {
    return new Promise((resolve) => {
      window.ymaps.ready(() => resolve(window.ymaps));
    });
  }

  if (loaderPromise) {
    return loaderPromise;
  }

  loaderPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU`;
    script.async = true;
    script.dataset.source = "yandex-maps";

    script.onload = () => {
      if (!window.ymaps) {
        loaderPromise = null;
        reject(new Error("Yandex Maps script loaded but ymaps is unavailable."));
        return;
      }

      window.ymaps.ready(() => resolve(window.ymaps));
    };

    script.onerror = () => {
      loaderPromise = null;
      reject(new Error("Failed to load Yandex Maps script."));
    };

    document.head.append(script);
  });

  return loaderPromise;
}

/**
 * Creates map facade for rendering route and user location.
 */
export function createMapService() {
  /**
   * @param {{
   * container: HTMLElement,
   * apiKey: string,
   * center?: [number, number],
   * zoom?: number
   * }} options
   */
  async function createSession({ container, apiKey, center = [56.326, 44.006], zoom = 13 }) {
    const ymaps = await loadYandexMaps(apiKey);
    const map = new ymaps.Map(container, {
      center,
      zoom,
      controls: ["zoomControl", "typeSelector"],
    });

    let routePolyline = null;
    /** @type {{ pointId: string, marker: any }[]} */
    let pointMarkers = [];
    let userMarker = null;

    function clearRouteObjects() {
      if (routePolyline) {
        map.geoObjects.remove(routePolyline);
        routePolyline = null;
      }

      pointMarkers.forEach(({ marker }) => map.geoObjects.remove(marker));
      pointMarkers = [];
    }

    /**
     * @param {Array<{ id: string, title: string, coords: [number, number] }>} points
     * @param {{ currentPointId?: string, reachedPointIds?: string[], onPointClick?: (pointId: string) => void }} [options]
     */
    function renderRoute(points, options = {}) {
      clearRouteObjects();

      if (points.length === 0) {
        return;
      }

      const coordinates = points.map((point) => point.coords);
      routePolyline = new ymaps.Polyline(coordinates, {}, {
        strokeColor: "#57b4ff",
        strokeWidth: 4,
        strokeOpacity: 0.85,
      });

      map.geoObjects.add(routePolyline);

      pointMarkers = points.map((point, index) => {
        const isCurrent = point.id === options.currentPointId;
        const isReached = options.reachedPointIds?.includes(point.id);

        const preset = isCurrent
          ? "islands#redIcon"
          : isReached
            ? "islands#greenIcon"
            : "islands#blueIcon";

        const marker = new ymaps.Placemark(
          point.coords,
          {
            hintContent: point.title,
            balloonContentHeader: point.title,
            balloonContentBody: `Точка ${index + 1}`,
          },
          {
            preset,
          }
        );

        marker.events.add("click", () => {
          options.onPointClick?.(point.id);
        });

        map.geoObjects.add(marker);
        return { pointId: point.id, marker };
      });

      if (coordinates.length > 1) {
        map.setBounds(routePolyline.geometry.getBounds(), {
          checkZoomRange: true,
          zoomMargin: [48, 24, 48, 24],
        });
      } else {
        map.setCenter(coordinates[0], 15);
      }
    }

    /**
     * @param {{ currentPointId?: string, reachedPointIds?: string[] }} options
     */
    function updatePointState({ currentPointId, reachedPointIds = [] }) {
      pointMarkers.forEach(({ pointId, marker }) => {
        const isCurrent = pointId === currentPointId;
        const isReached = reachedPointIds.includes(pointId);

        const preset = isCurrent
          ? "islands#redIcon"
          : isReached
            ? "islands#greenIcon"
            : "islands#blueIcon";

        marker.options.set("preset", preset);
      });
    }

    /**
     * @param {[number, number]} coords
     */
    function updateUserLocation(coords) {
      if (!userMarker) {
        userMarker = new ymaps.Placemark(
          coords,
          {
            hintContent: "Вы здесь",
          },
          {
            preset: "islands#violetCircleDotIcon",
          }
        );

        map.geoObjects.add(userMarker);
      } else {
        userMarker.geometry.setCoordinates(coords);
      }
    }

    function destroy() {
      try {
        map.destroy();
      } catch {
        // Ignore teardown errors to keep page stable.
      }
    }

    return {
      renderRoute,
      updatePointState,
      updateUserLocation,
      destroy,
    };
  }

  return {
    createSession,
  };
}
