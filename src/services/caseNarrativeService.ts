// Real-backend case-narrative data access — talks to the Express API in
// server/ (server/ingest_case_narrative.py -> Postgres `case_narrative_notes`
// -> GET /api/cases/:caseId and GET /api/cases/:caseId/narrative) rather than
// the Supabase analyst-case system in caseService.ts. This is the ONLY
// service that reads case_narrative_notes — it never duplicates those rows
// into another store; every read goes through the two module-level caches
// below, so a given case's detail/narrative is fetched at most once per
// page session no matter how many components (Case Detail, Timeline) ask
// for it.
//
// Case ID is always the authoritative key here (e.g. "CASE-0001427") —
// never the case title, which is not unique (two LED cases in this dataset
// are both titled "Operation Steel Summit"). Likewise every narrative note
// carries `person_id`, never a bare name, for linking to the Person View.
import { apiGet, NotFoundError } from './apiClient';
import type { TimelineEvent, TimelineEventType } from '../types';

export type CaseNarrativeKind = 'CONNECTION_BASIS' | 'TIMELINE_EVENT';

/** Mirrors server/schema.sql's case_narrative_notes exactly. event_date is
 * a plain "YYYY-MM-DD" string and event_time a plain "HH:MM:SS" string (or
 * null) — see server/index.js's DATE type-parser fix. Never pass either
 * through `new Date()`; use formatNarrativeDate/formatNarrativeTime below,
 * which parse them as plain text. */
export interface CaseNarrativeNote {
  id: string;
  case_id: string;
  person_id: string | null;
  kind: CaseNarrativeKind;
  event_date: string | null;
  event_time: string | null;
  text: string;
  source_ref: string | null;
  created_at: string;
}

export interface ApiLedCasePersonRef {
  person_id: string;
  name: string;
  risk_level: string | null;
  status: string | null;
}

/** Raw shape of GET /api/cases/:caseId (server/index.js). evidence / alerts
 * / investigations are the case's existing Master Dataset rows — surfaced
 * here only as counts (see LedCaseOverview), never duplicated in full,
 * since the narrative endpoint is specifically for the case-level
 * investigative story, not a second copy of the Master Dataset. */
export interface ApiLedCaseDetail {
  case_id: string;
  case_number: string;
  title: string;
  case_type: string;
  priority: string;
  status: string;
  opened_date: string | null;
  closed_date: string | null;
  persons: ApiLedCasePersonRef[];
  evidence: unknown[];
  alerts: unknown[];
  investigations: unknown[];
  narrative: CaseNarrativeNote[];
}

// Module-level caches (per page session): each caseId's full detail and/or
// narrative list is fetched over the network at most once, then reused by
// every caller (Case Detail overview, Timeline, Person View activity,
// however many times they ask) — see item 12 (no repeated narrative
// fetches per timeline card).
const caseDetailCache = new Map<string, Promise<ApiLedCaseDetail | null>>();
const narrativeCache = new Map<string, Promise<CaseNarrativeNote[]>>();

export const caseNarrativeService = {
  /** Full LED case row (case metadata + persons + narrative), from
   * GET /api/cases/:caseId. Returns null if this case_id doesn't exist in
   * Postgres (a 404) rather than throwing, so callers can treat "not an
   * LED case" the same as "not found" — a genuinely unreachable backend
   * still throws (ApiUnavailableError), which callers should surface as
   * an error state, not silently as "not found". */
  async getLedCaseDetail(caseId: string): Promise<ApiLedCaseDetail | null> {
    if (!caseDetailCache.has(caseId)) {
      const promise = apiGet<ApiLedCaseDetail>(`/api/cases/${encodeURIComponent(caseId)}`).catch((err) => {
        caseDetailCache.delete(caseId); // don't cache a transient failure
        if (err instanceof NotFoundError) return null;
        throw err;
      });
      caseDetailCache.set(caseId, promise);
    }
    return caseDetailCache.get(caseId)!;
  },

  /** Narrative notes for a case, optionally filtered by kind. Reuses the
   * full-detail cache above when it's already been fetched (it embeds
   * `narrative`), so viewing Case Detail then Timeline for the same case
   * never issues two separate requests just to get the same rows twice. */
  async getCaseNarrative(caseId: string, kind?: CaseNarrativeKind): Promise<CaseNarrativeNote[]> {
    if (caseDetailCache.has(caseId)) {
      const detail = await caseDetailCache.get(caseId)!;
      if (detail) return kind ? detail.narrative.filter((n) => n.kind === kind) : detail.narrative;
    }
    if (!narrativeCache.has(caseId)) {
      const promise = apiGet<{ data: CaseNarrativeNote[] }>(`/api/cases/${encodeURIComponent(caseId)}/narrative`)
        .then((res) => res.data)
        .catch((err) => {
          narrativeCache.delete(caseId);
          if (err instanceof NotFoundError) return [];
          throw err;
        });
      narrativeCache.set(caseId, promise);
    }
    const all = await narrativeCache.get(caseId)!;
    return kind ? all.filter((n) => n.kind === kind) : all;
  },

  /** Clears the cache — not used in normal operation (data is static for
   * the life of a page session); exposed for tests / manual refresh. */
  clearCache(caseId?: string) {
    if (caseId) {
      caseDetailCache.delete(caseId);
      narrativeCache.delete(caseId);
    } else {
      caseDetailCache.clear();
      narrativeCache.clear();
    }
  },
};

