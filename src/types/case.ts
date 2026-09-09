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

  // ---- Linked case entities (Person ID is the authoritative identifier —
  // never the name). Optional so cases created before this field existed
  // keep working unchanged; every read site treats a missing array as empty. ----
  /** Person ID(s) of the victim(s) associated with this case. */
  victimPersonIds?: string[];
  /** Person ID(s) of the suspect(s) associated with this case. */
  suspectPersonIds?: string[];
  /** ID(s) of other related people/entities (any EntityType) associated with this case. */
  relatedEntityIds?: string[];

  // ---- LED case fields (Postgres `cases`, via caseNarrativeService --
  // never Supabase). Optional so every existing Supabase/mock Case literal
  // (mockCases.ts, caseService.hydrateCase) remains valid unchanged. ----
  /** True only for a case hydrated from the self-hosted Postgres `cases`
   * table (see caseService.getLedCase) -- never set for a Supabase
   * analyst case or a legacy demo case. CaseDashboardPage branches on this
   * to render LedCaseOverview instead of the Supabase-oriented overview. */
  isLedCase?: boolean;
  /** The LED case's human case_number (e.g. "CN-2024-001427"), distinct
   * from `code` which mirrors it for LED cases but means "OP-001" for
   * Supabase analyst cases. */
  ledCaseNumber?: string;
}
