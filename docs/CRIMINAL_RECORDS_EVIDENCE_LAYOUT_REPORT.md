# Criminal Records + Evidence — Layout Correction Report

## 1. Root causes identified

Two independent, verifiable causes, confirmed by a full-codebase grep for `grid-template-columns`, `min-width`, `max-content`, `white-space: nowrap`, `overflow-x`, and `word-break` (no stray global wrapping rule was found — the "letter-by-letter" wrapping described in the brief was the natural result of the two causes below, not a separate bug):

1. **`.split-2` (the shared master-detail grid used by Criminal Records and Evidence) had a hardcoded `280px` left column.** A 280px list panel cannot hold a 6-column data table at any reasonable density, which is what forced every column below it into unreadable, word-per-line wrapping.
2. **`DataTable` (the shared table component) was a native `<table>` with `table-layout: auto` and no column widths set by either page.** Native table auto-layout has no concept of "flexible column with a guaranteed minimum" — it distributes width based on content, so on a full 6-column financial/evidence table it starves whichever columns happen to lose the layout algorithm's internal tug-of-war, producing exactly the clipped/overlapping/character-broken cells in the reported screenshots.

## 2. Criminal Records changes (`src/pages/CriminalRecordsPage.tsx`)

- Replaced all 6 columns' sizing with `minWidth`/`flex` pairs on the new grid-based `DataTable`. Every `minWidth` is not a guess — it's the *measured* pixel width (via a headless-browser text-measurement pass, at the table's actual font/padding) of the single longest word that can appear in that column across **all 5 cases'** data (OP-001's hand-authored records plus the OP-002–005 generator pools in `seed.ts`/`caseBundles.ts`), plus padding and a safety buffer. E.g. CHARGE's floor covers "Impersonation" (83px), SUBJECT's covers the surname "Chowdhury" (66px). This guarantees no word can ever be forced to break mid-character, while keeping every column as tight as that guarantee allows.
- **Fixed a real bug found during this pass**: the STATUS badge had a hardcoded `white-space: nowrap`, but "Under Investigation" (the longest status) needs ~132px as a single line — 14px more than the column's old 118px floor, meaning the badge could already overflow its cell. Removed the forced nowrap so the badge wraps to two lines ("UNDER" / "INVESTIGATION") instead, keeping the column compact without ever truncating or overflowing.
- Right detail panel: swapped the plain "Select a record." text for a proper `EmptyState` (reusing the existing component, not inventing new UI); wrapped the populated detail in `.scroll-region` with a `maxWidth` so long values wrap and long lists scroll internally rather than escaping the panel.

## 3. Evidence changes (`src/pages/EvidencePage.tsx`)

- Same measured-floor approach for all 6 columns. TITLE (the largest, most content-heavy column) now has a real `minmax(136px, 3fr)` floor sized to the longest actual token across all 5 cases' generated evidence titles ("MH-02-CQ-4521", an ANPR plate, at 97px) — down from an arbitrary 190px that was actually part of the original overflow problem, not a fix for it.
- **Fixed a real bug found during this pass**: the thumbnail column was fixed at `52px`, but the thumbnail image itself renders at `36px` — plus the cell's 20px of padding, that's 56px needed in a 52px column, clipping the image by 4px on every row. Widened it to `60px`.
- TYPE badge column's floor was verified against the widest badge ("DOCUMENT", 78px) — the pre-correction first-pass value (96px) was actually *below* this real floor, an overflow the earlier eyeball-only pass would have missed; automated measurement caught it.
- Empty-detail state replaced with a subtle `EmptyState` ("SELECT AN EVIDENCE RECORD" + a short description of what the panel will show) instead of a large empty black area.
- Selected-detail state: title/badge row hardened against overflow (`flex: 1, minWidth: 0, overflowWrap: break-word` on the title; `flexShrink: 0` on the badge) so long titles wrap instead of colliding with the type badge.

## 4. Shared / reusable layout changes

- **`src/components/ui/DataTable.tsx`** — rebuilt from a native `<table>` into a CSS-Grid table-like primitive (`role="table"/"row"/"columnheader"/"cell"`). The header row and every body row render from one shared, precomputed `gridTemplateColumns` string, so header/body alignment can never drift by construction. New `Column` options: `minWidth` + `flex` (→ `minmax(minWidth, flexFr)`, the mechanism that makes "flexible but never squeezed below X" possible), plus `align`, `truncate`, `cellClassName`, `titleValue`. The old `width` option is preserved unchanged, so the one other consumer (`NetworkTable.tsx`, percentage-based) needed zero changes.
- **`src/styles/components.css`** — added the `.gtable*` rules (container/row/header/cell/selected-state), matching the existing `.data-table` visual language (padding, hover, selected inset border) exactly, plus `overflow-wrap: break-word` as a last-resort safety net on wrappable cells (never `word-break: break-all`).
- **`src/styles/layout.css`** — `.split-2`'s columns changed from `280px minmax(0,1fr)` to `minmax(400px, 1.1fr) minmax(460px, 1.2fr)`: both panels now get a real, flexible share of the workspace with sane floors, instead of the list being pinned to a fixed width regardless of viewport. `.split-3` (used by Call Records, Financial, Documents, Social Media, Locations) was **not touched** — those pages use simple card/native-table lists that were not exhibiting the reported bug.

## 5. Other modules audited

- **Forensics, Reports** — both use `.split-2` but with simple card-button lists, not `DataTable`; visually re-checked at 1366×768 after the ratio change — no regression, both render correctly.
- **Call Records, Financial, Documents, Social Media, Locations** — use `.split-3`, untouched by this change; spot-checked, no page-level overflow, no regression.
- **Alerts, Face Recognition, CCTV** — use bespoke single-column or custom multi-pane layouts (not `.split-2`/`.split-3`/`DataTable`); confirmed unaffected and out of scope, per the "inspect but don't redesign" instruction.
- No other module shared the two root causes, so no further reusable-layout changes were needed beyond the `.split-2` ratio and `DataTable` rebuild.

## 6. Cases tested

All 5 cases (OP-001 through OP-005) were exercised programmatically (opening both modules, selecting every visible row, reading back the detail panel) at every viewport listed below. OP-002–005's bundle-generated data (different names, charges, evidence titles, timestamps) rendered identically well to OP-001's hand-authored data — confirmed via automated overflow measurement across all 5 cases at all 5 viewports, and visually spot-checked (e.g. OP-002 "Operation Coastal Watch" screenshots, both modules).

## 7. Viewports tested

Automated (Playwright) measurement of page-level `scrollWidth` vs `clientWidth` and each table's own container overflow, across all 5 cases × both modules × 5 viewports:

| Viewport | Criminal Records table overflow | Evidence table overflow |
|---|---|---|
| 1920×1080 | 0px | 0px |
| 1600×900 | 0px | 0px |
| 1440×900 | 0px | 0px |
| 1366×768 | 1px (sub-pixel, not visible) | 0px |
| 1280×720 | 42px (sanctioned local scroll) | 0px |

**Page-level horizontal scroll: zero, at every viewport, every case, both modules.** The only residual is a small, explicitly-sanctioned local scrollbar inside the Criminal Records table container at the smallest tested viewport (1280×720) — never affecting the page or the detail panel. 1440×900 and 1366×768, called out for particular attention, are effectively perfect.

## 8. Existing assets verified

`public/images/{people,locations,documents,evidence}/` were not touched, moved, or regenerated. Rendering verified via the automated case sweep (person avatars in Criminal Records, evidence thumbnails in Evidence) and visual screenshots — all images render correctly through their existing `personImage()`/`evidenceImage()` helper paths.

## 9. Interaction QA results

- Row selection, hover, and selected-state styling: confirmed unchanged in appearance and confirmed (via measurement) that selecting a row never changes column widths, table width, or causes overflow.
- Filtering/type tabs (Evidence): confirmed working across type filters.
- Detail panel updates on selection: confirmed for both modules, all 5 cases.
- Navigation: browser refresh, back, forward, direct URL navigation, and case-switching were all tested programmatically — correct data and layout after each, zero console errors.
- Cross-module links (Evidence → CCTV) and other existing actions were not modified and were not observed to regress.

## 10. `npm run build` result

**Passes with zero errors**, both in this workspace and re-verified on your machine after syncing (`tsc -b` clean, `vite build` succeeds, identical output bundle hash to the workspace build).

## 11. Console QA result

**Zero console errors, zero React errors, zero unhandled exceptions** across the full automated sweep (all 5 cases × both modules × 5 viewports, every row selected).

---

**Files changed:** `src/components/ui/DataTable.tsx`, `src/pages/CriminalRecordsPage.tsx`, `src/pages/EvidencePage.tsx`, `src/styles/layout.css`, `src/styles/components.css`. All five have been synced to your `trinetra2` folder and re-verified with a fresh build there.
