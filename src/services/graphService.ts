import { getEntitiesByCase, getRelationshipsForCase, getEntityById, getRelationshipsForEntity } from '../data';
import type { Entity, EntityType, Relationship, RelationshipType } from '../types';
import { mockDelay } from '../utils/mockDelay';
import { personService } from './personService';

export interface GraphData {
  entities: Entity[];
  relationships: Relationship[];
}

// The live /api/persons/:id/network endpoint reports edges as one of these
// four kinds (see server/index.js) — mapped onto the app's existing
// RelationshipType enum purely for filtering/styling. The real descriptive
// text (relationship_type / transaction_type / call_type from Postgres)
// is preserved as-is in `label`, so nothing about the underlying data is
// lost by this mapping.
const LIVE_EDGE_TYPE: Record<string, RelationshipType> = {
  relationship: 'family_of',
  account: 'financed_by',
  transaction: 'transferred_to',
  call: 'called',
};

function liveEntity(node: { id: string; name: string; riskLevel: string | null }, caseId: string): Entity {
  const now = new Date().toISOString();
  return {
    id: node.id,
    caseIds: [caseId],
    type: 'person' as EntityType,
    name: node.name,
    status: 'active',
    riskLevel: (node.riskLevel ?? 'unknown').toLowerCase() as Entity['riskLevel'],
    metadata: {},
    sourceIds: ['master-dataset'],
    createdAt: now,
    updatedAt: now,
  } as Entity;
}

/**
 * Builds a graph from the live Master Dataset backend for every real
 * (non-mock) Person ID linked to this case. Centers on the first linked
 * person and pulls their 2-hop network, then makes sure every other
 * explicitly-linked person is present too (as an isolated node) even if the
 * network call didn't happen to surface them. Throws ApiUnavailableError
 * straight through if Express can't be reached — the caller must show that
 * as an explicit backend-unavailable state, never silently fall back to
 * mock data for a real case.
 */
async function buildLiveGraph(realPersonIds: string[], caseId: string): Promise<GraphData> {
  const [primary, ...rest] = realPersonIds;
  const network = await personService.getNetwork(primary, 2);

  const entityMap = new Map<string, Entity>();
  for (const node of network.nodes) entityMap.set(node.id, liveEntity(node, caseId));

  for (const pid of rest) {
    if (entityMap.has(pid)) continue;
    const raw = await personService.getPersonRaw(pid);
    if (raw) entityMap.set(pid, liveEntity({ id: raw.person_id, name: raw.name, riskLevel: raw.risk_level }, caseId));
  }

  const now = new Date().toISOString();
  const relationships: Relationship[] = network.edges
    .filter((e) => entityMap.has(e.source) && entityMap.has(e.target))
    .map((e, i) => ({
      id: `live-${e.source}-${e.target}-${e.type}-${i}`,
      caseId,
      sourceId: e.source,
      targetId: e.target,
      type: LIVE_EDGE_TYPE[e.type] ?? 'associated',
      label: e.label ?? e.type,
      strength: 0.6,
      metadata: { liveEdgeKind: e.type },
      sourceIds: ['master-dataset'],
      createdAt: now,
    }));

  return { entities: [...entityMap.values()], relationships };
}

function mergeGraphs(a: GraphData, b: GraphData): GraphData {
  const entityIds = new Set(a.entities.map((e) => e.id));
  const relIds = new Set(a.relationships.map((r) => r.id));
  return {
    entities: [...a.entities, ...b.entities.filter((e) => !entityIds.has(e.id))],
    relationships: [...a.relationships, ...b.relationships.filter((r) => !relIds.has(r.id))],
  };
}

export const graphService = {
  /**
   * `realPersonIds` — Person IDs linked to this case (via Supabase
   * case_entities) that are NOT part of the small in-memory demo dataset,
   * i.e. real Master Dataset IDs. When present, their live relationship
   * graph is merged with whatever the existing mock case-graph produces
   * (unchanged, so legacy demo cases like OP-001 keep working exactly as
   * before). Omit/empty for a pure demo case.
   */
  async getCaseGraph(caseId: string, realPersonIds: string[] = []): Promise<GraphData> {
    await mockDelay(300);
    const mock: GraphData = { entities: getEntitiesByCase(caseId), relationships: getRelationshipsForCase(caseId) };
    if (realPersonIds.length === 0) return mock;

    const live = await buildLiveGraph(realPersonIds, caseId); // ApiUnavailableError propagates to the caller on purpose
    return mergeGraphs(mock, live);
  },
  async expandEntity(entityId: string): Promise<GraphData> {
    // Mock-only: recentering onto a live (master-dataset) node is handled
    // entirely client-side by subjectGraph.buildSubjectGraph over the
    // already-fetched depth-2 graph (see getCaseGraph above), so this path
    // is never invoked for real entities today.
    await mockDelay(400);
    const rels = getRelationshipsForEntity(entityId);
    const entities: Entity[] = [];
    const seen = new Set<string>();
    for (const rel of rels) {
      const otherId = rel.sourceId === entityId ? rel.targetId : rel.sourceId;
      if (seen.has(otherId)) continue;
      seen.add(otherId);
      const e = getEntityById(otherId);
      if (e) entities.push(e);
    }
    return { entities, relationships: rels };
  },
};
