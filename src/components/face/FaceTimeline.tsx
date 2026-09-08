import type { FaceDetection } from '../../types';
import { formatTime } from '../../utils/formatters';

export function FaceTimeline({ detections, activeId, onSelect }: { detections: FaceDetection[]; activeId: string | null; onSelect: (id: string) => void }) {
  const sorted = [...detections].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  if (sorted.length === 0) return <div className="text-muted" style={{ fontSize: 12, padding: 8 }}>No detections recorded.</div>;
  return (
    <div className="row gap-2" style={{ overflowX: 'auto', padding: '8px 4px' }}>
      {sorted.map((d) => (
        <button
          key={d.id}
          type="button"
          onClick={() => onSelect(d.id)}
          className="stack"
          style={{
            flexShrink: 0, width: 100, padding: 6, borderRadius: 4, cursor: 'pointer', textAlign: 'left',
            background: activeId === d.id ? 'var(--cyan-glow)' : 'var(--bg-2)',
            border: '1px solid ' + (activeId === d.id ? 'var(--cyan-dim)' : 'var(--border)'),
          }}
        >
          <span className="mono text-cyan" style={{ fontSize: 10.5 }}>{formatTime(d.timestamp)}</span>
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{d.cameraId}</span>
          <span className="text-muted" style={{ fontSize: 9.5 }}>{Math.round(d.confidence * 100)}%</span>
        </button>
      ))}
    </div>
  );
}
