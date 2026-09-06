import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, User, Car, Building2, MapPin, Briefcase, FolderOpen } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useInvestigationStore } from '../../store/investigationStore';
import { allEntities, mockCases } from '../../data';
import type { Entity } from '../../types';

const ICONS: Record<string, typeof User> = {
  person: User, vehicle: Car, organization: Building2, location: MapPin, phone: Briefcase,
};

export function CommandPalette() {
  const open = useUIStore((s) => s.commandPaletteOpen);
  const close = useUIStore((s) => s.closeCommandPalette);
  const navigate = useNavigate();
  const { caseId } = useParams();
  const selectEntity = useInvestigationStore((s) => s.selectEntity);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const entityResults = useMemo<Entity[]>(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allEntities
      .filter((e) => (!caseId || e.caseIds.includes(caseId)) && (e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q)))
      .slice(0, 8);
  }, [query, caseId]);

  const caseResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return mockCases.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)).slice(0, 5);
  }, [query]);

  if (!open) return null;

  function goToEntity(entity: Entity) {
    if (!caseId) return;
    selectEntity(entity.id);
    if (entity.type === 'person') navigate(`/cases/${caseId}/person/${entity.id}`);
    else navigate(`/cases/${caseId}/network`);
    close();
  }

  return (
    <div className="modal-backdrop" style={{ alignItems: 'flex-start', paddingTop: '12vh' }} onClick={close}>
      <div className="modal" style={{ width: 560, minWidth: 0 }} onClick={(e) => e.stopPropagation()}>
        <div className="search-input" style={{ margin: 12, padding: '8px 10px' }}>
          <Search size={15} />
          <input autoFocus placeholder="Search entities, cases… or type a command" value={query} onChange={(e) => setQuery(e.target.value)} />
          <span className="mono text-muted" style={{ fontSize: 10 }}>ESC</span>
        </div>
        <div style={{ maxHeight: 380, overflowY: 'auto' }}>
          {!query && (
            <div className="stack">
              <div className="system-label" style={{ padding: '4px 14px' }}>QUICK ACTIONS</div>
              {caseId && (
                <>
                  <PaletteRow icon={<FolderOpen size={14} />} label="Go to Network Analysis" onClick={() => { navigate(`/cases/${caseId}/network`); close(); }} />
                  <PaletteRow icon={<FolderOpen size={14} />} label="Go to CCTV" onClick={() => { navigate(`/cases/${caseId}/cctv`); close(); }} />
                  <PaletteRow icon={<FolderOpen size={14} />} label="Go to Timeline" onClick={() => { navigate(`/cases/${caseId}/timeline`); close(); }} />
                </>
              )}
              <PaletteRow icon={<FolderOpen size={14} />} label="Go to Cases Dashboard" onClick={() => { navigate('/cases'); close(); }} />
            </div>
          )}
          {query && caseResults.length > 0 && (
            <div className="stack">
              <div className="system-label" style={{ padding: '4px 14px' }}>CASES</div>
              {caseResults.map((c) => (
                <PaletteRow key={c.id} icon={<FolderOpen size={14} />} label={`${c.code} — ${c.name}`} onClick={() => { navigate(`/cases/${c.id}`); close(); }} />
              ))}
            </div>
          )}
          {query && entityResults.length > 0 && (
            <div className="stack">
              <div className="system-label" style={{ padding: '4px 14px' }}>ENTITIES</div>
              {entityResults.map((e) => {
                const Icon = ICONS[e.type] ?? User;
                return (
                  <PaletteRow key={e.id} icon={<Icon size={14} />} label={e.name} sub={`${e.type.toUpperCase()} · ${e.id}`} onClick={() => goToEntity(e)} />
                );
              })}
            </div>
          )}
          {query && !entityResults.length && !caseResults.length && (
            <div className="empty-state" style={{ padding: 24 }}>
              <div className="empty-state-title">NO MATCHES</div>
              <div className="text-muted" style={{ fontSize: 12 }}>No entities or cases match "{query}".</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PaletteRow({ icon, label, sub, onClick }: { icon: ReactNode; label: string; sub?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="row gap-2"
      style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '8px 14px', cursor: 'pointer', color: 'var(--text-primary)' }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--panel-hover)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
    >
      <span style={{ color: 'var(--cyan)' }}>{icon}</span>
      <span className="stack" style={{ lineHeight: 1.3 }}>
        <span style={{ fontSize: 13 }}>{label}</span>
        {sub && <span className="text-muted" style={{ fontSize: 10.5 }}>{sub}</span>}
      </span>
    </button>
  );
}
