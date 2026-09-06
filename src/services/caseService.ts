import { mockCases } from '../data';
import type { Case, CaseStatus } from '../types';
import { mockDelay } from '../utils/mockDelay';

export const caseService = {
  async listCases(): Promise<Case[]> {
    await mockDelay(500);
    return mockCases;
  },
  async getCase(caseId: string): Promise<Case | undefined> {
    await mockDelay(350);
    return mockCases.find((c) => c.id === caseId);
  },
  async filterCases(opts: { status?: CaseStatus | 'all'; query?: string }): Promise<Case[]> {
    await mockDelay(400);
    return mockCases.filter((c) => {
      const statusOk = !opts.status || opts.status === 'all' || c.status === opts.status;
      const q = opts.query?.toLowerCase().trim();
      const queryOk = !q || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
      return statusOk && queryOk;
    });
  },
};
