export type EvidenceType = 'cctv' | 'call' | 'document' | 'financial' | 'social' | 'forensic' | 'face';

export interface Evidence {
  id: string;
  caseId: string;
  type: EvidenceType;
  title: string;
  description: string;
  collectedAt: string;
  collectedBy: string;
  entityIds: string[];
  sourceRef: string;
  confidence?: number;
  chainOfCustody: { actor: string; action: string; timestamp: string }[];
  tags: string[];
}

export interface OcrEntity {
  id: string;
  documentId: string;
  page: number;
  text: string;
  entityType: 'PERSON' | 'LOCATION' | 'PHONE' | 'ACCOUNT' | 'ORGANIZATION' | 'DATE' | 'ID_NUMBER';
  confidence: number;
  boundingBox: { x: number; y: number; width: number; height: number };
  linkedEntityId?: string;
}

export interface Alert {
  id: string;
  caseId: string;
  timestamp: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  entityIds: string[];
  acknowledged: boolean;
  source: string;
}
