import { useEffect, useMemo, useState } from 'react';
import { useCaseStore } from '../store/caseStore';
import { HeroIntelligence } from '../components/cases/HeroIntelligence';
import { CaseToolbar, type AdvancedFilters, type SortKey, type ViewMode } from '../components/cases/CaseToolbar';
import { CaseCard, CaseListRow } from '../components/cases/CaseCard';
import { NewCaseModal } from '../components/cases/NewCaseModal';
import { RecentActivityPanel } from '../components/cases/RecentActivityPanel';
import { CaseDistributionPanel } from '../components/cases/CaseDistributionPanel';
import { GeographicFocusPanel } from '../components/cases/GeographicFocusPanel';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import type { Case, CaseStatus } from '../types';

const PRIORITY_WEIGHT: Record<Case['priority'], number> = { critical: 4, high: 3, medium: 2, low: 1 };
const WINDOW_MS: Record<Exclude<AdvancedFilters['updated'], 'any'>, number> = {
  today: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
};

export function CasesPage() {
  const { cases, status, fetchCases, filterStatus, setFilterStatus, query, setQuery, pinnedIds, togglePin } = useCaseStore();

  const [filters, setFilters] = useState<AdvancedFilters>({ priorities: [], statuses: [], updated: 'any' });
  const [sortKey, setSortKey] = useState<SortKey>('updated');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [newCaseOpen, setNewCaseOpen] = useState(false);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const visibleCases = useMemo(() => {
    const q = query.toLowerCase().trim();
    const now = Date.now();
    const filtered = cases.filter((c) => {
      const tabOk = filterStatus === 'all' || c.status === filterStatus;
      const queryOk = !q || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
      const priorityOk = filters.priorities.length === 0 || filters.priorities.includes(c.priority);
      const statusOk = filters.statuses.length === 0 || filters.statuses.includes(c.status);
      const windowOk = filters.updated === 'any' || now - new Date(c.updatedAt).getTime() <= WINDOW_MS[filters.updated];
      return tabOk && queryOk && priorityOk && statusOk && windowOk;
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sortKey) {
        case 'priority':
          return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
        case 'name':
          return a.name.localeCompare(b.name);
        case 'people':
          return b.stats.personCount - a.stats.personCount;
        case 'entities':
          return b.stats.entityCount - a.stats.entityCount;
        case 'connections':
          return b.stats.relationshipCount - a.stats.relationshipCount;
        case 'updated':
        default:
          return b.updatedAt.localeCompare(a.updatedAt);
      }
    });

    return sorted.sort((a, b) => {
      const aPinned = pinnedIds.includes(a.id) ? 1 : 0;
      const bPinned = pinnedIds.includes(b.id) ? 1 : 0;
      return bPinned - aPinned;
    });
  }, [cases, filterStatus, query, filters, sortKey, pinnedIds]);

  return (
    <div className="dash-page">
      <HeroIntelligence cases={cases} />

      <div className="dash-content">
        <CaseToolbar
          activeTab={filterStatus}
          onTabChange={(t: CaseStatus | 'all') => setFilterStatus(t)}
          query={query}
          onQueryChange={setQuery}
          filters={filters}
          onFiltersChange={setFilters}
          sortKey={sortKey}
          onSortChange={setSortKey}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onNewCase={() => setNewCaseOpen(true)}
        />

        {status === 'loading' && <LoadingState label="Loading case index" />}
        {status === 'error' && <EmptyState title="Case index unavailable" hint="Could not reach the case management data source." />}
        {status === 'ready' && visibleCases.length === 0 && (
          <EmptyState title="No cases found" hint="No cases match the current filters." />
        )}

        {status === 'ready' && visibleCases.length > 0 && (
          viewMode === 'grid' ? (
            <div className="dash-case-grid">
              {visibleCases.map((c) => (
                <CaseCard key={c.id} c={c} pinned={pinnedIds.includes(c.id)} onTogglePin={togglePin} />
              ))}
            </div>
          ) : (
            <div className="dash-case-list">
              {visibleCases.map((c) => (
                <CaseListRow key={c.id} c={c} pinned={pinnedIds.includes(c.id)} onTogglePin={togglePin} />
              ))}
            </div>
          )
        )}

        <div className="dash-panel-row">
          <RecentActivityPanel />
          <CaseDistributionPanel cases={cases} />
          <GeographicFocusPanel cases={cases} />
        </div>
      </div>

      <NewCaseModal open={newCaseOpen} onClose={() => setNewCaseOpen(false)} />
    </div>
  );
}
