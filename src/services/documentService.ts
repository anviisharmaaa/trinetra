import { mockDocuments, mockOcrEntities } from '../data';
import type { DocumentEntity, OcrEntity } from '../types';
import { mockDelay } from '../utils/mockDelay';

export const documentService = {
  async listByCase(caseId: string): Promise<DocumentEntity[]> {
    await mockDelay(400);
    return mockDocuments.filter((d) => d.caseIds.includes(caseId));
  },
  async getOcrEntities(documentId: string): Promise<OcrEntity[]> {
    await mockDelay(600);
    return mockOcrEntities.filter((o) => o.documentId === documentId);
  },
};
