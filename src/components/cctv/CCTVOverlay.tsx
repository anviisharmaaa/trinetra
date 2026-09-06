import { formatDateTime } from '../../utils/formatters';

/**
 * The HUD burned over the video feed. Deliberately restrained — this is a
 * recorded-archive viewer, not a video-game minimap: camera identity in one
 * corner, a "RECORDED" (never "LIVE") indicator in the other, and a single
 * slim strip for the investigation-time / event context, sitting just above
 * the transport controls.
 */
export function CCTVOverlay({
  cameraCode, locationLabel, timestamp, eventTypeLabel,
}: {
  cameraCode: string;
  locationLabel?: string;
  timestamp?: string;
  eventTypeLabel?: string;
}) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
      <div className="row" style={{ position: 'absolute', top: 8, left: 8, right: 8, justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="stack" style={{ gap: 0, background: 'rgba(5,8,13,0.55)', padding: '3px 6px', borderRadius: 3 }}>
          <span className="mono text-cyan" style={{ fontSize: 11, letterSpacing: '0.03em' }}>{cameraCode}</span>
          {locationLabel && <span className="text-muted mono" style={{ fontSize: 9 }}>{locationLabel}</span>}
        </div>
        <div className="row gap-1" style={{ alignItems: 'center', background: 'rgba(5,8,13,0.55)', padding: '3px 6px', borderRadius: 3 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--danger)', boxShadow: '0 0 5px var(--danger)' }} />
          <span className="mono" style={{ fontSize: 9.5, letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>RECORDED</span>
        </div>
      </div>

      {(timestamp || eventTypeLabel) && (
        <div
          className="row"
          style={{
            position: 'absolute', left: 8, right: 8, bottom: 54, justifyContent: 'space-between', alignItems: 'center',
            background: 'rgba(5,8,13,0.5)', padding: '3px 6px', borderRadius: 3,
          }}
        >
          <span className="mono text-secondary" style={{ fontSize: 9.5 }}>{timestamp ? formatDateTime(timestamp) : ''}</span>
          {eventTypeLabel && <span className="badge badge-info" style={{ fontSize: 9 }}>{eventTypeLabel}</span>}
        </div>
      )}
    </div>
  );
}
