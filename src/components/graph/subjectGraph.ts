import type { Entity, EntityType, Relationship } from '../../types';

// Canonical group order — this is also the visual order groups appear in
// going clockwise from the top (radial) or left-to-right (hierarchical), so
// the same kind of entity always lands in roughly the same place no matter
// which case or subject is being viewed.
export const GROUP_ORDER: EntityType[] = [
  'organization', 'person', 'location', 'account', 'vehicle', 'phone', 'device', 'document', 'social', 'incident',
];

export interface NeighborNode {
  entity: Entity;
  relationship: Relationship; // the strongest relationship to the center, used for the edge
  extraRelationshipCount: number; // additional relationships to the center beyond the one shown
}

export interface OverflowGroup {
  type: EntityType;
  hiddenCount: number;
  hiddenIds: string[];
}

export interface SubjectGraph {
  center: Entity | null;
  groups: { type: EntityType; visible: NeighborNode[] }[];
  overflow: OverflowGroup[];
  totalDirectConnections: number;
}

/**
 * Picks a sensible default subject when nothing is selected yet: the entity
 * with the most direct relationships (ties broken by preferring a person),
 * so the graph never opens on an isolated, low-value node.
 */
export function pickDefaultCenter(entities: Entity[], relationships: Relationship[]): Entity | null {
  if (entities.length === 0) return null;
  const degree = new Map<string, number>();
  for (const r of relationships) {
    degree.set(r.sourceId, (degree.get(r.sourceId) ?? 0) + 1);
    degree.set(r.targetId, (degree.get(r.targetId) ?? 0) + 1);
  }
  const ranked = [...entities].sort((a, b) => {
    const da = degree.get(a.id) ?? 0;
    const db = degree.get(b.id) ?? 0;
    if (db !== da) return db - da;
    if (a.type === 'person' && b.type !== 'person') return -1;
    if (b.type === 'person' && a.type !== 'person') return 1;
    return 0;
  });
  return ranked[0] ?? null;
}

/**
 * Builds the bounded, organized "subject-centric" view of the graph: the
 * center entity plus its direct relationships only, grouped by entity type
 * and capped per group (with the remainder collapsed into an overflow
 * chip) unless that group has been explicitly expanded. This is the single
 * source of truth both the radial/hierarchical SVG renderer and the
 * force-directed fallback draw from — nothing outside this bounded set is
 * ever rendered at once.
 */
export function buildSubjectGraph({
  centerId, entities, relationships, expandedGroups, maxPerGroup = 5,
}: {
  centerId: string | null;
  entities: Entity[];
  relationships: Relationship[];
  expandedGroups: Set<string>;
  maxPerGroup?: number;
}): SubjectGraph {
  const entityById = new Map(entities.map((e) => [e.id, e]));
  const center = centerId ? entityById.get(centerId) ?? null : null;
  if (!center) return { center: null, groups: [], overflow: [], totalDirectConnections: 0 };

  const byNeighbor = new Map<string, Relationship[]>();
  for (const r of relationships) {
    if (r.sourceId !== center.id && r.targetId !== center.id) continue;
    const otherId = r.sourceId === center.id ? r.targetId : r.sourceId;
    if (otherId === center.id) continue; // ignore self-loops
    if (!entityById.has(otherId)) continue;
    const list = byNeighbor.get(otherId) ?? [];
    list.push(r);
    byNeighbor.set(otherId, list);
  }

  const neighbors: NeighborNode[] = [];
  for (const [otherId, rels] of byNeighbor) {
    const entity = entityById.get(otherId)!;
    const strongest = [...rels].sort((a, b) => b.strength - a.strength)[0];
    neighbors.push({ entity, relationship: strongest, extraRelationshipCount: rels.length - 1 });
  }

  const byType = new Map<EntityType, NeighborNode[]>();
  for (const n of neighbors) {
    const list = byType.get(n.entity.type) ?? [];
    list.push(n);
    byType.set(n.entity.type, list);
  }
  for (const list of byType.values()) {
    list.sort((a, b) => b.relationship.strength - a.relationship.strength);
  }

  const groups: { type: EntityType; visible: NeighborNode[] }[] = [];
  const overflow: OverflowGroup[] = [];
  for (const type of GROUP_ORDER) {
    const list = byType.get(type);
    if (!list || list.length === 0) continue;
    const expanded = expandedGroups.has(`${center.id}:${type}`);
    const visible = expanded ? list : list.slice(0, maxPerGroup);
    groups.push({ type, visible });
    if (!expanded && list.length > maxPerGroup) {
      const hidden = list.slice(maxPerGroup);
      overflow.push({ type, hiddenCount: hidden.length, hiddenIds: hidden.map((h) => h.entity.id) });
    }
  }

  return { center, groups, overflow, totalDirectConnections: neighbors.length };
}

export function groupKey(centerId: string, type: EntityType): string {
  return `${centerId}:${type}`;
}
