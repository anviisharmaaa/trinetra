import type { Entity } from '../../types';
import { mockPersons } from './mockPersons';
import { mockVehicles } from './mockVehicles';
import { mockPhones } from './mockPhones';
import { mockLocations } from './mockLocations';
import { mockOrganizations, mockDevices, mockAccounts, mockDocuments } from './mockOrganizations';

export * from './mockPersons';
export * from './mockVehicles';
export * from './mockPhones';
export * from './mockLocations';
export * from './mockOrganizations';

export const allEntities: Entity[] = [
  ...mockPersons,
  ...mockVehicles,
  ...mockPhones,
  ...mockLocations,
  ...mockOrganizations,
  ...mockDevices,
  ...mockAccounts,
  ...mockDocuments,
];

const entityIndex = new Map(allEntities.map((e) => [e.id, e]));

export function getEntityById(id: string): Entity | undefined {
  return entityIndex.get(id);
}

export function getEntitiesByCase(caseId: string): Entity[] {
  return allEntities.filter((e) => e.caseIds.includes(caseId));
}
