import type { EntityType } from '../../types';

/**
 * One consistent SVG shape per entity type, drawn at (0,0) — callers wrap
 * this in a <g transform="translate(x,y)">. Keeping shape separate from
 * color means the type is legible even for someone who can't distinguish
 * the color coding (and keeps the graph from reading as "everything is a
 * circle").
 */
export function NodeShape({ type, r, fill, stroke, strokeWidth = 2 }: {
  type: EntityType | 'overflow';
  r: number;
  fill: string;
  stroke: string;
  strokeWidth?: number;
}) {
  const common = { fill, stroke, strokeWidth };
  switch (type) {
    case 'organization':
    case 'document':
      return <rect x={-r} y={-r} width={r * 2} height={r * 2} rx={r * 0.28} {...common} />;
    case 'location':
      return (
        <polygon
          points={`0,${-r * 1.15} ${r * 1.15},0 0,${r * 1.15} ${-r * 1.15},0`}
          {...common}
        />
      );
    case 'vehicle': {
      const w = r * 1.2;
      return (
        <polygon
          points={`${-w},${-r * 0.55} ${-w * 0.5},${-r} ${w * 0.5},${-r} ${w},${-r * 0.55} ${w},${r * 0.55} ${w * 0.5},${r} ${-w * 0.5},${r} ${-w},${r * 0.55}`}
          {...common}
        />
      );
    }
    case 'device':
      return (
        <g>
          <rect x={-r} y={-r} width={r * 2} height={r * 2} rx={r * 0.2} {...common} />
          <rect x={-r * 0.5} y={-r * 0.5} width={r} height={r} rx={r * 0.15} fill="none" stroke={fill} strokeWidth={1.2} opacity={0.7} />
        </g>
      );
    case 'phone':
      return (
        <g>
          <circle r={r} {...common} />
          <circle r={r * 0.4} fill="none" stroke={fill} strokeWidth={1.2} opacity={0.8} />
        </g>
      );
    case 'account':
      return (
        <g>
          <circle r={r} {...common} />
          <text y={r * 0.35} textAnchor="middle" fontSize={r * 1.05} fontWeight={700} fill={stroke === fill ? '#04121a' : stroke}>$</text>
        </g>
      );
    case 'social':
    case 'incident':
      return <circle r={r} {...common} strokeDasharray="3 2" />;
    case 'overflow':
      return <circle r={r} fill="none" stroke={fill} strokeWidth={1.5} strokeDasharray="3 3" />;
    case 'person':
    default:
      return <circle r={r} {...common} />;
  }
}
