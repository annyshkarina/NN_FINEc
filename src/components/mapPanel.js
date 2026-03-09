/**
 * @param {{ hasApiKey: boolean }} options
 */
export function mapPanel({ hasApiKey }) {
  if (!hasApiKey) {
    return `
      <section class="map-panel map-panel--fallback">
        <p>Map is unavailable. Please configure Yandex Maps API key.</p>
      </section>
    `;
  }

  return `
    <section class="map-panel">
      <div class="map-panel__canvas" data-map-canvas aria-label="Route map"></div>
    </section>
  `;
}
