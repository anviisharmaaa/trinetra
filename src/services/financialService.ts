import { mockTransactions, mockCriminalRecords, mockAccounts } from '../data';
import type { Transaction, CriminalRecord, AccountEntity } from '../types';
import { mockDelay } from '../utils/mockDelay';

export const financialService = {
  async listAccountsForCase(caseId: string): Promise<AccountEntity[]> {
    await mockDelay(400);
    return mockAccounts.filter((a) => a.caseIds.includes(caseId));
  },
  async listTransactions(caseId: string, accountId?: string): Promise<Transaction[]> {
    await mockDelay(500);
    return mockTransactions.filter((t) => {
      if (t.caseId !== caseId) return false;
      if (accountId && t.fromAccountId !== accountId && t.toAccountId !== accountId) return false;
      return true;
    });
  },
  async listCriminalRecords(entityId?: string, caseId?: string): Promise<CriminalRecord[]> {
    await mockDelay(400);
    return mockCriminalRecords.filter((r) => {
      if (entityId && r.entityId !== entityId) return false;
      if (caseId && r.caseId !== caseId) return false;
      return true;
    });
  },
};
