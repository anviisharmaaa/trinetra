import { mockFaceDetections, mockFaceMatches } from '../data';
import type { FaceDetection, FaceMatch } from '../types';
import { mockDelay } from '../utils/mockDelay';

export const faceService = {
  async listDetections(cameraId?: string): Promise<FaceDetection[]> {
    await mockDelay(450);
    return cameraId ? mockFaceDetections.filter((d) => d.cameraId === cameraId) : mockFaceDetections;
  },
  async listMatches(entityId?: string): Promise<FaceMatch[]> {
    await mockDelay(400);
    return entityId ? mockFaceMatches.filter((m) => m.entityId === entityId) : mockFaceMatches;
  },
  async listByCase(caseId: string, cameraId?: string): Promise<FaceDetection[]> {
    await mockDelay(450);
    return mockFaceDetections.filter((d) => d.caseId === caseId && (!cameraId || d.cameraId === cameraId));
  },
  async listMatchesByCase(caseId: string): Promise<FaceMatch[]> {
    await mockDelay(400);
    const caseDetectionIds = new Set(mockFaceDetections.filter((d) => d.caseId === caseId).map((d) => d.id));
    return mockFaceMatches.filter((m) => caseDetectionIds.has(m.sourceEventId));
  },
};
