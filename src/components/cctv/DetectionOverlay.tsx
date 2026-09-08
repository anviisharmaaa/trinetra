import type { CCTVEvent } from '../../types';
import { getEntityById } from '../../data';

/**
 * Entity/confidence badge for the currently-selected CCTV event.
 *
 * This deliberately does NOT draw a bounding box: `CCTVEvent` carries no
 * real coordinate data (unlike `FaceDetection`, which has a genuine
 * `boundingBox` — see `FaceBoundingBox`), so drawing one here would just be
 * fabricated computer-vision output laid on top of a real recording.
 * Camera id / location / timestamp / event type already live in
 * `CCTVOverlay`; this only adds what CCTVOverlay doesn't know — the
 * detected entities and match confidence.
 */
export function DetectionOverlay({ event }: { event: CCTVEvent | null }) {
  if (!event) return null;
  const entities = event.entityIds.map(getEntityById).filter(Boolean);
  if (entities.length === 0) return null;
  return (
    <div style={{ position: 'absolute', left: 8, right: 8, bottom: 88, pointerEvents: 'none', zIndex: 2 }} className="row gap-2" >{/* sits just above CCTVOverlay's timestamp strip */}
      {entities.map((e) => e && (
        <span key={e.id} className="badge badge-info" style={{ fontSize: 9.5 }}>
          {e.name} · {Math.round(event.confidence * 100)}%
        </span>
      ))}
    </div>
  );
}
