import { create } from 'zustand';
import type { Case, CasePriority, CaseStatus, Entity } from '../types';
import { caseService } from '../services/caseService';
import { getEntityById } from '../data';

export interface NewCaseInput {
  name: string;
  description: string;
  priority: CasePriority;
  investigatorLead: string;
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

  fetchCases: () => Promise<void>;
  setFilterStatus: (s: CaseStatus | 'all') => void;
  setQuery: (q: string) => void;
  setActiveCase: (id: string | null) => void;
  togglePin: (id: string) => void;
  createCase: (input: NewCaseInput) => Case;
  getActiveCase: () => Case | undefined;
  getFilteredCases: () => Case[];
}

export const useCaseStore = create<CaseState>((set, get) => ({
  cases: [],
  status: 'idle',
  error: null,
  filterStatus: 'all',
  query: '',
  activeCaseId: null,
  pinnedIds: [],

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
  createCase: (input) => {
    const existing = get().cases;
    const nextNumber = existing.length + 1;
    const code = `OP-${String(nextNumber).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const id = `case-new-${Date.now()}`;

    // Resolve every id against the existing entity dataset by ID — never by
    // name. Anything that doesn't resolve (or, for victim/suspect, doesn't
    // resolve to a `person` record) is silently dropped here as a last line
    // of defense: it should never happen in practice, since the Case
    // Builder only ever adds ids that came back from a real search result.
    const resolvePersons = (ids?: string[]): Entity[] =>
      (ids ?? [])
        .map((pid) => getEntityById(pid))
        .filter((e): e is Entity => !!e && e.type === 'person');
    const resolveAny = (ids?: string[]): Entity[] =>
      (ids ?? []).map((eid) => getEntityById(eid)).filter((e): e is Entity => !!e);

    const victims = resolvePersons(input.victimPersonIds);
    const suspects = resolvePersons(input.suspectPersonIds);
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

    // Link back from each existing entity to this new case — exactly how
    // every other case-to-entity relationship in this app already works
    // (Entity.caseIds) — so the new case behaves consistently everywhere
    // (Key People panel, entityService.listByCase, network graph, etc.)
    // without any special-casing, and without copying the person's data
    // into the case itself.
    for (const entity of linkedAll) {
      if (!entity.caseIds.includes(id)) entity.caseIds.push(id);
    }

    set((s) => ({ cases: [newCase, ...s.cases] }));
    return newCase;
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
