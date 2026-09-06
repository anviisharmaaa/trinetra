import { useRef, useState } from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown, LayoutGrid, List as ListIcon, Plus, Check } from 'lucide-react';
import type { CasePriority, CaseStatus } from '../../types';
import { useClickOutside } from '../../hooks/useClickOutside';

export type SortKey = 'updated' | 'priority' | 'name' | 'people' | 'entities' | 'connections';
export type UpdatedWindow = 'any' | 'today' | 'week' | 'month';
export type ViewMode = 'grid' | 'list';

export interface AdvancedFilters {
  priorities: CasePriority[];
  statuses: CaseStatus[];
  updated: UpdatedWindow;
}

const STATUS_TABS: { key: CaseStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All Cases' },
  { key: 'active', label: 'Active' },
  { key: 'monitoring', label: 'Monitoring' },
  { key: 'closed', label: 'Closed' },
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'updated', label: 'Last Updated' },
  { key: 'priority', label: 'Priority' },
  { key: 'name', label: 'Name' },
  { key: 'people', label: 'People' },
  { key: 'entities', label: 'Entities' },
  { key: 'connections', label: 'Connections' },
];

export function activeFilterCount(f: AdvancedFilters): number {
  return f.priorities.length + f.statuses.length + (f.updated !== 'any' ? 1 : 0);
}

export function CaseToolbar({
  activeTab, onTabChange, query, onQueryChange,
  filters, onFiltersChange, sortKey, onSortChange,
  viewMode, onViewModeChange, onNewCase,
}: {
  activeTab: CaseStatus | 'all';
  onTabChange: (t: CaseStatus | 'all') => void;
  query: string;
  onQueryChange: (q: string) => void;
  filters: AdvancedFilters;
  onFiltersChange: (f: AdvancedFilters) => void;
  sortKey: SortKey;
  onSortChange: (k: SortKey) => void;
  viewMode: ViewMode;
  onViewModeChange: (v: ViewMode) => void;
  onNewCase: () => void;
}) {
  return (
    <div className="dash-toolbar">
      <div className="dash-segmented">
        {STATUS_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={activeTab === t.key ? 'active' : ''}
            onClick={() => onTabChange(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="dash-toolbar-right">
        <div className="dash-search">
          <Search size={14} />
          <input value={query} onChange={(e) => onQueryChange(e.target.value)} placeholder="Search cases…" />
          {query && (
            <button type="button" className="dash-icon-btn" style={{ width: 20, height: 20 }} onClick={() => onQueryChange('')} aria-label="Clear search">
              <X size={12} />
            </button>
          )}
        </div>

        <FilterControl filters={filters} onChange={onFiltersChange} />
        <SortControl sortKey={sortKey} onChange={onSortChange} />

        <div className="dash-view-toggle">
          <button type="button" className={viewMode === 'grid' ? 'active' : ''} aria-label="Grid view" onClick={() => onViewModeChange('grid')}>
            <LayoutGrid size={14} />
          </button>
          <button type="button" className={viewMode === 'list' ? 'active' : ''} aria-label="List view" onClick={() => onViewModeChange('list')}>
            <ListIcon size={14} />
          </button>
        </div>

        <button type="button" className="dash-btn-primary" onClick={onNewCase}>
          <Plus size={14} /> New Case
        </button>
      </div>
    </div>
  );
}

const PRIORITY_OPTIONS: CasePriority[] = ['high', 'medium', 'low'];
const STATUS_OPTIONS: CaseStatus[] = ['active', 'monitoring', 'closed'];
const UPDATED_OPTIONS: { key: UpdatedWindow; label: string }[] = [
  { key: 'any', label: 'Any time' },
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This week' },
  { key: 'month', label: 'This month' },
];

function FilterControl({ filters, onChange }: { filters: AdvancedFilters; onChange: (f: AdvancedFilters) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside([ref], () => setOpen(false), open);
  const count = activeFilterCount(filters);

  function togglePriority(p: CasePriority) {
    const has = filters.priorities.includes(p);
    onChange({ ...filters, priorities: has ? filters.priorities.filter((x) => x !== p) : [...filters.priorities, p] });
  }
  function toggleStatus(s: CaseStatus) {
    const has = filters.statuses.includes(s);
    onChange({ ...filters, statuses: has ? filters.statuses.filter((x) => x !== s) : [...filters.statuses, s] });
  }

  return (
    <div className="dash-popover-anchor" ref={ref}>
      <button type="button" className={`dash-btn-ghost ${count > 0 ? 'has-value' : ''}`} onClick={() => setOpen((v) => !v)}>
        <SlidersHorizontal size={14} /> Filter {count > 0 && <span className="dash-count-chip">{count}</span>}
      </button>
      {open && (
        <div className="dash-popover">
          <div className="dash-popover-section">
            <div className="dash-popover-heading">Priority</div>
            {PRIORITY_OPTIONS.map((p) => (
              <label key={p} className="dash-checkbox-row">
                <input type="checkbox" checked={filters.priorities.includes(p)} onChange={() => togglePriority(p)} />
                <span className="dash-checkbox-box">{filters.priorities.includes(p) && <Check size={11} />}</span>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </label>
            ))}
          </div>
          <div className="dash-popover-section">
            <div className="dash-popover-heading">Status</div>
            {STATUS_OPTIONS.map((s) => (
              <label key={s} className="dash-checkbox-row">
                <input type="checkbox" checked={filters.statuses.includes(s)} onChange={() => toggleStatus(s)} />
                <span className="dash-checkbox-box">{filters.statuses.includes(s) && <Check size={11} />}</span>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </label>
            ))}
          </div>
          <div className="dash-popover-section">
            <div className="dash-popover-heading">Updated</div>
            {UPDATED_OPTIONS.map((u) => (
              <label key={u.key} className="dash-radio-row">
                <input type="radio" name="updated-window" checked={filters.updated === u.key} onChange={() => onChange({ ...filters, updated: u.key })} />
                <span className="dash-radio-dot" />
                {u.label}
              </label>
            ))}
          </div>
          {count > 0 && (
            <button type="button" className="dash-btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }} onClick={() => onChange({ priorities: [], statuses: [], updated: 'any' })}>
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function SortControl({ sortKey, onChange }: { sortKey: SortKey; onChange: (k: SortKey) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside([ref], () => setOpen(false), open);
  const current = SORT_OPTIONS.find((o) => o.key === sortKey)!;

  return (
    <div className="dash-popover-anchor" ref={ref}>
      <button type="button" className="dash-btn-ghost" onClick={() => setOpen((v) => !v)}>
        <ArrowUpDown size={14} /> {current.label}
      </button>
      {open && (
        <div className="dash-popover dash-popover-menu">
          {SORT_OPTIONS.map((o) => (
            <button
              key={o.key}
              type="button"
              className={`dash-menu-item ${sortKey === o.key ? 'active' : ''}`}
              onClick={() => { onChange(o.key); setOpen(false); }}
            >
              {o.label}
              {sortKey === o.key && <Check size={13} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
