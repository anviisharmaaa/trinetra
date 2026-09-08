import type { CCTVEvent, Movement } from '../../types';
import { ALL_BUNDLES } from '../caseBundles';

export const mockCctvEvents: CCTVEvent[] = [
  { id: 'CE-001', cameraId: 'CAM-BW12', caseId: 'case-op001', timestamp: '2026-09-04T14:29:16.000Z', entityIds: ['P-0042'], eventType: 'face_match', confidence: 0.942 },
  { id: 'CE-002', cameraId: 'CAM-BW12', caseId: 'case-op001', timestamp: '2026-09-04T14:31:02.000Z', entityIds: ['P-0042'], eventType: 'face_match', confidence: 0.91 },
  { id: 'CE-003', cameraId: 'CAM-AW09', caseId: 'case-op001', timestamp: '2026-09-04T14:48:40.000Z', entityIds: ['P-0043'], eventType: 'face_match', confidence: 0.88 },
  { id: 'CE-004', cameraId: 'CAM-BW02', caseId: 'case-op001', timestamp: '2026-09-03T09:12:00.000Z', entityIds: ['VEH-01'], eventType: 'vehicle_detected', confidence: 0.97, evidenceRef: 'EV-002' },
  { id: 'CE-005', cameraId: 'CAM-CH03', caseId: 'case-op001', timestamp: '2026-09-02T18:40:00.000Z', entityIds: ['VEH-04', 'P-0048'], eventType: 'vehicle_detected', confidence: 0.93 },
  { id: 'CE-006', cameraId: 'CAM-OE11', caseId: 'case-op001', timestamp: '2026-08-29T21:07:00.000Z', entityIds: ['P-0045'], eventType: 'person_detected', confidence: 0.61, evidenceRef: 'EV-003' },
  { id: 'CE-007', cameraId: 'CAM-OE11', caseId: 'case-op001', timestamp: '2026-08-29T21:09:20.000Z', entityIds: ['P-0042', 'P-0045'], eventType: 'movement', confidence: 0.7 },
  { id: 'CE-008', cameraId: 'CAM-PW08', caseId: 'case-op001', timestamp: '2026-08-28T08:20:00.000Z', entityIds: ['P-0046'], eventType: 'face_match', confidence: 0.89 },
  { id: 'CE-009', cameraId: 'CAM-DR02', caseId: 'case-op001', timestamp: '2026-08-27T17:55:00.000Z', entityIds: ['VEH-04', 'P-0048'], eventType: 'vehicle_detected', confidence: 0.95 },
  { id: 'CE-010', cameraId: 'CAM-LW07', caseId: 'case-op001', timestamp: '2026-08-25T11:30:00.000Z', entityIds: ['P-0044'], eventType: 'face_match', confidence: 0.86 },
  { id: 'CE-011', cameraId: 'CAM-KR06', caseId: 'case-op001', timestamp: '2026-08-22T07:45:00.000Z', entityIds: ['P-0048'], eventType: 'person_detected', confidence: 0.81 },
  { id: 'CE-012', cameraId: 'CAM-BW02', caseId: 'case-op001', timestamp: '2026-08-20T20:10:00.000Z', entityIds: ['P-0042', 'P-0043'], eventType: 'movement', confidence: 0.77 },
  ...ALL_BUNDLES.flatMap((b) => b.cctvEvents),
];

export const mockMovements: Movement[] = [
  ...ALL_BUNDLES.flatMap((b) => b.movements),
  { id: 'MV-001', entityId: 'P-0042', caseId: 'case-op001', fromLocationId: 'loc-001', toLocationId: 'loc-002', timestamp: '2026-09-04T14:35:00.000Z', cameraId: 'CAM-BW12' },
  { id: 'MV-002', entityId: 'P-0045', caseId: 'case-op001', fromLocationId: 'loc-004', toLocationId: 'loc-001', timestamp: '2026-08-29T21:15:00.000Z', cameraId: 'CAM-OE11' },
  { id: 'MV-003', entityId: 'VEH-04', caseId: 'case-op001', fromLocationId: 'loc-006', toLocationId: 'loc-008', timestamp: '2026-08-27T17:40:00.000Z', cameraId: 'CAM-CH03' },
  { id: 'MV-004', entityId: 'P-0048', caseId: 'case-op001', fromLocationId: 'loc-009', toLocationId: 'loc-006', timestamp: '2026-08-22T08:00:00.000Z', cameraId: 'CAM-KR06' },
];
