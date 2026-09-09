export type TimelineEventType =
  | 'call' | 'message' | 'movement' | 'transaction' | 'cctv' | 'social' | 'document' | 'meeting' | 'alert' | 'case';

export interface TimelineEvent {
  id: string;
  caseId: string;
  timestamp: string;
  title: string;
  description?: string;
  entityIds: string[];
  locationId?: string;
  eventType: TimelineEventType;
  source: string;
  importance: 'high' | 'medium' | 'low';

  // ---- Optional, set only for events derived from case_narrative_notes
  // (see caseNarrativeService.narrativeNoteToTimelineEvent). Every existing
  // TimelineEvent producer (mockTimeline, personService.getTimeline) simply
  // omits these, so nothing about them changes. ----
  /** Pre-formatted, timezone-safe calendar date (e.g. "23 Jan 2014") --
   * derived by parsing the backend's plain "YYYY-MM-DD" string directly,
   * never via `new Date()`. When present, TimelinePage shows this instead
   * of formatDate(timestamp). */
  displayDate?: string;
  /** Pre-formatted "HH:MM:SS", or null when the source record had no
   * time-of-day (TimelinePage then shows a "Time unavailable" treatment
   * rather than defaulting to midnight). Only meaningful when `displayDate`
   * is also set. */
  displayTime?: string | null;
  /** Subtle source-traceability string (e.g. "TRINETRA_Case_Data.xlsx!
   * Case_01_Financial_Fraud!row339"), shown only when present. */
  sourceRef?: string;
}
