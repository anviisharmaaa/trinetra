import { mockSocialProfiles, mockSocialConnections, mockSocialActivity } from '../data';
import type { SocialProfile, SocialConnection, SocialActivity } from '../types';
import { mockDelay } from '../utils/mockDelay';
import { caseService } from './caseService';
import { personService } from './personService';

function mapSocialRows(rows: Array<Record<string, unknown>>, caseId: string): SocialProfile[] {
  return rows.map((row) => {
    const personId = String((row.person_id ?? row.personId ?? '') || '');
    const platform = String(row.platform ?? 'Unknown');
    const handle = String(row.username ?? row.handle ?? `@${row.social_account_id ?? 'profile'}`);
    const displayName = String(row.profile_name ?? row.name ?? handle);
    const followerBand = String(row.follower_band ?? '0');
    const followerValue = Number(followerBand.replace(/[^\d.]/g, '')) || 0;
    return {
      id: String(row.social_account_id ?? row.id ?? `${personId}-${platform}`),
      caseId,
      entityId: personId || undefined,
      platform: (platform === 'X' || platform === 'Instagram' || platform === 'Facebook' || platform === 'Telegram' || platform === 'WhatsApp' || platform === 'LinkedIn') ? platform : 'X',
      handle,
      displayName,
      followers: followerValue,
      following: Math.max(0, Math.round(followerValue * 0.7)),
      bio: undefined,
      verified: Boolean(row.status === 'active'),
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      riskScore: Number(row.risk_level === 'high' ? 0.8 : row.risk_level === 'medium' ? 0.5 : row.risk_level === 'critical' ? 0.9 : 0.2),
    };
  });
}

export const socialMediaService = {
  async getProfilesForEntity(entityId: string): Promise<SocialProfile[]> {
    await mockDelay(450);
    return mockSocialProfiles.filter((p) => p.entityId === entityId);
  },
  async getConnections(profileId: string): Promise<SocialConnection[]> {
    await mockDelay(350);
    return mockSocialConnections.filter((c) => c.profileId === profileId || c.connectedProfileId === profileId);
  },
  async getActivity(profileId: string): Promise<SocialActivity[]> {
    await mockDelay(350);
    return mockSocialActivity.filter((a) => a.profileId === profileId);
  },
  async search(query: string): Promise<SocialProfile[]> {
    await mockDelay(500);
    const q = query.toLowerCase();
    return mockSocialProfiles.filter((p) => p.handle.toLowerCase().includes(q) || p.displayName.toLowerCase().includes(q));
  },
  async allProfiles(): Promise<SocialProfile[]> {
    await mockDelay(300);
    return mockSocialProfiles;
  },
  async listByCase(caseId: string): Promise<SocialProfile[]> {
    await mockDelay(250);
    const personIds = (await caseService.getCasePersonIds(caseId)).allPersonIds;
    if (personIds.length) {
      const liveRows = await personService.getRecordsForPeople(personIds, 'social-media');
      const mapped = mapSocialRows(liveRows, caseId);
      if (mapped.length) return mapped;
    }
    return mockSocialProfiles.filter((p) => p.caseId === caseId);
  },
};
