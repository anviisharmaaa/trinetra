import { mockLocations, getEntitiesByCase } from '../data';
import type { LocationEntity } from '../types';
import { mockDelay } from '../utils/mockDelay';
import { caseService } from './caseService';
import { personService } from './personService';

function mapLocationRows(rows: Array<Record<string, unknown>>, caseId: string): LocationEntity[] {
  return rows.map((row) => {
    const locationId = String(row.location_id ?? row.id ?? 'loc');
    return {
      id: locationId,
      caseIds: [caseId],
      type: 'location',
      name: String(row.name ?? row.location_id ?? row.locationId ?? 'Location'),
      label: 'LOCATION',
      status: 'active',
      metadata: {
        address: String(row.address ?? row.location_id ?? ''),
        city: String(row.city ?? 'Unknown city'),
        coordinates: { lat: Number(row.lat ?? 0), lng: Number(row.lng ?? 0) },
        category: String(row.category ?? 'unknown'),
      },
      sourceIds: ['master-dataset'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
}

export const locationService = {
  async listByCase(caseId: string): Promise<LocationEntity[]> {
    await mockDelay(250);
    const personIds = (await caseService.getCasePersonIds(caseId)).allPersonIds;
    if (personIds.length) {
      const liveRows = await personService.getRecordsForPeople(personIds, 'locations');
      const mapped = mapLocationRows(liveRows, caseId);
      if (mapped.length) return mapped;
    }
    return getEntitiesByCase(caseId).filter((e): e is LocationEntity => e.type === 'location');
  },
  async getLocation(id: string): Promise<LocationEntity | undefined> {
    await mockDelay(200);
    return mockLocations.find((l) => l.id === id);
  },
};
