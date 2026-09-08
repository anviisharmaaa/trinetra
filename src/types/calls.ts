export interface CallRecord {
  id: string;
  caseId: string;
  fromPhoneId: string;
  toPhoneId: string;
  timestamp: string;
  durationSeconds: number;
  type: 'voice' | 'sms';
  towerLocationId?: string;
  frequencyBand?: 'high' | 'medium' | 'low';
}
