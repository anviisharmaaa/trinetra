import { create } from 'zustand';
import type { AnalystUser } from '../types';
import { authService } from '../services/authService';

interface SessionState {
  user: AnalystUser | null;
  isAuthenticated: boolean;
  authError: string | null;
  isAuthenticating: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (displayName: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  isAuthenticated: false,
  authError: null,
  isAuthenticating: false,

  login: async (email, password) => {
    set({ isAuthenticating: true, authError: null });
    const result = await authService.login(email, password);
    if (result.success && result.user) {
      set({ user: result.user, isAuthenticated: true, isAuthenticating: false, authError: null });
      return true;
    }
    set({ isAuthenticating: false, authError: result.error ?? 'Authentication failed.' });
    return false;
  },

  signup: async (displayName, email, password) => {
    set({ isAuthenticating: true, authError: null });
    const result = await authService.signup(displayName, email, password);
    if (result.success && result.user) {
      set({ user: result.user, isAuthenticated: true, isAuthenticating: false, authError: null });
      return true;
    }
    set({ isAuthenticating: false, authError: result.error ?? 'Unable to create account.' });
    return false;
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, isAuthenticated: false });
  },

  restoreSession: async () => {
    const user = await authService.getCurrentUser();
    set({ user, isAuthenticated: !!user });
  },
}));
