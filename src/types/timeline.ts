export type TimelineEventType =
  | 'call' | 'message' | 'movement' | 'transaction' | 'cctv' | 'social' | 'document' | 'meeting' | 'alert' | 'case';

export interface TimelineEvent {
  id: string;
  caseId: string;
  timestamp: string;
  title: string;
  description?: string;
  entityIds: string[];
  locationId?: string;
  eventType: TimelineEventType;
  source: string;
  importance: 'high' | 'medium' | 'low';
}
