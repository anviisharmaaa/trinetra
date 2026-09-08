import { getEntitiesByCase, getRelationshipsForCase, getEntityById, getRelationshipsForEntity } from '../data';
import type { Entity, Relationship } from '../types';
import { mockDelay } from '../utils/mockDelay';

export interface GraphData {
  entities: Entity[];
  relationships: Relationship[];
}

export const graphService = {
  async getCaseGraph(caseId: string): Promise<GraphData> {
    await mockDelay(650);
    return { entities: getEntitiesByCase(caseId), relationships: getRelationshipsForCase(caseId) };
  },
  async expandEntity(entityId: string): Promise<GraphData> {
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
