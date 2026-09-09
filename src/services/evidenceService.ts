import { mockEvidence, mockAlerts } from '../data';
import type { Evidence, Alert } from '../types';
import { mockDelay } from '../utils/mockDelay';
import { caseService } from './caseService';
import { personService } from './personService';

function mapEvidenceRows(rows: Array<Record<string, unknown>>, caseId: string): Evidence[] {
  return rows.map((row) => {
    const personId = String((row.person_id ?? row.personId ?? '') || '');
    const evidenceId = String(row.evidence_id ?? row.id ?? 'ev');
    const sourceType = String(row.source_type ?? row.evidence_type ?? 'dataset');
    const sourceRef = String(row.source_record_id ?? row.source_reference ?? evidenceId);
    const collectedDate = String(row.collection_date ?? row.collectedAt ?? new Date().toISOString());
    const collectedTime = String(row.collection_time ?? '00:00:00');
    const description = String(row.description ?? `${sourceType} record`);
    const type = String(row.evidence_type ?? 'document').toLowerCase() as Evidence['type'];
    return {
      id: evidenceId,
      caseId,
      type: ['cctv', 'call', 'document', 'financial', 'social', 'forensic', 'face'].includes(type) ? type as Evidence['type'] : 'document',
      title: description.length > 60 ? description.slice(0, 60) + '…' : description,
      description,
      collectedAt: collectedTime && collectedDate ? `${collectedDate}T${collectedTime}` : new Date().toISOString(),
      collectedBy: sourceType,
      entityIds: personId ? [personId] : [],
      sourceRef,
      confidence: typeof row.confidence === 'number' ? row.confidence : Number(row.confidence ?? 0),
      chainOfCustody: [{ actor: sourceType, action: 'Recorded in master dataset', timestamp: collectedDate }],
      tags: [sourceType, String(row.verification_status ?? 'dataset')],
    };
  });
}

export const evidenceService = {
  async listByCase(caseId: string): Promise<Evidence[]> {
    await mockDelay(250);
    const personIds = (await caseService.getCasePersonIds(caseId)).allPersonIds;
    if (personIds.length) {
      const liveRows = await personService.getRecordsForPeople(personIds, 'evidence');
      const mapped = mapEvidenceRows(liveRows, caseId);
      if (mapped.length) return mapped;
    }
    return mockEvidence.filter((e) => e.caseId === caseId);
  },
  async listAlerts(caseId: string): Promise<Alert[]> {
    await mockDelay(350);
    return mockAlerts.filter((a) => a.caseId === caseId).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  },
};
