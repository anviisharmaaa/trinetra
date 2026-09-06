import { Outlet, useParams } from 'react-router-dom';
import { TopBar } from './TopBar';
import { BottomNavigation } from './BottomNavigation';
import { AIAssistant } from './AIAssistant';
import { GlobalOverlays } from './GlobalOverlays';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

// The case investigation workspace has no permanent left sidebar — navigation
// between the 15 case modules happens via the horizontal CaseModuleNav tab
// bar rendered inside CaseWorkspaceLayout, matching the reference UI.
export function AppShell() {
  const { caseId } = useParams();
  useKeyboardShortcuts(caseId);

  return (
    <div className="app-shell">
      <TopBar />
      <div className="workspace" data-sidebar="hidden">
        <main className="main-workspace">
          <Outlet />
        </main>
      </div>
      <BottomNavigation />
      <AIAssistant />
      <GlobalOverlays />
    </div>
  );
}
