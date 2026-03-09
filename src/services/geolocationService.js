/**
 * Wrapper around browser geolocation API.
 */
export function createGeolocationService() {
  function isSupported() {
    return "geolocation" in navigator;
  }

  /**
   * @param {{
   * onPosition: (coords: [number, number], position: GeolocationPosition) => void,
   * onError?: (error: GeolocationPositionError) => void,
   * options?: PositionOptions
   * }} options
   */
  function watchPosition({ onPosition, onError, options }) {
    if (!isSupported()) {
      throw new Error("Геолокация не поддерживается этим браузером.");
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        onPosition([position.coords.latitude, position.coords.longitude], position);
      },
      (error) => {
        onError?.(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000,
        ...options,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }

  return {
    isSupported,
    watchPosition,
  };
}
