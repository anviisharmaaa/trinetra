import { mockCameras, mockCctvEvents, mockMovements } from '../data';
import type { Camera, CCTVEvent, Movement } from '../types';
import { mockDelay } from '../utils/mockDelay';

export const cctvService = {
  async listCameras(caseId: string): Promise<Camera[]> {
    await mockDelay(350);
    const locIds = new Set(
      mockCctvEvents.filter((e) => e.caseId === caseId).map((e) => e.cameraId),
    );
    return mockCameras.filter((c) => locIds.has(c.id));
  },
  async listEvents(caseId: string, opts?: { cameraId?: string; entityId?: string }): Promise<CCTVEvent[]> {
    await mockDelay(500);
    return mockCctvEvents.filter((e) => {
      if (e.caseId !== caseId) return false;
      if (opts?.cameraId && e.cameraId !== opts.cameraId) return false;
      if (opts?.entityId && !e.entityIds.includes(opts.entityId)) return false;
      return true;
    });
  },
  async listMovements(caseId: string): Promise<Movement[]> {
    await mockDelay(300);
    return mockMovements.filter((m) => m.caseId === caseId);
  },
};
