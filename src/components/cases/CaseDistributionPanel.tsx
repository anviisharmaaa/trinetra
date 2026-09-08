import type { Case } from '../../types';

type Bucket = 'high' | 'medium' | 'low' | 'closed';

const BUCKET_META: Record<Bucket, { label: string; var: string }> = {
  high: { label: 'High Priority', var: 'var(--danger)' },
  medium: { label: 'Medium Priority', var: 'var(--warning)' },
  low: { label: 'Low Priority', var: 'var(--success)' },
  closed: { label: 'Closed', var: 'var(--text-muted)' },
};

function bucketFor(c: Case): Bucket {
  if (c.status === 'closed') return 'closed';
  if (c.priority === 'critical' || c.priority === 'high') return 'high';
  if (c.priority === 'medium') return 'medium';
  return 'low';
}

const RADIUS = 46;
const CIRC = 2 * Math.PI * RADIUS;

export function CaseDistributionPanel({ cases }: { cases: Case[] }) {
  const counts: Record<Bucket, number> = { high: 0, medium: 0, low: 0, closed: 0 };
  for (const c of cases) counts[bucketFor(c)] += 1;
  const total = cases.length || 1;

  let offset = 0;
  const order: Bucket[] = ['high', 'medium', 'low', 'closed'];
  const segments = order.map((b) => {
    const value = counts[b];
    const length = (value / total) * CIRC;
    const seg = { b, value, dasharray: `${length} ${CIRC - length}`, dashoffset: -offset };
    offset += length;
    return seg;
  });

  return (
    <div className="dash-panel">
      <div className="dash-panel-header">Case Distribution</div>
      <div className="dash-distribution">
        <svg viewBox="0 0 120 120" className="dash-donut" role="img" aria-label="Case distribution by priority">
          <circle cx={60} cy={60} r={RADIUS} fill="none" stroke="var(--border-subtle)" strokeWidth={14} />
          {segments.filter((s) => s.value > 0).map((s) => (
            <circle
              key={s.b}
              cx={60}
              cy={60}
              r={RADIUS}
              fill="none"
              stroke={BUCKET_META[s.b].var}
              strokeWidth={14}
              strokeDasharray={s.dasharray}
              strokeDashoffset={s.dashoffset}
              transform="rotate(-90 60 60)"
              strokeLinecap="butt"
            />
          ))}
          <text x={60} y={56} textAnchor="middle" fontSize={22} fontWeight={600} fill="var(--text-primary)">{cases.length}</text>
          <text x={60} y={72} textAnchor="middle" fontSize={9} letterSpacing={1} fill="var(--text-muted)">CASES</text>
        </svg>
        <div className="dash-distribution-legend">
          {order.map((b) => (
            <div key={b} className="dash-legend-row">
              <span className="dash-legend-swatch" style={{ background: BUCKET_META[b].var }} />
              <span className="dash-legend-label">{BUCKET_META[b].label}</span>
              <span className="dash-legend-value">{counts[b]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
