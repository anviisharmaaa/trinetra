# TRINETRA — Project Handoff / Continuation Notes

This document summarizes the current state of the **TRINETRA** project (a fictional Indian government-style criminal-network intelligence platform prototype) so work can continue in a new chat. Paste this whole file into the new conversation as context.

Project location on the user's machine: `C:\Users\anvii\OneDrive\Desktop\trinetra2` (a OneDrive-synced folder connected to Claude).

---

## 1. What this project is

A frontend-only prototype (no real backend, no real security) of "TRINETRA" — a criminal-network intelligence dashboard. It is explicitly a **simulation/demo environment**: login uses mock credentials (`demo` / `demo`), and the app is labeled "SIMULATION MODE" / "SIMULATION ENVIRONMENT" throughout so it's never mistaken for something real. It deliberately does **not** use any real Indian government emblem (e.g. the Ashoka Chakra/Ministry of Home Affairs emblem) — an earlier decision replaced that with an abstract tricolor accent bar instead.

Tech stack: React + TypeScript + Vite (Vite 8 / rolldown-vite), Zustand for state, `three` + `three-globe` for the 3D globe, `lucide-react` for icons, React Router for navigation.

## 2. Phase 1 (completed earlier, not touched in this session)

A full 18+ page application was built and delivered previously: Cases Dashboard, and many other operational-intelligence pages, a design system, a mock data layer, and a dense "operational console" visual style (small radii, 11–13px type, `.field`/`.search-input`/`.input` classes in `components.css`). This phase is done and was not modified in this session except where noted below.

## 3. Phase 2 (this session) — Login page rebuild

The user provided a reference screenshot (a polished login mockup: dark background, large 3D globe with glowing arcs on the left, "TRINETRA" wordmark, headline copy, translucent login card on the right) plus an extremely detailed ~30-point specification demanding a **real, functional, animated 3D globe** (not a static image or GIF) and an Apple-minimalist / Palantir-adjacent "intelligence infrastructure" aesthetic. Full requirements are long; the key mandates were:

- Real interactive 3D globe (Three.js-family), continuously rotating, very slowly ("Apple product animation, not sci-fi").
- Animated arcs between geographic nodes with traveling light particles, following the globe's rotation as one true 3D object (not a 2D overlay).
- Staggered/randomized pulse timing on nodes ("do not make every node pulse simultaneously").
- Dark, restrained color palette (near-black background, cool blue/cyan accents used sparingly — "do NOT make everything blue").
- Fully working login: real validation, password show/hide, "Keep me signed in" (persisted vs session-only), demo auth flow (Idle → Authenticating → Success → navigate to `/cases`), backend-swappable auth layer.
- Respect `prefers-reduced-motion` (stop rotation, stop traveling particles, stop pulses).
- Use the same TRINETRA eye/network logo the user had provided earlier in the project (not a new icon).
- Explicit "do NOT" list: no static globe image, no GIF, no generic SaaS dashboard, no cyberpunk neon, no excessive glassmorphism, no clone of Palantir or Apple's website, etc.
- A 15-item verification checklist (run the app, confirm rotation/particles/pulses/rotation-attachment, form/auth/navigation work, no console errors, TypeScript builds, layouts at 1920×1080 and 1440×900, reduced-motion behavior).

### What was implemented

**New dependency:** `three-globe` (v2.45.2) — a `THREE.Object3D`-based globe library that plugs into a normal Three.js scene, chosen because it natively provides globe texture layers, graticules, atmosphere glow, points (nodes), rings (pulses), arcs (animated dashed routes), and country-polygon overlays — covering nearly every spec requirement out of the box.

**New/changed files (all under the project root):**

- `src/components/auth/TrinetraGlobe.tsx` — **fully rewritten.** Replaced the old fixed-380px vanilla-Three.js wireframe globe with a responsive, full-container `three-globe` scene:
  - `earth-dark.jpg` texture (subtle, near-black land/ocean), built-in atmosphere (cyan, restrained), built-in graticule (re-tinted from default grey to dim cyan).
  - 10 world-city nodes (Mumbai flagged as HQ/most prominent) with 5 of them pulsing on individually staggered periods (3600–6000ms) so the network doesn't pulse in unison.
  - 10 animated arcs connecting nodes, each with randomized per-arc travel duration and initial gap (organic, desynchronized).
  - Async-loaded, size-reduced (488KB→180KB) world country-outline GeoJSON overlay (`public/data/world-countries-110m.geojson`), fetched at runtime so it doesn't bloat the JS bundle; degrades gracefully if the fetch fails.
  - Fixed-in-scene directional lighting (not attached to the rotating group) so the globe reads as a lit 3D sphere with a dark far side.
  - Continuous rotation (`+= 0.00075` rad/frame — deliberately almost imperceptible), gated off entirely when `prefers-reduced-motion` is set.
  - Subtle mouse-parallax camera easing and cursor-proximity ambient-light boost, both gated behind `!reducedMotion`.
  - **Reduced-motion fix (important):** rather than just zeroing arc/ring animation durations (which turned out to still cause per-frame changes — see Section 5), reduced motion now **removes the arcs/rings data entirely** (`globe.arcsData([])`, `globe.ringsData([])`) when active, and restores the original (memoized, not re-randomized) data when motion is re-enabled. This is done both at initial mount and reactively if the OS setting changes mid-session, via a `globeRef` + a second `useEffect` keyed on the `reducedMotion` value.
  - Full cleanup on unmount (dispose geometries/materials/textures, remove listeners/observers, remove renderer DOM node).
  - Component API: `TrinetraGlobe({ interactive = true })` — no more `size` prop; it fills its parent container via CSS (`width: 100%; height: 100%`), kept in sync via `ResizeObserver` + a `resize` listener.

