import { create } from 'zustand';
import type { Case, CasePriority, CaseStatus, Entity } from '../types';
import { caseService, type CaseEntityLink } from '../services/caseService';
import { getEntityById } from '../data';
import { personService } from '../services/personService';

export interface NewCaseInput {
  name: string;
  description: string;
  priority: CasePriority;
  investigatorLead: string;
  /** Supabase auth.users id of the analyst creating this case. Required —
   * the owner-based RLS policy on `cases`/`case_entities` only accepts an
   * insert whose `created_by` matches the signed-in user. */
  createdBy: string;
  /** Person ID of the victim, if one was selected in the Case Builder. */
  victimPersonIds?: string[];
  /** Person IDs of suspects selected in the Case Builder. */
  suspectPersonIds?: string[];
  /** IDs of other related people/entities selected in the Case Builder (any EntityType). */
  relatedEntityIds?: string[];
}

interface CaseState {
  cases: Case[];
  status: 'idle' | 'loading' | 'ready' | 'error';
  error: string | null;
  filterStatus: CaseStatus | 'all';
  query: string;
  activeCaseId: string | null;
  pinnedIds: string[];
  /** Per-caseId lookup status for a case NOT present in `cases` (the bulk
   * mock+Supabase list) -- used only for the LED-case fallback (see
   * ensureCase). A Supabase/mock case never touches this map since it's
   * always found in `cases` directly. */
  caseLookup: Record<string, 'loading' | 'ready' | 'notfound' | 'error'>;

  fetchCases: () => Promise<void>;
  setFilterStatus: (s: CaseStatus | 'all') => void;
  setQuery: (q: string) => void;
  setActiveCase: (id: string | null) => void;
  togglePin: (id: string) => void;
  createCase: (input: NewCaseInput) => Promise<Case>;
  getActiveCase: () => Case | undefined;
  getFilteredCases: () => Case[];
  /** Resolves a caseId not already in `cases` against the real LED case
   * backend (Postgres `cases`, via caseService.getLedCase) and merges it in
   * on success. A no-op if the case is already present, or a lookup for it
   * is already in flight/complete. Called by CaseWorkspaceLayout alongside
   * setActiveCase so `/cases/CASE-0001427` resolves the same way
   * `/cases/<supabase-uuid>` already does, without altering that path. */
  ensureCase: (caseId: string) => Promise<void>;
}

