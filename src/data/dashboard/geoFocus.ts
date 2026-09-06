import type { Case } from '../../types';
import { GLOBE_NODES } from './network';

/** Fictional state assignment per case, used to drive the "Geographic
 *  Focus" panel. Kept as a lookup (rather than baked-in counts) so a case
 *  created through "+ New Case" is reflected automatically — it just
 *  falls into the "Others" bucket until assigned. */
const CASE_STATE: Record<string, string> = {
  'case-op001': 'Maharashtra',
  'case-op002': 'Maharashtra',
  'case-op003': 'Gujarat',
  'case-op004': 'Delhi',
};

const FEATURED_STATES = ['Maharashtra', 'Gujarat', 'Delhi', 'Karnataka'];

export interface GeoFocusRow {
  state: string;
  count: number;
}

export function computeGeoFocus(cases: Case[]): GeoFocusRow[] {
  const counts = new Map<string, number>();
  for (const c of cases) {
    const state = CASE_STATE[c.id] ?? 'Others';
    counts.set(state, (counts.get(state) ?? 0) + 1);
  }
  const rows = FEATURED_STATES.map((state) => ({ state, count: counts.get(state) ?? 0 }));
  const featuredTotal = rows.reduce((sum, r) => sum + r.count, 0);
  rows.push({ state: 'Others', count: Math.max(0, cases.length - featuredTotal) });
  return rows;
}

function nodeLatLng(id: string) {
  const n = GLOBE_NODES.find((g) => g.id === id)!;
  return { lat: n.lat, lng: n.lng };
}

/** Real (lat, lng) anchors for the featured states — reuses the same city
 *  coordinates as the hero globe (Mumbai, Ahmedabad, Delhi, Bengaluru) so
 *  the geography stays internally consistent across the dashboard. Fed
 *  through `projectIndia()` to place a dot on the silhouette panel. */
export const STATE_ANCHORS: Record<string, { lat: number; lng: number }> = {
  Maharashtra: nodeLatLng('mumbai'),
  Gujarat: nodeLatLng('ahmedabad'),
  Delhi: nodeLatLng('delhi'),
  Karnataka: nodeLatLng('bengaluru'),
};
