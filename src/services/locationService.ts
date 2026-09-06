import { mockLocations, getEntitiesByCase } from '../data';
import type { LocationEntity } from '../types';
import { mockDelay } from '../utils/mockDelay';

export const locationService = {
  async listByCase(caseId: string): Promise<LocationEntity[]> {
    await mockDelay(400);
    return getEntitiesByCase(caseId).filter((e): e is LocationEntity => e.type === 'location');
  },
  async getLocation(id: string): Promise<LocationEntity | undefined> {
    await mockDelay(200);
    return mockLocations.find((l) => l.id === id);
  },
};