export const useCaseStore = create<CaseState>((set, get) => ({
  cases: [],
  status: 'idle',
  error: null,
  filterStatus: 'all',
  query: '',
  activeCaseId: null,
  pinnedIds: [],
  caseLookup: {},

  fetchCases: async () => {
    set({ status: 'loading', error: null });
    try {
      const cases = await caseService.listCases();
      set({ cases, status: 'ready', pinnedIds: cases.filter((c) => c.pinned).map((c) => c.id) });
    } catch {
      set({ status: 'error', error: 'CASE INDEX UNAVAILABLE' });
    }
  },
  setFilterStatus: (s) => set({ filterStatus: s }),
  setQuery: (q) => set({ query: q }),
  setActiveCase: (id) => set({ activeCaseId: id }),
  togglePin: (id) =>
    set((s) => ({
      pinnedIds: s.pinnedIds.includes(id) ? s.pinnedIds.filter((p) => p !== id) : [...s.pinnedIds, id],
    })),
  createCase: async (input) => {
    if (!input.createdBy) {
      throw new Error('You must be signed in to create a case.');
    }

    const existing = get().cases;
    const nextNumber = existing.length + 1;
    const code = `OP-${String(nextNumber).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const id = `case-new-${Date.now()}`;

    // Resolve every id against the existing entity dataset by ID — never by
    // name. A person id is checked against the small in-memory demo dataset
    // first (fast, synchronous, covers legacy cases), then against the real
    // Master Dataset backend (server/) if it isn't found there — this is
    // what lets the Case Builder link a real Person ID from the ingested
    // 100k-person dataset, not just the old demo persons. Anything that
    // resolves in neither place is dropped: an invalid Person ID must never
    // produce a link.
    const resolvePerson = async (pid: string): Promise<Entity | undefined> => {
      const mock = getEntityById(pid);
      if (mock && mock.type === 'person') return mock;
      const real = await personService.getPersonRaw(pid);
      if (!real) return undefined;
      return {
        id: real.person_id, caseIds: [], type: 'person', name: real.name,
        riskLevel: (real.risk_level ?? 'unknown').toLowerCase() as Entity['riskLevel'],
        status: (real.status ?? '').toLowerCase() === 'active' ? 'active' : 'inactive',
        metadata: { nationality: real.nationality ?? undefined, occupation: real.occupation ?? undefined },
        sourceIds: ['master-dataset'], createdAt: now, updatedAt: now,
      } as Entity;
    };
    const resolvePersons = async (ids?: string[]): Promise<Entity[]> => {
      const resolved = await Promise.all((ids ?? []).map(resolvePerson));
      return resolved.filter((e): e is Entity => !!e);
    };
    const resolveAny = (ids?: string[]): Entity[] =>
      (ids ?? []).map((eid) => getEntityById(eid)).filter((e): e is Entity => !!e);

    const [victims, suspects] = await Promise.all([
      resolvePersons(input.victimPersonIds),
      resolvePersons(input.suspectPersonIds),
    ]);
    const related = resolveAny(input.relatedEntityIds);
    const linkedAll = [...victims, ...suspects, ...related];
    const linkedPersons = linkedAll.filter((e) => e.type === 'person');
    const linkedVehicles = linkedAll.filter((e) => e.type === 'vehicle');
    const linkedLocations = linkedAll.filter((e) => e.type === 'location');

    const newCase: Case = {
      id,
      code,
      name: input.name.toUpperCase(),
      description: input.description,
      status: 'active',
      priority: input.priority,
      classification: 'restricted',
      investigatorLead: input.investigatorLead,
      team: [input.investigatorLead],
      createdAt: now,
      updatedAt: now,
      victimPersonIds: victims.map((e) => e.id),
      suspectPersonIds: suspects.map((e) => e.id),
      relatedEntityIds: related.map((e) => e.id),
      stats: {
        personCount: linkedPersons.length,
        vehicleCount: linkedVehicles.length,
        entityCount: linkedAll.length,
        relationshipCount: 0,
        locationCount: linkedLocations.length,
        eventCount: 0,
        alertCount: 0,
        evidenceCount: 0,
      },
    };

    const links: CaseEntityLink[] = [
      ...victims.map((e) => ({ personId: e.id, entityType: e.type, role: 'victim' as const })),
      ...suspects.map((e) => ({ personId: e.id, entityType: e.type, role: 'suspect' as const })),
      ...related.map((e) => ({ personId: e.id, entityType: e.type, role: 'related' as const })),
    ];

    // Persist to Supabase FIRST. If this throws (e.g. because the
    // supabase/migrations/*_create_cases.sql migration hasn't been run yet
    // against this Supabase project), the case is never added to local
    // state and this function never returns a "created" case — it always
    // propagates the error to the caller instead of faking success.
    await caseService.createCase(newCase, input.createdBy, links);

    // Link back from each existing (mock-dataset) entity to this new case —
    // exactly how every other case-to-entity relationship in this app
    // already works (Entity.caseIds) — so the new case behaves consistently
    // everywhere (Key People panel, entityService.listByCase, network
    // graph, etc.) without any special-casing, and without copying the
    // person's data into the case itself.
    for (const entity of linkedAll) {
      if (!entity.caseIds.includes(id)) entity.caseIds.push(id);
    }

    set((s) => ({ cases: [newCase, ...s.cases] }));
    return newCase;
  },
  ensureCase: async (caseId) => {
    const { cases, caseLookup } = get();
    if (cases.some((c) => c.id === caseId)) return;
    if (caseLookup[caseId] === 'loading' || caseLookup[caseId] === 'ready') return;

    set((s) => ({ caseLookup: { ...s.caseLookup, [caseId]: 'loading' } }));
    try {
      const led = await caseService.getLedCase(caseId);
      if (led) {
        set((s) => ({
          cases: s.cases.some((c) => c.id === caseId) ? s.cases : [...s.cases, led],
          caseLookup: { ...s.caseLookup, [caseId]: 'ready' },
        }));
      } else {
        set((s) => ({ caseLookup: { ...s.caseLookup, [caseId]: 'notfound' } }));
      }
    } catch {
      // Backend unreachable, not merely "not found" -- CaseWorkspaceLayout
      // shows a distinct "case intelligence unavailable" message for this.
      set((s) => ({ caseLookup: { ...s.caseLookup, [caseId]: 'error' } }));
    }
  },
  getActiveCase: () => get().cases.find((c) => c.id === get().activeCaseId),
  getFilteredCases: () => {
    const { cases, filterStatus, query, pinnedIds } = get();
    const q = query.toLowerCase().trim();
    const filtered = cases.filter((c) => {
      const statusOk = filterStatus === 'all' || c.status === filterStatus;
      const queryOk = !q || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
      return statusOk && queryOk;
    });
    return [...filtered].sort((a, b) => {
      const aPinned = pinnedIds.includes(a.id) ? 1 : 0;
      const bPinned = pinnedIds.includes(b.id) ? 1 : 0;
      if (aPinned !== bPinned) return bPinned - aPinned;
      return b.updatedAt.localeCompare(a.updatedAt);
    });
  },
}));
