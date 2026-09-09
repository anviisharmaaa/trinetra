import { mockTransactions, mockCriminalRecords, mockAccounts } from '../data';
import type { Transaction, CriminalRecord, AccountEntity } from '../types';
import { mockDelay } from '../utils/mockDelay';
import { caseService } from './caseService';
import { personService } from './personService';

function mapAccountRows(rows: Array<Record<string, unknown>>, caseId: string): AccountEntity[] {
  return rows.map((row) => {
    const personId = String((row.person_id ?? row.personId ?? '') || '');
    const accountId = String((row.account_id ?? row.id ?? row.accountId ?? ''));
    const bankName = String((row.bank_name ?? row.bankName ?? 'Unknown Bank') || 'Unknown Bank');
    const accountNumber = String((row.account_number ?? row.accountNumber ?? '') || accountId);
    const balanceText = row.balance_band ?? row.balance ?? row.balanceBand;
    const balance = typeof balanceText === 'number' ? balanceText : Number(String(balanceText ?? '').replace(/[^\d.-]/g, '') || 0);
    return {
      id: accountId,
      caseIds: [caseId],
      type: 'account',
      name: `${bankName} •••• ${String(accountNumber).slice(-4) || accountId}`,
      status: 'active',
      riskLevel: 'unknown',
      metadata: {
        accountNumber: String(accountNumber),
        bankName,
        ownerId: personId || undefined,
        balance: Number.isFinite(balance) ? balance : undefined,
      },
      sourceIds: ['master-dataset'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
}

function mapTransactionRows(rows: Array<Record<string, unknown>>, caseId: string): Transaction[] {
  return rows.map((row) => ({
    id: String(row.transaction_id ?? row.id ?? row.transactionId ?? 'txn'),
    caseId,
    fromAccountId: String(row.own_account_id ?? row.fromAccountId ?? row.account_id ?? 'UNKNOWN'),
    toAccountId: String(row.counterparty_account_id ?? row.toAccountId ?? row.counterpartyAccountId ?? 'UNKNOWN'),
    amount: Number(row.amount ?? 0),
    currency: 'INR',
    timestamp: String((row.txn_date ?? row.timestamp ?? new Date().toISOString()) as string),
    mode: String(row.channel ?? row.mode ?? 'UPI') as Transaction['mode'],
    narration: String((row.merchant ?? row.reference_number ?? row.transaction_type ?? '') || 'Master dataset transaction'),
    flagged: Number(row.risk_score ?? 0) > 0.8,
  }));
}

export const financialService = {
  async listAccountsForCase(caseId: string): Promise<AccountEntity[]> {
    await mockDelay(250);
    const personIds = (await caseService.getCasePersonIds(caseId)).allPersonIds;
    if (personIds.length) {
      const liveRows = await personService.getRecordsForPeople(personIds, 'accounts');
      const mapped = mapAccountRows(liveRows, caseId);
      if (mapped.length) return mapped;
    }
    return mockAccounts.filter((a) => a.caseIds.includes(caseId));
  },
  async listTransactions(caseId: string, accountId?: string): Promise<Transaction[]> {
    await mockDelay(300);
    const personIds = (await caseService.getCasePersonIds(caseId)).allPersonIds;
    if (personIds.length) {
      const liveRows = await personService.getRecordsForPeople(personIds, 'transactions');
      const mapped = mapTransactionRows(liveRows, caseId).filter((t) => !accountId || t.fromAccountId === accountId || t.toAccountId === accountId);
      if (mapped.length) return mapped;
    }
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
