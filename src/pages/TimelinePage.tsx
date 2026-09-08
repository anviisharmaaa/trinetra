import { useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Phone, MessageSquare, MapPin, IndianRupee, Camera, Share2, FileText, Users, Bell, Briefcase } from 'lucide-react';
import { useTimelineStore, ALL_TIMELINE_TYPES } from '../store/timelineStore';
import { useInvestigationStore } from '../store/investigationStore';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { getEntityById } from '../data';
import type { TimelineEvent, TimelineEventType } from '../types';
import { formatDate, formatTime } from '../utils/formatters';

const TYPE_ICON: Record<TimelineEventType, typeof Phone> = {
  call: Phone, message: MessageSquare, movement: MapPin, transaction: IndianRupee,
  cctv: Camera, social: Share2, document: FileText, meeting: Users, alert: Bell, case: Briefcase,
};

export function TimelinePage() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { status, events, zoom, activeTypes, selectedEventId, loadCase, setZoom, toggleType, selectEvent } = useTimelineStore();
  const { selectEntity, selectLocation, selectTimestamp } = useInvestigationStore();
  const highlightRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => { if (caseId) loadCase(caseId); }, [caseId, loadCase]);

  // Deep-link support for "View in Timeline" from CCTV: `?event=TL-XXX`
  // selects and scrolls to that entry once events are loaded.
  const eventParam = searchParams.get('event');
  useEffect(() => {
    if (!eventParam || status !== 'ready') return;
    const match = events.find((e) => e.id === eventParam);
    if (!match) return;
    handleSelect(match);
    requestAnimationFrame(() => highlightRefs.current.get(match.id)?.scrollIntoView({ block: 'center', behavior: 'smooth' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventParam, status, events]);

  const filtered = useMemo(() => {
    let list = events.filter((e) => activeTypes.has(e.eventType));
    if (zoom !== 'all' && list.length) {
      const latest = new Date(list[list.length - 1].timestamp).getTime();
      const windowMs = zoom === 'day' ? 86400000 : zoom === 'week' ? 7 * 86400000 : 30 * 86400000;
      list = list.filter((e) => latest - new Date(e.timestamp).getTime() <= windowMs);
    }
    return list;
  }, [events, activeTypes, zoom]);

  if (status === 'loading' || status === 'idle') return <LoadingState label="RECONSTRUCTING TIMELINE" />;
  if (status === 'error') return <ErrorState title="TIMELINE UNAVAILABLE" message="Unable to load chronological event data." onRetry={() => caseId && loadCase(caseId)} />;

  function handleSelect(ev: TimelineEvent) {
    selectEvent(ev.id);
    selectTimestamp(ev.timestamp);
    if (ev.entityIds[0]) selectEntity(ev.entityIds[0]);
    if (ev.locationId) selectLocation(ev.locationId);
  }

  let lastDay = '';

  return (
    <div className="stack" style={{ height: '100%' }}>
      <div className="row" style={{ justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
        <div className="row gap-1">
          {(['day', 'week', 'month', 'all'] as const).map((z) => (
            <button key={z} type="button" className={`tab ${zoom === z ? 'active' : ''}`} onClick={() => setZoom(z)}>{z.toUpperCase()}</button>
          ))}
        </div>
        <div className="row gap-2" style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {ALL_TIMELINE_TYPES.map((t) => {
            const Icon = TYPE_ICON[t];
            const on = activeTypes.has(t);
            return (
              <button
                key={t}
                type="button"
                className="filter-chip"
                aria-pressed={on}
                style={{ opacity: on ? 1 : 0.4, display: 'flex', alignItems: 'center', gap: 4 }}
                onClick={() => toggleType(t)}
              >
                <Icon size={11} /> {t.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="scroll-region" style={{ flex: 1, padding: '16px 24px' }}>
        {filtered.length === 0 ? (
          <EmptyState title="No events in this window" hint="Try widening the zoom range or enabling more event types." />
        ) : (
          <div className="stack" style={{ position: 'relative', paddingLeft: 20, borderLeft: '2px solid var(--border)' }}>
            {filtered.map((ev) => {
              const day = formatDate(ev.timestamp);
              const showDay = day !== lastDay;
              lastDay = day;
              const Icon = TYPE_ICON[ev.eventType];
              const loc = ev.locationId ? getEntityById(ev.locationId) : undefined;
              return (
                <div key={ev.id}>
                  {showDay && <div className="text-muted mono" style={{ fontSize: 10.5, margin: '14px 0 6px -20px', paddingLeft: 0 }}>{day}</div>}
                  <button
                    ref={(el) => { if (el) highlightRefs.current.set(ev.id, el); else highlightRefs.current.delete(ev.id); }}
                    type="button"
                    className="row gap-3"
                    style={{
                      width: '100%', textAlign: 'left', padding: '10px 12px', marginLeft: -29, marginBottom: 4, cursor: 'pointer',
                      background: selectedEventId === ev.id ? 'var(--cyan-glow)' : 'transparent',
                      border: '1px solid ' + (selectedEventId === ev.id ? 'var(--cyan-dim)' : 'transparent'),
                      borderRadius: 4, color: 'inherit',
                    }}
                    onClick={() => handleSelect(ev)}
                  >
                    <span
                      style={{
                        width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: ev.importance === 'high' ? 'var(--danger-glow, rgba(228,92,104,0.18))' : 'var(--bg-2)',
                        border: '1px solid ' + (ev.importance === 'high' ? 'var(--danger)' : 'var(--border-active)'), flexShrink: 0,
                      }}
                    >
                      <Icon size={11} color={ev.importance === 'high' ? 'var(--danger)' : 'var(--cyan)'} />
                    </span>
                    <div className="stack" style={{ minWidth: 0, flex: 1 }}>
                      <div className="row" style={{ justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 12.5, fontWeight: 600 }}>{ev.title}</span>
                        <span className="text-muted mono" style={{ fontSize: 10.5 }}>{formatTime(ev.timestamp)}</span>
                      </div>
                      {ev.description && <span className="text-secondary" style={{ fontSize: 11.5 }}>{ev.description}</span>}
                      <div className="row gap-2" style={{ marginTop: 2, flexWrap: 'wrap' }}>
                        {ev.entityIds.map((id) => {
                          const ent = getEntityById(id);
                          return <span key={id} className="badge badge-neutral" style={{ fontSize: 9.5 }}>{ent?.name ?? id}</span>;
                        })}
                        {loc && (
                          <button
                            type="button"
                            className="badge badge-info"
                            style={{ fontSize: 9.5, border: 'none', cursor: 'pointer' }}
                            onClick={(e) => { e.stopPropagation(); selectLocation(loc.id); navigate(`/cases/${caseId}/location`); }}
                          >
                            <MapPin size={9} style={{ marginRight: 3, verticalAlign: -1 }} />{loc.name}
                          </button>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
