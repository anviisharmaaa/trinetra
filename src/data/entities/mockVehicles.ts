import type { VehicleEntity } from '../../types';
import { ALL_BUNDLES } from '../caseBundles';

export const mockVehicles: VehicleEntity[] = [
  {
    id: 'VEH-01', caseIds: ['case-op001'], type: 'vehicle', name: 'MH-02-CQ-4521', status: 'active',
    metadata: { registrationNumber: 'MH-02-CQ-4521', make: 'Maruti Suzuki', model: 'Dzire', color: 'White', ownerId: 'P-0042', lastSeenLocationId: 'loc-001' },
    sourceIds: ['src-anpr-01'], createdAt: '2026-06-12T09:00:00.000Z', updatedAt: '2026-09-03T08:00:00.000Z',
  },
  {
    id: 'VEH-02', caseIds: ['case-op001'], type: 'vehicle', name: 'MH-04-BT-7712', status: 'active',
    metadata: { registrationNumber: 'MH-04-BT-7712', make: 'Mahindra', model: 'Bolero', color: 'Grey', ownerId: 'P-0043', lastSeenLocationId: 'loc-006' },
    sourceIds: ['src-anpr-02'], createdAt: '2026-06-14T10:00:00.000Z', updatedAt: '2026-09-02T14:00:00.000Z',
  },
  {
    id: 'VEH-03', caseIds: ['case-op001'], type: 'vehicle', name: 'MH-01-AX-9081', status: 'active',
    metadata: { registrationNumber: 'MH-01-AX-9081', make: 'Toyota', model: 'Fortuner', color: 'Black', ownerId: 'P-0046', lastSeenLocationId: 'loc-007' },
    sourceIds: ['src-anpr-01'], createdAt: '2026-06-20T10:00:00.000Z', updatedAt: '2026-09-01T09:00:00.000Z',
  },
  {
    id: 'VEH-04', caseIds: ['case-op001'], type: 'vehicle', name: 'MH-43-K-3320 (Freight Truck)', status: 'active',
    metadata: { registrationNumber: 'MH-43-K-3320', make: 'Tata', model: '407 Container', color: 'Blue', ownerId: 'ORG-01', lastSeenLocationId: 'loc-008' },
    sourceIds: ['src-anpr-03'], createdAt: '2026-06-25T08:00:00.000Z', updatedAt: '2026-08-30T08:00:00.000Z',
  },
  ...ALL_BUNDLES.flatMap((b) => b.vehicles),
];
