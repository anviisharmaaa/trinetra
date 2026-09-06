export interface FaceDetection {
  id: string;
  caseId?: string;
  timestamp: string;
  cameraId: string;
  frameId: string;
  boundingBox: { x: number; y: number; width: number; height: number };
  identityId?: string;
  confidence: number;
  status: 'matched' | 'possible-match' | 'unknown';
  attributes?: {
    ageRange?: string;
    direction?: string;
    mask?: boolean;
  };
}

export interface FaceMatch {
  id: string;
  entityId?: string;
  cameraId: string;
  timestamp: string;
  confidence: number;
  status: 'confirmed' | 'possible' | 'unknown';
  boundingBox: { x: number; y: number; width: number; height: number };
  sourceEventId: string;
}
