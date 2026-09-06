import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Evidence, LocationEntity, TimelineEvent } from '../../types';
import { EvidenceThumb } from '../ui/EntityImage';
import { evidenceImage } from '../../config/imageAssets';
import { formatRelativeTime } from '../../utils/formatters';

function dayBucket(iso: string): string {
  return iso.slice(0, 10); // YYYY-MM-DD
}

/**
 * Case-wide context beneath the map + detail panel: a recent-activity feed
 * across all currently visible locations, a compact per-day event
 * histogram, and a horizontal strip of linked evidence — kept concise on
 * purpose so this never grows into its own cluttered surface.
 */
export function LocationBottomStrip({
  events, locationsById, evidence, onSelectLocation,
}: {
  events: TimelineEvent[];
  locationsById: Map<string, LocationEntity>;
  evidence: Evidence[];
  onSelectLocation: (id: string) => void;
}) {
  const navigate = useNavigate();
  const { caseId } = useParams();

  const recent = useMemo(
    () => [...events].filter((e) => e.locationId).sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 6),
    [events],
  );

  const dayHistogram = useMemo(() => {
    const buckets = new Map<string, number>();
    for (const e of events) buckets.set(dayBucket(e.timestamp), (buckets.get(dayBucket(e.timestamp)) ?? 0) + 1);
    const days = [...buckets.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-14);
    const max = Math.max(1, ...days.map(([, c]) => c));
    return { days, max };
  }, [events]);

  return (
    <div className="row" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-2)', height: 200, flexShrink: 0 }}>
      <div className="stack gap-2" style={{ flex: 1, minWidth: 0, padding: 10, borderRight: '1px solid var(--border)', overflowY: 'auto' }}>
        <div className="system-label">RECENT LOCATION ACTIVITY</div>
        {recent.length === 0 ? <span className="text-muted" style={{ fontSize: 12 }}>No recent activity.</span> : (
          <div className="stack gap-2">
            {recent.map((ev) => {
              const loc = ev.locationId ? locationsById.get(ev.locationId) : undefined;
              return (
                <button
                  key={ev.id}
                  type="button"
                  className="row gap-2"
                  style={{ background: 'none', border: 'none', textAlign: 'left', cursor: loc ? 'pointer' : 'default', color: 'inherit', padding: 0 }}
                  onClick={() => loc && onSelectLocation(loc.id)}
                >
                  <span style={{ flex: 1, fontSize: 11.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {loc ? `${loc.name} — ` : ''}{ev.title}
                  </span>
                  <span className="text-muted mono" style={{ fontSize: 9.5, flexShrink: 0 }}>{formatRelativeTime(ev.timestamp)}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="stack gap-2" style={{ width: 300, flexShrink: 0, padding: 10, borderRight: '1px solid var(--border)' }}>
        <div className="system-label">LOCATION TIMELINE</div>
        {dayHistogram.days.length === 0 ? <span className="text-muted" style={{ fontSize: 12 }}>No timeline data.</span> : (
          <div className="row gap-1" style={{ alignItems: 'flex-end', height: 120 }}>
            {dayHistogram.days.map(([day, count]) => (
              <div key={day} title={`${day}: ${count} event${count === 1 ? '' : 's'}`} className="stack" style={{ flex: 1, alignItems: 'center', gap: 3 }}>
                <div style={{ width: '100%', height: (count / dayHistogram.max) * 96, background: 'var(--cyan)', borderRadius: '2px 2px 0 0', minHeight: 2 }} />
                <span className="text-muted mono" style={{ fontSize: 8 }}>{day.slice(8, 10)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="stack gap-2" style={{ width: 260, flexShrink: 0, padding: 10 }}>
        <div className="system-label">RELATED MEDIA</div>
        {evidence.length === 0 ? <span className="text-muted" style={{ fontSize: 12 }}>No linked media.</span> : (
          <div className="row gap-2" style={{ overflowX: 'auto', paddingBottom: 4 }}>
            {evidence.slice(0, 10).map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => navigate(`/cases/${caseId}/evidence`)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}
                title={e.title}
              >
                <EvidenceThumb evidenceId={e.id} evidenceType={e.type} src={evidenceImage(e.id)} size={52} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
