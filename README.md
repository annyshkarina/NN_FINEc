# Financial Code: Walking Tour of Nizhny Novgorod

Mobile-first static SPA for a self-guided financial literacy tour.  
The project is designed for GitHub Pages deployment and future backend migration.

## What the app includes

- route and transport selection
- tour run page with map, live geolocation status, and point progression
- unlock-by-radius logic with manual fallback
- centralized audio guide playback (play/pause/stop/speed)
- tasks and articles with lock/unlock states
- local profile and persistent progress via `localStorage`

## Stack

- Vite
- Vanilla JavaScript (ES modules)
- Modern CSS
- Yandex Maps JS API
- Browser Geolocation API
- HTML5 Audio API

## Architecture

- `src/pages` - route-level screens
- `src/components` - reusable UI blocks
- `src/services` - content/storage/map/geolocation/audio/domain logic
- `src/state` - centralized app state
- `src/utils` - router, math helpers, constants
- `src/data` - JSON content and configuration

## 1) Install dependencies

```bash
npm install
```

## 2) Run dev server

```bash
npm run dev
```

## 3) Configure Yandex Maps API key

1. Copy `src/data/config.example.json` to `src/data/config.json`.
2. Set `YANDEX_MAPS_API_KEY`.

```json
{
  "YANDEX_MAPS_API_KEY": "your_key_here"
}
```

Security:

- keep `src/data/config.json` empty in public repos
- do not commit real production keys

Fallback behavior:

- empty key: `Map is unavailable. Please configure Yandex Maps API key.`
- API/network load failure: map panel switches to fallback message

## 4) Build project

```bash
npm run build
```

For Pages deployment (explicit relative assets):

```bash
npm run build:pages
```

## 5) Deploy to GitHub Pages

Workflow file: `.github/workflows/deploy.yml`

- triggers on push to `main` and `master` (plus manual run)
- builds with `npm run build:pages`
- deploys `dist` via `actions/deploy-pages`

Repository setup:

1. Open GitHub repository `Settings -> Pages`.
2. Set Source to `GitHub Actions`.
3. Push to `main` or `master`, or run workflow manually.

## Routing model

Hash routing is used for static hosting compatibility:

- `#/home`
- `#/excursions`
- `#/transport`
- `#/run`
- `#/tasks`
- `#/tasks/:taskId`
- `#/articles`
- `#/articles/:articleId`
- `#/profile`
- `#/about`

## Geolocation and demo fallback

- Normal mode: app tracks user position and unlocks point content inside `radiusMeters`.
- If geolocation is denied/unavailable: user can use `I reached the point`.
- Demo mode:
  - `#/run?demo=1` forces demo mode for the current run view
  - `#/run?demo=0` forces normal mode for the current run view
  - run-page toggle persists demo mode in local storage
- `Reset all progress` clears both tour progress and persisted demo-mode flag.

## Local state persistence

Progress is stored in `localStorage` with runtime validation and safe defaults:

- `profile`
- `selectedRouteId`
- `selectedTransport`
- `currentPointIndex`
- `reachedPoints`
- `unlockedTasks`
- `completedTasks`
- `unlockedArticles`
- `finishedRoutes`
- `audioSpeed`
- `lastKnownPosition`

## Final local test checklist

1. `npm install`
2. `npm run dev`
3. Select route and transport, open `#/run`
4. Verify:
   - map key fallback (empty key)
   - map rendering (valid key)
   - geolocation status updates
   - manual point confirmation fallback
   - demo mode toggle and `#/run?demo=1`
   - audio play/pause/stop/speed persistence
   - article/task unlock after point reach
5. Refresh page and verify progress persistence
6. `npm run build:pages`

## Future improvements

- runtime-secure key injection strategy for private production deployments
- offline map/content fallback for low-connectivity routes
- automated unit/e2e tests for progression and unlock logic
