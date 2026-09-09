import { create } from 'zustand';
import { caseService } from '../services/caseService';

interface CaseIntelligenceState {
  activeCaseId: string | null;
  victimIds: string[];
  suspectIds: string[];
  relatedPersonIds: string[];
  allPersonIds: string[];
  loading: boolean;
  error: string | null;
  loadCase: (caseId: string) => Promise<void>;
  reset: () => void;
}

export const useCaseIntelligenceStore = create<CaseIntelligenceState>((set) => ({
  activeCaseId: null,
  victimIds: [],
  suspectIds: [],
  relatedPersonIds: [],
  allPersonIds: [],
  loading: false,
  error: null,

  loadCase: async (caseId: string) => {
    set({ activeCaseId: caseId, loading: true, error: null });
    try {
      const ids = await caseService.getCasePersonIds(caseId);
      set({
        activeCaseId: caseId,
        victimIds: ids.victimIds,
        suspectIds: ids.suspectIds,
        relatedPersonIds: ids.relatedPersonIds,
        allPersonIds: ids.allPersonIds,
        loading: false,
        error: null,
      });
    } catch {
      set({
        activeCaseId: caseId,
        victimIds: [],
        suspectIds: [],
        relatedPersonIds: [],
        allPersonIds: [],
        loading: false,
        error: 'CASE INTELLIGENCE UNAVAILABLE',
      });
    }
  },

  reset: () => set({
    activeCaseId: null,
    victimIds: [],
    suspectIds: [],
    relatedPersonIds: [],
    allPersonIds: [],
    loading: false,
    error: null,
  }),
}));
