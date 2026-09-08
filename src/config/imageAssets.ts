// ---------------------------------------------------------------------------
// TRINETRA — Centralized image asset mapping.
//
// This is the ONLY place in the app that builds a path into public/images/.
// No component should hand-roll a `/images/...` string or point at an
// external URL — everything goes through the helpers below, so replacing a
// placeholder with a real photo later never means hunting through
// components.
//
// Every path this file returns is a *candidate*. None of it is guaranteed to
// exist on disk. Every consumer MUST render through <EntityImage> (see
// src/components/ui/EntityImage.tsx), which quietly falls back to a
// generated placeholder (initials avatar, category icon, etc.) when the
// file 404s. Nothing here ever fetches a remote URL.
// ---------------------------------------------------------------------------

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Case cover image — shown (optionally) behind the Cases Dashboard card / case banner. */
export function caseCoverImage(caseId: string): string {
  const CASE_SLUGS: Record<string, string> = {
    'case-op001': 'operation-trinetra-01',
    'case-op002': 'operation-coastal-watch',
    'case-op003': 'operation-northern-circuit',
    'case-op004': 'operation-silent-ledger',
    'case-op005': 'operation-desert-route',
  };
  const slug = CASE_SLUGS[caseId] ?? slugify(caseId);
  return `/images/cases/${slug}.jpg`;
}

/** Person portrait — dossier header, network graph node preview, face match cards. */
export function personImage(personId: string, name: string): string {
  return `/images/people/${slugify(name)}-${personId.toLowerCase()}.jpg`;
}

/** Location thumbnail — Locations page right-rail callout, network node preview. */
export function locationImage(locationId: string, name: string): string {
  return `/images/locations/${slugify(name)}-${locationId.toLowerCase()}.jpg`;
}

/** Vehicle photo — vehicle entity detail views. */
export function vehicleImage(vehicleId: string, registrationNumber: string): string {
  return `/images/vehicles/${slugify(registrationNumber)}-${vehicleId.toLowerCase()}.jpg`;
}

/** Document first-page preview — Documents library thumbnails. */
export function documentImage(documentId: string, fileName: string): string {
  return `/images/documents/${slugify(fileName.replace(/\.[a-z0-9]+$/i, ''))}-${documentId.toLowerCase()}.jpg`;
}

/** Evidence item photo — Evidence repository thumbnails. */
export function evidenceImage(evidenceId: string): string {
  return `/images/evidence/${evidenceId.toLowerCase()}.jpg`;
}

/** CCTV / face-recognition captured frame — camera viewer, detection match card. */
export function cctvFrameImage(frameId: string): string {
  return `/images/cctv/${frameId.toLowerCase()}.jpg`;
}
