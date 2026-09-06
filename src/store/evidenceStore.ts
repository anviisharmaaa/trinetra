import { create } from 'zustand';
import type { Evidence, Alert } from '../types';
import { evidenceService } from '../services/evidenceService';

interface EvidenceState {
  status: 'idle' | 'loading' | 'ready' | 'error';
  evidence: Evidence[];
  alerts: Alert[];
  loadCase: (caseId: string) => Promise<void>;
  acknowledgeAlert: (id: string) => void;
}

export const useEvidenceStore = create<EvidenceState>((set) => ({
  status: 'idle',
  evidence: [],
  alerts: [],
  loadCase: async (caseId) => {
    set({ status: 'loading' });
    try {
      const [evidence, alerts] = await Promise.all([
        evidenceService.listByCase(caseId),
        evidenceService.listAlerts(caseId),
      ]);
      set({ evidence, alerts, status: 'ready' });
    } catch {
      set({ status: 'error' });
    }
  },
  acknowledgeAlert: (id) => set((s) => ({ alerts: s.alerts.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)) })),
}));
