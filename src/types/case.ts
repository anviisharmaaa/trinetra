export type CaseStatus = 'active' | 'monitoring' | 'closed';
export type CasePriority = 'critical' | 'high' | 'medium' | 'low';

export interface CaseActivityItem {
  id: string;
  caseId: string;
  timestamp: string;
  actor: string;
  action: string;
  targetLabel?: string;
}

export interface Case {
  id: string;
  code: string; // e.g. OP-001
  name: string;
  description: string;
  status: CaseStatus;
  priority: CasePriority;
  classification: 'restricted' | 'confidential' | 'secret';
  investigatorLead: string;
  team: string[];
  createdAt: string;
  updatedAt: string;
  pinned?: boolean;
  stats: {
    personCount: number;
    vehicleCount: number;
    entityCount: number;
    relationshipCount: number;
    locationCount: number;
    eventCount: number;
    alertCount: number;
    evidenceCount: number;
  };
}