// ---------------------------------------------------------------------------
// Timezone-safe date/time formatting. event_date/event_time are plain
// "YYYY-MM-DD" / "HH:MM:SS" text from Postgres — these helpers parse them
// with regex/string-slicing only and NEVER construct a `Date` object, so
// the calendar date shown is always exactly the date the backend supplied,
// regardless of the investigator's browser timezone.
// ---------------------------------------------------------------------------

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2014-01-23" -> "23 Jan 2014". Never touches `Date` — pure string/regex
 * parsing, immune to timezone shifting. Falls back to the raw string (never
 * throws) if the input doesn't match the expected shape. */
export function formatNarrativeDate(isoDate: string | null | undefined): string {
  if (!isoDate) return 'Date unavailable';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate);
  if (!m) return isoDate;
  const [, y, mo, d] = m;
  const monthName = MONTH_NAMES[parseInt(mo, 10) - 1] ?? mo;
  return `${d} ${monthName} ${y}`;
}

/** "22:20:13" -> "22:20:13" (validated passthrough); null -> null (caller
 * shows a "Time unavailable" treatment). Never touches `Date`. */
export function formatNarrativeTime(hms: string | null | undefined): string | null {
  if (!hms) return null;
  const m = /^(\d{2}):(\d{2}):(\d{2})/.exec(hms);
  return m ? `${m[1]}:${m[2]}:${m[3]}` : hms;
}

// ---------------------------------------------------------------------------
// Event-category derivation (item 8): the narrative text already starts
// with a plain-English category ("Transaction ...", "Call ...", "CCTV
// ...", etc.) — no NLP classifier, just a prefix match against the
// existing TimelineEventType union, with a generic fallback. Categories
// are never invented beyond what appears in the text.
// ---------------------------------------------------------------------------

const CATEGORY_RULES: { prefix: RegExp; type: TimelineEventType; label: string }[] = [
  { prefix: /^transaction\b/i, type: 'transaction', label: 'Transaction' },
  { prefix: /^call\b/i, type: 'call', label: 'Call' },
  { prefix: /^cctv\b/i, type: 'cctv', label: 'CCTV' },
  { prefix: /^face match\b/i, type: 'cctv', label: 'Face Match' },
  { prefix: /^travel\b/i, type: 'movement', label: 'Travel' },
  { prefix: /^evidence\b/i, type: 'document', label: 'Evidence' },
  { prefix: /^alert\b/i, type: 'alert', label: 'Alert' },
  { prefix: /^(incident|fir|investigation|led case)\b/i, type: 'case', label: 'Investigation' },
];

export function deriveNarrativeCategory(text: string): { type: TimelineEventType; label: string } {
  for (const rule of CATEGORY_RULES) {
    if (rule.prefix.test(text)) return { type: rule.type, label: rule.label };
  }
  return { type: 'case', label: 'Investigation Event' };
}

/** A domain reference embedded in the narrative text (e.g. "TXN-0239671",
 * "CALL-0001234"), if any — used both for the event title and to
 * de-duplicate against the same record already surfaced as a live
 * Master Dataset timeline event (see timelineStore.loadCase). */
export function extractNarrativeRef(text: string): string | null {
  const m = /\b([A-Z]{2,8}-\d{3,})\b/.exec(text);
  return m ? m[1] : null;
}

function deriveNarrativeTitle(text: string): string {
  const { label } = deriveNarrativeCategory(text);
  const ref = extractNarrativeRef(text);
  return ref ? `${label} · ${ref}` : label;
}

/** Converts one TIMELINE_EVENT narrative note into the app's generic
 * TimelineEvent shape, for merging into the existing unified Timeline
 * (timelineStore). `timestamp` is a plain local "YYYY-MM-DDTHH:MM:SS"
 * string (never UTC-suffixed) purely so the existing string-based
 * `.localeCompare` sort in timelineStore orders it correctly next to
 * every other event — it is never fed to `formatDate`/`formatTime` for
 * display; `displayDate`/`displayTime` (timezone-safe) are used for that
 * instead (see TimelinePage). */
export function narrativeNoteToTimelineEvent(note: CaseNarrativeNote, caseId: string): TimelineEvent {
  const category = deriveNarrativeCategory(note.text);
  const datePart = note.event_date ?? '0001-01-01';
  const timePart = note.event_time ?? '00:00:00';
  return {
    id: note.id,
    caseId,
    timestamp: `${datePart}T${timePart}`,
    title: deriveNarrativeTitle(note.text),
    description: note.text,
    entityIds: note.person_id ? [note.person_id] : [],
    eventType: category.type,
    source: 'Case Narrative',
    importance: 'medium',
    displayDate: formatNarrativeDate(note.event_date),
    displayTime: note.event_time,
    sourceRef: note.source_ref ?? undefined,
  };
}
