import { create } from 'zustand';
import type { AnalystUser } from '../types';
import { authService } from '../services/authService';

interface SessionState {
  user: AnalystUser | null;
  isAuthenticated: boolean;
  authError: string | null;
  isAuthenticating: boolean;
  /** True until the initial restoreSession() call (fired once on app mount)
   * has resolved. ProtectedRoute must wait for this before deciding whether
   * to redirect to /login — otherwise a hard reload always bounces an
   * already-authenticated user, because isAuthenticated still holds its
   * initial `false` value at that point. */
  isRestoringSession: boolean;
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
  isRestoringSession: true,

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
    try {
      const user = await authService.getCurrentUser();
      set({ user, isAuthenticated: !!user });
    } finally {
      set({ isRestoringSession: false });
    }
  },
}));
