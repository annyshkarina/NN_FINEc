import { haversineDistance } from "../utils/distance.js";

/**
 * Domain service containing route progress and unlock logic.
 * @param {{ contentService: any, store: import("../state/store.js").Store }} options
 */
export function createRouteEngine({ contentService, store }) {
  async function getSelectedRouteBundle() {
    const state = store.getState();

    if (!state.selectedRouteId) {
      return null;
    }

    return contentService.getRouteBundle(state.selectedRouteId);
  }

  async function getCurrentPoint() {
    const state = store.getState();
    const bundle = await getSelectedRouteBundle();
    if (!bundle) {
      return null;
    }

    if (bundle.points.length === 0) {
      return null;
    }

    const maxIndex = bundle.points.length - 1;
    const normalizedIndex = Math.max(0, Math.min(state.currentPointIndex, maxIndex));

    if (normalizedIndex !== state.currentPointIndex) {
      store.setCurrentPointIndex(normalizedIndex);
    }

    return bundle.points[normalizedIndex] || null;
  }

  async function unlockPoint(pointId) {
    const point = await contentService.getPointById(pointId);
    if (!point) {
      return null;
    }

    const alreadyReached = store.getState().reachedPoints.includes(point.id);
    if (!alreadyReached) {
      store.markPointReached({
        pointId: point.id,
        taskId: point.taskId,
        articleId: point.articleId,
      });

      const bundle = await getSelectedRouteBundle();
      if (bundle && bundle.route.id === point.routeId) {
        const reachedPoints = store.getState().reachedPoints;
        const allReached = bundle.points.every((item) => reachedPoints.includes(item.id));
        if (allReached) {
          store.finishRoute(bundle.route.id);
        }
      }
    }

    return {
      point,
      alreadyReached,
    };
  }

  /**
   * @param {[number, number]} coords
   */
  async function evaluatePosition(coords) {
    store.setLastKnownPosition(coords, { notify: false });

    const currentPoint = await getCurrentPoint();
    if (!currentPoint) {
      return {
        type: "idle",
      };
    }

    const distanceMeters = haversineDistance(coords, currentPoint.coords);
    const withinRadius = distanceMeters <= currentPoint.radiusMeters;

    if (!withinRadius) {
      return {
        type: "tracking",
        currentPoint,
        distanceMeters,
      };
    }

    const unlocked = await unlockPoint(currentPoint.id);

    return {
      type: "reached",
      currentPoint,
      distanceMeters,
      unlocked,
    };
  }

  async function advanceToNextPoint() {
    const state = store.getState();
    const bundle = await getSelectedRouteBundle();

    if (!bundle) {
      return {
        done: false,
      };
    }

    const nextIndex = state.currentPointIndex + 1;
    if (nextIndex >= bundle.points.length) {
      store.finishRoute(bundle.route.id);
      return {
        done: true,
        routeCompleted: true,
      };
    }

    store.setCurrentPointIndex(nextIndex);
    return {
      done: true,
      routeCompleted: false,
    };
  }

  async function finishSelectedRoute() {
    const bundle = await getSelectedRouteBundle();
    if (!bundle) {
      return { ok: false };
    }

    store.finishRoute(bundle.route.id);
    return { ok: true };
  }

  async function getProgress() {
    const state = store.getState();
    const bundle = await getSelectedRouteBundle();
    if (!bundle) {
      return {
        reached: 0,
        total: 0,
        percent: 0,
      };
    }

    const reached = bundle.points.filter((point) => state.reachedPoints.includes(point.id)).length;
    const total = bundle.points.length;

    return {
      reached,
      total,
      percent: total === 0 ? 0 : Math.round((reached / total) * 100),
    };
  }

  /**
   * @param {string} taskId
   * @param {import("../state/store.js").AppState} state
   */
  function getTaskStatus(taskId, state) {
    if (state.completedTasks.includes(taskId)) {
      return "completed";
    }

    if (state.unlockedTasks.includes(taskId)) {
      return "available";
    }

    return "locked";
  }

  /**
   * @param {string} articleId
   * @param {import("../state/store.js").AppState} state
   */
  function getArticleStatus(articleId, state) {
    if (state.unlockedArticles.includes(articleId)) {
      return "available";
    }

    return "locked";
  }

  async function getTasksOverview() {
    const state = store.getState();
    const routes = await contentService.getRoutes();

    const bundles = await Promise.all(
      routes.map(async (route, routeIndex) => {
        const [tasks, points] = await Promise.all([
          contentService.getTasksByRouteId(route.id),
          contentService.getPointsByRouteId(route.id),
        ]);

        const pointById = new Map(points.map((point) => [point.id, point]));

        return tasks.map((task) => {
          const point = pointById.get(task.pointId) || null;
          return {
            id: task.id,
            routeId: task.routeId,
            routeTitle: route.title,
            pointId: task.pointId,
            pointTitle: point?.title || "Неизвестная точка",
            pointOrder: point?.order ?? Number.MAX_SAFE_INTEGER,
            routeOrder: routeIndex,
            title: task.title,
            type: task.type,
            description: task.description,
            rewardPoints: task.rewardPoints,
            canSkip: task.canSkip,
            status: getTaskStatus(task.id, state),
          };
        });
      })
    );

    return bundles
      .flat()
      .sort((first, second) => {
        if (first.routeOrder !== second.routeOrder) {
          return first.routeOrder - second.routeOrder;
        }

        if (first.pointOrder !== second.pointOrder) {
          return first.pointOrder - second.pointOrder;
        }

        return first.title.localeCompare(second.title);
      });
  }

  /**
   * @param {string} taskId
   */
  async function getTaskDetails(taskId) {
    const task = await contentService.getTaskById(taskId);
    if (!task) {
      return null;
    }

    const [route, point] = await Promise.all([
      contentService.getRouteById(task.routeId),
      contentService.getPointById(task.pointId),
    ]);

    const state = store.getState();
    const status = getTaskStatus(task.id, state);

    return {
      ...task,
      routeTitle: route?.title || "Маршрут",
      pointTitle: point?.title || "Точка",
      status,
      canComplete: status === "available",
    };
  }

  /**
   * @param {string} taskId
   */
  async function completeTask(taskId) {
    const details = await getTaskDetails(taskId);

    if (!details) {
      return {
        ok: false,
        reason: "not-found",
      };
    }

    if (details.status === "locked") {
      return {
        ok: false,
        reason: "locked",
      };
    }

    if (details.status === "completed") {
      return {
        ok: true,
        alreadyCompleted: true,
      };
    }

    store.completeTask(taskId);

    return {
      ok: true,
      alreadyCompleted: false,
    };
  }

  async function getArticlesOverview() {
    const state = store.getState();
    const routes = await contentService.getRoutes();

    const bundles = await Promise.all(
      routes.map(async (route, routeIndex) => {
        const [articles, points] = await Promise.all([
          contentService.getArticlesByRouteId(route.id),
          contentService.getPointsByRouteId(route.id),
        ]);

        const pointById = new Map(points.map((point) => [point.id, point]));

        return articles.map((article) => {
          const point = pointById.get(article.pointId) || null;
          return {
            id: article.id,
            routeId: article.routeId,
            routeTitle: route.title,
            pointId: article.pointId,
            pointTitle: point?.title || "Неизвестная точка",
            pointOrder: point?.order ?? Number.MAX_SAFE_INTEGER,
            routeOrder: routeIndex,
            title: article.title,
            summary: article.summary,
            status: getArticleStatus(article.id, state),
          };
        });
      })
    );

    return bundles
      .flat()
      .sort((first, second) => {
        if (first.routeOrder !== second.routeOrder) {
          return first.routeOrder - second.routeOrder;
        }

        if (first.pointOrder !== second.pointOrder) {
          return first.pointOrder - second.pointOrder;
        }

        return first.title.localeCompare(second.title);
      });
  }

  /**
   * @param {string} articleId
   */
  async function getArticleDetails(articleId) {
    const article = await contentService.getArticleById(articleId);
    if (!article) {
      return null;
    }

    const [route, point] = await Promise.all([
      contentService.getRouteById(article.routeId),
      contentService.getPointById(article.pointId),
    ]);

    const state = store.getState();

    return {
      ...article,
      routeTitle: route?.title || "Маршрут",
      pointTitle: point?.title || "Точка",
      relatedPoint: point,
      status: getArticleStatus(article.id, state),
      unlocked: state.unlockedArticles.includes(article.id),
    };
  }

  return {
    getSelectedRouteBundle,
    getCurrentPoint,
    unlockPoint,
    evaluatePosition,
    advanceToNextPoint,
    finishSelectedRoute,
    getProgress,
    getTasksOverview,
    getTaskDetails,
    completeTask,
    getArticlesOverview,
    getArticleDetails,
  };
}
