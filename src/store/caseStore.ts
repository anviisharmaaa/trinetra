import { create } from 'zustand';
import type { Case, CasePriority, CaseStatus } from '../types';
import { caseService } from '../services/caseService';

export interface NewCaseInput {
  name: string;
  description: string;
  priority: CasePriority;
  investigatorLead: string;
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
    const newCase: Case = {
      id: `case-new-${Date.now()}`,
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
      stats: {
        personCount: 0,
        vehicleCount: 0,
        entityCount: 0,
        relationshipCount: 0,
        locationCount: 0,
        eventCount: 0,
        alertCount: 0,
        evidenceCount: 0,
      },
    };
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
