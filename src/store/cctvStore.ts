import { create } from 'zustand';
import type { Camera, CCTVEvent } from '../types';
import { cctvService } from '../services/cctvService';

interface CCTVState {
  status: 'idle' | 'loading' | 'ready' | 'error';
  error: string | null;
  caseId: string | null;
  cameras: Camera[];
  events: CCTVEvent[];

  loadCase: (caseId: string) => Promise<void>;
}

export const useCCTVStore = create<CCTVState>((set) => ({
  status: 'idle',
  error: null,
  caseId: null,
  cameras: [],
  events: [],

  loadCase: async (caseId) => {
    set({ status: 'loading', error: null });
    try {
      const [cameras, events] = await Promise.all([
        cctvService.listCameras(caseId),
        cctvService.listEvents(caseId),
      ]);
      set({ cameras, events, status: 'ready', caseId });
    } catch {
      set({ status: 'error', error: 'CCTV_ARCHIVE_03 UNAVAILABLE' });
    }
  },
}));