- `src/pages/LoginPage.tsx` — **fully rewritten** to match the reference composition: top bar (TRINETRA wordmark, INTELLIGENCE/SECURITY/IMPACT nav labels, "SYSTEM STATUS · NOMINAL" with a subtle pulsing dot + live clock), a full-bleed globe layer behind everything (masked with a radial gradient so it fades at the edges rather than hard-cutting), a left branding column ("A clearer picture for a safer tomorrow." / "Intelligence. Security. Relentless." / one-line supporting copy — kept deliberately brief, not a marketing page), and a translucent login card on the right containing:
  - The existing eye/network icon (`trinetra-icon.png`, see below) + "TRINETRA" / "INTELLIGENCE PLATFORM".
  - "Welcome back" / "Sign in to continue to Trinetra".
  - Real username + password fields (person/lock icons, focus-state border/background transitions), password show/hide toggle.
  - "Keep me signed in" checkbox (wired to real persistence — see `sessionStore.ts` below) + "Forgot password?" (shows an inline "not available in this demo environment" notice rather than doing nothing or using the app's global toast system, which isn't mounted on this route).
  - Light/off-white primary "Sign in →" button with Idle → Authenticating (spinner) → Access granted → `navigate('/cases')` states.
  - "or" divider + outlined "Sign in with Smart Card" button (also shows the same kind of inline "not available in demo" notice).
  - A small muted "Demo access — demo / demo" hint.
  - Footer links "Security Notice | Privacy | Help" (same inline-notice pattern).
  - Bottom-left "BUILT FOR A SAFER INDIA" + an abstract tricolor accent bar (not a real emblem). Bottom-right "SIMULATION ENVIRONMENT" / "VERSION 2.0.1".

