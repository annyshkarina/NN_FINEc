import routesData from "../data/routes.json";
import pointsData from "../data/points.json";
import tasksData from "../data/tasks.json";
import articlesData from "../data/articles.json";
import configData from "../data/config.json";

/** @typedef {import("../state/store.js").TransportMode} TransportMode */

/**
 * @typedef Route
 * @property {string} id
 * @property {string} slug
 * @property {string} title
 * @property {string} description
 * @property {string} theme
 * @property {string} coverImage
 * @property {string} startPointId
 * @property {{ walk: number, scooter: number, car: number }} transportDurations
 * @property {string[]} points
 */

/**
 * @typedef Point
 * @property {string} id
 * @property {string} routeId
 * @property {number} order
 * @property {string} title
 * @property {string} address
 * @property {[number, number]} coords
 * @property {string} shortDescription
 * @property {string} fullDescription
 * @property {string} financialInsight
 * @property {string} logistics
 * @property {string} currentInfo
 * @property {string} articleId
 * @property {string} taskId
 * @property {string} audioSrc
 * @property {string} image
 * @property {number} radiusMeters
 */

/**
 * @typedef Task
 * @property {string} id
 * @property {string} routeId
 * @property {string} pointId
 * @property {string} title
 * @property {string} type
 * @property {string} description
 * @property {number} rewardPoints
 * @property {boolean} canSkip
 */

/**
 * @typedef Article
 * @property {string} id
 * @property {string} routeId
 * @property {string} pointId
 * @property {string} title
 * @property {string} summary
 * @property {string} content
 * @property {string[]} images
 */

/**
 * @typedef RouteBundle
 * @property {Route} route
 * @property {Point[]} points
 */

/**
 * Creates content service. API is async to simplify future migration to remote backend.
 */
export function createContentService() {
  /** @type {Route[]} */
  const routes = routesData;
  /** @type {Point[]} */
  const points = pointsData;
  /** @type {Task[]} */
  const tasks = tasksData;
  /** @type {Article[]} */
  const articles = articlesData;

  const pointsById = new Map(points.map((point) => [point.id, point]));
  const tasksById = new Map(tasks.map((task) => [task.id, task]));
  const articlesById = new Map(articles.map((article) => [article.id, article]));

  /**
   * @template T
   * @param {T} value
   * @returns {T}
   */
  function clone(value) {
    if (typeof structuredClone === "function") {
      return structuredClone(value);
    }

    return JSON.parse(JSON.stringify(value));
  }

  /** @returns {Promise<Route[]>} */
  async function getRoutes() {
    return clone(routes);
  }

  /** @param {string} routeId */
  async function getRouteById(routeId) {
    return clone(routes.find((route) => route.id === routeId) || null);
  }

  /** @param {string} routeId */
  async function getPointsByRouteId(routeId) {
    const routePoints = points
      .filter((point) => point.routeId === routeId)
      .sort((first, second) => first.order - second.order);
    return clone(routePoints);
  }

  /** @param {string} pointId */
  async function getPointById(pointId) {
    return clone(pointsById.get(pointId) || null);
  }

  /** @param {string} routeId */
  async function getTasksByRouteId(routeId) {
    return clone(tasks.filter((task) => task.routeId === routeId));
  }

  /** @param {string} taskId */
  async function getTaskById(taskId) {
    return clone(tasksById.get(taskId) || null);
  }

  /** @param {string} routeId */
  async function getArticlesByRouteId(routeId) {
    return clone(articles.filter((article) => article.routeId === routeId));
  }

  /** @param {string} articleId */
  async function getArticleById(articleId) {
    return clone(articlesById.get(articleId) || null);
  }

  /** @param {string} routeId */
  async function getRouteBundle(routeId) {
    const route = routes.find((item) => item.id === routeId);
    if (!route) {
      return null;
    }

    const orderedPoints = route.points
      .map((pointId) => pointsById.get(pointId))
      .filter(Boolean)
      .map((point) => /** @type {Point} */ (point));

    /** @type {RouteBundle} */
    const bundle = {
      route,
      points: orderedPoints,
    };

    return clone(bundle);
  }

  /** @returns {Promise<{ YANDEX_MAPS_API_KEY: string }>} */
  async function getConfig() {
    return clone(configData);
  }

  /**
   * @returns {{ id: TransportMode, label: string }[]}
   */
  function getTransportModes() {
    return [
      { id: "walk", label: "Пешком" },
      { id: "scooter", label: "Самокат" },
      { id: "car", label: "Авто" },
    ];
  }

  return {
    getRoutes,
    getRouteById,
    getRouteBundle,
    getPointsByRouteId,
    getPointById,
    getTasksByRouteId,
    getTaskById,
    getArticlesByRouteId,
    getArticleById,
    getConfig,
    getTransportModes,
  };
}
