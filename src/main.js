import "./styles/base.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/pages.css";

import { layout } from "./components/layout.js";
import { homePage } from "./pages/home.js";
import { excursionsPage } from "./pages/excursions.js";
import { transportPage } from "./pages/transport.js";
import { runPage } from "./pages/run.js";
import { tasksPage } from "./pages/tasks.js";
import { taskDetailsPage } from "./pages/taskDetails.js";
import { articlesPage } from "./pages/articles.js";
import { articleDetailsPage } from "./pages/articleDetails.js";
import { profilePage } from "./pages/profile.js";
import { aboutPage } from "./pages/about.js";

import { createHashRouter } from "./utils/router.js";
import { createStorageService } from "./services/storage.js";
import { createContentService } from "./services/contentService.js";
import { createGeolocationService } from "./services/geolocationService.js";
import { createMapService } from "./services/mapService.js";
import { createAudioService } from "./services/audioService.js";
import { createRouteEngine } from "./services/routeEngine.js";
import { createStore } from "./state/store.js";

const appNode = document.getElementById("app");

if (!appNode) {
  throw new Error("App root #app is missing.");
}

const storageService = createStorageService();
const contentService = createContentService();
const geolocationService = createGeolocationService();
const mapService = createMapService();
const store = createStore({ storageService });
const audioService = createAudioService({ store });
const routeEngine = createRouteEngine({ contentService, store });

/** @type {() => void} */
let activeCleanup = () => {};

const routeDefinitions = [
  { name: "home", path: "/home" },
  { name: "excursions", path: "/excursions" },
  { name: "transport", path: "/transport" },
  { name: "run", path: "/run" },
  { name: "tasks", path: "/tasks" },
  { name: "task-details", path: "/tasks/:taskId" },
  { name: "articles", path: "/articles" },
  { name: "article-details", path: "/articles/:articleId" },
  { name: "profile", path: "/profile" },
  { name: "about", path: "/about" },
];

const pageFactories = {
  home: homePage,
  excursions: excursionsPage,
  transport: transportPage,
  run: runPage,
  tasks: tasksPage,
  "task-details": taskDetailsPage,
  articles: articlesPage,
  "article-details": articleDetailsPage,
  profile: profilePage,
  about: aboutPage,
};

/** @type {{
 * store: typeof store,
 * contentService: typeof contentService,
 * geolocationService: typeof geolocationService,
 * mapService: typeof mapService,
 * audioService: typeof audioService,
 * routeEngine: typeof routeEngine,
 * router: ReturnType<typeof createHashRouter>,
 * route: any
 * }} */
const context = {
  store,
  contentService,
  geolocationService,
  mapService,
  audioService,
  routeEngine,
  router: /** @type {any} */ (null),
  route: null,
};

async function renderCurrentRoute(route) {
  activeCleanup();
  activeCleanup = () => {};

  context.route = route;

  const factory = pageFactories[route.name] || pageFactories.home;
  const page = await factory(context);

  appNode.innerHTML = layout({
    activeNav: page.activeNav,
    content: page.html,
  });

  const pageRoot = /** @type {HTMLElement | null} */ (appNode.querySelector("[data-page-root]"));
  if (!pageRoot || !page.mount) {
    return;
  }

  activeCleanup = page.mount(pageRoot) || (() => {});
}

const router = createHashRouter({
  routes: routeDefinitions,
  fallbackPath: "/home",
  onRouteChange: renderCurrentRoute,
});

context.router = router;

router.start();
