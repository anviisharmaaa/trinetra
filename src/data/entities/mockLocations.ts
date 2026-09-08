import type { LocationEntity } from '../../types';
import { MUMBAI_LOCALITIES, CITIES, mulberry32, pick } from '../seed';
import { ALL_BUNDLES } from '../caseBundles';

const rand = mulberry32(1010);

export const mockLocations: LocationEntity[] = [
  ...MUMBAI_LOCALITIES.map((loc, i) => ({
    id: `loc-${String(i + 1).padStart(3, '0')}`,
    caseIds: i < 6 ? ['case-op001'] : ['case-op001', 'case-op002'],
    type: 'location' as const,
    name: loc.name,
    label: loc.category.replace('_', ' ').toUpperCase(),
    status: 'active' as const,
    metadata: {
      address: `${loc.name}, Mumbai, Maharashtra`,
      city: 'Mumbai',
      coordinates: { lat: loc.lat, lng: loc.lng },
      category: loc.category,
    },
    sourceIds: ['src-gis-01'],
    createdAt: '2026-06-12T09:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  })),
  ...CITIES.slice(1).map((c, i) => ({
    id: `loc-city-${String(i + 1).padStart(2, '0')}`,
    caseIds: ['case-op002', 'case-op003'],
    type: 'location' as const,
    name: c.name,
    label: 'CITY',
    status: 'active' as const,
    metadata: {
      address: c.name,
      city: c.name,
      coordinates: { lat: c.lat, lng: c.lng },
      category: 'city',
    },
    sourceIds: ['src-gis-01'],
    createdAt: '2026-03-02T08:15:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  })),
  ...ALL_BUNDLES.flatMap((b) => b.locations),
];

export function randomLocationId(caseId: string): string {
  const pool = mockLocations.filter((l) => l.caseIds.includes(caseId));
  return pick(rand, pool.length ? pool : mockLocations).id;
}
