import { SearchInput } from '../ui/SearchInput';
import { CollapsibleSection } from './CollapsibleSection';
import type { FacetOption, LocationStats } from './locationMeta';
import type { LocationEntity } from '../../types';
import { RISK_COLORS } from '../../utils/entityMeta';

export type QuickFilter = 'all' | 'recent' | 'watchlist' | 'key';

const QUICK_FILTERS: { key: QuickFilter; label: string }[] = [
  { key: 'all', label: 'ALL LOCATIONS' },
  { key: 'recent', label: 'RECENT' },
  { key: 'watchlist', label: 'WATCHLIST' },
  { key: 'key', label: 'KEY LOCATIONS' },
];

export function LocationFilters({
  query, onQueryChange,
  quickFilter, onQuickFilterChange,
  typeFacets, activeTypes, onToggleType,
  regionFacets, activeRegions, onToggleRegion,
  results, activeLocationId, onSelectLocation, riskByLocationId,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  quickFilter: QuickFilter;
  onQuickFilterChange: (f: QuickFilter) => void;
  typeFacets: FacetOption[];
  activeTypes: Set<string>;
  onToggleType: (key: string) => void;
  regionFacets: FacetOption[];
  activeRegions: Set<string>;
  onToggleRegion: (key: string) => void;
  results: LocationEntity[];
  activeLocationId: string | null;
  onSelectLocation: (id: string) => void;
  riskByLocationId: Map<string, LocationStats['computedRisk']>;
}) {
  return (
    <div className="stack gap-3" style={{ padding: 10, height: '100%', overflowY: 'auto' }}>
      <SearchInput value={query} onChange={onQueryChange} placeholder="Search locations…" />

      <div className="stack gap-1">
        {QUICK_FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className="row gap-2"
            onClick={() => onQuickFilterChange(f.key)}
            style={{
              background: quickFilter === f.key ? 'var(--cyan-glow)' : 'none',
              border: '1px solid ' + (quickFilter === f.key ? 'var(--cyan-dim)' : 'transparent'),
              borderRadius: 4, padding: '6px 8px', cursor: 'pointer', color: 'inherit', textAlign: 'left', fontSize: 11.5,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <CollapsibleSection title="LOCATION TYPES">
        <div className="stack gap-1">
          {typeFacets.map((t) => (
            <label key={t.key} className="row gap-2" style={{ fontSize: 12, cursor: 'pointer', justifyContent: 'space-between' }}>
              <span className="row gap-2">
                <input type="checkbox" checked={activeTypes.has(t.key)} onChange={() => onToggleType(t.key)} />
                {t.label}
              </span>
              <span className="text-muted mono" style={{ fontSize: 10 }}>{t.count}</span>
            </label>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="REGIONS">
        <div className="stack gap-1">
          {regionFacets.map((r) => (
            <label key={r.key} className="row gap-2" style={{ fontSize: 12, cursor: 'pointer', justifyContent: 'space-between' }}>
              <span className="row gap-2">
                <input type="checkbox" checked={activeRegions.has(r.key)} onChange={() => onToggleRegion(r.key)} />
                {r.label}
              </span>
              <span className="text-muted mono" style={{ fontSize: 10 }}>{r.count}</span>
            </label>
          ))}
        </div>
      </CollapsibleSection>

      <div>
        <div className="system-label" style={{ marginBottom: 6 }}>MATCHING LOCATIONS ({results.length})</div>
        <div className="stack gap-1">
          {results.length === 0 && <span className="text-muted" style={{ fontSize: 11.5 }}>No locations match the current filters.</span>}
          {results.map((l) => {
            const risk = riskByLocationId.get(l.id) ?? 'unknown';
            return (
              <button
                key={l.id}
                type="button"
                className="row gap-2"
                onClick={() => onSelectLocation(l.id)}
                style={{
                  background: activeLocationId === l.id ? 'var(--cyan-glow)' : 'none',
                  border: '1px solid ' + (activeLocationId === l.id ? 'var(--cyan-dim)' : 'transparent'),
                  borderRadius: 4, padding: 7, cursor: 'pointer', color: 'inherit', textAlign: 'left', alignItems: 'center',
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: RISK_COLORS[risk] }} />
                <span className="stack" style={{ minWidth: 0, gap: 1 }}>
                  <span style={{ fontSize: 12 }}>{l.name}</span>
                  <span className="text-muted" style={{ fontSize: 10 }}>{l.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
