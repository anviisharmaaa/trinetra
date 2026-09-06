import type { PhoneEntity } from '../../types';
import { ALL_BUNDLES } from '../caseBundles';

export const mockPhones: PhoneEntity[] = [
  { id: 'PH-1001', caseIds: ['case-op001'], type: 'phone', name: '+91 98XXX XX210', status: 'active', metadata: { number: '+91 98765 43210', carrier: 'Airtel', ownerId: 'P-0042', imei: '35-892401-XXXXXX-0' }, sourceIds: ['src-call-01'], createdAt: '2026-06-12T09:00:00.000Z', updatedAt: '2026-09-04T09:00:00.000Z' },
  { id: 'PH-1002', caseIds: ['case-op001'], type: 'phone', name: '+91 90XXX XX045 (secondary)', status: 'active', metadata: { number: '+91 90112 20045', carrier: 'Jio', ownerId: 'P-0042' }, sourceIds: ['src-call-01'], createdAt: '2026-06-12T09:00:00.000Z', updatedAt: '2026-08-20T09:00:00.000Z' },
  { id: 'PH-1003', caseIds: ['case-op001'], type: 'phone', name: '+91 99XXX XX882', status: 'active', metadata: { number: '+91 99001 18822', carrier: 'Vi', ownerId: 'P-0043' }, sourceIds: ['src-call-01'], createdAt: '2026-06-14T10:00:00.000Z', updatedAt: '2026-09-03T09:00:00.000Z' },
  { id: 'PH-1004', caseIds: ['case-op001'], type: 'phone', name: '+91 98XXX XX551', status: 'active', metadata: { number: '+91 98220 15511', carrier: 'Airtel', ownerId: 'P-0044' }, sourceIds: ['src-call-01'], createdAt: '2026-06-18T09:00:00.000Z', updatedAt: '2026-09-02T09:00:00.000Z' },
  { id: 'PH-1005', caseIds: ['case-op001'], type: 'phone', name: '+91 7XXXX XX119 (burner)', status: 'unknown', metadata: { number: '+91 78210 44119', carrier: 'Unregistered', ownerId: 'P-0045' }, sourceIds: ['src-call-02'], createdAt: '2026-07-02T20:00:00.000Z', updatedAt: '2026-08-29T21:00:00.000Z' },
  { id: 'PH-1006', caseIds: ['case-op001'], type: 'phone', name: '+91 99XXX XX004', status: 'active', metadata: { number: '+91 99870 12004', carrier: 'Jio', ownerId: 'P-0046' }, sourceIds: ['src-call-01'], createdAt: '2026-06-20T10:00:00.000Z', updatedAt: '2026-09-01T09:00:00.000Z' },
  { id: 'PH-1007', caseIds: ['case-op001'], type: 'phone', name: '+91 96XXX XX377', status: 'active', metadata: { number: '+91 96540 87377', carrier: 'BSNL', ownerId: 'P-0047' }, sourceIds: ['src-call-02'], createdAt: '2026-07-05T12:00:00.000Z', updatedAt: '2026-08-30T10:00:00.000Z' },
  { id: 'PH-1008', caseIds: ['case-op001'], type: 'phone', name: '+91 93XXX XX628', status: 'active', metadata: { number: '+91 93330 55628', carrier: 'Airtel', ownerId: 'P-0048' }, sourceIds: ['src-call-01'], createdAt: '2026-06-25T08:00:00.000Z', updatedAt: '2026-08-27T18:00:00.000Z' },
  ...ALL_BUNDLES.flatMap((b) => b.phones),
];
