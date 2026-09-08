import { create } from 'zustand';
import type { FaceDetection, FaceMatch } from '../types';
import { faceService } from '../services/faceService';

interface FaceState {
  status: 'idle' | 'loading' | 'ready' | 'error';
  detections: FaceDetection[];
  matches: FaceMatch[];
  selectedMatchId: string | null;
  scanning: boolean;

  loadForCamera: (cameraId?: string) => Promise<void>;
  loadForCase: (caseId: string, cameraId?: string) => Promise<void>;
  setSelectedMatch: (id: string | null) => void;
  setScanning: (v: boolean) => void;
}

export const useFaceStore = create<FaceState>((set) => ({
  status: 'idle',
  detections: [],
  matches: [],
  selectedMatchId: null,
  scanning: false,

  loadForCamera: async (cameraId) => {
    set({ status: 'loading' });
    const [detections, matches] = await Promise.all([
      faceService.listDetections(cameraId),
      faceService.listMatches(),
    ]);
    set({ detections, matches, status: 'ready' });
  },
  loadForCase: async (caseId, cameraId) => {
    set({ status: 'loading' });
    const [detections, matches] = await Promise.all([
      faceService.listByCase(caseId, cameraId),
      faceService.listMatchesByCase(caseId),
    ]);
    set({ detections, matches, status: 'ready' });
  },
  setSelectedMatch: (id) => set({ selectedMatchId: id }),
  setScanning: (v) => set({ scanning: v }),
}));
