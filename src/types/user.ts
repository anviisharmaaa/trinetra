export interface AnalystUser {
  id: string;
  username: string;
  displayName: string;
  designation: string;
  unit: string;
  clearanceLevel: 'L1' | 'L2' | 'L3' | 'L4';
  avatarInitials: string;
  lastLogin: string;
}
