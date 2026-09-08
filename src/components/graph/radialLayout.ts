import type { EntityType } from '../../types';
import type { SubjectGraph } from './subjectGraph';

export const CENTER_R = 34;
export const NODE_R = 17;
export const OVERFLOW_R = 14;

const MIN_ARC = 82; // minimum px of circumference reserved per radial slot
const MIN_SLOT_W = 122; // minimum px of horizontal width reserved per hierarchical slot
const GAP_SLOTS = 0.9; // extra slot-widths of empty space inserted between groups
const BASE_RADIUS = 168;
const TREE_ROW_GAP = 168;

export interface LaidOutNode {
  id: string;
  kind: 'center' | 'neighbor' | 'overflow';
  type: EntityType | 'overflow';
  x: number;
  y: number;
  angle: number; // radians; used for label placement + edge trim direction
  data?: SubjectGraph['groups'][number]['visible'][number];
  overflowGroup?: SubjectGraph['overflow'][number];
}

export interface LaidOutEdge {
  id: string;
  x1: number; y1: number; x2: number; y2: number;
  labelX: number; labelY: number;
  label: string;
  strength: number;
  extraCount: number;
}

export interface GraphLayoutResult {
  nodes: LaidOutNode[];
  edges: LaidOutEdge[];
  width: number;
  height: number;
}

interface Slot { type: EntityType; kind: 'neighbor' | 'overflow'; nodeIndex?: number }

function buildSlots(graph: SubjectGraph): { type: EntityType; slots: Slot[] }[] {
  return graph.groups.map((g) => {
    const slots: Slot[] = g.visible.map((_, i) => ({ type: g.type, kind: 'neighbor' as const, nodeIndex: i }));
    const overflow = graph.overflow.find((o) => o.type === g.type);
    if (overflow) slots.push({ type: g.type, kind: 'overflow' });
    return { type: g.type, slots };
  });
}

export function layoutRadial(graph: SubjectGraph): GraphLayoutResult {
  if (!graph.center) return { nodes: [], edges: [], width: 400, height: 300 };

  const groupSlots = buildSlots(graph);
  const totalSlots = groupSlots.reduce((sum, g) => sum + g.slots.length, 0);
  const gapCount = groupSlots.length;
  const circumferenceNeeded = (totalSlots + gapCount * GAP_SLOTS) * MIN_ARC;
  const radius = Math.max(BASE_RADIUS, circumferenceNeeded / (2 * Math.PI));
  const anglePerSlot = (2 * Math.PI) / (totalSlots + gapCount * GAP_SLOTS);
  const gapAngle = anglePerSlot * GAP_SLOTS;

  const nodes: LaidOutNode[] = [{ id: graph.center.id, kind: 'center', type: graph.center.type, x: 0, y: 0, angle: 0 }];
  const edges: LaidOutEdge[] = [];

  let cursor = -Math.PI / 2; // start at top, sweep clockwise
  groupSlots.forEach((g) => {
    const groupWidth = g.slots.length * anglePerSlot;
    const groupStart = cursor;
    g.slots.forEach((slot, i) => {
      const angle = groupStart + (i + 0.5) * anglePerSlot;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      if (slot.kind === 'overflow') {
        const overflowGroup = graph.overflow.find((o) => o.type === slot.type);
        nodes.push({ id: `overflow:${slot.type}`, kind: 'overflow', type: 'overflow', x, y, angle, overflowGroup });
      } else {
        const neighbor = graph.groups.find((gg) => gg.type === slot.type)!.visible[slot.nodeIndex!];
        nodes.push({ id: neighbor.entity.id, kind: 'neighbor', type: neighbor.entity.type, x, y, angle, data: neighbor });
        const startX = CENTER_R * Math.cos(angle);
        const startY = CENTER_R * Math.sin(angle);
        const endX = x - NODE_R * Math.cos(angle);
        const endY = y - NODE_R * Math.sin(angle);
        const mx = (startX + endX) / 2;
        const my = (startY + endY) / 2;
        const perpOffset = (i % 2 === 0 ? -1 : 1) * 9;
        edges.push({
          id: neighbor.relationship.id,
          x1: startX, y1: startY, x2: endX, y2: endY,
          labelX: mx + perpOffset * Math.cos(angle + Math.PI / 2),
          labelY: my + perpOffset * Math.sin(angle + Math.PI / 2),
          label: neighbor.relationship.label,
          strength: neighbor.relationship.strength,
          extraCount: neighbor.extraRelationshipCount,
        });
      }
    });
    cursor = groupStart + groupWidth + gapAngle;
  });

  const halfExtent = radius + NODE_R + 140;
  return { nodes, edges, width: halfExtent * 2, height: halfExtent * 2 };
}

export function layoutHierarchical(graph: SubjectGraph): GraphLayoutResult {
  if (!graph.center) return { nodes: [], edges: [], width: 400, height: 300 };

  const groupSlots = buildSlots(graph);
  const totalSlots = groupSlots.reduce((sum, g) => sum + g.slots.length, 0);
  const gapCount = Math.max(0, groupSlots.length - 1);
  const totalWidth = (totalSlots + gapCount * GAP_SLOTS) * MIN_SLOT_W;

  const nodes: LaidOutNode[] = [{ id: graph.center.id, kind: 'center', type: graph.center.type, x: 0, y: 0, angle: Math.PI / 2 }];
  const edges: LaidOutEdge[] = [];

  let cursor = -totalWidth / 2;
  const rowY = TREE_ROW_GAP;
  groupSlots.forEach((g) => {
    const groupWidth = g.slots.length * MIN_SLOT_W;
    const groupStart = cursor;
    g.slots.forEach((slot, i) => {
      const x = groupStart + (i + 0.5) * MIN_SLOT_W;
      const y = rowY;
      const angle = Math.atan2(y, x || 0.0001);
      if (slot.kind === 'overflow') {
        const overflowGroup = graph.overflow.find((o) => o.type === slot.type);
        nodes.push({ id: `overflow:${slot.type}`, kind: 'overflow', type: 'overflow', x, y, angle, overflowGroup });
      } else {
        const neighbor = graph.groups.find((gg) => gg.type === slot.type)!.visible[slot.nodeIndex!];
        nodes.push({ id: neighbor.entity.id, kind: 'neighbor', type: neighbor.entity.type, x, y, angle, data: neighbor });
        const startX = 0;
        const startY = CENTER_R;
        // Every edge in a row fans out from the same trunk point (0, CENTER_R).
        // Placing labels near that shared origin (e.g. the true midpoint)
        // bunches them together regardless of how far apart the nodes end
        // up — the label boxes collide even though the nodes don't. Placing
        // each label close to its own node instead spaces labels exactly
        // as far apart as the nodes themselves (MIN_SLOT_W), which is
        // always wider than a label box.
        const t = 0.72;
        edges.push({
          id: neighbor.relationship.id,
          x1: startX, y1: startY, x2: x, y2: y - NODE_R,
          labelX: startX + (x - startX) * t,
          labelY: startY + (y - startY) * t,
          label: neighbor.relationship.label,
          strength: neighbor.relationship.strength,
          extraCount: neighbor.extraRelationshipCount,
        });
      }
    });
    cursor = groupStart + groupWidth + MIN_SLOT_W * GAP_SLOTS;
  });

  const width = Math.max(totalWidth + NODE_R * 2 + 80, 500);
  const height = rowY + NODE_R + 140;
  return { nodes, edges, width, height };
}
