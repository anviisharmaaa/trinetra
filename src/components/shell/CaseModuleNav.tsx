import { NavLink } from 'react-router-dom';
import {
  LayoutGrid, Share2, Clock, MapPin, Bell, Users, Phone, Gavel,
  Camera, ScanFace, Landmark, FileText, Fingerprint, FolderLock, FileBarChart,
} from 'lucide-react';
import type { ReactNode } from 'react';

interface ModuleItem {
  seg: string;
  label: string;
  icon: ReactNode;
  badge?: number;
}

export function CaseModuleNav({ caseId, alertCount }: { caseId: string; alertCount?: number }) {
  const base = `/cases/${caseId}`;
  const items: ModuleItem[] = [
    { seg: '', label: 'Overview', icon: <LayoutGrid size={13} /> },
    { seg: 'network', label: 'Network', icon: <Share2 size={13} /> },
    { seg: 'timeline', label: 'Timeline', icon: <Clock size={13} /> },
    { seg: 'location', label: 'Locations', icon: <MapPin size={13} /> },
    { seg: 'alerts', label: 'Alerts', icon: <Bell size={13} />, badge: alertCount },
    { seg: 'social-media', label: 'Social Media', icon: <Users size={13} /> },
    { seg: 'call-records', label: 'Call Records', icon: <Phone size={13} /> },
    { seg: 'criminal-records', label: 'Criminal Records', icon: <Gavel size={13} /> },
    { seg: 'cctv', label: 'CCTV', icon: <Camera size={13} /> },
    { seg: 'face-recognition', label: 'Face Recognition', icon: <ScanFace size={13} /> },
    { seg: 'financial', label: 'Financial', icon: <Landmark size={13} /> },
    { seg: 'documents', label: 'Documents', icon: <FileText size={13} /> },
    { seg: 'forensics', label: 'Forensics', icon: <Fingerprint size={13} /> },
    { seg: 'evidence', label: 'Evidence', icon: <FolderLock size={13} /> },
    { seg: 'reports', label: 'Reports', icon: <FileBarChart size={13} /> },
  ];

  return (
    <nav
      className="row gap-1 case-module-nav"
      style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-1)',
        padding: '0 16px',
        overflowX: 'auto',
        flexShrink: 0,
      }}
    >
      {items.map((item) => (
        <NavLink
          key={item.seg || 'overview'}
          to={item.seg ? `${base}/${item.seg}` : base}
          end={item.seg === ''}
          className={({ isActive }) => `row gap-1 case-module-tab ${isActive ? 'case-module-tab-active' : ''}`}
          style={({ isActive }) => ({
            padding: '10px 12px',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
            color: isActive ? 'var(--cyan)' : 'var(--text-secondary)',
            borderBottom: isActive ? '2px solid var(--cyan)' : '2px solid transparent',
            textDecoration: 'none',
            flexShrink: 0,
          })}
        >
          {item.icon}
          <span>{item.label}</span>
          {!!item.badge && (
            <span className="badge badge-high" style={{ padding: '0 4px', fontSize: 9, marginLeft: 2 }}>{item.badge}</span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
