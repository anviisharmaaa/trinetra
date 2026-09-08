# TRINETRA — CCTV Module Video Upgrade — Implementation Report

## 1. Files changed (existing files modified)

- `src/components/cctv/CCTVViewer.tsx` — rebuilt around the video player + 3-tier fallback chain; preserves the "NO CAMERA SELECTED" and "CAMERA OFFLINE" states unchanged.
- `src/components/cctv/DetectionOverlay.tsx` — dropped the hardcoded-position fake bounding box (CCTVEvent has no real coordinate data); now shows only entity-name/confidence badges, positioned to sit above the new HUD strip instead of duplicating it.
- `src/components/cctv/CameraList.tsx` — camera cards now resolve and show the location name (via `getEntityById`) instead of only raw coverage text.
- `src/store/cctvStore.ts` — dropped the unused `activeCameraId`/`isPlaying`/`playbackTimestamp`/`dateRange*` fields (nothing consumed them beyond the one bug being fixed); store now only loads/holds `cameras`/`events` for the case. Selection moved to the URL (see #7).
- `src/pages/CCTVPage.tsx` — selection state (`camera`, `event`) is now driven by URL search params instead of ephemeral React state; renders the new `CCTVEventDetails` strip.
- `src/components/locations/LocationDetailPanel.tsx` — the "camera → CCTV" click now navigates with `?camera=<id>` instead of relying solely on a store field the CCTV page never read.
- `src/components/face/FaceViewer.tsx` — plays that detection's camera video (seeking to a deterministic offset) instead of a static frame; keeps the real `FaceBoundingBox` (real `boundingBox` data, unchanged) and the JPG/"unavailable" fallback for when no video exists.
- `src/pages/EvidencePage.tsx` — reads `?item=` to auto-select a record (deep-link target from CCTV); adds a "VIEW IN CCTV" button on `cctv`/`face` records that parses `sourceRef`.
- `src/pages/TimelinePage.tsx` — reads `?event=` to select and scroll to a specific timeline entry (deep-link target from CCTV).

No other files were touched. Nothing under `public/images/**` was modified, regenerated, renamed, or deleted.

## 2. Files created (new)

- `src/config/cctvVideoAssets.ts` — the single place that builds `/videos/...` paths and resolves event/detection → (camera, offset). See #4/#5.
- `src/components/cctv/CCTVVideoPlayer.tsx` — the real `<video>` element + play/pause/seek/mute/volume/speed/fullscreen state machine, reused by both the CCTV viewer and the Face viewer.
- `src/components/cctv/CCTVControls.tsx` — the transport control bar (scrubber, time, volume, speed, fullscreen).
- `src/components/cctv/CCTVOverlay.tsx` — the HUD burned over the video: camera id + location (top-left), "RECORDED" indicator (top-right), timestamp/event-type strip.
- `src/components/cctv/CCTVUnavailable.tsx` — the tier-3 "VIDEO SOURCE UNAVAILABLE" panel (camera id/location/selected event/timestamp/event type), used when neither an MP4 nor a JPG resolves.
- `src/components/cctv/CCTVEventDetails.tsx` — the event-detail strip (full event data + "View in Timeline" / "View in Evidence" buttons).
- `src/utils/crossModuleLinks.ts` — two small helpers: matching a CCTV event to its Timeline entry by exact timestamp, and parsing `Evidence.sourceRef` ("CAM-XXX / CE-XXX" or "CAM-XXX / FD-XXX").
- `public/videos/cctv/README.md` — the (currently empty) drop-in location for the 29 MP4s, with the exact required filenames listed.

## 3. Video asset directory

`public/videos/cctv/` — created, currently empty except for the README. Nothing else in `public/images/**` was touched; those directories are untouched and still resolve through the same `imageAssets.ts` helpers as before.

## 4. Camera → video mapping (all 29 rendered cameras)

One rule, no per-camera table to maintain: `cctvVideoSource(cameraId) = /videos/cctv/${cameraId.toLowerCase()}.mp4`. Verified against the actual data (via the app's own `cctvService` filtering logic — cameras referenced by at least one CCTV event or face detection) that this is exactly 29 cameras, and the 3 that are never referenced (`CAM-MW05`, `CAM-002-05`, `CAM-005-05`) are correctly excluded everywhere already:

```
cam-002-01.mp4  cam-002-02.mp4  cam-002-03.mp4  cam-002-04.mp4  cam-002-06.mp4
cam-003-01.mp4  cam-003-02.mp4  cam-003-03.mp4  cam-003-04.mp4  cam-003-05.mp4
cam-003-06.mp4  cam-003-07.mp4  cam-004-01.mp4  cam-004-02.mp4  cam-004-03.mp4
cam-005-01.mp4  cam-005-02.mp4  cam-005-03.mp4  cam-005-04.mp4  cam-005-06.mp4
cam-aw09.mp4    cam-bw02.mp4    cam-bw12.mp4    cam-ch03.mp4    cam-dr02.mp4
cam-kr06.mp4    cam-lw07.mp4    cam-oe11.mp4    cam-pw08.mp4
```

Per case: OP-001 → 9 cameras, OP-002 → 5, OP-003 → 7, OP-004 → 3, OP-005 → 5 (29 total, no overlap between cases).

## 5. Event / face-detection → offset approach

`cctvEventVideo(eventId)` / `cctvDetectionVideo(detectionId)` (in `cctvVideoAssets.ts`) resolve the event/detection to `{ cameraId, source, offsetSeconds, timestamp }`. `offsetSeconds` comes from a deterministic hash of the event/detection's own id, mapped into an assumed `180`-second clip with an 8-second margin at each end — same input always produces the same offset, so a refresh or a direct deep link always seeks to the same point without persisting anything. The investigation wall-clock timestamp shown in the UI (`CCTVOverlay`, `CCTVEventDetails`) is always the real event timestamp, completely separate from this synthetic playback offset.

## 6. Fallback strategy (verified end-to-end with zero video/image assets on disk)

1. **MP4** — `<video src={cctvVideoSource(camera.id)}>` is attempted first.
2. **JPG** — on the video's `onError`, the camera switches to the existing `cctvFrameImage()` still frame via the same `EntityImage` component every other module already uses (silent 404 handling, no broken-image icon).
3. **Unavailable panel** — if the JPG also 404s, `EntityImage`'s `fallback` renders `CCTVUnavailable` (CCTV) / an equivalent inline panel (Face), showing camera id, location/frame, selected event, and timestamp — never a broken `<video>` or blank box.

Confirmed live in the QA pass below: with no files in `public/videos/` or `public/images/cctv/`, every camera in every case correctly falls through all three tiers to the polished "VIDEO SOURCE UNAVAILABLE" panel. Dropping a real MP4 in later requires no code change — the same camera id resolves it automatically.

## 7. Cross-module integration changes

- **Deep-linkable selection**: `CCTVPage` now treats `?camera=` / `?event=` as the source of truth (validated against the current case's cameras/events, so a stale or foreign id is ignored rather than leaking case data). Refresh, browser back/forward, and a direct `/cases/:caseId/cctv?camera=...&event=...` URL all now work correctly — verified for all 5 cases.
- **Locations → CCTV (fixed)**: clicking a camera in a location's CCTV tab previously called `investigationStore.selectCamera()`, which `CCTVPage` never read — the CCTV page always opened on the first camera regardless. It now also navigates with `?camera=<id>` directly, and `CCTVPage` additionally still honors the store value as a one-shot hint on arrival for any other caller. Verified working for OP-001, OP-002, OP-004, OP-005 (OP-003's default-selected location had no camera nearby in the QA run, same code path).
- **CCTV → Timeline ("View in Timeline")**: added to `CCTVEventDetails`. Matches the selected CCTV event to its Timeline entry by exact case+timestamp (CCTV-sourced timeline entries already share the exact ISO timestamp of the CCTV event they summarize — no new data invented), then deep-links to `/cases/:caseId/timeline?event=TL-XXX`, which now selects and scrolls to that entry.
- **CCTV ↔ Evidence**: `CCTVEvent.evidenceRef` (already existed on 2 real OP-001 events, `CE-004`→`EV-002`, `CE-006`→`EV-003`) now surfaces as a "View in Evidence" button → `/cases/:caseId/evidence?item=EV-XXX`, which auto-selects that record. In the other direction, `Evidence.sourceRef` (format `"CAM-XXX / CE-XXX"` or `"CAM-XXX / FD-XXX"`) is parsed to show "View in CCTV" on every `cctv`/`face` evidence record, deep-linking back to the right camera (and event, when the ref is a CCTV event id).

## 8. Case-scoping verification

Automated (Playwright) pass across all 5 cases (`case-op001`…`case-op005`) confirmed: each case's CCTV page only ever shows that case's own cameras/events (no cross-case leakage), URL camera/event params from a different case are never honored for the wrong case, and video/JPG/unavailable resolution is always keyed off the currently-loaded case's camera/event data. No shared mutable state leaked between cases in the store (case id is now tracked in `cctvStore` alongside its cameras/events).

## 9. Asset QA (people / locations / documents)

`public/images/{people,locations,documents,evidence,vehicles,cases,cctv}` are all present as directories and were not modified. In this sandbox they currently contain no files (0 each) — a pre-existing state of this environment, unrelated to this change — so every image in the app is already exercising the same `EntityImage` fallback path (initials avatar / category icon / "NO IMAGE ON FILE") that this upgrade also relies on for CCTV. Confirmed via code inspection and the QA pass that no image helper (`personImage`, `locationImage`, `documentImage`, `evidenceImage`, `vehicleImage`, `cctvFrameImage`) was touched, and every call site that used them before still calls them the same way.

## 10. CCTV module QA results

Ran a scripted Playwright sweep (bypassing login via the app's own session storage keys) across all 5 cases, covering: camera list rendering and selection, event timeline rendering and selection, event-detail strip content, fallback-panel rendering with zero media on disk, URL sync on camera/event selection, refresh-preserves-selection, Locations→CCTV camera deep-link, Evidence↔CCTV deep-links in both directions, and a Face Recognition page smoke test. **Zero unexpected console errors or page errors across all 5 cases** (only the expected 404s for the not-yet-present video/image files, which are filtered out as expected fallback-chain behavior, not bugs). "View in Timeline" only appears when a matching Timeline entry actually exists — true for OP-001's hand-authored data, and correctly absent (not a dead link) for the generated OP-002…005 bundles, whose synthetic timeline entries don't happen to share exact timestamps with their CCTV events in the underlying mock data.

## 11. `npm run build` result

Clean in both environments:
- Cloud sandbox: `tsc -b && vite build` — **0 errors**, build succeeds.
- Your machine (synced copy): `tsc -b` — **0 errors**; `vite build` — succeeds, producing byte-identical output (same chunk hashes/sizes) to the cloud build. (Run separately on-device only because the combined command exceeded this session's single-command time limit on your machine — not a build failure; a plain `npm run build` in your own terminal will complete fine, just gave a few minutes.)

## 12. Visual quality self-audit

- Video is the clear focal point; no HUD clutter — top-left camera/location, top-right "RECORDED" (never implies live), a slim timestamp/event strip, entity badges, and the transport bar are the only overlays, each in its own zone with no overlap.
- Controls are standard and unsurprising: play/pause, scrubber with time, volume + mute, speed, fullscreen — no invented iconography.
- Camera list and event timeline keep their original look; camera cards now also show the location name.
- Selection state is unambiguous: active camera and active event are both highlighted exactly as before (cyan glow/border), and the URL always reflects the current selection.
- No fabricated computer-vision precision: the old fixed-position "detection box" for plain CCTV events (which had no real coordinates) was removed; only `FaceDetection`'s real bounding box is ever drawn as a box.
- The "VIDEO SOURCE UNAVAILABLE" panel reuses the same dark/redacted-archive visual language as the rest of the module rather than looking like an error page.
- Same color tokens, radii, and typography scale as the rest of TRINETRA throughout (no new colors or effects introduced).

## 13. Remaining work — only the actual media files

Everything above is code-complete and works today with zero video files. The only remaining step is dropping the 29 real MP4 recordings into `public/videos/cctv/` using the exact filenames listed in #4 (also written to `public/videos/cctv/README.md`). No code changes are needed when that happens — each camera will pick up its file automatically the next time it's opened. If real footage isn't available, placeholder/stock clips matching the 29 filenames would let the video player, controls, and offset-seeking be exercised end-to-end instead of always falling through to the fallback panel.
