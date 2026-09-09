import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore';
import { LoadingState } from '../components/ui/LoadingState';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const isRestoringSession = useSessionStore((s) => s.isRestoringSession);

  // Wait for the initial restoreSession() call (fired once from App.tsx) to
  // finish before deciding whether to redirect. Without this, a hard reload
  // always bounces an authenticated user to /login, because isAuthenticated
  // still holds its initial `false` value while the async session check is
  // still in flight.
  if (isRestoringSession) return <LoadingState label="RESTORING SESSION" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
