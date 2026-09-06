import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, ShieldAlert } from 'lucide-react';
import type { Case } from '../../types';
import { formatRelativeTime } from '../../utils/formatters';

const MODULE_LABELS: Record<string, string> = {
  '': 'Overview',
  network: 'Network',
  timeline: 'Timeline',
  location: 'Locations',
  alerts: 'Alerts',
  'social-media': 'Social Media',
  'call-records': 'Call Records',
  'criminal-records': 'Criminal Records',
  cctv: 'CCTV',
  'face-recognition': 'Face Recognition',
  financial: 'Financial',
  documents: 'Documents',
  forensics: 'Forensics',
  evidence: 'Evidence',
  reports: 'Reports',
  person: 'Person Dossier',
};

export function CaseHeader({ activeCase }: { activeCase: Case }) {
  const navigate = useNavigate();
  const location = useLocation();

  const segments = location.pathname.split('/').filter(Boolean); // ['cases', caseId, module?, ...]
  const moduleSeg = segments[2] ?? '';
  const moduleLabel = MODULE_LABELS[moduleSeg] ?? moduleSeg;

  return (
    <div
      className="stack case-banner"
      style={{ borderBottom: '1px solid var(--border)', padding: '10px 20px', background: 'var(--bg-1)', flexShrink: 0 }}
    >
      <div className="row gap-1 text-muted mono" style={{ fontSize: 10, marginBottom: 6 }}>
        <button type="button" className="link-reset" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }} onClick={() => navigate('/cases')}>CASES</button>
        <ChevronRight size={11} />
        <span className="text-cyan">{activeCase.code}</span>
        {moduleLabel && moduleSeg !== '' && (
          <>
            <ChevronRight size={11} />
            <span>{moduleLabel.toUpperCase()}</span>
          </>
        )}
      </div>

      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div className="row gap-3" style={{ alignItems: 'flex-start', minWidth: 0 }}>
          <div
            className="row"
            style={{
              width: 38, height: 38, borderRadius: 8, flexShrink: 0,
              background: 'var(--cyan-glow)', border: '1px solid var(--cyan-dim)',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ShieldAlert size={18} color="var(--cyan)" />
          </div>
          <div className="stack" style={{ minWidth: 0 }}>
            <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
              <span className="page-title" style={{ fontSize: 16 }}>{activeCase.name}</span>
              <span className={`badge badge-${activeCase.priority === 'critical' || activeCase.priority === 'high' ? 'high' : activeCase.priority}`}>{activeCase.priority} PRIORITY</span>
              <span className="badge badge-info" style={{ textTransform: 'uppercase' }}>{activeCase.classification}</span>
              <span className="row gap-1"><span className={`status-dot ${activeCase.status}`} /> <span className="text-muted" style={{ fontSize: 10.5 }}>{activeCase.status.toUpperCase()}</span></span>
            </div>
            <p className="text-secondary" style={{ fontSize: 11.5, margin: '4px 0 0', maxWidth: 780, lineHeight: 1.4 }}>{activeCase.description}</p>
            <div className="row gap-3 text-muted" style={{ fontSize: 10.5, marginTop: 6 }}>
              <span className="mono text-cyan">{activeCase.code}</span>
              <span>Lead: {activeCase.investigatorLead}</span>
              <span>Updated {formatRelativeTime(activeCase.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
