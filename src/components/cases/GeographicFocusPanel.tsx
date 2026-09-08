import { useMemo } from 'react';
import type { Case } from '../../types';
import { computeGeoFocus, STATE_ANCHORS } from '../../data/dashboard/geoFocus';
import { indiaDotGrid, indiaOutlinePath, projectIndia } from './indiaOutline';

const W = 160;
const H = 190;

export function GeographicFocusPanel({ cases }: { cases: Case[] }) {
  const rows = useMemo(() => computeGeoFocus(cases), [cases]);
  const dots = useMemo(() => indiaDotGrid(26, 30), []);
  const outline = useMemo(() => indiaOutlinePath(W, H), []);

  return (
    <div className="dash-panel">
      <div className="dash-panel-header">Geographic Focus</div>
      <div className="dash-geo">
        <svg viewBox={`0 0 ${W} ${H}`} className="dash-geo-map" role="img" aria-label="Case geographic focus across India">
          <path d={outline} fill="rgba(76,201,240,0.03)" stroke="rgba(76,201,240,0.16)" strokeWidth={1} />
          {dots.map((d, i) => (
            <circle key={i} cx={d.x * W} cy={d.y * H} r={0.7} fill="rgba(148,163,184,0.35)" />
          ))}
          {rows.filter((r) => r.count > 0 && STATE_ANCHORS[r.state]).map((r) => {
            const anchor = STATE_ANCHORS[r.state];
            const p = projectIndia(anchor.lat, anchor.lng);
            const radius = 3 + Math.min(r.count, 4) * 1.4;
            return (
              <g key={r.state}>
                <circle cx={p.x * W} cy={p.y * H} r={radius + 4} fill="rgba(76,201,240,0.15)" />
                <circle cx={p.x * W} cy={p.y * H} r={radius} fill="var(--accent, #4cc9f0)" />
              </g>
            );
          })}
        </svg>
        <div className="dash-geo-legend">
          {rows.map((r) => (
            <div key={r.state} className="dash-legend-row">
              <span className="dash-legend-label">{r.state}</span>
              <span className="dash-legend-value">{r.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
