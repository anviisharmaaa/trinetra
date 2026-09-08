import type { OrganizationEntity, DeviceEntity, AccountEntity, DocumentEntity } from '../../types';
import { ALL_BUNDLES } from '../caseBundles';

export const mockOrganizations: OrganizationEntity[] = [
  {
    id: 'ORG-01', caseIds: ['case-op001'], type: 'organization', name: 'Meridian Freight Logistics', status: 'active', riskLevel: 'high',
    metadata: { sector: 'Freight & Logistics', registrationId: 'U63090MH2014PTC251882', address: 'Plot 14, Chembur Industrial Estate, Mumbai', memberIds: ['P-0042', 'P-0043', 'P-0046', 'P-0048'] },
    sourceIds: ['src-mca-01'], createdAt: '2026-06-12T09:00:00.000Z', updatedAt: '2026-09-01T09:00:00.000Z',
  },
  {
    id: 'ORG-02', caseIds: ['case-op001'], type: 'organization', name: 'Konnect Traders Pvt Ltd', status: 'active', riskLevel: 'medium',
    metadata: { sector: 'General Trading', registrationId: 'U51909MH2018PTC312440', address: 'Sunview Towers, Lower Parel, Mumbai', memberIds: ['P-0044'] },
    sourceIds: ['src-mca-01'], createdAt: '2026-06-18T09:00:00.000Z', updatedAt: '2026-08-28T09:00:00.000Z',
  },
  ...ALL_BUNDLES.flatMap((b) => b.organizations),
];

export const mockDevices: DeviceEntity[] = [
  { id: 'DEV-01', caseIds: ['case-op001'], type: 'device', name: 'Samsung Galaxy S23 (Arjun Malhotra)', status: 'active', metadata: { deviceType: 'smartphone', serialNumber: 'SM-S911B-88231', ownerId: 'P-0042', os: 'Android 15' }, sourceIds: ['src-forensic-01'], createdAt: '2026-07-10T09:00:00.000Z', updatedAt: '2026-08-20T09:00:00.000Z' },
  ...ALL_BUNDLES.flatMap((b) => b.devices),
];

export const mockAccounts: AccountEntity[] = [
  { id: 'ACC-01', caseIds: ['case-op001'], type: 'account', name: 'HDFC •••• 4821 (Arjun Malhotra)', status: 'active', metadata: { accountNumber: 'XXXXXXXX4821', bankName: 'HDFC Bank', ifsc: 'HDFC0001234', ownerId: 'P-0042', balance: 842300 }, sourceIds: ['src-financial-01'], createdAt: '2026-06-12T09:00:00.000Z', updatedAt: '2026-09-01T09:00:00.000Z' },
  { id: 'ACC-02', caseIds: ['case-op001'], type: 'account', name: 'UPI arjun.m@okhdfc', status: 'active', metadata: { accountNumber: 'arjun.m@okhdfc', bankName: 'HDFC Bank (UPI)', ownerId: 'P-0042' }, sourceIds: ['src-financial-01'], createdAt: '2026-06-12T09:00:00.000Z', updatedAt: '2026-09-01T09:00:00.000Z' },
  { id: 'ACC-03', caseIds: ['case-op001'], type: 'account', name: 'ICICI •••• 1190 (Rajat Verma)', status: 'active', metadata: { accountNumber: 'XXXXXXXX1190', bankName: 'ICICI Bank', ifsc: 'ICIC0002345', ownerId: 'P-0043', balance: 214500 }, sourceIds: ['src-financial-01'], createdAt: '2026-06-14T09:00:00.000Z', updatedAt: '2026-08-30T09:00:00.000Z' },
  { id: 'ACC-04', caseIds: ['case-op001'], type: 'account', name: 'Axis •••• 7734 (Priyanka Nair)', status: 'active', metadata: { accountNumber: 'XXXXXXXX7734', bankName: 'Axis Bank', ifsc: 'UTIB0003456', ownerId: 'P-0044', balance: 118900 }, sourceIds: ['src-financial-01'], createdAt: '2026-06-18T09:00:00.000Z', updatedAt: '2026-09-02T09:00:00.000Z' },
  { id: 'ACC-05', caseIds: ['case-op001'], type: 'account', name: 'Konnect Traders — Current A/C', status: 'active', metadata: { accountNumber: 'XXXXXXXX9021', bankName: 'Axis Bank', ifsc: 'UTIB0003456', ownerId: 'ORG-02', balance: 4210000 }, sourceIds: ['src-financial-01'], createdAt: '2026-06-18T09:00:00.000Z', updatedAt: '2026-09-02T09:00:00.000Z' },
  { id: 'ACC-06', caseIds: ['case-op001'], type: 'account', name: 'SBI •••• 2290 (Vikram Singh Rathore)', status: 'active', metadata: { accountNumber: 'XXXXXXXX2290', bankName: 'State Bank of India', ifsc: 'SBIN0004567', ownerId: 'P-0046', balance: 1620000 }, sourceIds: ['src-financial-01'], createdAt: '2026-06-20T09:00:00.000Z', updatedAt: '2026-09-01T09:00:00.000Z' },
  { id: 'ACC-07', caseIds: ['case-op001'], type: 'account', name: 'PNB •••• 5563 (Sana Ali)', status: 'active', riskLevel: 'medium', metadata: { accountNumber: 'XXXXXXXX5563', bankName: 'Punjab National Bank', ifsc: 'PUNB0005678', ownerId: 'P-0047', balance: 4200 }, sourceIds: ['src-financial-02'], createdAt: '2026-07-05T09:00:00.000Z', updatedAt: '2026-08-30T09:00:00.000Z' },
  ...ALL_BUNDLES.flatMap((b) => b.accounts),
];

