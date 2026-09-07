import type { AnalystUser } from '../types';
import { supabase } from '../utils/supabase/client';

export interface AuthResult {
  success: boolean;
  user?: AnalystUser;
  error?: string;
}

function toAnalystUser(user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }): AnalystUser {
  const displayName = typeof user.user_metadata?.display_name === 'string'
    ? user.user_metadata.display_name
    : user.email?.split('@')[0] ?? 'Analyst';
  const initials = displayName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'AN';
  return {
    id: user.id,
    username: user.email ?? '',
    displayName,
    designation: 'Investigating Officer',
    unit: 'Special Intelligence Unit — Mumbai Zone',
    clearanceLevel: 'L3',
    avatarInitials: initials,
    lastLogin: new Date().toISOString(),
  };
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error || !data.user) return { success: false, error: error?.message ?? 'Unable to sign in.' };
    return { success: true, user: toAnalystUser(data.user) };
  },
  async signup(displayName: string, email: string, password: string): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { display_name: displayName.trim() } },
    });
    if (error || !data.user) return { success: false, error: error?.message ?? 'Unable to create account.' };
    if (!data.session) return { success: false, error: 'Account created. Check your email to confirm your account before signing in.' };
    return { success: true, user: toAnalystUser(data.user) };
  },
  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },
  async getCurrentUser(): Promise<AnalystUser | null> {
    const { data } = await supabase.auth.getUser();
    return data.user ? toAnalystUser(data.user) : null;
  },
};
