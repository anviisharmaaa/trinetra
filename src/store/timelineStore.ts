import { create } from 'zustand';
import type { TimelineEvent, TimelineEventType } from '../types';
import { timelineService } from '../services/timelineService';

interface TimelineState {
  status: 'idle' | 'loading' | 'ready' | 'error';
  events: TimelineEvent[];
  zoom: 'day' | 'week' | 'month' | 'all';
  activeTypes: Set<TimelineEventType>;
  selectedEventId: string | null;

  loadCase: (caseId: string, entityId?: string) => Promise<void>;
  setZoom: (z: TimelineState['zoom']) => void;
  toggleType: (t: TimelineEventType) => void;
  selectEvent: (id: string | null) => void;
}

const ALL_TYPES: TimelineEventType[] = ['call', 'message', 'movement', 'transaction', 'cctv', 'social', 'document', 'meeting', 'alert', 'case'];

export const useTimelineStore = create<TimelineState>((set) => ({
  status: 'idle',
  events: [],
  zoom: 'all',
  activeTypes: new Set(ALL_TYPES),
  selectedEventId: null,

  loadCase: async (caseId, entityId) => {
    set({ status: 'loading' });
    try {
      const events = await timelineService.listByCase(caseId, entityId ? { entityId } : undefined);
      set({ events, status: 'ready' });
    } catch {
      set({ status: 'error' });
    }
  },
  setZoom: (z) => set({ zoom: z }),
  toggleType: (t) =>
    set((s) => {
      const next = new Set(s.activeTypes);
      if (next.has(t)) next.delete(t); else next.add(t);
      return { activeTypes: next };
    }),
  selectEvent: (id) => set({ selectedEventId: id }),
}));

export { ALL_TYPES as ALL_TIMELINE_TYPES };
