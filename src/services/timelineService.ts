import { mockTimeline } from '../data';
import type { TimelineEvent, TimelineEventType } from '../types';
import { mockDelay } from '../utils/mockDelay';

export interface TimelineFilters {
  entityId?: string;
  locationId?: string;
  types?: TimelineEventType[];
  from?: string;
  to?: string;
}

export const timelineService = {
  async listByCase(caseId: string, filters?: TimelineFilters): Promise<TimelineEvent[]> {
    await mockDelay(450);
    return mockTimeline
      .filter((e) => e.caseId === caseId)
      .filter((e) => !filters?.entityId || e.entityIds.includes(filters.entityId))
      .filter((e) => !filters?.locationId || e.locationId === filters.locationId)
      .filter((e) => !filters?.types?.length || filters.types.includes(e.eventType))
      .filter((e) => !filters?.from || e.timestamp >= filters.from)
      .filter((e) => !filters?.to || e.timestamp <= filters.to)
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  },
};
