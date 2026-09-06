import { VideoOff } from 'lucide-react';
import type { Camera, CCTVEvent } from '../../types';
import { formatDateTime, titleCase } from '../../utils/formatters';

/**
 * Third and final tier of the video fallback chain: no MP4 for this camera,
 * and no archived still frame either. Rather than a broken player or a bare
 * "no image" placeholder, this surfaces exactly what an analyst needs to
 * know is still true even without a picture — which camera, where, what was
 * selected, and when — so the module stays useful with zero media on disk.
 */
export function CCTVUnavailable({ camera, event }: { camera: Camera; event: CCTVEvent | null }) {
  return (
    <div
      style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 10,
        background: 'repeating-linear-gradient(180deg,#060a0f,#060a0f 2px,#080d13 2px,#080d13 4px)',
      }}
    >
      <VideoOff size={22} className="text-muted" />
      <span className="mono text-muted" style={{ fontSize: 11, letterSpacing: '0.08em' }}>VIDEO SOURCE UNAVAILABLE</span>
      <div className="stack gap-1" style={{ alignItems: 'center', marginTop: 4 }}>
        <span className="text-secondary" style={{ fontSize: 12 }}>
          {camera.code} — {camera.name}
        </span>
        <span className="text-muted" style={{ fontSize: 11 }}>{camera.coverage}</span>
        {event && (
          <div className="row gap-2" style={{ marginTop: 6 }}>
            <span className="badge badge-neutral" style={{ fontSize: 9.5 }}>{titleCase(event.eventType)}</span>
            <span className="mono text-muted" style={{ fontSize: 9.5 }}>{formatDateTime(event.timestamp)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
