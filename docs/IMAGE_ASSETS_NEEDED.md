# IMAGE ASSETS I NEED TO ADD

This audit was produced by reading every page and component in the app (not assumed from a fixed list), then cross-checking against `src/config/imageAssets.ts` — the single centralized module that builds every `/images/...` path used anywhere in TRINETRA. No component ever hard-codes an image path or points at an external URL; every image request goes through one of that file's helper functions, and every consumer renders through `<EntityImage>` / `<PersonAvatar>` / `<LocationThumb>` / `<EvidenceThumb>` / `<FramePlaceholder>` (`src/components/ui/EntityImage.tsx`), which fall back to a generated initials avatar, a category icon, or a labeled placeholder block whenever a file 404s. **No file listed below is required for the app to work** — everything already degrades gracefully, never with a broken image icon or a stretched placeholder. This document exists so real photography/artwork can be dropped in later to replace the placeholders.

Counts below were generated programmatically by walking the actual mock data for all five cases (OP‑001, OP‑002, OP‑003, OP‑004, OP‑005) through the real `imageAssets.ts` helpers, so they are exact, not estimated.

## Summary

| Folder | Files needed | Status |
|---|---|---|
| `public/images/people/` | 54 | Needed — wired across 8 modules |
| `public/images/locations/` | 39 | Needed — wired across 2 modules |
| `public/images/documents/` | 17 | Needed — wired in Documents |
| `public/images/evidence/` | 32 | Needed — wired in Evidence |
| `public/images/cctv/` | 106 | Needed — wired across 3 modules |
| `public/images/vehicles/` | 20 | **Not currently needed** — helper exists, nothing renders it yet |
| `public/images/cases/` | 5 | **Not currently needed** — helper exists, nothing renders it yet |

## Assets to add

| Filename | Folder | Used Where | What Image Should Show | Recommended Size |
|---|---|---|---|---|
| `{name-slug}-{person-id}.jpg` — 54 files, exact names in Appendix A | `public/images/people/` | Person Dossier header; Network Graph node preview + entity detail panel; Face Recognition match cards; Criminal Records table row + record detail header; Financial account list; Social Media profile list + profile overview; Case Overview "Key People" list | Front‑facing passport‑style portrait/headshot of the individual, neutral background. These are fictional case subjects, so AI‑generated or stock likenesses are fine — just keep one consistent photo per person across all modules (same file, many call‑sites). | 200×200px (square; rendered as a circle almost everywhere) |
| `{location-slug}-{location-id}.jpg` — 39 files, exact names in Appendix B | `public/images/locations/` | Locations page right‑panel detail callout (large image); Network Graph location entity detail panel | An establishing photo of the place itself — building exterior, port/dock, market street, warehouse, checkpost — matching its category (residential/commercial/port/transit/etc.). Not a map screenshot; the map is handled separately by the dark investigation map. | 640×360px (16:9) |
| `{doc-slug}-{document-id}.jpg` — 17 files, exact names in Appendix C | `public/images/documents/` | Documents library list thumbnail (24×32 icon‑sized) | A first‑page scan/photo preview of the document type — ID card, bank statement, KYC form, lease/sale deed, manifest, ledger page. Can be a generic redacted‑document mockup per document type rather than a unique scan per file. | 240×320px (portrait, ~A4 ratio) |
| `{evidence-id}.jpg` — 32 files, exact names in Appendix D | `public/images/evidence/` | Evidence repository table thumbnail column; evidence detail panel header image | A representative photo of the physical or digital evidence item matching its `type`/tags — a seized phone or laptop, a printed ledger page, a photograph print, an audio/video still. | 240×240px (square) |
| `{camera-or-event-or-frame-id}.jpg` — 106 files, exact names in Appendix E | `public/images/cctv/` | CCTV camera viewer frame (behind the scanline/detection‑box overlay); Face Recognition detection viewer frame (behind the face bounding‑box overlay); Locations page CCTV tab compact thumbnails | A grainy, low‑light CCTV‑style still — a street, lobby, or checkpost scene with a person or vehicle roughly centered, so the existing bounding‑box/scanline overlay lines up believably on top of it. | 480×270px (16:9) |

