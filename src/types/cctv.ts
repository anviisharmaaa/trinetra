export interface Camera {
  id: string;
  name: string;
  code: string;
  locationId: string;
  status: 'online' | 'offline';
  coordinates: { lat: number; lng: number };
  coverage: string;
}

export interface CCTVEvent {
  id: string;
  cameraId: string;
  caseId: string;
  timestamp: string;
  entityIds: string[];
  eventType: 'person_detected' | 'vehicle_detected' | 'face_match' | 'movement';
  confidence: number;
  evidenceRef?: string;
  thumbnailColor?: string;
}

export interface Movement {
  id: string;
  entityId: string;
  caseId: string;
  fromLocationId: string;
  toLocationId: string;
  timestamp: string;
  cameraId?: string;
}
