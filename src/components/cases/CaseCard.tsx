import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MoreVertical, Users, Share2, MapPin, ArrowRight, Ship, Waves, Building2, Lock, Landmark, Copy, Archive, FileOutput } from 'lucide-react';
import type { Case } from '../../types';
import { formatRelativeTime } from '../../utils/formatters';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useUIStore } from '../../store/uiStore';

const CASE_ICONS: Record<string, typeof Ship> = {
  'case-op001': Ship,
  'case-op002': Waves,
  'case-op003': Building2,
  'case-op004': Lock,
};

const PRIORITY_TONE: Record<Case['priority'], 'high' | 'medium' | 'low'> = {
  critical: 'high',
  high: 'high',
  medium: 'medium',
  low: 'low',
};

function CaseIcon({ caseId, className }: { caseId: string; className?: string }) {
  const Icon = CASE_ICONS[caseId] ?? Landmark;
  return <Icon className={className} />;
}

function OverflowMenu({ c }: { c: Case }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pushToast = useUIStore((s) => s.pushToast);
  useClickOutside([ref], () => setOpen(false), open);

  function act(_label: string, message: string) {
    setOpen(false);
    pushToast(message, 'info');
  }

  return (
    <div className="dash-overflow" ref={ref}>
      <button
        type="button"
        className="dash-icon-btn"
        aria-label="More options"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
      >
        <MoreVertical size={15} />
      </button>
      {open && (
        <div className="dash-overflow-menu" onClick={(e) => e.stopPropagation()}>
          <button type="button" onClick={() => act('duplicate', `Duplicated ${c.code} as a draft case.`)}>
            <Copy size={13} /> Duplicate case
          </button>
          <button type="button" onClick={() => act('export', `Export package for ${c.code} queued.`)}>
            <FileOutput size={13} /> Export summary
          </button>
          <button type="button" onClick={() => act('archive', `${c.code} moved to archive.`)}>
            <Archive size={13} /> Archive case
          </button>
        </div>
      )}
    </div>
  );
}

interface CaseCardProps {
  c: Case;
  pinned: boolean;
  onTogglePin: (id: string) => void;
}

export function CaseCard({ c, pinned, onTogglePin }: CaseCardProps) {
  const navigate = useNavigate();

  function open() {
    navigate(`/cases/${c.id}`);
  }

  return (
    <article
      className="dash-case-card"
      onClick={open}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') open(); }}
    >
      <div className={`dash-case-thumb tone-${PRIORITY_TONE[c.priority]}`}>
        <CaseIcon caseId={c.id} className="dash-case-thumb-icon" />
      </div>

      <div className="dash-case-body">
        <div className="dash-case-toprow">
          <span className="dash-case-code">{c.code}</span>
          <div className="dash-case-toprow-actions">
            <span className={`dash-priority-pill tone-${PRIORITY_TONE[c.priority]}`}>{c.priority}</span>
            <button
              type="button"
              className={`dash-icon-btn ${pinned ? 'is-active' : ''}`}
              aria-label={pinned ? 'Unpin case' : 'Pin case'}
              onClick={(e) => { e.stopPropagation(); onTogglePin(c.id); }}
            >
              <Star size={14} fill={pinned ? 'currentColor' : 'none'} />
            </button>
            <OverflowMenu c={c} />
          </div>
        </div>

        <h3 className="dash-case-title">{titleCase(c.name)}</h3>
        <p className="dash-case-desc">{c.description}</p>

        <div className="dash-case-stats">
          <span><Users size={13} /> {c.stats.personCount} People</span>
          <span><Share2 size={13} /> {c.stats.entityCount} Entities</span>
          <span><MapPin size={13} /> {c.stats.relationshipCount} Connections</span>
        </div>

        <div className="dash-case-footer">
          <span className="dash-case-updated">
            <span className={`dash-status-dot status-${c.status}`} />
            Updated {formatRelativeTime(c.updatedAt)}
          </span>
          <span className="dash-case-open">Open Case <ArrowRight size={13} /></span>
        </div>
      </div>
    </article>
  );
}

export function CaseListRow({ c, pinned, onTogglePin }: CaseCardProps) {
  const navigate = useNavigate();
  function open() {
    navigate(`/cases/${c.id}`);
  }
  return (
    <div className="dash-case-row" onClick={open} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') open(); }}>
      <div className={`dash-case-row-icon tone-${PRIORITY_TONE[c.priority]}`}>
        <CaseIcon caseId={c.id} />
      </div>
      <div className="dash-case-row-main">
        <div className="dash-case-row-top">
          <span className="dash-case-code">{c.code}</span>
          <span className={`dash-priority-pill tone-${PRIORITY_TONE[c.priority]}`}>{c.priority}</span>
          <span className={`dash-status-dot status-${c.status}`} />
          <span className="text-muted" style={{ fontSize: 11.5 }}>{c.status}</span>
        </div>
        <h3 className="dash-case-title" style={{ fontSize: 14.5 }}>{titleCase(c.name)}</h3>
      </div>
      <div className="dash-case-row-stats">
        <span><Users size={13} /> {c.stats.personCount}</span>
        <span><Share2 size={13} /> {c.stats.entityCount}</span>
        <span><MapPin size={13} /> {c.stats.relationshipCount}</span>
      </div>
      <div className="dash-case-row-updated">Updated {formatRelativeTime(c.updatedAt)}</div>
      <div className="dash-case-row-actions" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={`dash-icon-btn ${pinned ? 'is-active' : ''}`}
          aria-label={pinned ? 'Unpin case' : 'Pin case'}
          onClick={() => onTogglePin(c.id)}
        >
          <Star size={14} fill={pinned ? 'currentColor' : 'none'} />
        </button>
        <OverflowMenu c={c} />
        <span className="dash-case-open"><ArrowRight size={14} /></span>
      </div>
    </div>
  );
}

function titleCase(name: string): string {
  return name.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
}
