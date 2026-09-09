import { useEffect, useRef, useState } from 'react';
import { Plus, Search, X, AlertTriangle } from 'lucide-react';
import { entityService } from '../../services/entityService';
import { personService } from '../../services/personService';
import { PersonAvatar } from '../ui/EntityImage';
import { personImage } from '../../config/imageAssets';
import { ENTITY_LABELS, riskBadgeClass } from '../../utils/entityMeta';
import type { Entity, EntityType } from '../../types';

/**
 * Search → select → preview → confirm entity linker, shared by the Victim,
 * Suspects, and Related Entities sections of the Case Builder.
 *
 * The Person ID (`entity.id`) is the only thing ever stored or compared —
 * the name shown here is display-only. A candidate can only be added after
 * it has come back from a real search against the existing entity dataset,
 * so there is no code path that can link a Person ID that doesn't exist.
 */
export function EntityPicker({
  selectedIds,
  onChange,
  types,
  multiple,
  addLabel,
  placeholder = 'Search by name or ID…',
}: {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  /** Restrict candidates to these entity types (e.g. `['person']` for Victim/Suspects). Omit to allow any type. */
  types?: EntityType[];
  multiple: boolean;
  addLabel: string;
  placeholder?: string;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Entity[]>([]);
  const [searching, setSearching] = useState(false);
  const [staged, setStaged] = useState<Entity | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [selectedEntities, setSelectedEntities] = useState<Record<string, Entity>>({});
  const boxRef = useRef<HTMLDivElement>(null);

  // Person-only pickers (Victim / Suspects) search the real backend — the
  // ingested Master Dataset in PostgreSQL — since Person ID is authoritative
  // and must be validated against the real records, not the small demo
  // dataset. "Other Related Entities" (any type) still searches the
  // existing mock entity set until non-person types are connected too.
  const isPersonOnly = types?.length === 1 && types[0] === 'person';

  async function resolveOne(id: string): Promise<Entity | undefined> {
    if (isPersonOnly) {
      const raw = await personService.getPersonRaw(id);
      if (raw) return { id: raw.person_id, caseIds: [], type: 'person', name: raw.name, riskLevel: (raw.risk_level ?? 'unknown').toLowerCase() as Entity['riskLevel'], metadata: {}, sourceIds: [], createdAt: '', updatedAt: '' } as Entity;
    }
    return entityService.getEntity(id);
  }

  // Resolve display info for already-selected ids (covers ids the parent
  // already had, e.g. when re-opening a draft) purely by ID lookup.
  useEffect(() => {
    let cancelled = false;
    Promise.all(selectedIds.map((id) => resolveOne(id))).then((found) => {
      if (cancelled) return;
      const map: Record<string, Entity> = {};
      found.forEach((e, i) => { if (e) map[selectedIds[i]] = e; });
      setSelectedEntities(map);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds.join(',')]);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setNotFound(false);
      return;
    }
    let cancelled = false;
    setSearching(true);
    const handle = setTimeout(() => {
      const search = isPersonOnly ? personService.search(q, 8) : entityService.search(q, undefined, types);
      search.then((found) => {
        if (cancelled) return;
        const candidates = found.filter((e) => !selectedIds.includes(e.id));
        setResults(candidates.slice(0, 8));
        setNotFound(candidates.length === 0);
        setSearching(false);
      }).catch(() => {
        if (cancelled) return;
        setResults([]);
        setNotFound(true);
        setSearching(false);
      });
    }, 200);
    return () => { cancelled = true; clearTimeout(handle); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, types?.join(',')]);

  function stage(entity: Entity) {
    setStaged(entity);
    setResults([]);
    setQuery('');
  }

  function confirmAdd() {
    if (!staged) return;
    setSelectedEntities((prev) => ({ ...prev, [staged.id]: staged }));
    onChange(multiple ? [...selectedIds, staged.id] : [staged.id]);
    setStaged(null);
  }

  function remove(id: string) {
    onChange(selectedIds.filter((x) => x !== id));
  }

  const atCapacity = !multiple && selectedIds.length >= 1;

  return (
    <div className="stack gap-2" ref={boxRef}>
      {!atCapacity && (
        <div className="dash-popover-anchor">
          {staged ? (
            <div className="entity-picker-preview">
              <PersonAvatar
                personId={staged.id}
                name={staged.name}
                src={staged.type === 'person' ? personImage(staged.id, staged.name) : undefined}
                size={32}
                square={staged.type !== 'person'}
              />
              <div className="stack" style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>{staged.name}</span>
                <span className="text-muted mono" style={{ fontSize: 10.5 }}>
                  {staged.id} · {ENTITY_LABELS[staged.type]}
                  {staged.type === 'person' && staged.metadata.occupation ? ` · ${staged.metadata.occupation}` : ''}
                </span>
              </div>
              <button type="button" className="btn btn-primary btn-sm" onClick={confirmAdd}>
                <Plus size={12} /> {addLabel}
              </button>
              <button type="button" className="icon-btn" style={{ width: 22, height: 22 }} onClick={() => setStaged(null)} aria-label="Cancel selection">
                <X size={12} />
              </button>
            </div>
          ) : (
            <div className="field" style={{ marginBottom: 0 }}>
              <div className="search-input">
                <Search size={13} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={placeholder}
                />
              </div>
              {query.trim() && (
                <div className="dash-popover entity-picker-dropdown">
                  {searching && <div className="text-muted" style={{ fontSize: 11.5, padding: '4px 6px' }}>Searching…</div>}
                  {!searching && notFound && (
                    <div className="row gap-1 text-muted" style={{ fontSize: 11.5, padding: '4px 6px' }}>
                      <AlertTriangle size={12} /> No matching Person ID or name found in the existing dataset.
                    </div>
                  )}
                  {!searching && results.map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      className="entity-picker-result"
                      onClick={() => stage(e)}
                    >
                      <PersonAvatar
                        personId={e.id}
                        name={e.name}
                        src={e.type === 'person' ? personImage(e.id, e.name) : undefined}
                        size={26}
                        square={e.type !== 'person'}
                      />
                      <div className="stack" style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: 12 }}>{e.name}</span>
                        <span className="text-muted mono" style={{ fontSize: 10 }}>{e.id} · {ENTITY_LABELS[e.type]}</span>
                      </div>
                      {e.type === 'person' && <span className={riskBadgeClass(e.riskLevel)} style={{ fontSize: 9.5 }}>{e.riskLevel ?? 'unknown'}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {selectedIds.length > 0 && (
        <div className="stack gap-1">
          {selectedIds.map((id) => {
            const e = selectedEntities[id];
            return (
              <div key={id} className="entity-picker-selected-row">
                {e ? (
                  <>
                    <PersonAvatar
                      personId={id}
                      name={e.name}
                      src={e.type === 'person' ? personImage(e.id, e.name) : undefined}
                      size={24}
                      square={e.type !== 'person'}
                    />
                    <span style={{ fontSize: 12, flex: 1 }}>{e.name}</span>
                    <span className="text-muted mono" style={{ fontSize: 10 }}>{id}</span>
                    <span className={riskBadgeClass(e.type === 'person' ? e.riskLevel : undefined)} style={{ fontSize: 9.5 }}>
                      {e.type === 'person' ? (e.riskLevel ?? 'unknown') : ENTITY_LABELS[e.type]}
                    </span>
                  </>
                ) : (
                  <span className="text-muted mono" style={{ fontSize: 11, flex: 1 }}>{id}</span>
                )}
                <button type="button" className="icon-btn" style={{ width: 20, height: 20 }} onClick={() => remove(id)} aria-label="Remove">
                  <X size={11} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
