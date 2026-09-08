export interface Transaction {
  id: string;
  caseId: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  currency: 'INR';
  timestamp: string;
  mode: 'UPI' | 'NEFT' | 'IMPS' | 'CASH' | 'RTGS' | 'CARD';
  narration?: string;
  flagged?: boolean;
}

export interface CriminalRecord {
  id: string;
  entityId: string;
  caseId: string;
  filedAt: string;
  firNumber: string;
  section: string;
  charge: string;
  status: 'under_investigation' | 'charge_sheeted' | 'convicted' | 'acquitted' | 'closed';
  station: string;
}