## Explicitly not needed right now

| Folder | Files | Why it's on hold |
|---|---|---|
| `public/images/vehicles/` | 20 (pattern: `{registration-slug}-{vehicle-id}.jpg`) | `vehicleImage()` is defined in `imageAssets.ts` but is not called by any component — there is no dedicated vehicle detail view in the app today. Adding these files now would be decorative with nothing to display them; revisit only if a Vehicle detail page is built. |
| `public/images/cases/` | 5 (pattern: `operation-{case-slug}.jpg`) | `caseCoverImage()` is defined but unused — `CaseCard` deliberately uses icon‑based case tiles on the Cases dashboard, not photo covers. Revisit only if the Cases dashboard is redesigned to show cover art. |

## Modules audited with no image need at all

These were read in full and judged to have no genuine single-subject slot for an image — adding one would be decoration, not information, so per the "don't create unnecessary assets" instruction none were wired:

- **Call Records** — a dense per‑call log table (caller/callee/duration/tower); no natural single‑subject portrait slot, and the subjects already have photos elsewhere (dossier, criminal records, etc.).
- **Alerts** — linked entities render as small inline text badges that can be a person, vehicle, or location in the same row; it's a notification feed, and turning mixed‑type badges into avatars would clutter rather than clarify.
- **Forensics** — same inline‑badge pattern as Alerts for linked entities; the module's actual content is chain‑of‑custody text records and tags, not a photo browser.
- **Reports** — a formal, printable document (`window.print()` export). Its Entity Register table lists every entity type at once (person, vehicle, org, location); adding photos for persons only would be visually inconsistent in a print‑oriented register, so it stays text‑only by design.
- **Timeline** — already uses distinct Lucide icons per event type (call, message, movement, transaction, CCTV, social, document, meeting, alert, case) for visual differentiation; linked entities appear only as small text badges, with no single‑subject focus per row.

## Modules where images are already wired

Overview (Case Dashboard "Key People"), Network Graph (people + locations), Locations (locations), Social Media (people), Criminal Records (people), Financial (people, via account owner), CCTV (frames), Face Recognition (frames + `MatchCard` avatars), Documents (document previews), Evidence (evidence photos). All ten read through `EntityImage.tsx`'s graceful‑fallback components, so any of the files above can be dropped into `public/images/<folder>/` at any time — filled slots swap the placeholder out with zero code changes, and unfilled slots keep showing their initials/icon fallback exactly as they do today.

---

## Appendix A — People (`public/images/people/`, 54 files)

```
ajay-chowdhury-p-003-010.jpg
amit-kapoor-p-004-003.jpg
anil-chauhan-p-005-002.jpg
anjali-singh-rathore-p-002-007.jpg
arjun-chowdhury-p-005-003.jpg
arjun-malhotra-p-0042.jpg
aslam-chauhan-p-003-012.jpg
aslam-thakur-p-003-006.jpg
ayesha-mehta-p-003-020.jpg
deepak-chauhan-p-0048.jpg
deepak-desai-p-003-007.jpg
deepak-verma-p-004-005.jpg
divya-joshi-p-003-021.jpg
gaurav-desai-p-003-003.jpg
gaurav-khan-p-003-016.jpg
gaurav-singh-rathore-p-003-013.jpg
harpreet-khan-p-002-008.jpg
harpreet-pillai-p-005-006.jpg
irfan-mehta-p-003-018.jpg
kavita-mehta-p-003-023.jpg
kiran-menon-p-004-004.jpg
manish-bhatt-p-002-002.jpg
manish-sharma-p-003-008.jpg
meera-bose-p-002-003.jpg
nargis-iyer-p-005-007.jpg
naveen-joshi-p-003-015.jpg
naveen-khan-p-002-005.jpg
neha-rana-p-003-019.jpg
pooja-naidu-p-003-005.jpg
priyanka-bhatt-p-005-010.jpg
priyanka-nair-p-0044.jpg
priyanka-sharma-p-003-014.jpg
rajat-mehta-p-004-002.jpg
rajat-verma-p-0043.jpg
rakesh-ali-p-004-006.jpg
ravi-ali-p-003-017.jpg
ravi-thakur-p-003-009.jpg
rohit-iyer-p-002-006.jpg
rohit-menon-p-005-001.jpg
salman-pillai-p-005-005.jpg
sana-ali-p-0047.jpg
sanjay-chauhan-p-005-004.jpg
sanjay-desai-p-002-004.jpg
sanjay-desai-p-003-011.jpg
sanjay-kapoor-p-003-002.jpg
sunita-sheikh-p-004-001.jpg
suresh-iyer-p-005-009.jpg
swati-thakur-p-002-001.jpg
swati-verma-p-003-001.jpg
tarun-chauhan-p-003-004.jpg
unidentified-male-unknown-07-p-0045.jpg
vikram-singh-rathore-p-0046.jpg
zaid-reddy-p-003-022.jpg
zara-verma-p-005-008.jpg
```

