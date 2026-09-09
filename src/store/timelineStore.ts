import { create } from 'zustand';
import type { TimelineEvent, TimelineEventType } from '../types';
import { timelineService } from '../services/timelineService';
import { personService } from '../services/personService';
import { ApiUnavailableError } from '../services/apiClient';
import { caseNarrativeService, extractNarrativeRef, narrativeNoteToTimelineEvent } from '../services/caseNarrativeService';

interface TimelineState {
  status: 'idle' | 'loading' | 'ready' | 'error';
  error: string | null;
  events: TimelineEvent[];
  zoom: 'day' | 'week' | 'month' | 'all';
  activeTypes: Set<TimelineEventType>;
  selectedEventId: string | null;

  /** `realPersonIds`: Person IDs linked to this case that live in the real
   * Master Dataset backend, not the small in-memory demo dataset — see
   * TimelinePage, which derives this the same way NetworkAnalysisPage does. */
  loadCase: (caseId: string, entityId?: string, realPersonIds?: string[]) => Promise<void>;
  setZoom: (z: TimelineState['zoom']) => void;
  toggleType: (t: TimelineEventType) => void;
  selectEvent: (id: string | null) => void;
}

const ALL_TYPES: TimelineEventType[] = ['call', 'message', 'movement', 'transaction', 'cctv', 'social', 'document', 'meeting', 'alert', 'case'];

export const useTimelineStore = create<TimelineState>((set) => ({
  status: 'idle',
  error: null,
  events: [],
  zoom: 'all',
  activeTypes: new Set(ALL_TYPES),
  selectedEventId: null,

  loadCase: async (caseId, entityId, realPersonIds = []) => {
    set({ status: 'loading', error: null });
    try {
      const mockEvents = await timelineService.listByCase(caseId, entityId ? { entityId } : undefined);

      // A specific entity was requested (e.g. Person View filtering to one
      // subject) — only pull that person's live timeline, if they're one of
      // the case's real Person IDs; otherwise pull every real person linked
      // to the case, same as the mock behavior it's merged with.
      const targets = entityId ? realPersonIds.filter((id) => id === entityId) : realPersonIds;
      let liveEvents: TimelineEvent[] = [];
      if (targets.length > 0) {
        const results = await Promise.all(targets.map((id) => personService.getTimeline(id)));
        liveEvents = results.flat().map((ev) => ({ ...ev, caseId }));
      }

      // LED case-narrative timeline events (case_narrative_notes, kind =
      // TIMELINE_EVENT) — fetched once per case (cached in
      // caseNarrativeService, shared with Case Detail's overview) and
      // merged in alongside the mock/live events above. This is a no-op
      // for every non-LED case: getCaseNarrative resolves to [] (a 404
      // from the backend), never an error, so it never blocks or degrades
      // the existing mock/live timeline.
      let narrativeEvents: TimelineEvent[] = [];
      try {
        const notes = await caseNarrativeService.getCaseNarrative(caseId, 'TIMELINE_EVENT');
        const relevant = entityId ? notes.filter((n) => n.person_id === entityId) : notes;
        narrativeEvents = relevant.map((n) => narrativeNoteToTimelineEvent(n, caseId));
      } catch {
        narrativeEvents = [];
      }

      // De-dup: a narrative note that describes a structured record already
      // present as a live Master Dataset event (same embedded reference,
      // e.g. "TXN-0239671", which is exactly that live event's `id`) is
      // dropped in favor of the live, fully-structured record — narrative
      // note ids (CNOTE-...) are stable and otherwise never collide with
      // anything.
      const liveIds = new Set(liveEvents.map((e) => e.id));
      const dedupedNarrative = narrativeEvents.filter((e) => {
        const ref = extractNarrativeRef(e.description ?? '');
        return !ref || !liveIds.has(ref);
      });

      const events = [...mockEvents, ...liveEvents, ...dedupedNarrative].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
      set({ events, status: 'ready' });
    } catch (err) {
      // A real case whose backend is unreachable gets an explicit error
      // state (see TimelinePage) rather than silently showing only
      // whatever mock data happened to exist for this case.
      const message = err instanceof ApiUnavailableError
        ? 'MASTER DATASET BACKEND UNAVAILABLE'
        : 'Unable to load chronological event data.';
      set({ status: 'error', error: message });
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
