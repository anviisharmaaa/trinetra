import { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Search, LogOut, ShieldCheck, Command, Bell, ChevronDown, User, Settings, HelpCircle, Keyboard } from 'lucide-react';
import { useSystemTime } from '../../hooks/useSystemTime';
import { useSessionStore } from '../../store/sessionStore';
import { useUIStore } from '../../store/uiStore';
import { useCaseStore } from '../../store/caseStore';
import { useClickOutside } from '../../hooks/useClickOutside';
import { initials, formatRelativeTime } from '../../utils/formatters';
import { DASHBOARD_ACTIVITY } from '../../data/dashboard/activity';
import trinetraMark from '../../assets/logos/trinetra-mark.png';

const NOTIFICATIONS = DASHBOARD_ACTIVITY.filter((a) => a.tone === 'danger' || a.tone === 'warning');

export function TopBar() {
  const now = useSystemTime();
  const navigate = useNavigate();
  const params = useParams();
  const user = useSessionStore((s) => s.user);
  const logout = useSessionStore((s) => s.logout);
  const openCommandPalette = useUIStore((s) => s.openCommandPalette);
  const pushToast = useUIStore((s) => s.pushToast);
  const cases = useCaseStore((s) => s.cases);
  const activeCase = cases.find((c) => c.id === params.caseId);

  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside([notifRef], () => setNotifOpen(false), notifOpen);
  useClickOutside([menuRef], () => setMenuOpen(false), menuOpen);

  const timeStr = now.toLocaleTimeString('en-IN', { hour12: false });

  function handleLogout() {
    setMenuOpen(false);
    logout();
    navigate('/login');
  }

  function goSettings() {
    setMenuOpen(false);
    navigate('/settings');
  }

  function showHelp() {
    setMenuOpen(false);
    pushToast('Help centre is not available in this demo environment.', 'info');
  }

  return (
    <header className="row" style={{ height: 'var(--topbar-height)', borderBottom: '1px solid var(--border)', background: 'var(--bg-1)', padding: '0 12px', justifyContent: 'space-between' }}>
      <div className="row gap-3" style={{ minWidth: 0 }}>
        <Link to="/cases" className="row gap-2" style={{ flexShrink: 0 }}>
          <img src={trinetraMark} alt="Trinetra" style={{ width: 26, height: 26, objectFit: 'contain' }} />
          <div className="stack" style={{ lineHeight: 1.1 }}>
            <span style={{ fontWeight: 700, letterSpacing: '0.08em', fontSize: 13 }}>TRINETRA</span>
          </div>
        </Link>
        {activeCase && (
          <div className="breadcrumbs" style={{ minWidth: 0 }}>
            <span className="text-muted">/</span>
            <span className="mono" style={{ color: 'var(--cyan)' }}>{activeCase.code}</span>
            <span className="current" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 260 }}>{activeCase.name}</span>
            <span className={`badge badge-${activeCase.status === 'active' ? 'low' : activeCase.status === 'monitoring' ? 'medium' : 'neutral'}`}>{activeCase.status}</span>
          </div>
        )}
      </div>

      <button type="button" className="search-input" style={{ width: 360, cursor: 'pointer' }} onClick={openCommandPalette}>
        <Search size={14} />
        <span className="text-muted" style={{ flex: 1, textAlign: 'left' }}>Search people, cases, phones, locations…</span>
        <span className="row gap-1 text-muted mono" style={{ fontSize: 10 }}><Command size={11} />K</span>
      </button>

      <div className="row gap-3" style={{ flexShrink: 0 }}>
        <span className="mono text-secondary" style={{ fontSize: 12 }}>{timeStr}</span>

        <div className="row gap-1" title="All systems nominal">
          <span className="topbar-status-dot" />
          <span className="text-secondary" style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.05em' }}>NOMINAL</span>
        </div>

        <div className="row gap-1" title="Clearance level">
          <ShieldCheck size={14} color="var(--cyan)" />
          <span className="mono text-cyan" style={{ fontSize: 11 }}>{user?.clearanceLevel ?? 'L1'}</span>
        </div>

        <div className="topbar-dropdown-anchor" ref={notifRef}>
          <button type="button" className="icon-btn" aria-label="Notifications" onClick={() => setNotifOpen((v) => !v)} style={{ position: 'relative' }}>
            <Bell size={15} />
            {NOTIFICATIONS.length > 0 && <span className="topbar-notif-badge">{NOTIFICATIONS.length}</span>}
          </button>
          {notifOpen && (
            <div className="topbar-dropdown" style={{ width: 300 }}>
              <div className="topbar-dropdown-heading">Notifications</div>
              {NOTIFICATIONS.length === 0 && <div className="text-muted" style={{ fontSize: 12, padding: '8px 4px' }}>No new notifications.</div>}
              {NOTIFICATIONS.map((n) => (
                <div key={n.id} className="topbar-notif-row">
                  <span className={`status-dot ${n.tone === 'danger' ? 'offline' : 'monitoring'}`} />
                  <div className="stack" style={{ gap: 2 }}>
                    <span style={{ fontSize: 12 }}>{n.message}</span>
                    <span className="text-muted" style={{ fontSize: 10.5 }}>{n.caseCode} · {formatRelativeTime(n.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="topbar-dropdown-anchor" ref={menuRef}>
          <button type="button" className="row gap-2" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 2 }} onClick={() => setMenuOpen((v) => !v)}>
            <div
              style={{
                width: 26, height: 26, borderRadius: 3, background: 'var(--cyan-glow)', border: '1px solid var(--cyan-dim)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--cyan)',
              }}
            >
              {user ? initials(user.displayName) : '--'}
            </div>
            <div className="stack" style={{ lineHeight: 1.1, textAlign: 'left' }}>
              <span style={{ fontSize: 12 }}>{user?.displayName ?? 'Unknown'}</span>
              <span className="text-muted" style={{ fontSize: 10 }}>{user?.unit ?? ''}</span>
            </div>
            <ChevronDown size={13} className="text-muted" />
          </button>
          {menuOpen && (
            <div className="topbar-dropdown" style={{ width: 190, right: 0 }}>
              <button type="button" className="topbar-menu-item" onClick={goSettings}><User size={14} /> Profile</button>
              <button type="button" className="topbar-menu-item" onClick={goSettings}><Settings size={14} /> Settings</button>
              <button type="button" className="topbar-menu-item" onClick={showHelp}><HelpCircle size={14} /> Help</button>
              <button type="button" className="topbar-menu-item" onClick={goSettings}><Keyboard size={14} /> Keyboard Shortcuts</button>
              <div className="topbar-menu-divider" />
              <button type="button" className="topbar-menu-item danger" onClick={handleLogout}><LogOut size={14} /> Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