## Appendix B — Locations (`public/images/locations/`, 39 files)

```
ahmedabad-loc-city-05.jpg
ahmedabad-naroda-gidc-loc-005-05.jpg
andheri-east-loc-002.jpg
bandra-west-loc-001.jpg
barmer-border-checkpost-loc-005-02.jpg
bhuj-industrial-area-loc-005-04.jpg
chandigarh-sector-17-loc-003-04.jpg
chembur-loc-006.jpg
colaba-loc-004.jpg
connaught-place-loc-003-01.jpg
delhi-loc-city-06.jpg
devgad-market-road-loc-002-04.jpg
dockyard-road-loc-008.jpg
faridabad-industrial-estate-loc-003-06.jpg
guhagar-residency-loc-002-05.jpg
gurugram-cyber-hub-loc-003-02.jpg
hinjewadi-it-park-loc-004-01.jpg
jaipur-vaishali-nagar-loc-003-05.jpg
jaisalmer-transit-camp-loc-005-06.jpg
jodhpur-transport-nagar-loc-005-01.jpg
kandla-port-loc-005-03.jpg
kurla-loc-009.jpg
lower-parel-loc-003.jpg
malad-west-loc-005.jpg
malvan-jetty-loc-002-02.jpg
nagpur-civil-lines-loc-004-02.jpg
nagpur-loc-city-07.jpg
nashik-loc-city-02.jpg
noida-sector-62-loc-003-03.jpg
powai-loc-007.jpg
pune-camp-loc-004-03.jpg
pune-loc-city-01.jpg
ratnagiri-fishing-harbour-loc-002-01.jpg
sawantwadi-transit-yard-loc-002-06.jpg
sonipat-warehouse-cluster-loc-003-07.jpg
surat-loc-city-04.jpg
thane-loc-city-03.jpg
vashi-loc-010.jpg
vengurla-creek-loc-002-03.jpg
```

## Appendix C — Documents (`public/images/documents/`, 17 files)

```
aadhaar-arjunmalhotra-doc-01.jpg
benamideclaration-apexholdings-doc-003-02.jpg
boatregistration-sagarkanya2-doc-002-01.jpg
chargesheet-silentledger-doc-004-03.jpg
customsmanifest-kandlaport-doc-005-03.jpg
exportlicence-konkanbluemarine-doc-002-02.jpg
forgedkyc-muleaccount07-doc-004-01.jpg
freightcontract-meridiankonnect-doc-03.jpg
fuelledger-q3-doc-002-03.jpg
hawalaledger-seized-doc-005-02.jpg
hdfc-statementq2-arjunmalhotra-doc-02.jpg
leaseagreement-chemburwarehouse-doc-04.jpg
loanagreement-northstarrealty-doc-003-03.jpg
muleaccountopeningform-doc-004-02.jpg
saledeed-sonipatplot14-doc-003-01.jpg
shellcompanyfilings-mca-doc-003-04.jpg
transportpermit-tharlogistics-doc-005-01.jpg
```

