import type { Transaction, CriminalRecord } from '../../types';
import { ALL_BUNDLES } from '../caseBundles';

export const mockTransactions: Transaction[] = [
  { id: 'TX-001', caseId: 'case-op001', fromAccountId: 'ACC-06', toAccountId: 'ACC-05', amount: 480000, currency: 'INR', timestamp: '2026-08-30T11:00:00.000Z', mode: 'RTGS', narration: 'Freight advance', flagged: true },
  { id: 'TX-002', caseId: 'case-op001', fromAccountId: 'ACC-05', toAccountId: 'ACC-01', amount: 210000, currency: 'INR', timestamp: '2026-08-30T15:20:00.000Z', mode: 'NEFT', narration: 'Consultancy fee', flagged: true },
  { id: 'TX-003', caseId: 'case-op001', fromAccountId: 'ACC-05', toAccountId: 'ACC-07', amount: 95000, currency: 'INR', timestamp: '2026-08-31T10:05:00.000Z', mode: 'IMPS', narration: 'Vendor payment', flagged: true },
  { id: 'TX-004', caseId: 'case-op001', fromAccountId: 'ACC-07', toAccountId: 'ACC-04', amount: 40000, currency: 'INR', timestamp: '2026-08-31T18:45:00.000Z', mode: 'UPI', narration: 'Reimbursement', flagged: true },
  { id: 'TX-005', caseId: 'case-op001', fromAccountId: 'ACC-01', toAccountId: 'ACC-03', amount: 60000, currency: 'INR', timestamp: '2026-09-01T09:30:00.000Z', mode: 'UPI', narration: 'Loan repayment' },
  { id: 'TX-006', caseId: 'case-op001', fromAccountId: 'ACC-03', toAccountId: 'ACC-04', amount: 22000, currency: 'INR', timestamp: '2026-09-01T14:00:00.000Z', mode: 'UPI', narration: 'Shared expense' },
  { id: 'TX-007', caseId: 'case-op001', fromAccountId: 'ACC-06', toAccountId: 'ACC-01', amount: 150000, currency: 'INR', timestamp: '2026-09-02T09:00:00.000Z', mode: 'NEFT', narration: 'Consultancy fee', flagged: true },
  { id: 'TX-008', caseId: 'case-op001', fromAccountId: 'ACC-04', toAccountId: 'ACC-05', amount: 18000, currency: 'INR', timestamp: '2026-09-02T16:00:00.000Z', mode: 'UPI', narration: 'Office expense' },
  { id: 'TX-009', caseId: 'case-op001', fromAccountId: 'ACC-05', toAccountId: 'ACC-07', amount: 62000, currency: 'INR', timestamp: '2026-09-03T10:00:00.000Z', mode: 'IMPS', narration: 'Vendor payment', flagged: true },
  { id: 'TX-010', caseId: 'case-op001', fromAccountId: 'ACC-07', toAccountId: 'ACC-04', amount: 30000, currency: 'INR', timestamp: '2026-09-03T19:00:00.000Z', mode: 'UPI', narration: 'Cash equivalent', flagged: true },
  ...ALL_BUNDLES.flatMap((b) => b.transactions),
];

export const mockCriminalRecords: CriminalRecord[] = [
  { id: 'CR-001', entityId: 'P-0042', caseId: 'case-op001', filedAt: '2021-04-11T00:00:00.000Z', firNumber: 'FIR/2021/0442', section: 'IPC 420, 120B', charge: 'Cheating & Criminal Conspiracy', status: 'closed', station: 'Bandra Police Station' },
  { id: 'CR-002', entityId: 'P-0046', caseId: 'case-op001', filedAt: '2019-09-02T00:00:00.000Z', firNumber: 'FIR/2019/1187', section: 'Customs Act 135', charge: 'Evasion of Customs Duty', status: 'convicted', station: 'Colaba Police Station' },
  { id: 'CR-003', entityId: 'P-0043', caseId: 'case-op001', filedAt: '2023-12-19T00:00:00.000Z', firNumber: 'FIR/2023/0891', section: 'IPC 379', charge: 'Theft (Vehicle)', status: 'under_investigation', station: 'Andheri Police Station' },
  { id: 'CR-004', entityId: 'P-0047', caseId: 'case-op001', filedAt: '2025-02-08T00:00:00.000Z', firNumber: 'FIR/2025/0233', section: 'IT Act 66D, PMLA', charge: 'Impersonation for Cheating / Money Mule', status: 'charge_sheeted', station: 'Malad Police Station' },
  ...ALL_BUNDLES.flatMap((b) => b.criminalRecords),
];
