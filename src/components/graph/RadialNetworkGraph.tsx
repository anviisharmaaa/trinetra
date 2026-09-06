import { useMemo, useState } from 'react';
import type { Entity, EntityType, Relationship } from '../../types';
import { ENTITY_COLORS, RISK_COLORS } from '../../utils/entityMeta';
import { buildSubjectGraph } from './subjectGraph';
import { layoutHierarchical, layoutRadial, CENTER_R, NODE_R, OVERFLOW_R } from './radialLayout';
import { NodeShape } from './NodeShape';

export type GraphMode = 'radial' | 'hierarchical';

function truncate(label: string, max: number): string {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}

export function RadialNetworkGraph({
  mode, centerId, entities, relationships, expandedGroups, selectedEntityId,
  zoom, onSelectNode, onExpandGroup, onEmptyClick,
}: {
  mode: GraphMode;
  centerId: string | null;
  entities: Entity[];
  relationships: Relationship[];
  expandedGroups: Set<string>;
  selectedEntityId: string | null;
  zoom: number;
  onSelectNode: (id: string) => void;
  onExpandGroup: (type: EntityType) => void;
  onEmptyClick?: () => void;
}) {
  const [hoverId, setHoverId] = useState<string | null>(null);

  const graph = useMemo(
    () => buildSubjectGraph({ centerId, entities, relationships, expandedGroups }),
    [centerId, entities, relationships, expandedGroups],
  );

  const layout = useMemo(
    () => (mode === 'radial' ? layoutRadial(graph) : layoutHierarchical(graph)),
    [mode, graph],
  );

  const hoveredEdgeId = useMemo(() => {
    if (!hoverId) return null;
    return layout.nodes.find((n) => n.id === hoverId)?.data?.relationship.id ?? null;
  }, [hoverId, layout.nodes]);

  if (!graph.center) {
    return (
      <div className="empty-state" style={{ height: '100%' }}>
        <span className="empty-state-title">SELECT AN ENTITY</span>
        <span className="text-muted" style={{ fontSize: 12 }}>Choose a subject to build its relationship graph.</span>
      </div>
    );
  }

  const cx = layout.width / 2;
  const cy = layout.height / 2;

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto', background: 'var(--bg-1)' }} onClick={() => onEmptyClick?.()}>
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: layout.width * zoom, minHeight: layout.height * zoom }}>
        <svg
          width={layout.width * zoom}
          height={layout.height * zoom}
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          style={{ overflow: 'visible' }}
        >
          <g transform={`translate(${cx},${cy})`}>
            {/* Edges drawn first so nodes sit on top */}
            {layout.edges.map((e) => {
              const dimmed = hoverId !== null && hoverId !== graph.center!.id && e.id !== hoveredEdgeId;
              return (
                <g key={e.id} opacity={dimmed ? 0.25 : 1}>
                  <line
                    x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                    stroke="var(--border-active)"
                    strokeWidth={0.8 + e.strength * 2.2}
                  />
                  <g transform={`translate(${e.labelX},${e.labelY})`}>
                    <rect x={-38} y={-7} width={76} height={14} rx={3} fill="var(--bg-0)" stroke="var(--border)" strokeWidth={0.5} opacity={0.92} />
                    <text textAnchor="middle" dy={3.5} fontSize={8} fill="var(--text-secondary)" fontFamily="var(--font-mono, monospace)">
                      {truncate(e.label, 13)}{e.extraCount > 0 ? ` +${e.extraCount}` : ''}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Center node */}
            <CenterNode entity={graph.center} selected onHover={setHoverId} />

            {/* Neighbor + overflow nodes */}
            {layout.nodes.filter((n) => n.kind !== 'center').map((n) => {
              const dimmed = hoverId !== null && hoverId !== n.id && hoverId !== graph.center!.id;
              if (n.kind === 'overflow' && n.overflowGroup) {
                return (
                  <g
                    key={n.id}
                    transform={`translate(${n.x},${n.y})`}
                    style={{ cursor: 'pointer' }}
                    opacity={dimmed ? 0.35 : 1}
                    onMouseEnter={() => setHoverId(n.id)}
                    onMouseLeave={() => setHoverId(null)}
                    onClick={(ev) => { ev.stopPropagation(); onExpandGroup(n.overflowGroup!.type); }}
                  >
                    <NodeShape type="overflow" r={OVERFLOW_R} fill="var(--text-muted)" stroke="var(--text-muted)" />
                    <text textAnchor="middle" dy={3.5} fontSize={9} fontWeight={700} fill="var(--text-muted)">+{n.overflowGroup.hiddenCount}</text>
                    <text
                      textAnchor={labelAnchor(n.angle)}
                      x={labelDx(n.angle, OVERFLOW_R)}
                      dy={labelDy(n.angle, OVERFLOW_R)}
                      fontSize={9}
                      fill="var(--text-muted)"
                    >
                      more
                    </text>
                  </g>
                );
              }
              if (!n.data) return null;
              const entity = n.data.entity;
              const color = ENTITY_COLORS[entity.type];
              const risk = (entity as { riskLevel?: string }).riskLevel;
              const isSelected = selectedEntityId === entity.id;
              return (
                <g
                  key={n.id}
                  transform={`translate(${n.x},${n.y})`}
                  style={{ cursor: 'pointer' }}
                  opacity={dimmed ? 0.35 : 1}
                  onMouseEnter={() => setHoverId(n.id)}
                  onMouseLeave={() => setHoverId(null)}
                  onClick={(ev) => { ev.stopPropagation(); onSelectNode(entity.id); }}
                >
                  <NodeShape
                    type={entity.type}
                    r={NODE_R}
                    fill={color}
                    stroke={isSelected ? '#ffffff' : (RISK_COLORS[risk ?? 'unknown'] ?? color)}
                    strokeWidth={isSelected ? 3 : 2}
                  />
                  <text
                    textAnchor={labelAnchor(n.angle)}
                    x={labelDx(n.angle, NODE_R)}
                    dy={labelDy(n.angle, NODE_R)}
                    fontSize={10}
                    fill="var(--text-secondary)"
                  >
                    {truncate(entity.name, 20)}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}

function CenterNode({ entity, onHover }: { entity: Entity; selected: boolean; onHover: (id: string | null) => void }) {
  const color = ENTITY_COLORS[entity.type];
  return (
    <g onMouseEnter={() => onHover(entity.id)} onMouseLeave={() => onHover(null)}>
      <circle r={CENTER_R + 8} fill={color} opacity={0.12} />
      <g transform="scale(1)">
        <NodeShape type={entity.type} r={CENTER_R} fill={color} stroke="#ffffff" strokeWidth={2.5} />
      </g>
      <text textAnchor="middle" dy={CENTER_R + 20} fontSize={13} fontWeight={700} fill="var(--text-primary)">
        {truncate(entity.name, 26)}
      </text>
      <text textAnchor="middle" dy={CENTER_R + 34} fontSize={9} fill="var(--text-muted)" letterSpacing="0.05em">
        SELECTED SUBJECT
      </text>
    </g>
  );
}

function labelAnchor(angle: number): 'start' | 'end' | 'middle' {
  const c = Math.cos(angle);
  if (c > 0.35) return 'start';
  if (c < -0.35) return 'end';
  return 'middle';
}
function labelDx(angle: number, r: number): number {
  const c = Math.cos(angle);
  if (Math.abs(c) <= 0.35) return 0;
  return c > 0 ? r + 6 : -(r + 6);
}
function labelDy(angle: number, r: number): number {
  const s = Math.sin(angle);
  const c = Math.cos(angle);
  if (Math.abs(c) <= 0.35) return s > 0 ? r + 14 : -(r + 8);
  return 3.5;
}

