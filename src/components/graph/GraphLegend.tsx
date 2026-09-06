import { ENTITY_COLORS, ENTITY_LABELS } from '../../utils/entityMeta';
import { NodeShape } from './NodeShape';

export function GraphLegend({ onClose }: { onClose?: () => void }) {
  return (
    <div className="panel fade-in" style={{ position: 'absolute', bottom: 12, left: 12, padding: 10, zIndex: 5, fontSize: 10.5, minWidth: 170 }}>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
        <span className="system-label">ENTITY TYPES</span>
        {onClose && <button type="button" onClick={onClose} className="text-muted" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}>×</button>}
      </div>
      <div className="stack gap-1">
        {Object.entries(ENTITY_LABELS).map(([type, label]) => (
          <div key={type} className="row gap-2">
            <svg width={14} height={14} viewBox="-9 -9 18 18">
              <NodeShape type={type as keyof typeof ENTITY_COLORS} r={7} fill={ENTITY_COLORS[type as keyof typeof ENTITY_COLORS]} stroke={ENTITY_COLORS[type as keyof typeof ENTITY_COLORS]} strokeWidth={1} />
            </svg>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
