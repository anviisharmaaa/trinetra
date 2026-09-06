import { useNavigate, useParams } from 'react-router-dom';
import { History, ShieldCheck } from 'lucide-react';
import type { CCTVEvent } from '../../types';
import { getEntityById } from '../../data';
import { formatDateTime, titleCase } from '../../utils/formatters';
import { findTimelineEventForTimestamp } from '../../utils/crossModuleLinks';

/**
 * Detail strip for whichever CCTV event is currently selected — the data
 * the event timeline cards are too small to show in full (description,
 * exact confidence, every linked entity) plus the two cross-module jumps
 * the spec calls out: from this exact camera+event straight into Timeline,
 * and straight into the Evidence record it was promoted to, when one
 * exists.
 */
export function CCTVEventDetails({ event }: { event: CCTVEvent | null }) {
  const navigate = useNavigate();
  const { caseId } = useParams();

  if (!event) {
    return <div className="text-muted" style={{ fontSize: 12, padding: '8px 12px' }}>No event selected.</div>;
  }

  const entities = event.entityIds.map(getEntityById).filter(Boolean);
  const timelineMatch = caseId ? findTimelineEventForTimestamp(caseId, event.timestamp) : undefined;

  return (
    <div className="row gap-3" style={{ padding: '8px 12px', alignItems: 'center', flexWrap: 'wrap' }}>
      <div className="stack" style={{ gap: 1, minWidth: 0 }}>
        <span className="mono text-cyan" style={{ fontSize: 11 }}>{event.id} · {event.cameraId}</span>
        <span className="text-muted mono" style={{ fontSize: 10 }}>{formatDateTime(event.timestamp)}</span>
      </div>
      <span className="badge badge-info">{titleCase(event.eventType)}</span>
      <span className="badge badge-neutral">{Math.round(event.confidence * 100)}% confidence</span>
      {entities.length > 0 && (
        <div className="row gap-1" style={{ flexWrap: 'wrap' }}>
          {entities.map((e) => e && <span key={e.id} className="badge badge-neutral">{e.name}</span>)}
        </div>
      )}
      <div className="row gap-2" style={{ marginLeft: 'auto' }}>
        {timelineMatch && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => navigate(`/cases/${caseId}/timeline?event=${timelineMatch.id}`)}
          >
            <History size={12} /> VIEW IN TIMELINE
          </button>
        )}
        {event.evidenceRef && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => navigate(`/cases/${caseId}/evidence?item=${event.evidenceRef}`)}
          >
            <ShieldCheck size={12} /> VIEW IN EVIDENCE
          </button>
        )}
      </div>
    </div>
  );
}