- `src/styles/login.css` — **new file**, all styles scoped under `.auth-*` class names so nothing here collides with or alters the existing dense operational-console styling used on every other page. Contains the topbar, headline typography, the translucent card (blur + subtle border/shadow, restrained per "no huge shadows/no excessive glassmorphism"), input styling with focus transitions, the primary/secondary buttons (including loading-spinner and success states), the inline notice/toast pattern, and responsive breakpoints (~1180px and ~900px, since the app's stated primary targets are desktop: 1920×1080, 2560×1440, 1440×900, 1280×800). Imported once via `@import './styles/login.css';` in `src/index.css`.

- `src/assets/logos/trinetra-icon.png` — **new asset**, extracted from the user's original full lockup image (`trinetra-mark.png`, which has an "OPERATION TRINETRA" wordmark + tagline baked into a black background) via a black-key alpha technique (`alpha = max(R,G,B)` per pixel) so only the eye/network icon survives as a clean transparent PNG, per the user's explicit instruction to reuse the same logo rather than invent a new one.

- `src/assets/textures/earth-dark.jpg` and `public/data/world-countries-110m.geojson` — new static assets bundled with the app (see above).

- `src/utils/localStorage.ts` — added `loadSessionJSON` / `saveSessionJSON` / `removeSessionKey` (sessionStorage-backed mirrors of the existing localStorage helpers) so "Keep me signed in" can have real, distinct behavior.

- `src/store/sessionStore.ts` — `login()` signature extended to `login(username, password, remember = true)`. When `remember` is true the session persists via `localStorage` (survives closing the browser); when false it uses `sessionStorage` (cleared when the tab closes). Both storages are defensively cleared on every login to avoid stale duplicate sessions if the checkbox state changes between logins.

- `src/hooks/useReducedMotion.ts` — **new hook**, tracks `prefers-reduced-motion` live via `matchMedia(...).addEventListener('change', ...)` (not just a one-time check at mount), so the globe can react if the OS setting changes mid-session.

- `package.json` — added `three-globe: ^2.45.2`. (A `playwright` devDependency was added temporarily for this session's own QA and was removed again before final delivery — it is **not** part of the delivered project.)

## 4. Verification performed this session

- `npm run build` (`tsc -b && vite build`) — clean, no TypeScript errors, no build errors, in the cloud sandbox environment.
- A Playwright-driven pass against `vite preview` covering the user's 15-item checklist:
  1. App runs — yes.
  2. Globe rotates — confirmed via frame-diffing screenshots over time.
  3–4. Routes animate / particles travel along them — confirmed visually and via frame diffing (this is native `three-globe` arc-dash behavior).
  5. Nodes pulse independently (staggered, not simultaneous) — implemented via distinct `ringPeriod` values per node; visually present.
  6. Routes/nodes/particles stay attached to the globe through rotation — yes, they're all children of the same `ThreeGlobe` object inside the rotating `THREE.Group`.
  7–8. Login form works (fill, focus, password show/hide) and demo auth works (`demo`/`demo` succeeds, wrong credentials show an inline error) — confirmed.
  9. Successful login navigates to `/cases` — confirmed (took longer than the ~1.5s designed delay to show up in the sandbox's software-rendered browser, purely because that sandbox renders WebGL in software and is much slower than a real GPU-backed browser; polling for the URL change rather than a fixed wait confirmed it does navigate correctly).
  10. No console errors — confirmed (only benign WebGL driver performance warnings, not errors).
  11. TypeScript builds successfully — confirmed.
  12. Animation stays smooth — reasonable given `requestAnimationFrame`, capped device-pixel-ratio, disposal on unmount, and a modest node/arc count; true 60fps could not be measured precisely in the sandbox's software-rendered browser.
  13–14. Layout correct at 1920×1080 and 1440×900 — confirmed via screenshots, both look premium and match the reference's composition intent.
  15. `prefers-reduced-motion` behavior — **a real bug was found and fixed here.** Initially, reduced motion correctly stopped globe rotation and camera parallax (read fresh every frame) but did *not* fully stop the arc/ring animations (setting their duration/speed to 0 wasn't enough — some residual per-frame change persisted). The fix, described in Section 3 above, removes the arc/ring *data* entirely under reduced motion instead of trying to zero out their animation timing, and was re-verified to produce a fully static canvas region (zero pixel diff over a multi-second window) when reduced motion is active.

## 5. Known environment quirk (not a code bug)

Attempting to run `npm install` / `npm run build` / `npm run dev` for this project **through the remote-device bridge** (i.e., automated shell access to the user's OneDrive-synced `trinetra2` folder from within this Claude session) crashes with a low-level `Bus error` in Vite's native bundler binaries (this project uses Vite 8 / rolldown-vite, which ships native `.node` bindings for rolldown/lightningcss/oxlint). This reproduced consistently for both `vite build` and plain `vite dev`, even though `tsc -b` alone succeeded fine. The same exact source builds and runs perfectly in Claude's own cloud sandbox.

This points to the remote bridge's virtualized/synced mount not being a safe place to execute native Node addons from (a known class of issue with FUSE-like or network-backed mounts and `mmap`/`dlopen`), **not** a problem with the delivered code. Running `npm install` / `npm run dev` directly in a normal terminal on the user's own Windows machine (not through this bridge) should not hit this, since it accesses the same OneDrive folder through the normal Windows filesystem driver rather than through Claude's remote-bridge VM.

**Action needed from the user before running the app:** delete the `node_modules` folder inside `trinetra2` (it was partially/inconsistently installed while diagnosing the above, and further deletion attempts through the bridge itself proved too slow/unreliable to finish — instant to do by hand in File Explorer or a local terminal), then run:

```
npm install
npm run dev
```

## 6. Pending / possible next steps

- Re-verify the login page (and the rest of the app) once the user has done a clean local `npm install` on their own machine, ideally with a screen-recording or their own screenshots, since sandbox verification substitutes for but isn't identical to a real GPU-backed browser.
- No other Phase 2 work is outstanding — every item in the user's spec and 15-point checklist has been addressed as described above.
- If further changes are wanted (e.g., different node/arc geography, adjusting the globe's default rotation so more of India/South Asia is initially visible rather than East/Southeast Asia, tuning colors, etc.), the relevant file is `src/components/auth/TrinetraGlobe.tsx` (see `NODES`, `ARCS`, and `globeGroup.rotation.y` for the starting orientation).
- `dist/assets/index-*.js` is currently ~2.6MB (765KB gzipped) and Vite warns about chunk size; code-splitting was not addressed since it wasn't part of the spec, but could be a future optimization (e.g., lazy-loading the Three.js/three-globe bundle only on the login route).

## 7. File index (Phase 2 changes only)

```
src/components/auth/TrinetraGlobe.tsx      — rewritten (3D globe)
src/components/auth/BackgroundEffects.tsx  — reviewed, unchanged
src/pages/LoginPage.tsx                    — rewritten (login page)
src/styles/login.css                       — new
src/store/sessionStore.ts                  — extended (remember-me)
src/utils/localStorage.ts                  — extended (session-storage helpers)
src/hooks/useReducedMotion.ts              — new
src/assets/logos/trinetra-icon.png         — new (extracted from existing logo)
src/assets/textures/earth-dark.jpg         — new (globe texture)
public/data/world-countries-110m.geojson   — new (country outlines, lazy-fetched)
src/index.css                              — added @import for login.css
package.json                               — added three-globe dependency
```

---

*Generated to hand off this session's work on the TRINETRA login page. Paste this file into a new chat along with the project folder to continue.*
