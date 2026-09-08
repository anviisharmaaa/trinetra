import type { LocationEntity } from '../../types';

export interface ProjectedPoint {
  location: LocationEntity;
  x: number;
  y: number;
}

export interface MapCluster {
  kind: 'cluster';
  key: string;
  label: string;
  x: number;
  y: number;
  members: LocationEntity[];
}

export interface MapSingle {
  kind: 'single';
  key: string;
  location: LocationEntity;
  x: number;
  y: number;
}

export type MapGroup = MapCluster | MapSingle;

/**
 * Groups projected markers into clusters so the overview map never shows
 * every pin at once ("Mumbai ● 8" instead of eight overlapping labels).
 * Primary grouping is by city (a meaningful, investigator-legible unit);
 * a lone location in a city is shown as an individual marker rather than a
 * "City ● 1" badge that would just be noise.
 */
export function clusterByCity(points: ProjectedPoint[]): MapGroup[] {
  const byCity = new Map<string, ProjectedPoint[]>();
  for (const p of points) {
    const city = p.location.metadata.city?.trim() || 'Unknown';
    const list = byCity.get(city) ?? [];
    list.push(p);
    byCity.set(city, list);
  }
  const groups: MapGroup[] = [];
  for (const [city, members] of byCity) {
    if (members.length === 1) {
      groups.push({ kind: 'single', key: members[0].location.id, location: members[0].location, x: members[0].x, y: members[0].y });
    } else {
      const x = members.reduce((s, m) => s + m.x, 0) / members.length;
      const y = members.reduce((s, m) => s + m.y, 0) / members.length;
      groups.push({ kind: 'cluster', key: `city:${city}`, label: city, x, y, members: members.map((m) => m.location) });
    }
  }
  return groups;
}

/**
 * Secondary pass used once a city has been "zoomed into" — a greedy
 * proximity merge (percent-of-canvas distance) so two locations that
 * genuinely sit on top of each other still don't render as overlapping
 * pins. Most focused views will just come back as all-singles.
 */
export function clusterByProximity(points: ProjectedPoint[], thresholdPercent = 5): MapGroup[] {
  const remaining = [...points];
  const groups: MapGroup[] = [];
  while (remaining.length) {
    const seed = remaining.shift()!;
    const bucket = [seed];
    for (let i = remaining.length - 1; i >= 0; i--) {
      const d = Math.hypot(remaining[i].x - seed.x, remaining[i].y - seed.y);
      if (d <= thresholdPercent) {
        bucket.push(remaining[i]);
        remaining.splice(i, 1);
      }
    }
    if (bucket.length === 1) {
      groups.push({ kind: 'single', key: bucket[0].location.id, location: bucket[0].location, x: bucket[0].x, y: bucket[0].y });
    } else {
      const x = bucket.reduce((s, m) => s + m.x, 0) / bucket.length;
      const y = bucket.reduce((s, m) => s + m.y, 0) / bucket.length;
      const label = bucket[0].location.metadata.city?.trim() || 'Cluster';
      groups.push({ kind: 'cluster', key: `prox:${bucket.map((b) => b.location.id).join(',')}`, label, x, y, members: bucket.map((b) => b.location) });
    }
  }
  return groups;
}
