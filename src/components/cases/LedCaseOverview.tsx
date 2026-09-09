// Case Detail experience for a real LED case (one whose case_id, e.g.
// "CASE-0001427", exists in the self-hosted PostgreSQL `cases` table —
// never a Supabase analyst case). Rendered by CaseDashboardPage in place
// of the Supabase-oriented overview when `activeCase.isLedCase` is true;
// the Supabase rendering path below it is completely untouched.
//
// Data flow: FRAGMENTED RECORDS (case_narrative_notes rows) -> CASE
// (grouped by case_id, never by title -- two LED cases here share the
// title "Operation Steel Summit") -> CHRONOLOGICAL INVESTIGATIVE STORY
// (People of Interest + Connection Basis + Timeline preview below) ->
// CONNECTED INTELLIGENCE (each person links out to the existing Person
// View, which is untouched, to inspect their full Master Dataset record).
//
// This intentionally does NOT duplicate the underlying Master Dataset: the
// narrative endpoint only ever supplies the case-level investigative
// story (who's connected and why, what happened when); evidence/alerts/
// investigations are shown as counts only, sourced from the same single
// GET /api/cases/:caseId fetch, not a second copy of those tables.
import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Fingerprint, FolderLock, Bell, Search } from 'lucide-react';
import { Panel } from '../ui/Panel';
import { LoadingState } from '../ui/LoadingState';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import { PersonAvatar } from '../ui/EntityImage';
import { personImage } from '../../config/imageAssets';
import { riskBadgeClass } from '../../utils/entityMeta';
import {
  caseNarrativeService,
  formatNarrativeDate,
  type ApiLedCaseDetail,
  type CaseNarrativeNote,
} from '../../services/caseNarrativeService';
import { ApiUnavailableError } from '../../services/apiClient';

type LoadStatus = 'loading' | 'ready' | 'empty' | 'error';

