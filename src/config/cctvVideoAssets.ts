// ---------------------------------------------------------------------------
// TRINETRA — Centralized CCTV video asset mapping.
//
// Mirrors the pattern in `imageAssets.ts`: this is the ONLY place that ever
// builds a path into `public/videos/`. No component should hand-roll a
// `/videos/...` string — everything goes through the helpers below.
//
// ARCHITECTURE (do not deviate from this):
//   CAMERA          -> ONE video source file (one physical recording).
//   CCTV EVENT      -> (camera, timestamp) -> that camera's video + a
//                       deterministic short playback offset into it.
//   FACE DETECTION  -> same as above, keyed off the detection's camera.
//
// There is deliberately NO per-event or per-detection video file. Every
// event/detection that shares a camera shares that camera's single MP4 and
// is simply scrubbed to a different point in it. This keeps the asset count
// at "one video per physical camera" (29 today) instead of exploding to one
// per event (106+).
//
// Every path this file returns is a *candidate* — exactly like
// `cctvFrameImage()`. None of it is guaranteed to exist on disk yet. Callers
// MUST treat the returned source as "try this, and handle onError" (see
// <CCTVVideoPlayer>), which is what lets the rest of the app work today,
// before a single MP4 has been recorded, and pick the real files up
// automatically the moment they're dropped into `public/videos/cctv/`.
// ---------------------------------------------------------------------------

import { mockCctvEvents, mockFaceDetections } from '../data';

export const CCTV_VIDEO_DIR = '/videos/cctv';

/**
 * Assumed length (in seconds) of each per-camera archival clip. This is a
 * presentation-layer constant only — it does not need to match the real
 * running time of whatever footage eventually gets dropped in; it just
 * defines the range the deterministic offset below is spread across.
 */
export const CCTV_CLIP_DURATION_SECONDS = 180;

/** camera.id -> the one video file that camera's footage lives in. */
export function cctvVideoSource(cameraId: string): string {
  return `${CCTV_VIDEO_DIR}/${cameraId.toLowerCase()}.mp4`;
}

/** Alias kept for readability at call sites that think in terms of "the camera's video". */
export const cctvVideo = cctvVideoSource;

/**
 * Deterministically derives a stable "somewhere in the middle of the clip"
 * offset from an arbitrary id (an event id, a detection id, ...). Same
 * input always produces the same output, so refreshing the page or
 * revisiting a deep link always seeks to the same point — without needing
 * to persist anything.
 */
function deterministicOffsetSeconds(id: string, durationSeconds: number = CCTV_CLIP_DURATION_SECONDS): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  h = Math.abs(h);
  const margin = 8; // keep clear of the very start/end of the clip
  const usable = Math.max(1, durationSeconds - margin * 2);
  return margin + (h % usable);
}

export interface CctvVideoRef {
  cameraId: string;
  source: string;
  offsetSeconds: number;
  timestamp: string;
}

/** Resolves a CCTVEvent id to the (camera, video source, offset) it should play from. */
export function cctvEventVideo(eventId: string): CctvVideoRef | null {
  const event = mockCctvEvents.find((e) => e.id === eventId);
  if (!event) return null;
  return {
    cameraId: event.cameraId,
    source: cctvVideoSource(event.cameraId),
    offsetSeconds: deterministicOffsetSeconds(event.id),
    timestamp: event.timestamp,
  };
}

/** Convenience accessor when only the offset (not the full ref) is needed. */
export function cctvEventOffset(eventId: string): number {
  return cctvEventVideo(eventId)?.offsetSeconds ?? 0;
}

/** Resolves a FaceDetection id to the (camera, video source, offset) it should play from. */
export function cctvDetectionVideo(detectionId: string): CctvVideoRef | null {
  const detection = mockFaceDetections.find((d) => d.id === detectionId);
  if (!detection) return null;
  return {
    cameraId: detection.cameraId,
    source: cctvVideoSource(detection.cameraId),
    offsetSeconds: deterministicOffsetSeconds(detection.id),
    timestamp: detection.timestamp,
  };
}

/** Convenience accessor when only the offset (not the full ref) is needed. */
export function cctvDetectionOffset(detectionId: string): number {
  return cctvDetectionVideo(detectionId)?.offsetSeconds ?? 0;
}
