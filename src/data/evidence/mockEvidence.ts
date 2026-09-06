import type { Evidence, Alert } from '../../types';
import { ALL_BUNDLES } from '../caseBundles';

export const mockEvidence: Evidence[] = [
  {
    id: 'EV-001', caseId: 'case-op001', type: 'face', title: 'Facial match — Arjun Malhotra at Sea Breeze Apartments',
    description: 'CCTV facial recognition match at 94.2% confidence, camera BW-12.',
    collectedAt: '2026-09-04T14:29:16.000Z', collectedBy: 'System — Face Recognition Module', entityIds: ['P-0042'],
    sourceRef: 'CAM-BW12 / FD-001', confidence: 0.942,
    chainOfCustody: [
      { actor: 'System', action: 'Auto-captured from live feed', timestamp: '2026-09-04T14:29:16.000Z' },
      { actor: 'Analyst Meher Fatima', action: 'Reviewed and confirmed match', timestamp: '2026-09-04T14:40:00.000Z' },
    ],
    tags: ['cctv', 'face-match', 'primary-subject'],
  },
  {
    id: 'EV-002', caseId: 'case-op001', type: 'cctv', title: 'ANPR capture — MH-02-CQ-4521 at Bandra West Junction',
    description: 'Automatic Number Plate Recognition capture of registered vehicle owned by P-0042.',
    collectedAt: '2026-09-03T09:12:00.000Z', collectedBy: 'System — ANPR', entityIds: ['P-0042', 'VEH-01'],
    sourceRef: 'CAM-BW02 / CE-004', confidence: 0.97,
    chainOfCustody: [{ actor: 'System', action: 'Auto-captured', timestamp: '2026-09-03T09:12:00.000Z' }],
    tags: ['cctv', 'vehicle'],
  },
  {
    id: 'EV-003', caseId: 'case-op001', type: 'cctv', title: 'Unidentified contact at Colaba dockside',
    description: 'Person detected meeting with P-0042 near dock perimeter; identity unresolved (UNKNOWN_07).',
    collectedAt: '2026-08-29T21:07:00.000Z', collectedBy: 'System — CCTV', entityIds: ['P-0042', 'P-0045'],
    sourceRef: 'CAM-OE11 / CE-006', confidence: 0.61,
    chainOfCustody: [
      { actor: 'System', action: 'Auto-captured', timestamp: '2026-08-29T21:07:00.000Z' },
      { actor: 'SI Rohan Kulkarni', action: 'Flagged for follow-up', timestamp: '2026-08-30T08:00:00.000Z' },
    ],
    tags: ['cctv', 'unresolved-identity'],
  },
  {
    id: 'EV-004', caseId: 'case-op001', type: 'financial', title: 'Flagged transfer chain — ACC-06 → ACC-05 → ACC-07',
    description: 'Three linked transfers within 24 hours consistent with layering pattern.',
    collectedAt: '2026-08-31T10:05:00.000Z', collectedBy: 'Analyst Meher Fatima', entityIds: ['P-0046', 'ORG-02', 'P-0047'],
    sourceRef: 'TX-001, TX-002, TX-003', confidence: 0.85,
    chainOfCustody: [{ actor: 'Analyst Meher Fatima', action: 'Flagged via financial module', timestamp: '2026-08-31T11:00:00.000Z' }],
    tags: ['financial', 'layering'],
  },
  {
    id: 'EV-005', caseId: 'case-op001', type: 'document', title: 'Freight contract — Meridian Freight & Konnect Traders',
    description: 'Signed contract establishing commercial relationship between the two entities.',
    collectedAt: '2026-07-08T09:00:00.000Z', collectedBy: 'SI Rohan Kulkarni', entityIds: ['ORG-01', 'ORG-02'],
    sourceRef: 'DOC-03', confidence: 0.9,
    chainOfCustody: [{ actor: 'SI Rohan Kulkarni', action: 'Obtained via search warrant', timestamp: '2026-07-08T09:00:00.000Z' }],
    tags: ['document', 'contract'],
  },
  {
    id: 'EV-006', caseId: 'case-op001', type: 'call', title: 'High-frequency call pattern — P-0042 ↔ P-0043',
    description: '14 calls over 30 days, concentrated around Bandra West and Andheri East cell towers.',
    collectedAt: '2026-09-04T14:32:12.000Z', collectedBy: 'System — Call Analysis', entityIds: ['P-0042', 'P-0043'],
    sourceRef: 'CL-001 … CL-014', confidence: 0.9,
    chainOfCustody: [{ actor: 'System', action: 'Pattern flagged automatically', timestamp: '2026-09-04T14:35:00.000Z' }],
    tags: ['call-records', 'pattern'],
  },
  {
    id: 'EV-007', caseId: 'case-op001', type: 'forensic', title: 'Device extraction — Samsung Galaxy S23 (DEV-01)',
    description: 'Full logical extraction performed via Cellebrite UFED. Recovered deleted messaging app cache referencing "shipment window" and "Konnect payment" terms, 3 deleted images geo-tagged near Colaba dockside, and a secondary SIM profile associated with PH-1005.',
    collectedAt: '2026-08-22T11:00:00.000Z', collectedBy: 'Forensic Analyst Divya Kapoor', entityIds: ['P-0042', 'DEV-01', 'P-0045'],
    sourceRef: 'DEV-01 / Cellebrite Report FR-2231', confidence: 0.88,
    chainOfCustody: [
      { actor: 'SI Rohan Kulkarni', action: 'Device seized under warrant', timestamp: '2026-08-20T15:30:00.000Z' },
      { actor: 'Forensic Analyst Divya Kapoor', action: 'Logical extraction performed', timestamp: '2026-08-22T11:00:00.000Z' },
      { actor: 'Forensic Analyst Divya Kapoor', action: 'Report filed and hashed (SHA-256)', timestamp: '2026-08-22T18:45:00.000Z' },
    ],
    tags: ['forensic', 'device-extraction', 'deleted-data'],
  },
  {
    id: 'EV-008', caseId: 'case-op001', type: 'forensic', title: 'Digital signature match — freight contract PDF metadata',
    description: 'Document metadata analysis confirms DOC-03 was authored and digitally signed from a device registered to ORG-01, timestamp consistent with declared contract date.',
    collectedAt: '2026-07-09T10:15:00.000Z', collectedBy: 'Forensic Analyst Divya Kapoor', entityIds: ['ORG-01', 'ORG-02'],
    sourceRef: 'DOC-03 / Metadata Report FR-1987', confidence: 0.93,
    chainOfCustody: [{ actor: 'Forensic Analyst Divya Kapoor', action: 'Metadata extracted and verified', timestamp: '2026-07-09T10:15:00.000Z' }],
    tags: ['forensic', 'document-authentication'],
  },
  ...ALL_BUNDLES.flatMap((b) => b.evidence),
];

