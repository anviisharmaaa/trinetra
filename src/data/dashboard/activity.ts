export type ActivityTone = 'danger' | 'info' | 'warning' | 'neutral';

export interface ActivityItem {
  id: string;
  timestamp: string; // ISO
  message: string;
  caseCode?: string;
  tone: ActivityTone;
}

/** Offsets are computed from "now" (rather than fixed ISO strings) so the
 *  Recent Activity feed always reads as live/fresh, however long ago this
 *  mock module was loaded relative to when someone opens the dashboard. */
function minutesAgo(mins: number): string {
  return new Date(Date.now() - mins * 60_000).toISOString();
}

export const DASHBOARD_ACTIVITY: ActivityItem[] = [
  { id: 'act-1', timestamp: minutesAgo(2), message: 'New entity linked to OP-003', caseCode: 'OP-003', tone: 'danger' },
  { id: 'act-2', timestamp: minutesAgo(14), message: 'Phone number match found', caseCode: 'OP-003', tone: 'info' },
  { id: 'act-3', timestamp: minutesAgo(60), message: 'Location data added to OP-002', caseCode: 'OP-002', tone: 'warning' },
  { id: 'act-4', timestamp: minutesAgo(180), message: 'New document uploaded', caseCode: 'OP-001', tone: 'neutral' },
  { id: 'act-5', timestamp: minutesAgo(300), message: 'Alert triggered in OP-001', caseCode: 'OP-001', tone: 'danger' },
  { id: 'act-6', timestamp: minutesAgo(430), message: 'Financial pattern flagged for review', caseCode: 'OP-003', tone: 'warning' },
  { id: 'act-7', timestamp: minutesAgo(560), message: 'Vehicle sighting logged near Konkan coastline', caseCode: 'OP-002', tone: 'info' },
];
