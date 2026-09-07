import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { locationService } from '../services/locationService';
import { cctvService } from '../services/cctvService';
import { timelineService } from '../services/timelineService';
import { evidenceService } from '../services/evidenceService';
import { MockIndiaMap } from '../components/map/MockIndiaMap';
import { LoadingState } from '../components/ui/LoadingState';
import { LocationFilters } from '../components/locations/LocationFilters';
import type { QuickFilter } from '../components/locations/LocationFilters';
import { LocationDetailPanel } from '../components/locations/LocationDetailPanel';
import { LocationBottomStrip } from '../components/locations/LocationBottomStrip';
import { computeLocationStats, deriveLocationTypes, deriveRegions, regionKeyFor } from '../components/locations/locationMeta';
import type { LocationStats } from '../components/locations/locationMeta';
import type { LocationEntity, Camera, TimelineEvent, Movement, Evidence } from '../types';
import { useInvestigationStore } from '../store/investigationStore';

export function LocationPage() {
  const { caseId } = useParams();
  const { selectedLocationId, selectLocation } = useInvestigationStore();
  const [locations, setLocations] = useState<LocationEntity[] | null>(null);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);

  const [query, setQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set());
  const [activeRegions, setActiveRegions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!caseId) return;
    setLocations(null);
    selectLocation(null);
    Promise.all([
      locationService.listByCase(caseId),
      cctvService.listCameras(caseId),
      cctvService.listMovements(caseId),
      timelineService.listByCase(caseId),
      evidenceService.listByCase(caseId),
    ]).then(([locs, cams, mv, evs, ev]) => {
      setLocations(locs);
      setCameras(cams);
      setMovements(mv);
      setEvents(evs);
      setEvidence(ev);
      if (locs[0]) selectLocation(locs[0].id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  const locationsById = useMemo(() => new Map((locations ?? []).map((l) => [l.id, l])), [locations]);

  const statsById = useMemo(() => {
    const map = new Map<string, LocationStats>();
    for (const l of locations ?? []) map.set(l.id, computeLocationStats(l, events));
    return map;
  }, [locations, events]);

  const riskByLocationId = useMemo(() => {
    const map = new Map<string, LocationStats['computedRisk']>();
    for (const [id, s] of statsById) map.set(id, s.computedRisk);
    return map;
  }, [statsById]);

  const typeFacets = useMemo(() => deriveLocationTypes(locations ?? []), [locations]);
  const regionFacets = useMemo(() => deriveRegions(locations ?? []), [locations]);

  // Facet checkbox sets default to "everything selected" whenever the
  // available facets change (new case loaded) — mirrors GraphFilters.
  useEffect(() => setActiveTypes(new Set(typeFacets.map((f) => f.key))), [typeFacets]);
  useEffect(() => setActiveRegions(new Set(regionFacets.map((f) => f.key))), [regionFacets]);

  const quickFilterIds = useMemo(() => {
    const all = locations ?? [];
    const recent = [...all]
      .filter((l) => (statsById.get(l.id)?.eventCount ?? 0) > 0)
      .sort((a, b) => (statsById.get(b.id)?.lastActivity ?? '').localeCompare(statsById.get(a.id)?.lastActivity ?? ''))
      .slice(0, 8)
      .map((l) => l.id);
    const watchlist = all.filter((l) => {
      const r = statsById.get(l.id)?.computedRisk;
      return r === 'critical' || r === 'high';
    }).map((l) => l.id);
    const key = [...all]
      .sort((a, b) => (statsById.get(b.id)?.eventCount ?? 0) - (statsById.get(a.id)?.eventCount ?? 0))
      .slice(0, Math.max(3, Math.ceil(all.length * 0.3)))
      .filter((l) => (statsById.get(l.id)?.eventCount ?? 0) > 0)
      .map((l) => l.id);
    return { recent: new Set(recent), watchlist: new Set(watchlist), key: new Set(key) };
  }, [locations, statsById]);

  const filtered = useMemo(() => {
    let list = locations ?? [];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((l) => l.name.toLowerCase().includes(q) || (l.metadata.address ?? '').toLowerCase().includes(q));
    }
    if (quickFilter !== 'all') {
      const idSet = quickFilterIds[quickFilter];
      list = list.filter((l) => idSet.has(l.id));
    }
    list = list.filter((l) => {
      const typeKey = l.metadata.category && typeFacets.some((f) => f.key === l.metadata.category) ? l.metadata.category : 'other';
      return activeTypes.size === 0 || activeTypes.has(typeKey);
    });
    list = list.filter((l) => activeRegions.size === 0 || activeRegions.has(regionKeyFor(l, regionFacets)));
    return list;
  }, [locations, query, quickFilter, quickFilterIds, activeTypes, activeRegions, typeFacets, regionFacets]);

  // Keep the selection consistent with whatever the current filters allow
  // on screen — otherwise the right panel and the map can disagree.
  useEffect(() => {
    if (!locations || filtered.length === 0) return;
    if (!selectedLocationId || !filtered.some((l) => l.id === selectedLocationId)) {
      selectLocation(filtered[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, locations]);

  function toggleType(key: string) {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }
  function toggleRegion(key: string) {
    setActiveRegions((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  if (locations === null) return <LoadingState label="LOADING LOCATION INTELLIGENCE" />;

  const active = locations.find((l) => l.id === selectedLocationId) ?? null;
  const activeStats = active ? statsById.get(active.id) ?? computeLocationStats(active, events) : null;
  const nearbyCameras = active ? cameras.filter((c) => c.locationId === active.id) : [];
  // Only render routes that are meaningful to the current selection — never
  // a web connecting every location to every other one.
  const relevantMovements = active ? movements.filter((m) => m.fromLocationId === active.id || m.toLocationId === active.id) : [];
  const visibleIds = new Set(filtered.map((l) => l.id));
  const relatedEvidence = evidence.filter((e) => e.entityIds.some((id) => visibleIds.has(id) || (active && id === active.id)));

  return (
    <div className="stack" style={{ height: '100%' }}>
      <div className="row" style={{ flex: 1, minHeight: 0 }}>
        <div className="split-3" style={{ flex: 1, minHeight: 0 }}>
          <LocationFilters
            query={query}
            onQueryChange={setQuery}
            quickFilter={quickFilter}
            onQuickFilterChange={setQuickFilter}
            typeFacets={typeFacets}
            activeTypes={activeTypes}
            onToggleType={toggleType}
            regionFacets={regionFacets}
            activeRegions={activeRegions}
            onToggleRegion={toggleRegion}
            results={filtered}
            activeLocationId={selectedLocationId}
            onSelectLocation={selectLocation}
            riskByLocationId={riskByLocationId}
          />

          <div style={{ padding: 10, minWidth: 0 }}>
            <MockIndiaMap
              locations={filtered}
              movements={relevantMovements}
              activeLocationId={selectedLocationId}
              onSelectLocation={selectLocation}
              riskByLocationId={riskByLocationId}
              statsByLocationId={statsById}
            />
          </div>

          <div className="scroll-region" style={{ padding: 12 }}>
            {!active || !activeStats ? (
              <span className="text-muted" style={{ fontSize: 12 }}>Select a location to inspect its profile, activity, and evidence.</span>
            ) : (
              <LocationDetailPanel location={active} stats={activeStats} nearbyCameras={nearbyCameras} />
            )}
          </div>
        </div>
      </div>

      <LocationBottomStrip
        events={events.filter((e) => e.locationId && visibleIds.has(e.locationId))}
        locationsById={locationsById}
        evidence={relatedEvidence}
        onSelectLocation={selectLocation}
      />
    </div>
  );
}
