import type { LocationEntity, TimelineEvent } from '../../types';

/**
 * Everything the Locations page needs to know about a location beyond the
 * raw entity — computed from the case's own timeline so it stays honest to
 * the mock dataset instead of inventing a `riskLevel` field that doesn't
 * exist on generated locations. Recomputed per-case, never cached globally.
 */
export interface LocationStats {
  events: TimelineEvent[];
  eventCount: number;
  firstSeen: string | null;
  lastActivity: string | null;
  computedRisk: 'critical' | 'high' | 'medium' | 'low' | 'unknown';
}

const CATEGORY_RISK_WEIGHT: Record<string, number> = {
  port_area: 2,
  border_checkpoint: 2,
  transit_hub: 1,
  industrial: 1,
  warehouse: 1,
  airport: 1,
  commercial: 0,
  residential: 0,
  city: 0,
};

export function computeLocationStats(location: LocationEntity, allCaseEvents: TimelineEvent[]): LocationStats {
  const events = allCaseEvents.filter((e) => e.locationId === location.id);
  const eventCount = events.length;
  const firstSeen = events.length ? events[0].timestamp : null; // already asc-sorted by timelineService
  const lastActivity = events.length ? events[events.length - 1].timestamp : null;

  let score = CATEGORY_RISK_WEIGHT[location.metadata.category ?? ''] ?? 0;
  if (eventCount >= 8) score += 2;
  else if (eventCount >= 4) score += 1;
  if (events.some((e) => e.importance === 'high')) score += 1;
  if (location.riskLevel === 'critical') score += 3;
  else if (location.riskLevel === 'high') score += 2;

  let computedRisk: LocationStats['computedRisk'];
  if (eventCount === 0 && score === 0) computedRisk = 'unknown';
  else if (score >= 4) computedRisk = 'critical';
  else if (score >= 3) computedRisk = 'high';
  else if (score >= 1) computedRisk = 'medium';
  else computedRisk = 'low';

  return { events, eventCount, firstSeen, lastActivity, computedRisk };
}

export const CATEGORY_META: Record<string, string> = {
  residential: 'Residential',
  commercial: 'Commercial',
  industrial: 'Industrial',
  port_area: 'Port / Harbor',
  airport: 'Airport',
  transit_hub: 'Transit Hub',
  warehouse: 'Warehouse',
  border_checkpoint: 'Border Checkpoint',
  city: 'City / Regional Marker',
};

export function categoryLabel(category?: string): string {
  if (!category) return 'Other';
  return CATEGORY_META[category] ?? 'Other';
}

export interface FacetOption {
  key: string;
  label: string;
  count: number;
}

/** Location Types facet — only categories actually present in this case's data, so there are no dead checkboxes. */
export function deriveLocationTypes(locations: LocationEntity[]): FacetOption[] {
  const counts = new Map<string, number>();
  for (const l of locations) {
    const key = l.metadata.category && CATEGORY_META[l.metadata.category] ? l.metadata.category : 'other';
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([key, count]) => ({ key, label: key === 'other' ? 'Other' : CATEGORY_META[key], count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

/** Regions facet — grouped by the location's own city field; long tail beyond the top N collapses into "Other". */
export function deriveRegions(locations: LocationEntity[], maxDistinct = 6): FacetOption[] {
  const counts = new Map<string, number>();
  for (const l of locations) {
    const key = l.metadata.city?.trim() || 'Other';
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  if (sorted.length <= maxDistinct) {
    return sorted.map(([key, count]) => ({ key, label: key, count }));
  }
  const head = sorted.slice(0, maxDistinct - 1);
  const tail = sorted.slice(maxDistinct - 1);
  const tailCount = tail.reduce((sum, [, c]) => sum + c, 0);
  const tailKeys = new Set(tail.map(([k]) => k));
  return [
    ...head.map(([key, count]) => ({ key, label: key, count })),
    { key: `__other__:${[...tailKeys].join('|')}`, label: 'Other', count: tailCount },
  ];
}

/** Resolves a location's region-facet key against the (possibly bucketed) facet list above. */
export function regionKeyFor(location: LocationEntity, regions: FacetOption[]): string {
  const city = location.metadata.city?.trim() || 'Other';
  const direct = regions.find((r) => r.key === city);
  if (direct) return city;
  const bucket = regions.find((r) => r.key.startsWith('__other__:') && r.key.includes(city));
  return bucket ? bucket.key : city;
}