export const mockAlerts: Alert[] = [
  { id: 'AL-001', caseId: 'case-op001', timestamp: '2026-09-04T14:29:16.000Z', severity: 'high', title: 'Facial match: Arjun Malhotra detected', description: 'Camera BW-12 — 94.2% confidence match at Sea Breeze Apartments.', entityIds: ['P-0042'], acknowledged: false, source: 'Face Recognition Module' },
  { id: 'AL-002', caseId: 'case-op001', timestamp: '2026-09-03T10:05:00.000Z', severity: 'critical', title: 'Layered transaction pattern detected', description: 'Three transfers routed through ACC-05 within 24 hours.', entityIds: ['ORG-02', 'P-0046', 'P-0047'], acknowledged: false, source: 'Financial Intelligence' },
  { id: 'AL-003', caseId: 'case-op001', timestamp: '2026-08-29T21:10:00.000Z', severity: 'medium', title: 'Unresolved identity near dock perimeter', description: 'UNKNOWN_07 seen meeting primary subject at Colaba dockside.', entityIds: ['P-0042', 'P-0045'], acknowledged: true, source: 'CCTV Module' },
  { id: 'AL-004', caseId: 'case-op001', timestamp: '2026-08-27T17:56:00.000Z', severity: 'low', title: 'Vehicle re-entered monitored zone', description: 'MH-43-K-3320 re-entered Chembur industrial perimeter.', entityIds: ['VEH-04'], acknowledged: true, source: 'ANPR' },
  { id: 'AL-005', caseId: 'case-op001', timestamp: '2026-08-20T20:12:00.000Z', severity: 'medium', title: 'New associate link established', description: 'Movement correlation links P-0042 and P-0043 at Bandra West Junction.', entityIds: ['P-0042', 'P-0043'], acknowledged: true, source: 'Network Analysis' },
  ...ALL_BUNDLES.flatMap((b) => b.alerts),
];
