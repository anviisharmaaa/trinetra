import type { SocialProfile, SocialConnection, SocialActivity } from '../../types';
import { ALL_BUNDLES } from '../caseBundles';

export const mockSocialProfiles: SocialProfile[] = [
  { id: 'SOC-01', caseId: 'case-op001', entityId: 'P-0042', platform: 'X', handle: '@arjun_m88', displayName: 'Arjun M.', followers: 842, following: 310, bio: 'Logistics | Mumbai', verified: false, createdAt: '2019-03-11T00:00:00.000Z', lastActive: '2026-09-04T08:12:00.000Z', riskScore: 0.62 },
  { id: 'SOC-02', caseId: 'case-op001', entityId: 'P-0042', platform: 'Telegram', handle: '@ajmalhotra', displayName: 'AJ', followers: 12, following: 44, createdAt: '2022-06-02T00:00:00.000Z', lastActive: '2026-09-03T22:40:00.000Z', riskScore: 0.71 },
  { id: 'SOC-03', caseId: 'case-op001', entityId: 'P-0043', platform: 'Instagram', handle: '@raju.verma91', displayName: 'Rajat Verma', followers: 1204, following: 588, createdAt: '2018-01-20T00:00:00.000Z', lastActive: '2026-09-04T07:00:00.000Z', riskScore: 0.4 },
  { id: 'SOC-04', caseId: 'case-op001', entityId: 'P-0044', platform: 'LinkedIn', handle: 'priyanka-nair-ca', displayName: 'Priyanka Nair', followers: 340, following: 210, bio: 'Chartered Accountant', verified: true, createdAt: '2016-08-14T00:00:00.000Z', lastActive: '2026-09-01T13:00:00.000Z', riskScore: 0.18 },
  { id: 'SOC-05', caseId: 'case-op001', platform: 'Telegram', handle: '@unknown_transit07', displayName: 'unknown_transit07', followers: 3, following: 9, createdAt: '2025-12-01T00:00:00.000Z', lastActive: '2026-08-29T21:20:00.000Z', riskScore: 0.85 },
  ...ALL_BUNDLES.flatMap((b) => b.socialProfiles),
];

export const mockSocialConnections: SocialConnection[] = [
  { id: 'SC-01', profileId: 'SOC-01', connectedProfileId: 'SOC-03', strength: 0.8, interactionCount: 46, type: 'frequent_contact' },
  { id: 'SC-02', profileId: 'SOC-01', connectedProfileId: 'SOC-02', strength: 0.5, interactionCount: 12, type: 'mutual' },
  { id: 'SC-03', profileId: 'SOC-02', connectedProfileId: 'SOC-05', strength: 0.66, interactionCount: 21, type: 'group_member' },
  { id: 'SC-04', profileId: 'SOC-03', connectedProfileId: 'SOC-04', strength: 0.3, interactionCount: 5, type: 'follows' },
  ...ALL_BUNDLES.flatMap((b) => b.socialConnections),
];

export const mockSocialActivity: SocialActivity[] = [
  { id: 'SA-01', profileId: 'SOC-01', timestamp: '2026-09-04T08:12:00.000Z', content: 'Checked in near Bandra freight yard', type: 'post', locationId: 'loc-001' },
  { id: 'SA-02', profileId: 'SOC-02', timestamp: '2026-09-03T22:40:00.000Z', content: 'Joined group "Konkan Traders Circle"', type: 'login' },
  { id: 'SA-03', profileId: 'SOC-05', timestamp: '2026-08-29T21:20:00.000Z', content: 'Message sent in encrypted channel', type: 'message', locationId: 'loc-004' },
  { id: 'SA-04', profileId: 'SOC-03', timestamp: '2026-09-04T07:00:00.000Z', content: 'Shared post from Meridian Freight page', type: 'share' },
  ...ALL_BUNDLES.flatMap((b) => b.socialActivity),
];

export function getSocialProfilesForCase(caseId: string): SocialProfile[] {
  return mockSocialProfiles.filter((p) => p.caseId === caseId);
}
