import { mockEvidence, mockAlerts } from '../data';
import type { Evidence, Alert } from '../types';
import { mockDelay } from '../utils/mockDelay';

export const evidenceService = {
  async listByCase(caseId: string): Promise<Evidence[]> {
    await mockDelay(400);
    return mockEvidence.filter((e) => e.caseId === caseId);
  },
  async listAlerts(caseId: string): Promise<Alert[]> {
    await mockDelay(350);
    return mockAlerts.filter((a) => a.caseId === caseId).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  },
};
