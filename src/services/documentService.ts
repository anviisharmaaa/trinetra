import { mockDocuments, mockOcrEntities } from '../data';
import type { DocumentEntity, OcrEntity } from '../types';
import { mockDelay } from '../utils/mockDelay';
import { caseService } from './caseService';
import { personService } from './personService';

function mapDocumentRows(rows: Array<Record<string, unknown>>, caseId: string): DocumentEntity[] {
  return rows.map((row) => ({
    id: String(row.document_id ?? row.id ?? 'doc'),
    caseIds: [caseId],
    type: 'document',
    name: String(row.document_number ?? row.source_reference ?? row.document_id ?? 'Document'),
    status: 'active',
    metadata: {
      fileName: String(row.source_reference ?? row.document_number ?? row.document_id ?? 'Document'),
      fileType: String(row.document_type ?? 'PDF'),
      pages: undefined,
      uploadedAt: row.issue_date ? String(row.issue_date) : undefined,
      tags: row.status ? [String(row.status)] : undefined,
    },
    sourceIds: ['master-dataset'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

export const documentService = {
  async listByCase(caseId: string): Promise<DocumentEntity[]> {
    await mockDelay(250);
    const personIds = (await caseService.getCasePersonIds(caseId)).allPersonIds;
    if (personIds.length) {
      const liveRows = await personService.getRecordsForPeople(personIds, 'documents');
      const mapped = mapDocumentRows(liveRows, caseId);
      if (mapped.length) return mapped;
    }
    return mockDocuments.filter((d) => d.caseIds.includes(caseId));
  },
  async getOcrEntities(documentId: string): Promise<OcrEntity[]> {
    await mockDelay(600);
    return mockOcrEntities.filter((o) => o.documentId === documentId);
  },
};