export const mockDocuments: DocumentEntity[] = [
  { id: 'DOC-01', caseIds: ['case-op001'], type: 'document', name: 'Aadhaar_ArjunMalhotra.pdf', status: 'active', metadata: { fileName: 'Aadhaar_ArjunMalhotra.pdf', fileType: 'identity', pages: 1, uploadedAt: '2026-07-01T09:00:00.000Z', tags: ['identity'] }, sourceIds: ['src-doc-01'], createdAt: '2026-07-01T09:00:00.000Z', updatedAt: '2026-07-01T09:00:00.000Z' },
  { id: 'DOC-02', caseIds: ['case-op001'], type: 'document', name: 'HDFC_StatementQ2_ArjunMalhotra.pdf', status: 'active', metadata: { fileName: 'HDFC_StatementQ2_ArjunMalhotra.pdf', fileType: 'financial', pages: 6, uploadedAt: '2026-07-03T09:00:00.000Z', tags: ['financial'] }, sourceIds: ['src-doc-02'], createdAt: '2026-07-03T09:00:00.000Z', updatedAt: '2026-07-03T09:00:00.000Z' },
  { id: 'DOC-03', caseIds: ['case-op001'], type: 'document', name: 'FreightContract_MeridianKonnect.pdf', status: 'active', metadata: { fileName: 'FreightContract_MeridianKonnect.pdf', fileType: 'contract', pages: 4, uploadedAt: '2026-07-08T09:00:00.000Z', tags: ['contract'] }, sourceIds: ['src-doc-03'], createdAt: '2026-07-08T09:00:00.000Z', updatedAt: '2026-07-08T09:00:00.000Z' },
  { id: 'DOC-04', caseIds: ['case-op001'], type: 'document', name: 'LeaseAgreement_ChemburWarehouse.pdf', status: 'active', metadata: { fileName: 'LeaseAgreement_ChemburWarehouse.pdf', fileType: 'property', pages: 3, uploadedAt: '2026-07-12T09:00:00.000Z', tags: ['property'] }, sourceIds: ['src-doc-04'], createdAt: '2026-07-12T09:00:00.000Z', updatedAt: '2026-07-12T09:00:00.000Z' },
  ...ALL_BUNDLES.flatMap((b) => b.documents),
];
