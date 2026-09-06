import { mockCurrentUser } from '../data';
import type { AnalystUser } from '../types';
import { mockDelay } from '../utils/mockDelay';

export interface AuthResult {
  success: boolean;
  user?: AnalystUser;
  error?: string;
}

// Mock/demo authentication only. Clearly labelled — never presented as real security.
export const authService = {
  async login(username: string, password: string): Promise<AuthResult> {
    await mockDelay(900);
    if (username.trim().toLowerCase() === 'demo' && password === 'demo') {
      return { success: true, user: mockCurrentUser };
    }
    return { success: false, error: 'INVALID CREDENTIALS. This is a demo environment — use demo / demo.' };
  },
  async logout(): Promise<void> {
    await mockDelay(200);
  },
  async getCurrentUser(): Promise<AnalystUser> {
    await mockDelay(150);
    return mockCurrentUser;
  },
};
