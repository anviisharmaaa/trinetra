import { mockSocialProfiles, mockSocialConnections, mockSocialActivity } from '../data';
import type { SocialProfile, SocialConnection, SocialActivity } from '../types';
import { mockDelay } from '../utils/mockDelay';

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
    await mockDelay(300);
    return mockSocialProfiles.filter((p) => p.caseId === caseId);
  },
};
