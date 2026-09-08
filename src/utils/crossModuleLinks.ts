// ---------------------------------------------------------------------------
// Small, focused helpers for the handful of cross-module deep links the CCTV
// module needs (CCTV <-> Timeline, CCTV <-> Evidence). These read existing
// data relationships that were already modeled (CCTVEvent.evidenceRef,
// Evidence.sourceRef, and the fact that CCTV-sourced TimelineEvents share an
// exact timestamp with the CCTVEvent they were generated from) rather than
// inventing any new entity or id.
// ---------------------------------------------------------------------------

import { mockTimeline } from '../data';
import type { TimelineEvent } from '../types';

/**
 * Finds the TimelineEvent that corresponds to a given case + timestamp.
 * CCTV-originated timeline entries are authored with the exact same ISO
 * timestamp as the CCTVEvent/FaceDetection they summarize, so this is a
 * precise (not fuzzy) match.
 */
export function findTimelineEventForTimestamp(caseId: string, timestamp: string): TimelineEvent | undefined {
  return mockTimeline.find((t) => t.caseId === caseId && t.timestamp === timestamp);
}

/**
 * Parses an Evidence.sourceRef of the form "CAM-XXX / CE-XXX" or
 * "CAM-XXX / FD-XXX" into its camera id and CCTV-event / face-detection id.
 * Returns null for source refs that don't follow this pattern (financial,
 * call, document evidence, etc. use their own formats and aren't CCTV deep
 * links).
 */
export function parseCctvSourceRef(sourceRef: string): { cameraId: string; refId: string } | null {
  const match = sourceRef.match(/^(CAM-[A-Z0-9-]+)\s*\/\s*(CE-[A-Z0-9-]+|FD-[A-Z0-9-]+)$/i);
  if (!match) return null;
  return { cameraId: match[1].toUpperCase(), refId: match[2].toUpperCase() };
}
