import { mockCases } from '../data';
import type { Case, CasePriority, CaseStatus } from '../types';
import { mockDelay } from '../utils/mockDelay';
import { supabase } from '../utils/supabase/client';
import { caseNarrativeService, type ApiLedCaseDetail } from './caseNarrativeService';

// ---------------------------------------------------------------------------
// Hybrid architecture. Cases and Case <-> Entity links live in Supabase (see
// supabase/migrations/*_create_cases.sql, guarded by owner-based RLS). The
// large investigation dataset (persons, accounts, phones, vehicles, ...) is
// NEVER stored here — it stays in the self-hosted PostgreSQL database behind
// the Express API in server/, and every `person_id` recorded in
// `case_entities` is nothing more than a bare reference into that dataset,
// resolved live via personService at read time (see caseStore.ts and
// CaseDashboardPage.tsx). This file only ever reads/writes case-management
// rows — it never fetches or stores person data.
//
// The handful of pre-existing demo cases in src/data/cases/mockCases.ts
// (e.g. OP-001) are not stored in Supabase at all. They are simply merged
// into every result below exactly as before, so nothing that already
// worked breaks regardless of whether the Supabase migration has been run.
// ---------------------------------------------------------------------------

export type CaseEntityRole = 'victim' | 'suspect' | 'related';

export interface CasePersonIds {
  victimIds: string[];
  suspectIds: string[];
  relatedPersonIds: string[];
  allPersonIds: string[];
}

export interface CaseEntityLink {
  personId: string;
  entityType: string;
  role: CaseEntityRole;
}

/**
 * Thrown instead of ever faking a successful save: the Supabase
 * "cases"/"case_entities" tables don't exist yet in this project, which
 * means supabase/migrations/<timestamp>_create_cases.sql has not been run
 * against it yet.
 */
export class SupabaseMigrationPendingError extends Error {
  constructor(cause?: string) {
    super(
      'Case could not be saved: the Supabase "cases" / "case_entities" tables do not exist yet. ' +
        'Run supabase/migrations/*_create_cases.sql against your Supabase project, then try again.' +
        (cause ? ` (${cause})` : ''),
    );
    this.name = 'SupabaseMigrationPendingError';
  }
}

