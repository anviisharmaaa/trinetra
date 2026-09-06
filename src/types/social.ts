export interface SocialProfile {
  id: string;
  caseId?: string;
  entityId?: string;
  platform: 'X' | 'Instagram' | 'Facebook' | 'Telegram' | 'WhatsApp' | 'LinkedIn';
  handle: string;
  displayName: string;
  followers: number;
  following: number;
  bio?: string;
  verified?: boolean;
  createdAt: string;
  lastActive: string;
  riskScore?: number;
}

export interface SocialConnection {
  id: string;
  profileId: string;
  connectedProfileId: string;
  strength: number;
  interactionCount: number;
  type: 'follows' | 'mutual' | 'frequent_contact' | 'group_member';
}

export interface SocialActivity {
  id: string;
  profileId: string;
  timestamp: string;
  content: string;
  type: 'post' | 'comment' | 'share' | 'login' | 'message';
  locationId?: string;
}
