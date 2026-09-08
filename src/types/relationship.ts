export type RelationshipType =
  | 'called'
  | 'messaged'
  | 'associated'
  | 'owned'
  | 'located_at'
  | 'visited'
  | 'works_for'
  | 'connected_to'
  | 'appeared_near'
  | 'transferred_to'
  | 'identified_by'
  | 'family_of'
  | 'financed_by';

export interface Relationship {
  id: string;
  caseId: string;
  sourceId: string;
  targetId: string;
  type: RelationshipType;
  label: string;
  strength: number; // 0-1
  confidence?: number;
  direction?: 'directed' | 'undirected';
  metadata: Record<string, unknown>;
  sourceIds: string[];
  createdAt: string;
}
