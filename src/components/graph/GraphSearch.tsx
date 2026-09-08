import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import type { Entity } from '../../types';
import { entityService } from '../../services/entityService';
import { ENTITY_LABELS } from '../../utils/entityMeta';
import { useClickOutside } from '../../hooks/useClickOutside';

/**
 * Jumps the graph to a subject rather than merely highlighting text on a
 * crowded canvas — since Network Analysis only ever draws one subject's
 * direct connections at a time, "search" has to mean "recenter on this
 * entity," not "find it somewhere in a wall of nodes."
 */
export function GraphSearch({ onPick }: { onPick: (entityId: string) => void }) {
  const { caseId } = useParams();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Entity[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside([ref], () => setOpen(false), open);

  useEffect(() => {
    if (!caseId || query.trim().length < 2) { setResults([]); return; }
    let cancelled = false;
    entityService.search(query, caseId).then((res) => {
      if (!cancelled) setResults(res.slice(0, 8));
    });
    return () => { cancelled = true; };
  }, [query, caseId]);

  return (
    <div ref={ref} style={{ position: 'relative', width: 230 }}>
      <div className="row gap-1" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 4, padding: '5px 8px' }}>
        <Search size={13} color="var(--text-muted)" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search entities…"
          style={{ background: 'none', border: 'none', outline: 'none', color: 'inherit', fontSize: 12, flex: 1, minWidth: 0 }}
        />
      </div>
      {open && results.length > 0 && (
        <div className="panel fade-in" style={{ position: 'absolute', top: '110%', left: 0, right: 0, zIndex: 20, padding: 4, maxHeight: 260, overflowY: 'auto' }}>
          {results.map((r) => (
            <button
              key={r.id}
              type="button"
              className="row gap-2"
              style={{ width: '100%', background: 'none', border: 'none', padding: '7px 8px', cursor: 'pointer', color: 'inherit', textAlign: 'left' }}
              onClick={() => { onPick(r.id); setQuery(''); setResults([]); setOpen(false); }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--panel-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              <span style={{ flex: 1, fontSize: 12.5 }}>{r.name}</span>
              <span className="text-muted" style={{ fontSize: 10 }}>{ENTITY_LABELS[r.type]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
