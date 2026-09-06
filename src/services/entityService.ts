import { allEntities, getEntityById, getEntitiesByCase } from '../data';
import { mockRelationships, getRelationshipsForEntity, getRelationshipsForCase } from '../data';
import type { Entity, EntityType, Relationship } from '../types';
import { mockDelay } from '../utils/mockDelay';

export const entityService = {
  async getEntity(id: string): Promise<Entity | undefined> {
    await mockDelay(250);
    return getEntityById(id);
  },
  async listByCase(caseId: string, types?: EntityType[]): Promise<Entity[]> {
    await mockDelay(450);
    const list = getEntitiesByCase(caseId);
    return types?.length ? list.filter((e) => types.includes(e.type)) : list;
  },
  async search(query: string, caseId?: string): Promise<Entity[]> {
    await mockDelay(500);
    const q = query.toLowerCase().trim();
    return allEntities.filter((e) => {
      const matchesCase = !caseId || e.caseIds.includes(caseId);
      const matchesQuery = !q || e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q);
      return matchesCase && matchesQuery;
    });
  },
  async getRelatedEntities(entityId: string): Promise<{ entity: Entity; relationship: Relationship }[]> {
    await mockDelay(400);
    const rels = getRelationshipsForEntity(entityId);
    const out: { entity: Entity; relationship: Relationship }[] = [];
    for (const rel of rels) {
      const otherId = rel.sourceId === entityId ? rel.targetId : rel.sourceId;
      const other = getEntityById(otherId);
      if (other) out.push({ entity: other, relationship: rel });
    }
    return out;
  },
  async getRelationshipsForCase(caseId: string): Promise<Relationship[]> {
    await mockDelay(300);
    return getRelationshipsForCase(caseId);
  },
  async getAllRelationships(): Promise<Relationship[]> {
    await mockDelay(100);
    return mockRelationships;
  },
};
