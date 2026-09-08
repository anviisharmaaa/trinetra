import type { CallRecord } from '../../types';
import { ALL_BUNDLES } from '../caseBundles';

function call(id: string, from: string, to: string, ts: string, dur: number, tower?: string, band?: CallRecord['frequencyBand']): CallRecord {
  return { id, caseId: 'case-op001', fromPhoneId: from, toPhoneId: to, timestamp: ts, durationSeconds: dur, type: 'voice', towerLocationId: tower, frequencyBand: band };
}

export const mockCalls: CallRecord[] = [
  call('CL-001', 'PH-1001', 'PH-1003', '2026-09-04T14:32:12.000Z', 522, 'loc-001', 'high'),
  call('CL-002', 'PH-1001', 'PH-1003', '2026-09-03T09:14:00.000Z', 190, 'loc-002', 'high'),
  call('CL-003', 'PH-1001', 'PH-1003', '2026-09-01T18:02:00.000Z', 88, 'loc-001', 'high'),
  call('CL-004', 'PH-1001', 'PH-1003', '2026-08-30T12:40:00.000Z', 340, 'loc-002', 'high'),
  call('CL-005', 'PH-1001', 'PH-1003', '2026-08-28T16:10:00.000Z', 61, 'loc-001', 'medium'),
  call('CL-006', 'PH-1001', 'PH-1004', '2026-08-27T10:00:00.000Z', 145, 'loc-003', 'medium'),
  call('CL-007', 'PH-1001', 'PH-1004', '2026-08-24T11:20:00.000Z', 210, 'loc-003', 'medium'),
  call('CL-008', 'PH-1003', 'PH-1005', '2026-08-29T20:55:00.000Z', 44, 'loc-004', 'low'),
  call('CL-009', 'PH-1003', 'PH-1005', '2026-08-20T19:30:00.000Z', 30, 'loc-004', 'low'),
  call('CL-010', 'PH-1006', 'PH-1001', '2026-09-02T08:15:00.000Z', 96, 'loc-007', 'medium'),
  call('CL-011', 'PH-1006', 'PH-1001', '2026-08-31T09:00:00.000Z', 133, 'loc-007', 'medium'),
  call('CL-012', 'PH-1008', 'PH-1001', '2026-08-27T17:50:00.000Z', 58, 'loc-006', 'low'),
  call('CL-013', 'PH-1006', 'PH-1003', '2026-08-25T09:12:00.000Z', 71, 'loc-002', 'medium'),
  call('CL-014', 'PH-1001', 'PH-1003', '2026-08-22T14:00:00.000Z', 26, 'loc-001', 'high'),
  ...ALL_BUNDLES.flatMap((b) => b.calls),
];
