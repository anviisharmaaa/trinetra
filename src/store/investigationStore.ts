import { create } from 'zustand';

// The single most important architectural concept in Trinetra: every
// intelligence module (graph, CCTV, face recognition, map, timeline,
// dossier) reads and writes the SAME selection state here. Selecting an
// entity anywhere in the app makes it "the" selected entity everywhere.
export type IntelligenceModule =
  | 'overview' | 'network' | 'person' | 'social' | 'calls' | 'criminal'
  | 'cctv' | 'face' | 'location' | 'financial' | 'documents' | 'forensics'
  | 'evidence' | 'reports' | 'timeline' | 'alerts';

interface InvestigationState {
  selectedEntityId: string | null;
  selectedRelationshipId: string | null;
  selectedLocationId: string | null;
  selectedCameraId: string | null;
  selectedTimestamp: string | null;
  activeModule: IntelligenceModule;

  selectEntity: (id: string | null, opts?: { openDrawer?: boolean }) => void;
  selectRelationship: (id: string | null) => void;
  selectLocation: (id: string | null) => void;
  selectCamera: (id: string | null) => void;
  selectTimestamp: (ts: string | null) => void;
  setActiveModule: (m: IntelligenceModule) => void;
  clearSelection: () => void;
}

export const useInvestigationStore = create<InvestigationState>((set) => ({
  selectedEntityId: null,
  selectedRelationshipId: null,
  selectedLocationId: null,
  selectedCameraId: null,
  selectedTimestamp: null,
  activeModule: 'overview',

  selectEntity: (id) => set({ selectedEntityId: id, selectedRelationshipId: null }),
  selectRelationship: (id) => set({ selectedRelationshipId: id, selectedEntityId: null }),
  selectLocation: (id) => set({ selectedLocationId: id }),
  selectCamera: (id) => set({ selectedCameraId: id }),
  selectTimestamp: (ts) => set({ selectedTimestamp: ts }),
  setActiveModule: (m) => set({ activeModule: m }),
  clearSelection: () =>
    set({ selectedEntityId: null, selectedRelationshipId: null, selectedLocationId: null, selectedCameraId: null }),
}));