interface SupabaseCaseRow {
  id: string;
  code: string;
  name: string;
  description: string | null;
  status: CaseStatus;
  priority: CasePriority;
  classification: Case['classification'];
  investigator_lead: string | null;
  team: string[] | null;
  pinned: boolean | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface SupabaseCaseEntityRow {
  case_id: string;
  person_id: string;
  entity_type: string;
  role: CaseEntityRole;
}

function isMissingRelationError(error: { code?: string; message?: string } | null | undefined): boolean {
  if (!error) return false;
  if (error.code === '42P01') return true; // Postgres: undefined_table
  return /relation .* does not exist/i.test(error.message ?? '');
}

function emptyStats() {
  return {
    personCount: 0,
    vehicleCount: 0,
    entityCount: 0,
    relationshipCount: 0,
    locationCount: 0,
    eventCount: 0,
    alertCount: 0,
    evidenceCount: 0,
  };
}

function hydrateCase(row: SupabaseCaseRow, links: SupabaseCaseEntityRow[]): Case {
  const victimPersonIds = [...new Set(links.filter((l) => l.role === 'victim').map((l) => l.person_id))];
  const suspectPersonIds = [...new Set(links.filter((l) => l.role === 'suspect').map((l) => l.person_id))];
  const relatedEntityIds = [...new Set(links.filter((l) => l.role === 'related').map((l) => l.person_id))];
  const personCount = links.filter((l) => l.entity_type === 'person').length;
  const vehicleCount = links.filter((l) => l.entity_type === 'vehicle').length;
  const locationCount = links.filter((l) => l.entity_type === 'location').length;

  return {
    id: row.id,
    code: row.code,
    name: row.name,
    description: row.description ?? '',
    status: row.status,
    priority: row.priority,
    classification: row.classification,
    investigatorLead: row.investigator_lead ?? 'Unassigned',
    team: row.team ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    pinned: row.pinned ?? false,
    victimPersonIds,
    suspectPersonIds,
    relatedEntityIds,
    stats: {
      ...emptyStats(),
      personCount,
      vehicleCount,
      locationCount,
      entityCount: links.length,
    },
  };
}

/**
 * Fetches every Supabase-backed case visible to the signed-in analyst (RLS
 * restricts this to cases they created), plus its case_entities links,
 * hydrated into full Case objects. Returns [] — and logs, but never throws —
 * if the migration hasn't been run yet, so callers can safely merge this
 * with the legacy mock cases regardless of migration status.
 */
async function fetchSupabaseCases(): Promise<Case[]> {
  const { data: rows, error } = await supabase.from('cases').select('*').order('created_at', { ascending: false });

  if (error) {
    if (!isMissingRelationError(error)) console.error('[caseService] failed to load Supabase cases:', error.message);
    return [];
  }
  if (!rows || rows.length === 0) return [];

  const ids = rows.map((r) => r.id);
  const { data: links, error: linkErr } = await supabase
    .from('case_entities')
    .select('case_id, person_id, entity_type, role')
    .in('case_id', ids);

  if (linkErr && !isMissingRelationError(linkErr)) {
    console.error('[caseService] failed to load case_entities:', linkErr.message);
  }

  const linksByCase = new Map<string, SupabaseCaseEntityRow[]>();
  for (const l of links ?? []) {
    const arr = linksByCase.get(l.case_id) ?? [];
    arr.push(l);
    linksByCase.set(l.case_id, arr);
  }

  return rows.map((row) => hydrateCase(row, linksByCase.get(row.id) ?? []));
}

async function fetchSupabaseCase(caseId: string): Promise<Case | undefined> {
  const { data: row, error } = await supabase.from('cases').select('*').eq('id', caseId).maybeSingle();
  if (error) {
    if (!isMissingRelationError(error)) console.error('[caseService] failed to load Supabase case:', error.message);
    return undefined;
  }
  if (!row) return undefined;

  const { data: links, error: linkErr } = await supabase
    .from('case_entities')
    .select('case_id, person_id, entity_type, role')
    .eq('case_id', caseId);
  if (linkErr && !isMissingRelationError(linkErr)) {
    console.error('[caseService] failed to load case_entities:', linkErr.message);
  }

  return hydrateCase(row, links ?? []);
}

// ---------------------------------------------------------------------------
// LED cases (self-hosted Postgres `cases`, e.g. "CASE-0001427") are a THIRD
// case source alongside the mock demo cases and Supabase analyst cases
// above -- never merged into listCases()/fetchSupabaseCases(), and never
// written to Supabase. getLedCase (below) is a per-id fallback, called only
// when a caseId isn't found in the mock+Supabase list (see
// caseStore.ensureCase), so it never affects the existing Cases list page.
// Case ID (case_id) is always the lookup key -- never the title, since two
// LED cases in this dataset share the title "Operation Steel Summit".
// ---------------------------------------------------------------------------

const LED_STATUS_MAP: Record<string, CaseStatus> = {
  OPEN: 'active',
  CLOSED: 'closed',
};

function mapLedStatus(status: string): CaseStatus {
  return LED_STATUS_MAP[status.toUpperCase()] ?? 'monitoring';
}

function mapLedPriority(priority: string): CasePriority {
  const p = priority.toLowerCase();
  return p === 'critical' || p === 'high' || p === 'medium' || p === 'low' ? p : 'medium';
}

function titleCaseWords(s: string): string {
  return s.replace(/_/g, ' ').replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
}

/** A DATE-only string ("YYYY-MM-DD") fed straight into `new Date()` is
 * parsed as UTC midnight, which can then display as the previous day once
 * converted to a negative-UTC-offset local timezone (e.g. formatRelativeTime
 * in CaseHeader). Appending an explicit local midnight time-of-day makes
 * `new Date()` parse it as LOCAL time instead, so it always round-trips to
 * the same calendar day regardless of the investigator's timezone. */
function toLocalMidnightIso(dateOnly: string | null): string | undefined {
  return dateOnly ? `${dateOnly}T00:00:00` : undefined;
}

function hydrateLedCase(row: ApiLedCaseDetail): Case {
  const eventCount = row.narrative.filter((n) => n.kind === 'TIMELINE_EVENT').length;
  return {
    id: row.case_id,
    code: row.case_number,
    name: row.title,
    description: `${titleCaseWords(row.case_type)} investigation -- LED case file.`,
    status: mapLedStatus(row.status),
    priority: mapLedPriority(row.priority),
    classification: 'confidential',
    investigatorLead: 'LED Case File',
    team: [],
    createdAt: toLocalMidnightIso(row.opened_date) ?? new Date(0).toISOString(),
    updatedAt: toLocalMidnightIso(row.closed_date) ?? toLocalMidnightIso(row.opened_date) ?? new Date(0).toISOString(),
    victimPersonIds: [],
    suspectPersonIds: [],
    relatedEntityIds: row.persons.map((p) => p.person_id),
    stats: {
      personCount: row.persons.length,
      vehicleCount: 0,
      entityCount: row.persons.length,
      relationshipCount: 0,
      locationCount: 0,
      eventCount,
      alertCount: row.alerts.length,
      evidenceCount: row.evidence.length,
    },
    isLedCase: true,
    ledCaseNumber: row.case_number,
  };
}

function dedupeIds(ids: Iterable<string>): string[] {
  return [...new Set([...ids].filter(Boolean))];
}

async function fetchCasePersonIdsFromSupabase(caseId: string): Promise<CasePersonIds> {
  const { data, error } = await supabase.from('case_entities').select('person_id, role').eq('case_id', caseId);
  if (error) {
    if (!isMissingRelationError(error)) console.error('[caseService] failed to load case_entities for person resolution:', error.message);
    return { victimIds: [], suspectIds: [], relatedPersonIds: [], allPersonIds: [] };
  }

  const victimIds = dedupeIds((data ?? []).filter((l) => l.role === 'victim').map((l) => l.person_id));
  const suspectIds = dedupeIds((data ?? []).filter((l) => l.role === 'suspect').map((l) => l.person_id));
  const relatedPersonIds = dedupeIds((data ?? []).filter((l) => l.role === 'related').map((l) => l.person_id));
  const allPersonIds = dedupeIds([...victimIds, ...suspectIds, ...relatedPersonIds]);

  return { victimIds, suspectIds, relatedPersonIds, allPersonIds };
}

export const caseService = {
  async listCases(): Promise<Case[]> {
    await mockDelay(150);
    const supabaseCases = await fetchSupabaseCases();
    return [...supabaseCases, ...mockCases];
  },

  async getCase(caseId: string): Promise<Case | undefined> {
    await mockDelay(100);
    const mock = mockCases.find((c) => c.id === caseId);
    if (mock) return mock;
    return fetchSupabaseCase(caseId);
  },

  async getCasePersonIds(caseId: string): Promise<CasePersonIds> {
    const active = await this.getCase(caseId);
    if (active) {
      const victimIds = dedupeIds(active.victimPersonIds ?? []);
      const suspectIds = dedupeIds(active.suspectPersonIds ?? []);
      const relatedPersonIds = dedupeIds(active.relatedEntityIds ?? []);
      const supabaseIds = await fetchCasePersonIdsFromSupabase(caseId);
      if (supabaseIds.allPersonIds.length > 0) {
        return {
          victimIds: supabaseIds.victimIds.length > 0 ? supabaseIds.victimIds : victimIds,
          suspectIds: supabaseIds.suspectIds.length > 0 ? supabaseIds.suspectIds : suspectIds,
          relatedPersonIds: supabaseIds.relatedPersonIds.length > 0 ? supabaseIds.relatedPersonIds : relatedPersonIds,
          allPersonIds: dedupeIds([...supabaseIds.victimIds, ...supabaseIds.suspectIds, ...supabaseIds.relatedPersonIds]),
        };
      }
      const allPersonIds = dedupeIds([...victimIds, ...suspectIds, ...relatedPersonIds]);
      return { victimIds, suspectIds, relatedPersonIds, allPersonIds };
    }

    const ledDetail = await caseNarrativeService.getLedCaseDetail(caseId);
    if (ledDetail) {
      const persons = dedupeIds(ledDetail.persons.map((p) => p.person_id));
      return { victimIds: [], suspectIds: [], relatedPersonIds: persons, allPersonIds: persons };
    }

    const supabaseIds = await fetchCasePersonIdsFromSupabase(caseId);
    return supabaseIds;
  },

  async filterCases(opts: { status?: CaseStatus | 'all'; query?: string }): Promise<Case[]> {
    const all = await this.listCases();
    return all.filter((c) => {
      const statusOk = !opts.status || opts.status === 'all' || c.status === opts.status;
      const q = opts.query?.toLowerCase().trim();
      const queryOk = !q || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
      return statusOk && queryOk;
    });
  },

  /**
   * Persists a newly-built case (already fully assembled by caseStore) to
   * Supabase: one row in `cases`, plus one `case_entities` row per linked
   * Victim / Suspect / Related-entity id. Never fakes success — if the
   * migration hasn't been run against this Supabase project yet, this
   * throws SupabaseMigrationPendingError rather than silently pretending
   * the case was saved. On any failure after the case row was written, the
   * case row is rolled back so no orphaned, entity-less case is left behind.
   */
  async createCase(newCase: Case, createdBy: string, links: CaseEntityLink[]): Promise<void> {
    const { error: caseErr } = await supabase.from('cases').insert({
      id: newCase.id,
      code: newCase.code,
      name: newCase.name,
      description: newCase.description,
      status: newCase.status,
      priority: newCase.priority,
      classification: newCase.classification,
      investigator_lead: newCase.investigatorLead,
      team: newCase.team,
      pinned: newCase.pinned ?? false,
      created_by: createdBy,
    });

    if (caseErr) {
      if (isMissingRelationError(caseErr)) throw new SupabaseMigrationPendingError(caseErr.message);
      throw new Error(`Failed to save case to Supabase: ${caseErr.message}`);
    }

    if (links.length > 0) {
      const { error: linkErr } = await supabase.from('case_entities').insert(
        links.map((l) => ({
          case_id: newCase.id,
          person_id: l.personId,
          entity_type: l.entityType,
          role: l.role,
          created_by: createdBy,
        })),
      );

      if (linkErr) {
        await supabase.from('cases').delete().eq('id', newCase.id);
        if (isMissingRelationError(linkErr)) throw new SupabaseMigrationPendingError(linkErr.message);
        throw new Error(`Failed to save case entities to Supabase: ${linkErr.message}`);
      }
    }
  },

  /**
   * Fallback lookup for a real LED case (self-hosted Postgres `cases`,
   * e.g. "CASE-0001427") -- tried only when a caseId isn't found among the
   * mock demo cases or Supabase analyst cases (see caseStore.ensureCase).
   * Returns undefined for a caseId that doesn't exist there either (a 404),
   * so the caller can show "case not found"; a genuinely unreachable
   * backend still throws. Shares caseNarrativeService's cache, so this
   * never issues a second network request beyond whatever LedCaseOverview
   * already triggered for the same case.
   */
  async getLedCase(caseId: string): Promise<Case | undefined> {
    const detail = await caseNarrativeService.getLedCaseDetail(caseId);
    return detail ? hydrateLedCase(detail) : undefined;
  },
};
