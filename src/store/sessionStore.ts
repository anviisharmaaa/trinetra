import { create } from 'zustand';
import type { AnalystUser } from '../types';
import { authService } from '../services/authService';
import { loadJSON, saveJSON, removeKey, loadSessionJSON, saveSessionJSON, removeSessionKey } from '../utils/localStorage';

interface SessionState {
  user: AnalystUser | null;
  isAuthenticated: boolean;
  authError: string | null;
  isAuthenticating: boolean;
  /** `remember` controls whether the demo session survives closing the tab
   *  (persisted to localStorage) or lives only for this browser session
   *  (sessionStorage) — wired to the login screen's "keep me signed in". */
  login: (username: string, password: string, remember?: boolean) => Promise<boolean>;
  logout: () => void;
  restoreSession: () => void;
}

function readInitial(): { user: AnalystUser | null; authed: boolean } {
  const persistedUser = loadJSON<AnalystUser | null>('session.demoUser', null);
  const persistedAuthed = loadJSON<boolean>('session.authenticated', false);
  if (persistedAuthed && persistedUser) return { user: persistedUser, authed: true };
  const sessionUser = loadSessionJSON<AnalystUser | null>('session.demoUser', null);
  const sessionAuthed = loadSessionJSON<boolean>('session.authenticated', false);
  return { user: sessionUser, authed: sessionAuthed };
}

const initial = readInitial();

export const useSessionStore = create<SessionState>((set) => ({
  user: initial.user,
  isAuthenticated: initial.authed,
  authError: null,
  isAuthenticating: false,

  login: async (username, password, remember = true) => {
    set({ isAuthenticating: true, authError: null });
    const result = await authService.login(username, password);
    if (result.success && result.user) {
      // Always clear both storages first so switching "remember" state
      // between logins never leaves a stale copy behind.
      removeKey('session.demoUser');
      removeKey('session.authenticated');
      removeSessionKey('session.demoUser');
      removeSessionKey('session.authenticated');
      const save = remember ? saveJSON : saveSessionJSON;
      save('session.demoUser', result.user);
      save('session.authenticated', true);
      set({ user: result.user, isAuthenticated: true, isAuthenticating: false, authError: null });
      return true;
    }
    set({ isAuthenticating: false, authError: result.error ?? 'Authentication failed.' });
    return false;
  },

  logout: () => {
    removeKey('session.demoUser');
    removeKey('session.authenticated');
    removeSessionKey('session.demoUser');
    removeSessionKey('session.authenticated');
    set({ user: null, isAuthenticated: false });
  },

  restoreSession: () => {
    const { user, authed } = readInitial();
    set({ user, isAuthenticated: authed });
  },
}));
