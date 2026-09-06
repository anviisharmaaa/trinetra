import { NavLink, useParams } from 'react-router-dom';
import {
  LayoutGrid, Users, Share2, Clock, Camera, ScanFace, MapPin, Landmark,
  FileText, Fingerprint, FolderLock, FileBarChart, Bell, ChevronLeft, ChevronRight,
  Phone, Gavel,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useSidebar } from '../../hooks/useSidebar';
import { useEvidenceStore } from '../../store/evidenceStore';

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  badge?: number;
}

export function LeftControlPanel() {
  const { caseId } = useParams();
  const { sidebarMode, cycleSidebarNarrower, cycleSidebarWider } = useSidebar();
  const alerts = useEvidenceStore((s) => s.alerts.filter((a) => !a.acknowledged).length);

  if (!caseId) return null;

  const base = `/cases/${caseId}`;
  const primary: NavItem[] = [
    { to: `${base}`, label: 'Overview', icon: <LayoutGrid size={16} /> },
    { to: `${base}/network`, label: 'Network', icon: <Share2 size={16} /> },
    { to: `${base}/timeline`, label: 'Timeline', icon: <Clock size={16} /> },
    { to: `${base}/location`, label: 'Location', icon: <MapPin size={16} /> },
    { to: `${base}/alerts`, label: 'Alerts', icon: <Bell size={16} />, badge: alerts },
  ];
  const intelligence: NavItem[] = [
    { to: `${base}/social-media`, label: 'Social Media', icon: <Users size={16} /> },
    { to: `${base}/call-records`, label: 'Call Records', icon: <Phone size={16} /> },
    { to: `${base}/criminal-records`, label: 'Criminal Records', icon: <Gavel size={16} /> },
    { to: `${base}/cctv`, label: 'CCTV', icon: <Camera size={16} /> },
    { to: `${base}/face-recognition`, label: 'Face Recognition', icon: <ScanFace size={16} /> },
    { to: `${base}/financial`, label: 'Financial', icon: <Landmark size={16} /> },
    { to: `${base}/documents`, label: 'Documents', icon: <FileText size={16} /> },
    { to: `${base}/forensics`, label: 'Forensics', icon: <Fingerprint size={16} /> },
  ];
  const outputs: NavItem[] = [
    { to: `${base}/evidence`, label: 'Evidence', icon: <FolderLock size={16} /> },
    { to: `${base}/reports`, label: 'Reports', icon: <FileBarChart size={16} /> },
  ];

  const isHidden = sidebarMode === 'hidden';
  const isCompact = sidebarMode === 'compact';

  if (isHidden) {
    return (
      <button
        type="button"
        className="icon-btn"
        onClick={cycleSidebarWider}
        aria-label="Expand sidebar"
        style={{ position: 'absolute', left: 4, top: 8, zIndex: 5, background: 'var(--panel)', border: '1px solid var(--border)' }}
      >
        <ChevronRight size={14} />
      </button>
    );
  }

  function renderGroup(title: string, items: NavItem[]) {
    return (
      <div className="stack" style={{ marginBottom: 12 }}>
        {!isCompact && <div className="system-label" style={{ padding: '0 12px', marginBottom: 4 }}>{title}</div>}
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === base}
            className={({ isActive }) => `row gap-2 nav-item ${isActive ? 'nav-active' : ''}`}
            style={({ isActive }) => ({
              padding: isCompact ? '9px 0' : '8px 12px',
              justifyContent: isCompact ? 'center' : 'flex-start',
              color: isActive ? 'var(--cyan)' : 'var(--text-secondary)',
              background: isActive ? 'var(--cyan-glow)' : 'transparent',
              borderLeft: isActive ? '2px solid var(--cyan)' : '2px solid transparent',
              fontSize: 12.5,
              textDecoration: 'none',
              position: 'relative',
            })}
            title={item.label}
          >
            {item.icon}
            {!isCompact && <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>}
            {!!item.badge && (
              <span className="badge badge-high" style={{ padding: '0 4px', fontSize: 9 }}>{item.badge}</span>
            )}
          </NavLink>
        ))}
      </div>
    );
  }

  return (
    <nav className="stack" style={{ borderRight: '1px solid var(--border)', background: 'var(--bg-1)', overflowY: 'auto', overflowX: 'hidden', paddingTop: 10, position: 'relative' }}>
      {renderGroup('Investigation', primary)}
      {renderGroup('Intelligence Modules', intelligence)}
      {renderGroup('Case Output', outputs)}
      <button
        type="button"
        className="icon-btn"
        onClick={cycleSidebarNarrower}
        aria-label="Collapse sidebar"
        style={{ position: 'absolute', bottom: 8, right: isCompact ? '50%' : 8, transform: isCompact ? 'translateX(50%)' : 'none' }}
      >
        <ChevronLeft size={14} />
      </button>
    </nav>
  );
}
