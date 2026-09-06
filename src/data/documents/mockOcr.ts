import type { OcrEntity } from '../../types';
import { ALL_BUNDLES } from '../caseBundles';

export const mockOcrEntities: OcrEntity[] = [
  { id: 'OCR-01', documentId: 'DOC-01', page: 1, text: 'Arjun Malhotra', entityType: 'PERSON', confidence: 0.98, boundingBox: { x: 0.3, y: 0.22, width: 0.28, height: 0.04 }, linkedEntityId: 'P-0042' },
  { id: 'OCR-02', documentId: 'DOC-01', page: 1, text: 'XXXX XXXX 4821', entityType: 'ID_NUMBER', confidence: 0.95, boundingBox: { x: 0.3, y: 0.3, width: 0.24, height: 0.035 }, linkedEntityId: 'P-0042' },
  { id: 'OCR-03', documentId: 'DOC-01', page: 1, text: 'Bandra West, Mumbai', entityType: 'LOCATION', confidence: 0.9, boundingBox: { x: 0.3, y: 0.4, width: 0.32, height: 0.035 }, linkedEntityId: 'loc-001' },
  { id: 'OCR-04', documentId: 'DOC-02', page: 1, text: 'HDFC0001234', entityType: 'ACCOUNT', confidence: 0.93, boundingBox: { x: 0.5, y: 0.12, width: 0.22, height: 0.03 }, linkedEntityId: 'ACC-01' },
  { id: 'OCR-05', documentId: 'DOC-02', page: 3, text: '+91 98765 43210', entityType: 'PHONE', confidence: 0.88, boundingBox: { x: 0.15, y: 0.6, width: 0.24, height: 0.03 }, linkedEntityId: 'PH-1001' },
  { id: 'OCR-06', documentId: 'DOC-03', page: 1, text: 'Meridian Freight Logistics', entityType: 'ORGANIZATION', confidence: 0.97, boundingBox: { x: 0.2, y: 0.18, width: 0.4, height: 0.04 }, linkedEntityId: 'ORG-01' },
  { id: 'OCR-07', documentId: 'DOC-03', page: 1, text: 'Konnect Traders Pvt Ltd', entityType: 'ORGANIZATION', confidence: 0.96, boundingBox: { x: 0.2, y: 0.26, width: 0.38, height: 0.04 }, linkedEntityId: 'ORG-02' },
  { id: 'OCR-08', documentId: 'DOC-03', page: 2, text: '08 Jul 2026', entityType: 'DATE', confidence: 0.9, boundingBox: { x: 0.6, y: 0.1, width: 0.2, height: 0.03 } },
  { id: 'OCR-09', documentId: 'DOC-04', page: 1, text: 'Plot 14, Chembur Industrial Estate', entityType: 'LOCATION', confidence: 0.91, boundingBox: { x: 0.18, y: 0.34, width: 0.42, height: 0.035 }, linkedEntityId: 'loc-006' },
  ...ALL_BUNDLES.flatMap((b) => b.ocrEntities),
];