## Appendix D — Evidence (`public/images/evidence/`, 32 files)

```
ev-001.jpg
ev-002.jpg
ev-003.jpg
ev-004.jpg
ev-005.jpg
ev-006.jpg
ev-007.jpg
ev-008.jpg
evd-002-01.jpg
evd-002-02.jpg
evd-002-03.jpg
evd-002-04.jpg
evd-002-05.jpg
evd-002-06.jpg
evd-003-01.jpg
evd-003-02.jpg
evd-003-03.jpg
evd-003-04.jpg
evd-003-05.jpg
evd-003-06.jpg
evd-004-01.jpg
evd-004-02.jpg
evd-004-03.jpg
evd-004-04.jpg
evd-004-05.jpg
evd-004-06.jpg
evd-005-01.jpg
evd-005-02.jpg
evd-005-03.jpg
evd-005-04.jpg
evd-005-05.jpg
evd-005-06.jpg
```

## Appendix E — CCTV / Face frames (`public/images/cctv/`, 106 files)

```
cam-002-01.jpg
cam-002-02.jpg
cam-002-03.jpg
cam-002-04.jpg
cam-002-06.jpg
cam-003-01.jpg
cam-003-02.jpg
cam-003-03.jpg
cam-003-04.jpg
cam-003-05.jpg
cam-003-06.jpg
cam-003-07.jpg
cam-004-01.jpg
cam-004-02.jpg
cam-004-03.jpg
cam-005-01.jpg
cam-005-02.jpg
cam-005-03.jpg
cam-005-04.jpg
cam-005-06.jpg
cam-aw09.jpg
cam-bw02.jpg
cam-bw12.jpg
cam-ch03.jpg
cam-dr02.jpg
cam-kr06.jpg
cam-lw07.jpg
cam-oe11.jpg
cam-pw08.jpg
ce-001.jpg
ce-002-01.jpg
ce-002-02.jpg
ce-002-03.jpg
ce-002-04.jpg
ce-002-05.jpg
ce-002-06.jpg
ce-002-07.jpg
ce-002.jpg
ce-003-01.jpg
ce-003-02.jpg
ce-003-03.jpg
ce-003-04.jpg
ce-003-05.jpg
ce-003-06.jpg
ce-003-07.jpg
ce-003-08.jpg
ce-003-09.jpg
ce-003-10.jpg
ce-003-11.jpg
ce-003-12.jpg
ce-003-13.jpg
ce-003-14.jpg
ce-003-15.jpg
ce-003-16.jpg
ce-003-17.jpg
ce-003-18.jpg
ce-003-19.jpg
ce-003-20.jpg
ce-003-21.jpg
ce-003.jpg
ce-004-01.jpg
ce-004-02.jpg
ce-004-03.jpg
ce-004-04.jpg
ce-004-05.jpg
ce-004-06.jpg
ce-004.jpg
ce-005-01.jpg
ce-005-02.jpg
ce-005-03.jpg
ce-005-04.jpg
ce-005-05.jpg
ce-005-06.jpg
ce-005-07.jpg
ce-005-08.jpg
ce-005-09.jpg
ce-005.jpg
ce-006.jpg
ce-007.jpg
ce-008.jpg
ce-009.jpg
ce-010.jpg
ce-011.jpg
ce-012.jpg
f-11209.jpg
f-15450.jpg
f-16456.jpg
f-21336.jpg
f-30014.jpg
f-36326.jpg
f-39725.jpg
f-40021.jpg
f-40987.jpg
f-47616.jpg
f-52350.jpg
f-58476.jpg
f-62401.jpg
f-64784.jpg
f-65510.jpg
f-77021.jpg
f-79211.jpg
f-83995.jpg
f-84903.jpg
f-88231.jpg
f-88245.jpg
f-97850.jpg
```
