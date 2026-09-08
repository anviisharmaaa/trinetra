# TRINETRA — Criminal Network Intelligence System (Frontend Prototype)

A fully functional frontend prototype of TRINETRA, a fictional Indian government-style
criminal network investigation platform in the spirit of Palantir Gotham / IBM i2 Analyst's
Notebook. This is a **simulation environment** — there is no real backend, no real
authentication, and no real government data. Everything is mock, fictional, and clearly
labelled as a demo throughout the UI.

## Running it

```bash
npm install
npm run dev
```

Then open the printed local URL and log in with the demo credentials:

- **Username:** `demo`
- **Password:** `demo`

The Locations module uses a MapTiler basemap, and the app includes a browser-side
Supabase client for data/auth integration. Create a `.env.local` file with
`VITE_MAPTILER_KEY`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_PUBLISHABLE_KEY`
before running the app. Vite apps do not support Next.js server helpers or
middleware; session refresh should be handled through Supabase's browser client
auth events or a backend service when authentication is added.

To produce a production build:

```bash
npm run build
npm run preview
```

## Stack

- React 19 + TypeScript + Vite
- React Router (case-centric nested routing)
- Zustand, split into many small domain stores (`src/store/*`) rather than one giant store
- Cytoscape.js for the network graph, accessed only through an adapter (`src/components/graph/graphAdapter.ts`)
- Three.js for the login-screen rotating globe
- Lucide React icons
- Hand-authored CSS design system (`src/styles/*`) with CSS custom properties — no Tailwind
- `localStorage` used only for UI/session-demo state (sidebar mode, density, the mock session) — never real credentials

## Architecture notes

- **Investigation Context** (`src/store/investigationStore.ts`) is the most important piece of
  state in the app. Every intelligence module — the graph, CCTV, face recognition, the map,
  the timeline, the dossier — reads and writes the same `selectedEntityId` /
  `selectedLocationId` / `selectedCameraId` / `selectedTimestamp`. Selecting an entity anywhere
  makes it "the" selected entity everywhere.
- **Mock backend layering**: `src/data` (raw mock data + seeded generators) →
  `src/repositories/mock` (repository pattern, see `personRepository.ts` for the canonical
  example) → `src/services` (the API surface the UI actually consumes) → pages/components.
  Every service call goes through `mockDelay()` so nothing resolves instantly — this mirrors a
  real analytical backend having latency. Swapping in a real API later means rewriting the
  repository/service internals only; UI code never talks to `src/data` directly.
- **MapProvider** (`src/components/map/MapProvider.tsx`) owns the MapLibre/MapTiler basemap and
  exposes a `project(lat, lng) → {x, y}` contract for the existing investigation overlays.
- **Graph adapter boundary**: nothing outside `src/components/graph/graphAdapter.ts` and
  `NetworkGraph.tsx` imports Cytoscape directly, so the graph library could be swapped later.

## Project structure

```
src/
  assets/       brand mark
  components/   shell, graph, cctv, face, map, dossier, timeline, ui primitives
  data/         mock entities, relationships, cases, cctv, financial, timeline, etc.
  hooks/        useSidebar, useInvestigation, useKeyboardShortcuts, useSystemTime
  pages/        one file per route
  repositories/ mock repository layer
  services/     mock service layer (what the UI actually calls)
  store/        zustand stores, one per domain
  styles/       variables.css, global.css, layout.css, components.css, animations.css
  types/        domain model
```

## Keyboard shortcuts

- `Ctrl/Cmd + K` — command palette
- `Ctrl/Cmd + B` — toggle sidebar
- `G` — Network Graph, `C` — CCTV, `P` — selected Person Dossier, `M` — Location/Map, `T` — Timeline
- `Esc` — close palette/modal

## Demo data

Investigation **OPERATION TRINETRA-01** (`case-op001`) is the fully hand-authored showcase
case: a fictional cross-border logistics/laundering network centered on Arjun Malhotra, with
persons, vehicles, phones, organizations, accounts, documents, CCTV cameras, face-recognition
detections, financial transfers and a cross-referenced timeline all pointing at consistent IDs.
Three additional cases (`case-op002/003/004`) are procedurally generated from the same seed
data pools for variety in the Cases dashboard.
