import type { Relationship } from '../../types';
import { mulberry32, pick, randInt } from '../seed';
import { OP002_PERSONS, OP003_PERSONS, OP004_PERSONS, OP005_PERSONS } from '../entities/mockPersons';
import { ALL_BUNDLES } from '../caseBundles';

let seq = 1;
function id() {
  return `REL-${String(seq++).padStart(4, '0')}`;
}

const now = '2026-09-01T00:00:00.000Z';

// ---- Hand-authored OP-001 network (matches dossier/graph/cctv/financial narrative) ----
export const OP001_RELATIONSHIPS: Relationship[] = [
  { id: id(), caseId: 'case-op001', sourceId: 'P-0042', targetId: 'P-0043', type: 'associated', label: 'ASSOCIATED WITH', strength: 0.9, confidence: 0.92, direction: 'undirected', metadata: { basis: '14 calls in 30 days' }, sourceIds: ['src-call-01'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0042', targetId: 'P-0044', type: 'associated', label: 'ASSOCIATED WITH', strength: 0.62, confidence: 0.8, direction: 'undirected', metadata: { basis: 'shared org filings' }, sourceIds: ['src-mca-01'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0042', targetId: 'P-0046', type: 'works_for', label: 'WORKS FOR', strength: 0.85, confidence: 0.9, direction: 'directed', metadata: {}, sourceIds: ['src-mca-01'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0043', targetId: 'P-0046', type: 'works_for', label: 'WORKS FOR', strength: 0.8, confidence: 0.88, direction: 'directed', metadata: {}, sourceIds: ['src-mca-01'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0048', targetId: 'P-0046', type: 'works_for', label: 'WORKS FOR', strength: 0.7, confidence: 0.85, direction: 'directed', metadata: {}, sourceIds: ['src-mca-01'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0042', targetId: 'ORG-01', type: 'works_for', label: 'WORKS FOR', strength: 0.88, confidence: 0.9, direction: 'directed', metadata: {}, sourceIds: ['src-mca-01'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0043', targetId: 'ORG-01', type: 'works_for', label: 'WORKS FOR', strength: 0.8, confidence: 0.87, direction: 'directed', metadata: {}, sourceIds: ['src-mca-01'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0046', targetId: 'ORG-01', type: 'works_for', label: 'DIRECTOR OF', strength: 0.95, confidence: 0.95, direction: 'directed', metadata: {}, sourceIds: ['src-mca-01'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0048', targetId: 'ORG-01', type: 'works_for', label: 'WORKS FOR', strength: 0.6, confidence: 0.8, direction: 'directed', metadata: {}, sourceIds: ['src-mca-01'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0044', targetId: 'ORG-02', type: 'works_for', label: 'ACCOUNTANT AT', strength: 0.9, confidence: 0.92, direction: 'directed', metadata: {}, sourceIds: ['src-mca-01'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'ORG-01', targetId: 'ORG-02', type: 'connected_to', label: 'FREIGHT CONTRACT WITH', strength: 0.7, confidence: 0.82, direction: 'undirected', metadata: { ref: 'DOC-03' }, sourceIds: ['src-doc-03'], createdAt: now },

  { id: id(), caseId: 'case-op001', sourceId: 'P-0042', targetId: 'PH-1001', type: 'owned', label: 'OWNS', strength: 1, confidence: 1, direction: 'directed', metadata: {}, sourceIds: ['src-call-01'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0042', targetId: 'PH-1002', type: 'owned', label: 'OWNS', strength: 1, confidence: 0.95, direction: 'directed', metadata: {}, sourceIds: ['src-call-01'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0043', targetId: 'PH-1003', type: 'owned', label: 'OWNS', strength: 1, confidence: 1, direction: 'directed', metadata: {}, sourceIds: ['src-call-01'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0044', targetId: 'PH-1004', type: 'owned', label: 'OWNS', strength: 1, confidence: 1, direction: 'directed', metadata: {}, sourceIds: ['src-call-01'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0045', targetId: 'PH-1005', type: 'owned', label: 'LIKELY OWNS', strength: 0.5, confidence: 0.41, direction: 'directed', metadata: {}, sourceIds: ['src-call-02'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0046', targetId: 'PH-1006', type: 'owned', label: 'OWNS', strength: 1, confidence: 1, direction: 'directed', metadata: {}, sourceIds: ['src-call-01'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0047', targetId: 'PH-1007', type: 'owned', label: 'OWNS', strength: 1, confidence: 0.9, direction: 'directed', metadata: {}, sourceIds: ['src-call-02'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0048', targetId: 'PH-1008', type: 'owned', label: 'OWNS', strength: 1, confidence: 1, direction: 'directed', metadata: {}, sourceIds: ['src-call-01'], createdAt: now },

  { id: id(), caseId: 'case-op001', sourceId: 'P-0042', targetId: 'PH-1003', type: 'called', label: 'CALLED (14×)', strength: 0.9, confidence: 0.95, direction: 'directed', metadata: { count: 14 }, sourceIds: ['src-call-01'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0042', targetId: 'PH-1004', type: 'called', label: 'CALLED (6×)', strength: 0.55, confidence: 0.9, direction: 'directed', metadata: { count: 6 }, sourceIds: ['src-call-01'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0043', targetId: 'PH-1005', type: 'called', label: 'CALLED (3×)', strength: 0.4, confidence: 0.7, direction: 'directed', metadata: { count: 3 }, sourceIds: ['src-call-02'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0046', targetId: 'PH-1001', type: 'called', label: 'CALLED (9×)', strength: 0.7, confidence: 0.92, direction: 'directed', metadata: { count: 9 }, sourceIds: ['src-call-01'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0048', targetId: 'PH-1001', type: 'called', label: 'CALLED (5×)', strength: 0.5, confidence: 0.85, direction: 'directed', metadata: { count: 5 }, sourceIds: ['src-call-01'], createdAt: now },

  { id: id(), caseId: 'case-op001', sourceId: 'P-0042', targetId: 'VEH-01', type: 'owned', label: 'OWNS', strength: 1, confidence: 1, direction: 'directed', metadata: {}, sourceIds: ['src-anpr-01'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0043', targetId: 'VEH-02', type: 'owned', label: 'OWNS', strength: 1, confidence: 1, direction: 'directed', metadata: {}, sourceIds: ['src-anpr-02'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0046', targetId: 'VEH-03', type: 'owned', label: 'OWNS', strength: 1, confidence: 1, direction: 'directed', metadata: {}, sourceIds: ['src-anpr-01'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'ORG-01', targetId: 'VEH-04', type: 'owned', label: 'OWNS', strength: 1, confidence: 1, direction: 'directed', metadata: {}, sourceIds: ['src-anpr-03'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0048', targetId: 'VEH-04', type: 'associated', label: 'DRIVES', strength: 0.8, confidence: 0.85, direction: 'directed', metadata: {}, sourceIds: ['src-cctv-04'], createdAt: now },

  { id: id(), caseId: 'case-op001', sourceId: 'P-0042', targetId: 'loc-001', type: 'located_at', label: 'RESIDES AT', strength: 0.9, confidence: 0.9, direction: 'directed', metadata: {}, sourceIds: ['src-informant-03'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0042', targetId: 'loc-002', type: 'visited', label: 'VISITED (11×)', strength: 0.75, confidence: 0.88, direction: 'directed', metadata: { count: 11 }, sourceIds: ['src-cctv-01'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0043', targetId: 'loc-002', type: 'located_at', label: 'RESIDES AT', strength: 0.85, confidence: 0.85, direction: 'directed', metadata: {}, sourceIds: ['src-informant-03'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0044', targetId: 'loc-003', type: 'located_at', label: 'RESIDES AT', strength: 0.8, confidence: 0.8, direction: 'directed', metadata: {}, sourceIds: ['src-informant-03'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0045', targetId: 'loc-004', type: 'appeared_near', label: 'APPEARED NEAR', strength: 0.5, confidence: 0.6, direction: 'directed', metadata: {}, sourceIds: ['src-cctv-03'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0046', targetId: 'loc-007', type: 'located_at', label: 'RESIDES AT', strength: 0.8, confidence: 0.8, direction: 'directed', metadata: {}, sourceIds: ['src-informant-03'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0048', targetId: 'loc-008', type: 'located_at', label: 'RESIDES AT', strength: 0.7, confidence: 0.75, direction: 'directed', metadata: {}, sourceIds: ['src-informant-03'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'ORG-01', targetId: 'loc-006', type: 'located_at', label: 'WAREHOUSE AT', strength: 0.9, confidence: 0.9, direction: 'directed', metadata: {}, sourceIds: ['src-doc-04'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'VEH-04', targetId: 'loc-008', type: 'appeared_near', label: 'LAST SEEN NEAR', strength: 0.6, confidence: 0.7, direction: 'directed', metadata: {}, sourceIds: ['src-anpr-03'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0042', targetId: 'loc-004', type: 'visited', label: 'VISITED (4×)', strength: 0.4, confidence: 0.65, direction: 'directed', metadata: { count: 4 }, sourceIds: ['src-cctv-03'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0045', targetId: 'P-0042', type: 'appeared_near', label: 'SEEN WITH', strength: 0.55, confidence: 0.55, direction: 'undirected', metadata: {}, sourceIds: ['src-cctv-03'], createdAt: now },

  { id: id(), caseId: 'case-op001', sourceId: 'P-0042', targetId: 'ACC-01', type: 'owned', label: 'OWNS', strength: 1, confidence: 1, direction: 'directed', metadata: {}, sourceIds: ['src-financial-01'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0042', targetId: 'ACC-02', type: 'owned', label: 'OWNS', strength: 1, confidence: 1, direction: 'directed', metadata: {}, sourceIds: ['src-financial-01'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0043', targetId: 'ACC-03', type: 'owned', label: 'OWNS', strength: 1, confidence: 1, direction: 'directed', metadata: {}, sourceIds: ['src-financial-01'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0044', targetId: 'ACC-04', type: 'owned', label: 'OWNS', strength: 1, confidence: 1, direction: 'directed', metadata: {}, sourceIds: ['src-financial-01'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'ORG-02', targetId: 'ACC-05', type: 'owned', label: 'OWNS', strength: 1, confidence: 1, direction: 'directed', metadata: {}, sourceIds: ['src-financial-01'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0046', targetId: 'ACC-06', type: 'owned', label: 'OWNS', strength: 1, confidence: 1, direction: 'directed', metadata: {}, sourceIds: ['src-financial-01'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0047', targetId: 'ACC-07', type: 'owned', label: 'OWNS', strength: 1, confidence: 0.9, direction: 'directed', metadata: {}, sourceIds: ['src-financial-02'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'ACC-01', targetId: 'ACC-05', type: 'transferred_to', label: 'TRANSFERRED TO', strength: 0.8, confidence: 0.85, direction: 'directed', metadata: {}, sourceIds: ['src-financial-01'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'ACC-05', targetId: 'ACC-07', type: 'transferred_to', label: 'TRANSFERRED TO', strength: 0.65, confidence: 0.75, direction: 'directed', metadata: {}, sourceIds: ['src-financial-02'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'ACC-06', targetId: 'ACC-05', type: 'transferred_to', label: 'TRANSFERRED TO', strength: 0.7, confidence: 0.8, direction: 'directed', metadata: {}, sourceIds: ['src-financial-01'], createdAt: now },

  { id: id(), caseId: 'case-op001', sourceId: 'P-0042', targetId: 'DOC-01', type: 'identified_by', label: 'IDENTIFIED BY', strength: 1, confidence: 0.98, direction: 'directed', metadata: {}, sourceIds: ['src-doc-01'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'P-0042', targetId: 'DOC-02', type: 'associated', label: 'REFERENCED IN', strength: 0.9, confidence: 0.9, direction: 'directed', metadata: {}, sourceIds: ['src-doc-02'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'ORG-01', targetId: 'DOC-03', type: 'associated', label: 'PARTY TO', strength: 0.9, confidence: 0.9, direction: 'directed', metadata: {}, sourceIds: ['src-doc-03'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'ORG-02', targetId: 'DOC-03', type: 'associated', label: 'PARTY TO', strength: 0.9, confidence: 0.9, direction: 'directed', metadata: {}, sourceIds: ['src-doc-03'], createdAt: now },
  { id: id(), caseId: 'case-op001', sourceId: 'ORG-01', targetId: 'DOC-04', type: 'associated', label: 'LEASEHOLDER', strength: 0.85, confidence: 0.85, direction: 'directed', metadata: {}, sourceIds: ['src-doc-04'], createdAt: now },

  { id: id(), caseId: 'case-op001', sourceId: 'P-0042', targetId: 'DEV-01', type: 'owned', label: 'OWNS', strength: 1, confidence: 1, direction: 'directed', metadata: {}, sourceIds: ['src-forensic-01'], createdAt: now },
];

// ---- Generated relationships for the bulk cases (associate ↔ associate + works_for chains) ----
function genRelationships(caseId: string, persons: { id: string }[], seed: number): Relationship[] {
  const rand = mulberry32(seed);
  const out: Relationship[] = [];
  const types: Relationship['type'][] = ['associated', 'called', 'appeared_near', 'connected_to', 'financed_by'];
  for (let i = 1; i < persons.length; i++) {
    const target = pick(rand, persons.slice(0, i));
    out.push({
      id: id(),
      caseId,
      sourceId: persons[i].id,
      targetId: target.id,
      type: 'associated',
      label: 'ASSOCIATED WITH',
      strength: 0.3 + rand() * 0.6,
      confidence: 0.5 + rand() * 0.45,
      direction: 'undirected',
      metadata: {},
      sourceIds: [`src-gen-${caseId}`],
      createdAt: now,
    });
  }
  // extra cross-links
  const extra = randInt(rand, 3, Math.max(3, Math.floor(persons.length * 0.6)));
  for (let i = 0; i < extra; i++) {
    const a = pick(rand, persons);
    const b = pick(rand, persons);
    if (a.id === b.id) continue;
    out.push({
      id: id(),
      caseId,
      sourceId: a.id,
      targetId: b.id,
      type: pick(rand, types),
      label: pick(rand, types).toUpperCase().replace('_', ' '),
      strength: 0.2 + rand() * 0.7,
      confidence: 0.4 + rand() * 0.55,
      direction: rand() > 0.5 ? 'directed' : 'undirected',
      metadata: {},
      sourceIds: [`src-gen-${caseId}`],
      createdAt: now,
    });
  }
  return out;
}

export const GEN_RELATIONSHIPS_OP002 = genRelationships('case-op002', OP002_PERSONS, 3002);
export const GEN_RELATIONSHIPS_OP003 = genRelationships('case-op003', OP003_PERSONS, 3003);
export const GEN_RELATIONSHIPS_OP004 = genRelationships('case-op004', OP004_PERSONS, 3004);
export const GEN_RELATIONSHIPS_OP005 = genRelationships('case-op005', OP005_PERSONS, 3005);

export const mockRelationships: Relationship[] = [
  ...OP001_RELATIONSHIPS,
  ...GEN_RELATIONSHIPS_OP002,
  ...GEN_RELATIONSHIPS_OP003,
  ...GEN_RELATIONSHIPS_OP004,
  ...GEN_RELATIONSHIPS_OP005,
  ...ALL_BUNDLES.flatMap((b) => b.relationships),
];

export function getRelationshipsForCase(caseId: string): Relationship[] {
  return mockRelationships.filter((r) => r.caseId === caseId);
}

export function getRelationshipsForEntity(entityId: string): Relationship[] {
  return mockRelationships.filter((r) => r.sourceId === entityId || r.targetId === entityId);
}
