import type { FaceDetection, FaceMatch } from '../../types';
import { ALL_BUNDLES } from '../caseBundles';

export const mockFaceDetections: FaceDetection[] = [
  { id: 'FD-001', caseId: 'case-op001', timestamp: '2026-09-04T14:29:16.000Z', cameraId: 'CAM-BW12', frameId: 'F-88231', boundingBox: { x: 0.42, y: 0.21, width: 0.14, height: 0.19 }, identityId: 'P-0042', confidence: 0.942, status: 'matched', attributes: { ageRange: '35-42', direction: 'facing-camera' } },
  { id: 'FD-002', caseId: 'case-op001', timestamp: '2026-09-04T14:31:02.000Z', cameraId: 'CAM-BW12', frameId: 'F-88245', boundingBox: { x: 0.55, y: 0.25, width: 0.12, height: 0.17 }, identityId: 'P-0042', confidence: 0.91, status: 'matched', attributes: { ageRange: '35-42', direction: 'three-quarter' } },
  { id: 'FD-003', caseId: 'case-op001', timestamp: '2026-09-04T14:48:00.000Z', cameraId: 'CAM-AW09', frameId: 'F-40021', boundingBox: { x: 0.3, y: 0.3, width: 0.15, height: 0.2 }, identityId: 'P-0043', confidence: 0.878, status: 'matched', attributes: { ageRange: '28-34' } },
  { id: 'FD-004', caseId: 'case-op001', timestamp: '2026-08-29T21:07:00.000Z', cameraId: 'CAM-OE11', frameId: 'F-11209', boundingBox: { x: 0.6, y: 0.18, width: 0.13, height: 0.18 }, confidence: 0.612, status: 'possible-match', attributes: { ageRange: '30-40', mask: true } },
  { id: 'FD-005', caseId: 'case-op001', timestamp: '2026-08-28T08:20:00.000Z', cameraId: 'CAM-PW08', frameId: 'F-77021', boundingBox: { x: 0.38, y: 0.22, width: 0.14, height: 0.19 }, identityId: 'P-0046', confidence: 0.893, status: 'matched', attributes: { ageRange: '42-50' } },
  { id: 'FD-006', caseId: 'case-op001', timestamp: '2026-08-25T11:30:00.000Z', cameraId: 'CAM-LW07', frameId: 'F-65510', boundingBox: { x: 0.48, y: 0.19, width: 0.12, height: 0.16 }, identityId: 'P-0044', confidence: 0.861, status: 'matched', attributes: { ageRange: '28-34' } },
  { id: 'FD-007', caseId: 'case-op001', timestamp: '2026-08-14T10:02:00.000Z', cameraId: 'CAM-BW02', frameId: 'F-30014', boundingBox: { x: 0.25, y: 0.28, width: 0.13, height: 0.17 }, confidence: 0.334, status: 'unknown', attributes: { ageRange: '25-35' } },
  ...ALL_BUNDLES.flatMap((b) => b.faceDetections),
];

export const mockFaceMatches: FaceMatch[] = mockFaceDetections
  .filter((d) => d.status !== 'unknown')
  .map((d) => ({
    id: `FM-${d.id.slice(3)}`,
    entityId: d.identityId,
    cameraId: d.cameraId,
    timestamp: d.timestamp,
    confidence: d.confidence,
    status: d.status === 'matched' ? 'confirmed' : 'possible',
    boundingBox: d.boundingBox,
    sourceEventId: d.id,
  }));
