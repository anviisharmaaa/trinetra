import { useState } from 'react';
import type { Case } from '../../types';
import { IntelligenceGlobe, type HoveredNode } from './IntelligenceGlobe';

const SIDE_LABELS = ['PEOPLE', 'DATA', 'INSIGHTS', 'A SAFER INDIA'];

export function HeroIntelligence({ cases }: { cases: Case[] }) {
  const [hovered, setHovered] = useState<HoveredNode | null>(null);

  const total = cases.length;
  const active = cases.filter((c) => c.status === 'active').length;
  const monitoring = cases.filter((c) => c.status === 'monitoring').length;
  const closed = cases.filter((c) => c.status === 'closed').length;

  const stats: { label: string; value: number }[] = [
    { label: 'Total Cases', value: total },
    { label: 'Active', value: active },
    { label: 'Monitoring', value: monitoring },
    { label: 'Closed', value: closed },
  ];

  return (
    <section className="dash-hero">
      <div className="dash-hero-copy">
        <div className="dash-eyebrow">Cases</div>
        <h1 className="dash-headline">
          Intelligence
          <br />
          in Action
        </h1>
        <p className="dash-subcopy">
          Track. Investigate. Connect.
          <br />
          A safer tomorrow.
        </p>
        <div className="dash-stat-row">
          {stats.map((s) => (
            <div key={s.label} className="dash-stat">
              <span className="dash-stat-value">{s.value}</span>
              <span className="dash-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="dash-hero-globe" aria-hidden="true">
        <div className="dash-globe-frame">
          <IntelligenceGlobe onHover={setHovered} />
          {hovered && (
            <div
              className="dash-globe-tooltip"
              style={{ left: hovered.x, top: hovered.y }}
            >
              <div className="dash-globe-tooltip-title">{hovered.node.label.toUpperCase()}</div>
              <div className="dash-globe-tooltip-row">{hovered.node.entities} entities</div>
              <div className="dash-globe-tooltip-row">{hovered.node.connections} active connections</div>
              <div className="dash-globe-tooltip-row">{hovered.node.investigations} investigation{hovered.node.investigations === 1 ? '' : 's'}</div>
            </div>
          )}
        </div>
        <div className="dash-globe-vignette" />
      </div>

      <div className="dash-side-labels" aria-hidden="true">
        {SIDE_LABELS.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </section>
  );
}
