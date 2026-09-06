import { LogOut, Keyboard, User, SlidersHorizontal, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';
import { useSessionStore } from '../store/sessionStore';
import { Panel } from '../components/ui/Panel';
import { formatDateTime } from '../utils/formatters';

const SHORTCUTS: { keys: string; action: string }[] = [
  { keys: 'Ctrl / Cmd + K', action: 'Open command palette' },
  { keys: 'Ctrl / Cmd + B', action: 'Toggle sidebar' },
  { keys: 'G', action: 'Go to Network Graph' },
  { keys: 'C', action: 'Go to CCTV' },
  { keys: 'P', action: 'Go to selected Person Dossier' },
  { keys: 'M', action: 'Go to Location / Map' },
  { keys: 'T', action: 'Go to Timeline' },
  { keys: 'Esc', action: 'Close palette / modal' },
];

export function SettingsPage() {
  const navigate = useNavigate();
  const { sidebarMode, setSidebarMode, density, setActiveModal } = useUIStore();
  const { user, logout } = useSessionStore();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="scroll-region stack gap-4" style={{ padding: 24, maxWidth: 760 }}>
      <div className="page-title">SETTINGS</div>

      <Panel title="ANALYST PROFILE" actions={<User size={14} color="var(--cyan)" />}>
        {user ? (
          <div className="stack gap-2">
            <Row label="NAME" value={user.displayName} />
            <Row label="DESIGNATION" value={user.designation} />
            <Row label="UNIT" value={user.unit} />
            <Row label="CLEARANCE LEVEL" value={user.clearanceLevel} />
            <Row label="LAST LOGIN" value={formatDateTime(user.lastLogin)} />
          </div>
        ) : (
          <span className="text-muted" style={{ fontSize: 12 }}>No active session.</span>
        )}
      </Panel>

      <Panel title="INTERFACE" actions={<SlidersHorizontal size={14} color="var(--cyan)" />}>
        <div className="stack gap-3">
          <div>
            <div className="system-label" style={{ marginBottom: 6 }}>LEFT CONTROL PANEL</div>
            <div className="row gap-1">
              {(['expanded', 'compact', 'hidden'] as const).map((m) => (
                <button key={m} type="button" className={`tab ${sidebarMode === m ? 'active' : ''}`} onClick={() => setSidebarMode(m)}>
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="system-label" style={{ marginBottom: 6 }}>DENSITY</div>
            <div className="row gap-1">
              {(['compact', 'comfortable'] as const).map((d) => (
                <button key={d} type="button" className={`tab ${density === d ? 'active' : ''}`} onClick={() => useUIStore.setState({ density: d })}>
                  {d.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="KEYBOARD SHORTCUTS" actions={<Keyboard size={14} color="var(--cyan)" />}>
        <div className="stack gap-2">
          {SHORTCUTS.map((s) => (
            <div key={s.keys} className="row" style={{ justifyContent: 'space-between', fontSize: 12.5 }}>
              <span className="text-secondary">{s.action}</span>
              <span className="mono badge badge-neutral">{s.keys}</span>
            </div>
          ))}
          <button type="button" className="btn btn-sm btn-ghost" style={{ width: 'fit-content', marginTop: 4 }} onClick={() => setActiveModal('shortcuts')}>
            VIEW FULL REFERENCE
          </button>
        </div>
      </Panel>

      <Panel title="SYSTEM" actions={<ShieldAlert size={14} color="var(--warning)" />}>
        <div className="stack gap-2">
          <span className="text-secondary" style={{ fontSize: 12 }}>
            TRINETRA is running in <strong className="text-cyan">SIMULATION MODE</strong>. All data, identities, and records in this
            environment are fictional and generated for demonstration purposes only. Authentication uses a demo credential set and does
            not represent real security controls.
          </span>
          <button type="button" className="btn btn-sm btn-danger" style={{ width: 'fit-content', marginTop: 6 }} onClick={handleLogout}>
            <LogOut size={12} style={{ marginRight: 6, verticalAlign: -2 }} />LOG OUT
          </button>
        </div>
      </Panel>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="row" style={{ justifyContent: 'space-between', fontSize: 12.5 }}>
      <span className="text-muted">{label}</span>
      <span className="mono">{value}</span>
    </div>
  );
}
