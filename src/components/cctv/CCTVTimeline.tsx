import type { CCTVEvent } from '../../types';
import { formatTime } from '../../utils/formatters';

export function CCTVTimeline({ events, activeId, onSelect }: { events: CCTVEvent[]; activeId: string | null; onSelect: (id: string) => void }) {
  if (events.length === 0) {
    return <div className="text-muted" style={{ fontSize: 12, padding: 8 }}>No events found for the selected time range.</div>;
  }
  const sorted = [...events].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  return (
    <div className="row gap-2" style={{ overflowX: 'auto', padding: '8px 4px' }}>
      {sorted.map((e) => (
        <button
          key={e.id}
          type="button"
          onClick={() => onSelect(e.id)}
          className="stack"
          style={{
            flexShrink: 0, width: 110, padding: 6, borderRadius: 4, cursor: 'pointer', textAlign: 'left',
            background: activeId === e.id ? 'var(--cyan-glow)' : 'var(--bg-2)',
            border: '1px solid ' + (activeId === e.id ? 'var(--cyan-dim)' : 'var(--border)'),
          }}
        >
          <span className="mono text-cyan" style={{ fontSize: 10.5 }}>{formatTime(e.timestamp)}</span>
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{e.eventType.replace('_', ' ')}</span>
          <span className="text-muted" style={{ fontSize: 9.5 }}>{Math.round(e.confidence * 100)}% conf.</span>
        </button>
      ))}
    </div>
  );
}
