/**
 * @param {{ hasApiKey: boolean }} options
 */
export function mapPanel({ hasApiKey }) {
  if (!hasApiKey) {
    return `
      <section class="map-panel map-panel--fallback">
        <p>Карта недоступна. Добавьте ключ Yandex Maps API.</p>
      </section>
    `;
  }

  return `
    <section class="map-panel">
      <div class="map-panel__canvas" data-map-canvas aria-label="Карта маршрута"></div>
    </section>
  `;
}
