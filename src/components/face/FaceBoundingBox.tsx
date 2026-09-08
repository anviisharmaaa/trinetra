import type { FaceDetection } from '../../types';

export function FaceBoundingBox({ detection }: { detection: FaceDetection }) {
  const { boundingBox: b, status, confidence } = detection;
  const color = status === 'matched' ? 'var(--cyan)' : status === 'possible-match' ? 'var(--warning)' : 'var(--text-muted)';
  return (
    <div
      style={{
        position: 'absolute',
        left: `${b.x * 100}%`, top: `${b.y * 100}%`, width: `${b.width * 100}%`, height: `${b.height * 100}%`,
        border: `1.5px solid ${color}`, boxShadow: `0 0 8px ${color}55`,
      }}
    >
      <span className="mono" style={{ position: 'absolute', top: -18, left: 0, fontSize: 9.5, background: 'var(--bg-0)', color, padding: '1px 4px', whiteSpace: 'nowrap' }}>
        {status === 'unknown' ? 'UNMATCHED' : `${Math.round(confidence * 100)}%`}
      </span>
    </div>
  );
}
