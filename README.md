# Financial Code: Walking Tour of Nizhny Novgorod

Mobile-first SPA for a self-guided financial literacy tour. The app is static-hosting friendly and deployable to GitHub Pages.

## Current implementation stage

Step 2 is implemented:

- project structure
- core services (content/storage/state/audio/route engine/router)
- Yandex Maps integration
- geolocation tracking with unlock-by-radius and manual fallback
- audio system (play/pause/stop/speed with local persistence)
- task system (locked/available/completed)
- article system (locked/available + detail pages with related point)

## Tech stack

- Vite
- Vanilla JavaScript (ES modules)
- Modern CSS
- Yandex Maps JS API
- Browser Geolocation API
- HTML5 Audio API

## Architecture

- `src/pages`: route-level pages
- `src/components`: reusable UI blocks
- `src/services`: content, map, geolocation, audio, storage, route engine
- `src/state`: centralized local state with persistence
- `src/utils`: router + helpers
- `src/data`: JSON content and config

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run dev server:

```bash
npm run dev
```

3. Open local app URL from Vite output.

## Configure Yandex Maps API key

Edit `src/data/config.json`:

```json
{
  "YANDEX_MAPS_API_KEY": "your_key_here"
}
```

If key is empty, map panel shows:

`Map is unavailable. Please configure Yandex Maps API key.`

Geolocation fallback:

- if permission is denied, the app shows `I reached the point` button.

## Build

```bash
npm run build
```

Production files are generated in `dist/`.

For GitHub Pages-specific build (relative asset paths):

```bash
npm run build:pages
```

## Deploy to GitHub Pages

1. Push repository to GitHub.
2. Ensure default branch is `main`.
3. In repository settings:
   - Go to `Settings` -> `Pages`.
   - Set source to `GitHub Actions`.
4. Push to `main` (or run workflow manually).
5. Workflow `.github/workflows/deploy.yml` builds with `npm run build:pages` and deploys `dist`.

## Local state model

User progress is stored in `localStorage`:

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

## Routing

Hash router is used for GitHub Pages compatibility:

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