export function LedCaseOverview({ caseId }: { caseId: string }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [detail, setDetail] = useState<ApiLedCaseDetail | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    caseNarrativeService
      .getLedCaseDetail(caseId)
      .then((d) => {
        if (cancelled) return;
        if (!d) {
          setStatus('error');
          setErrorMessage('This case could not be found.');
          return;
        }
        setDetail(d);
        setStatus(d.narrative.length === 0 && d.persons.length === 0 ? 'empty' : 'ready');
      })
      .catch((err) => {
        if (cancelled) return;
        setErrorMessage(err instanceof ApiUnavailableError ? 'The intelligence backend is currently unreachable.' : 'Case intelligence could not be loaded.');
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [caseId]);

  if (status === 'loading') return <LoadingState label="Loading case intelligence" />;
  if (status === 'error') {
    return (
      <ErrorState
        title="CASE INTELLIGENCE UNAVAILABLE"
        message={errorMessage ?? 'Case intelligence could not be loaded.'}
        onRetry={() => {
          caseNarrativeService.clearCache(caseId);
          setStatus('loading');
          caseNarrativeService
            .getLedCaseDetail(caseId)
            .then((d) => {
              setDetail(d);
              setStatus(d ? (d.narrative.length === 0 && d.persons.length === 0 ? 'empty' : 'ready') : 'error');
            })
            .catch(() => setStatus('error'));
        }}
      />
    );
  }
  if (!detail) return null;

  const connectionBasisByPerson = new Map<string, CaseNarrativeNote>();
  for (const note of detail.narrative) {
    if (note.kind === 'CONNECTION_BASIS' && note.person_id) connectionBasisByPerson.set(note.person_id, note);
  }
  const timelineNotes = detail.narrative
    .filter((n) => n.kind === 'TIMELINE_EVENT')
    .sort((a, b) => `${a.event_date ?? ''}T${a.event_time ?? ''}`.localeCompare(`${b.event_date ?? ''}T${b.event_time ?? ''}`));
  const timelinePreview = timelineNotes.slice(0, 8);

  return (
    <div className="scroll-region page-container" style={{ height: '100%' }}>
      <div className="row gap-3" style={{ marginBottom: 16, flexWrap: 'wrap' }}>
        <StatTile icon={<Search size={15} />} label="People of Interest" value={detail.persons.length} />
        <StatTile icon={<Clock size={15} />} label="Timeline Events" value={timelineNotes.length} />
        <StatTile icon={<FolderLock size={15} />} label="Evidence on File" value={detail.evidence.length} />
        <StatTile icon={<Bell size={15} />} label="Alerts" value={detail.alerts.length} />
        <StatTile icon={<Fingerprint size={15} />} label="Investigations" value={detail.investigations.length} />
      </div>

      <div className="row gap-3" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <Panel title="CASE OVERVIEW" className="fade-in" style={{ flex: 1, minWidth: 280 }}>
          <div className="stack gap-2">
            <OverviewRow label="LED Case #" value={detail.case_number} />
            <OverviewRow label="Case Type" value={titleCase(detail.case_type)} />
            <OverviewRow label="Opened" value={formatNarrativeDate(detail.opened_date)} />
            <OverviewRow label="Closed" value={detail.closed_date ? formatNarrativeDate(detail.closed_date) : 'Ongoing'} />
          </div>
        </Panel>

        <Panel
          title={`PEOPLE OF INTEREST (${detail.persons.length})`}
          className="fade-in"
          style={{ flex: 1.4, minWidth: 320 }}
        >
          {detail.persons.length === 0 ? (
            <EmptyState title="No people of interest on file for this case." />
          ) : (
            <div className="stack gap-2">
              {detail.persons.map((p) => {
                const basis = connectionBasisByPerson.get(p.person_id);
                return (
                  <button
                    key={p.person_id}
                    type="button"
                    className="case-entity-row"
                    style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, textAlign: 'left', cursor: 'pointer', padding: '8px 10px', color: 'inherit' }}
                    onClick={() => navigate(`/cases/${caseId}/person/${p.person_id}`)}
                  >
                    <div className="row gap-2">
                      <PersonAvatar personId={p.person_id} name={p.name} src={personImage(p.person_id, p.name)} size={26} />
                      <div className="stack" style={{ flex: 1, minWidth: 0 }}>
                        <div className="row gap-2" style={{ justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 12.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                          <span className={riskBadgeClass((p.risk_level ?? 'unknown').toLowerCase())} style={{ fontSize: 9.5, flexShrink: 0 }}>
                            {(p.risk_level ?? 'unknown').toLowerCase()}
                          </span>
                        </div>
                        <span className="text-muted mono" style={{ fontSize: 10 }}>{p.person_id}</span>
                        {basis && (
                          <div className="stack" style={{ marginTop: 4, borderLeft: '2px solid var(--border-active)', paddingLeft: 8 }}>
                            <span className="system-label" style={{ fontSize: 9.5 }}>CONNECTION BASIS</span>
                            <span className="text-secondary" style={{ fontSize: 11, lineHeight: 1.35 }}>{basis.text}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </Panel>
      </div>

      <Panel
        title="CHRONOLOGICAL TIMELINE"
        className="fade-in"
        style={{ marginTop: 16 }}
        actions={
          timelineNotes.length > 0 ? (
            <button className="btn btn-sm" type="button" onClick={() => navigate(`/cases/${caseId}/timeline`)}>
              OPEN FULL TIMELINE
            </button>
          ) : undefined
        }
      >
        {timelinePreview.length === 0 ? (
          <EmptyState title="No narrative events available for this case." />
        ) : (
          <div className="stack" style={{ position: 'relative', paddingLeft: 20, borderLeft: '2px solid var(--border)' }}>
            {timelinePreview.map((note) => (
              <NarrativeTimelineRow key={note.id} note={note} caseId={caseId} onOpenPerson={(pid) => navigate(`/cases/${caseId}/person/${pid}`)} />
            ))}
            {timelineNotes.length > timelinePreview.length && (
              <button
                type="button"
                className="text-muted"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11.5, padding: '6px 0', textAlign: 'left' }}
                onClick={() => navigate(`/cases/${caseId}/timeline`)}
              >
                + {timelineNotes.length - timelinePreview.length} more events in full Timeline
              </button>
            )}
          </div>
        )}
      </Panel>
    </div>
  );
}

function NarrativeTimelineRow({
  note, onOpenPerson,
}: {
  note: CaseNarrativeNote;
  caseId: string;
  onOpenPerson: (personId: string) => void;
}) {
  const time = note.event_time; // "HH:MM:SS" or null — never parsed as a Date
  return (
    <div className="stack" style={{ marginBottom: 12, marginLeft: -29, paddingLeft: 29 }}>
      <div className="row gap-2" style={{ alignItems: 'baseline' }}>
        <span className="text-cyan mono" style={{ fontSize: 10.5 }}>{formatNarrativeDate(note.event_date)}</span>
        <span className="text-muted mono" style={{ fontSize: 10 }}>{time ?? 'Time unavailable'}</span>
      </div>
      <span className="text-secondary" style={{ fontSize: 12, lineHeight: 1.4 }}>{note.text}</span>
      <div className="row gap-2" style={{ marginTop: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        {note.person_id && (
          <button
            type="button"
            className="badge badge-neutral"
            style={{ fontSize: 9.5, border: 'none', cursor: 'pointer' }}
            onClick={() => onOpenPerson(note.person_id as string)}
          >
            {note.person_id}
          </button>
        )}
        {note.source_ref && <span className="text-muted mono" style={{ fontSize: 9 }}>Source: {note.source_ref}</span>}
      </div>
    </div>
  );
}

function OverviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="row" style={{ justifyContent: 'space-between', fontSize: 12 }}>
      <span className="text-muted">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function StatTile({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="panel" style={{ padding: '10px 16px', flex: 1, minWidth: 150, display: 'flex', alignItems: 'center', gap: 10 }}>
      <span className="text-cyan">{icon}</span>
      <div className="stack">
        <span className="value-large">{value}</span>
        <span className="system-label">{label}</span>
      </div>
    </div>
  );
}

function titleCase(s: string): string {
  return s.replace(/_/g, ' ').replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
}
