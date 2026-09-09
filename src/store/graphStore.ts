import { create } from 'zustand';
import type { Entity, EntityType, Relationship, RelationshipType } from '../types';
import { graphService } from '../services/graphService';
import { ApiUnavailableError } from '../services/apiClient';
import { pickDefaultCenter, groupKey } from '../components/graph/subjectGraph';

// Network Analysis intentionally never renders the whole case graph at
// once — see subjectGraph.ts / radialLayout.ts. This store just holds the
// case's full entity/relationship pool plus the small amount of UI state
// that decides which *bounded* slice of it is currently drawn: which
// subject is centered, which overflow groups have been expanded, which
// view/layout mode is active.
export type GraphViewMode = 'graph' | 'table';
export type GraphLayout = 'radial' | 'hierarchical' | 'force-directed';
export type LoadStatus = 'idle' | 'loading' | 'partial' | 'ready' | 'error';

interface GraphFilters {
  entityTypes: Set<EntityType>;
  relationshipTypes: Set<RelationshipType>;
  minStrength: number;
}

interface GraphState {
  status: LoadStatus;
  error: string | null;
  entities: Entity[];
  relationships: Relationship[];
  hiddenIds: Set<string>;
  layout: GraphLayout;
  viewMode: GraphViewMode;
  filters: GraphFilters;
  searchQuery: string;
  centerEntityId: string | null;
  primarySubjectId: string | null;
  expandedGroups: Set<string>;

  /** `realPersonIds`: Person IDs linked to this case that live in the real
   * Master Dataset backend (not the small in-memory demo dataset) — see
   * NetworkAnalysisPage, which derives this from the active case's
   * victim/suspect Person IDs. */
  loadCaseGraph: (caseId: string, realPersonIds?: string[]) => Promise<void>;
  expandEntity: (entityId: string) => Promise<void>;
  hideEntity: (id: string) => void;
  resetHidden: () => void;
  setLayout: (l: GraphLayout) => void;
  setViewMode: (v: GraphViewMode) => void;
  setSearchQuery: (q: string) => void;
  toggleEntityTypeFilter: (t: EntityType) => void;
  toggleRelationshipTypeFilter: (t: RelationshipType) => void;
  setMinStrength: (v: number) => void;
  resetFilters: () => void;
  setCenter: (entityId: string) => void;
  expandGroup: (type: EntityType) => void;
  collapseAllGroups: () => void;
}

const ALL_ENTITY_TYPES: EntityType[] = ['person', 'vehicle', 'phone', 'social', 'organization', 'location', 'device', 'document', 'account', 'incident'];
const ALL_REL_TYPES: RelationshipType[] = ['called', 'messaged', 'associated', 'owned', 'located_at', 'visited', 'works_for', 'connected_to', 'appeared_near', 'transferred_to', 'identified_by', 'family_of', 'financed_by'];

function defaultFilters(): GraphFilters {
  return { entityTypes: new Set(ALL_ENTITY_TYPES), relationshipTypes: new Set(ALL_REL_TYPES), minStrength: 0 };
}

export const useGraphStore = create<GraphState>((set) => ({
  status: 'idle',
  error: null,
  entities: [],
  relationships: [],
  hiddenIds: new Set(),
  layout: 'radial',
  viewMode: 'graph',
  filters: defaultFilters(),
  searchQuery: '',
  centerEntityId: null,
  primarySubjectId: null,
  expandedGroups: new Set(),

  loadCaseGraph: async (caseId, realPersonIds = []) => {
    set({ status: 'loading', error: null, hiddenIds: new Set(), expandedGroups: new Set() });
    try {
      const data = await graphService.getCaseGraph(caseId, realPersonIds);
      const defaultCenter = pickDefaultCenter(data.entities, data.relationships);
      set({
        entities: data.entities,
        relationships: data.relationships,
        status: 'ready',
        centerEntityId: defaultCenter?.id ?? null,
        primarySubjectId: defaultCenter?.id ?? null,
      });
    } catch (err) {
      // A real (Master Dataset) case whose backend is unreachable gets an
      // explicit, distinct error — never a silent empty/mock graph.
      const message = err instanceof ApiUnavailableError
        ? 'MASTER DATASET BACKEND UNAVAILABLE'
        : 'DATA SOURCE UNAVAILABLE';
      set({ status: 'error', error: message });
    }
  },
  expandEntity: async (entityId) => {
    set({ status: 'partial' });
    try {
      const data = await graphService.expandEntity(entityId);
      set((s) => {
        const existingIds = new Set(s.entities.map((e) => e.id));
        const newEntities = data.entities.filter((e) => !existingIds.has(e.id));
        const existingRelIds = new Set(s.relationships.map((r) => r.id));
        const newRels = data.relationships.filter((r) => !existingRelIds.has(r.id));
        return { entities: [...s.entities, ...newEntities], relationships: [...s.relationships, ...newRels], status: 'ready' };
      });
    } catch {
      set({ status: 'error', error: 'EXPAND FAILED' });
    }
  },
  hideEntity: (id) => set((s) => ({ hiddenIds: new Set([...s.hiddenIds, id]) })),
  resetHidden: () => set({ hiddenIds: new Set() }),
  setLayout: (l) => set({ layout: l }),
  setViewMode: (v) => set({ viewMode: v }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  toggleEntityTypeFilter: (t) =>
    set((s) => {
      const next = new Set(s.filters.entityTypes);
      if (next.has(t)) next.delete(t); else next.add(t);
      return { filters: { ...s.filters, entityTypes: next } };
    }),
  toggleRelationshipTypeFilter: (t) =>
    set((s) => {
      const next = new Set(s.filters.relationshipTypes);
      if (next.has(t)) next.delete(t); else next.add(t);
      return { filters: { ...s.filters, relationshipTypes: next } };
    }),
  setMinStrength: (v) => set((s) => ({ filters: { ...s.filters, minStrength: v } })),
  resetFilters: () => set({ filters: defaultFilters(), searchQuery: '' }),
  setCenter: (entityId) => set({ centerEntityId: entityId }),
  expandGroup: (type) => set((s) => {
    if (!s.centerEntityId) return s;
    const next = new Set(s.expandedGroups);
    next.add(groupKey(s.centerEntityId, type));
    return { expandedGroups: next };
  }),
  collapseAllGroups: () => set({ expandedGroups: new Set() }),
}));

export { ALL_ENTITY_TYPES, ALL_REL_TYPES };
export const pickDefaultGraphCenter = pickDefaultCenter;
