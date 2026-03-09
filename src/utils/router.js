/**
 * @typedef RouteDefinition
 * @property {string} name
 * @property {string} path
 */

/**
 * @typedef RouteMatch
 * @property {string} name
 * @property {string} path
 * @property {Record<string, string>} params
 */

/**
 * Creates hash-based router suitable for static hosting environments.
 * @param {{ routes: RouteDefinition[], fallbackPath?: string, onRouteChange: (match: RouteMatch) => void | Promise<void> }} options
 */
export function createHashRouter({ routes, fallbackPath = "/home", onRouteChange }) {
  /** @type {RouteMatch | null} */
  let currentRoute = null;

  /**
   * @param {string} pattern
   * @param {string} currentPath
   * @returns {Record<string, string> | null}
   */
  function matchPattern(pattern, currentPath) {
    const patternParts = splitPath(pattern);
    const currentParts = splitPath(currentPath);

    if (patternParts.length !== currentParts.length) {
      return null;
    }

    /** @type {Record<string, string>} */
    const params = {};

    for (let index = 0; index < patternParts.length; index += 1) {
      const patternPart = patternParts[index];
      const currentPart = currentParts[index];

      if (patternPart.startsWith(":")) {
        params[patternPart.slice(1)] = decodeURIComponent(currentPart);
        continue;
      }

      if (patternPart !== currentPart) {
        return null;
      }
    }

    return params;
  }

  function splitPath(path) {
    return path
      .replace(/^\//, "")
      .replace(/\/$/, "")
      .split("/")
      .filter(Boolean);
  }

  function getCurrentPath() {
    const hash = window.location.hash || `#${fallbackPath}`;
    const path = hash.slice(1).split("?")[0];
    return path.startsWith("/") ? path : `/${path}`;
  }

  /**
   * @param {string} path
   * @returns {RouteMatch}
   */
  function resolve(path) {
    for (const route of routes) {
      const params = matchPattern(route.path, path);
      if (params) {
        return {
          name: route.name,
          path,
          params,
        };
      }
    }

    return {
      name: "not-found",
      path: fallbackPath,
      params: {},
    };
  }

  async function notifyCurrentRoute() {
    const resolved = resolve(getCurrentPath());
    currentRoute = resolved.name === "not-found" ? resolve(fallbackPath) : resolved;
    await onRouteChange(currentRoute);
  }

  /**
   * @param {string} path
   * @param {{ replace?: boolean }} [options]
   */
  function navigate(path, options = {}) {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const hash = `#${normalizedPath}`;

    if (options.replace) {
      window.location.replace(hash);
      return;
    }

    window.location.hash = hash;
  }

  function start() {
    window.addEventListener("hashchange", notifyCurrentRoute);

    if (!window.location.hash) {
      window.location.hash = `#${fallbackPath}`;
      return;
    }

    notifyCurrentRoute();
  }

  function stop() {
    window.removeEventListener("hashchange", notifyCurrentRoute);
  }

  return {
    start,
    stop,
    navigate,
    getCurrentRoute: () => currentRoute,
    refresh: notifyCurrentRoute,
  };
}
