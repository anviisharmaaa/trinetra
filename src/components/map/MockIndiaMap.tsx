import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { LocationEntity, Movement } from '../../types';
import { MapProvider, useMapProvider } from './MapProvider';
import { MapMarker } from './MapMarker';
import { MapRoute } from './MapRoute';
import { MapControls } from './MapControls';
import { ClusterMarker } from './ClusterMarker';
import { clusterByCity, clusterByProximity } from './clustering';
import type { MapCluster } from './clustering';
import type { LocationStats } from '../locations/locationMeta';

function deriveRegionLabel(locations: LocationEntity[]): string {
  const cities = locations.map((l) => l.metadata.city).filter((c): c is string => !!c);
  if (cities.length === 0) return 'MAPTILER — REGION UNKNOWN';
  const counts = new Map<string, number>();
  for (const c of cities) counts.set(c, (counts.get(c) ?? 0) + 1);
  const distinct = [...counts.keys()];
  if (distinct.length === 1) {
    return `MAPTILER — ${distinct[0].toUpperCase()} METROPOLITAN REGION`;
  }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([c]) => c.toUpperCase());
  return `MAPTILER — ${top.join(' / ')}`;
}

/**
 * The map canvas contents live inside MapProvider so they can call
 * useMapProvider() for lat/lng → percent projection. Split out so the
 * bounds (computed from whichever `locations` MapProvider was given) match
 * exactly what's being clustered/rendered here.
 */
function MapCanvasInner({
  locations, movements, activeLocationId, onSelectLocation, riskByLocationId, statsByLocationId, focused, onClusterClick,
}: {
  locations: LocationEntity[];
  movements: Movement[];
  activeLocationId: string | null;
  onSelectLocation: (id: string) => void;
  riskByLocationId: Map<string, LocationStats['computedRisk']>;
  statsByLocationId: Map<string, LocationStats>;
  focused: boolean;
  onClusterClick: (cluster: MapCluster) => void;
}) {
  const { project, zoom, zoomIn, zoomOut, reset } = useMapProvider();

  const groups = useMemo(() => {
    const points = locations.map((l) => ({ location: l, ...project(l.metadata.coordinates.lat, l.metadata.coordinates.lng) }));
    return focused ? clusterByProximity(points, 5) : clusterByCity(points);
  }, [locations, project, focused]);

  // Only connect two locations that are each individually visible right
  // now — a route line to/from a collapsed cluster badge would dangle at a
  // point that isn't actually that location, which is its own kind of
  // clutter/confusion.
  const singleIds = useMemo(
    () => new Set(groups.filter((g) => g.kind === 'single').map((g) => (g as { location: LocationEntity }).location.id)),
    [groups],
  );
  const meaningfulMovements = useMemo(
    () => movements.filter((m) => singleIds.has(m.fromLocationId) && singleIds.has(m.toLocationId)),
    [movements, singleIds],
  );

  return (
    <>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {meaningfulMovements.map((m) => <MapRoute key={m.id} movement={m} />)}
      </svg>
      {groups.map((g) => {
        if (g.kind === 'single') {
          return (
            <MapMarker
              key={g.key}
              location={g.location}
              active={g.location.id === activeLocationId}
              risk={riskByLocationId.get(g.location.id)}
              onClick={() => onSelectLocation(g.location.id)}
            />
          );
        }
        return (
          <ClusterMarker
            key={g.key}
            x={g.x}
            y={g.y}
            label={g.label}
            count={g.members.length}
            onClick={() => onClusterClick(g)}
          />
        );
      })}
      <MapControls zoom={zoom / 10} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={reset} />
      {activeLocationId && (() => {
        const active = locations.find((location) => location.id === activeLocationId);
        const stats = active ? statsByLocationId.get(active.id) : undefined;
        if (!active || !stats) return null;
        return (
          <div className="map-location-popup" role="dialog" aria-label={`${active.name} details`}>
            <div className="map-location-popup-header">
              <div>
                <span className="system-label">{active.metadata.category?.toUpperCase() ?? 'LOCATION'}</span>
                <strong>{active.name}</strong>
                <span className="text-muted">{active.metadata.city}</span>
              </div>
              <button type="button" aria-label="Close location details" onClick={() => onSelectLocation('')}>&times;</button>
            </div>
            <span className="text-secondary">{active.metadata.address}</span>
            <div className="row gap-2">
              <span className="badge badge-info">{stats.eventCount} EVENTS</span>
              <span className="badge badge-warning">{stats.computedRisk.toUpperCase()} RISK</span>
            </div>
            <span className="text-muted mono" style={{ fontSize: 10 }}>{active.metadata.coordinates.lat.toFixed(4)}, {active.metadata.coordinates.lng.toFixed(4)}</span>
          </div>
        );
      })()}
    </>
  );
}

export function MockIndiaMap({
  locations, movements = [], activeLocationId, onSelectLocation, riskByLocationId, statsByLocationId,
}: {
  locations: LocationEntity[];
  movements?: Movement[];
  activeLocationId: string | null;
  onSelectLocation: (id: string) => void;
  riskByLocationId?: Map<string, LocationStats['computedRisk']>;
  statsByLocationId?: Map<string, LocationStats>;
}) {
  const [focusCity, setFocusCity] = useState<string | null>(null);
  const risk = riskByLocationId ?? new Map();
  const stats = statsByLocationId ?? new Map();

  // A new location set (case switch, search, or filter change) means the
  // previous cluster-zoom no longer applies to what's on screen.
  useEffect(() => setFocusCity(null), [locations]);

  // The selected/active location should always be visible, not hidden
  // inside a collapsed "City ● N" badge — auto-zoom into its city when it
  // would otherwise be clustered away.
  useEffect(() => {
    if (!activeLocationId) return;
    const activeLoc = locations.find((l) => l.id === activeLocationId);
    if (!activeLoc) return;
    const city = activeLoc.metadata.city?.trim() || 'Unknown';
    const sameCity = locations.filter((l) => (l.metadata.city?.trim() || 'Unknown') === city);
    if (sameCity.length > 1) setFocusCity(city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLocationId, locations]);

  const displayLocations = focusCity
    ? locations.filter((l) => (l.metadata.city?.trim() || 'Unknown') === focusCity)
    : locations;
  const regionLabel = deriveRegionLabel(displayLocations.length ? displayLocations : locations);

  function handleClusterClick(cluster: MapCluster) {
    if (focusCity) {
      // Already zoomed into a city — there's no deeper cluster level, so a
      // residual proximity cluster just resolves to its first member.
      onSelectLocation(cluster.members[0].id);
    } else {
      setFocusCity(cluster.label);
    }
  }

  return (
    <div className="stack" style={{ height: '100%' }}>
      <div className="row gap-2" style={{ alignItems: 'center', padding: '6px 2px' }}>
        <div className="tabs" role="tablist">
          <button className="tab active" type="button" disabled aria-selected>MAP</button>
        </div>
        {focusCity && (
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => setFocusCity(null)}
            style={{ marginLeft: 4 }}
          >
            <ArrowLeft size={12} /> ALL LOCATIONS
          </button>
        )}
        {focusCity && (
          <span className="text-muted mono" style={{ fontSize: 10.5 }}>
            {focusCity} · {displayLocations.length} location{displayLocations.length === 1 ? '' : 's'}
          </span>
        )}
      </div>

      <div style={{ position: 'relative', flex: 1, minHeight: 0, width: '100%', overflow: 'hidden', background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
        <MapProvider locations={displayLocations}>
          <MapCanvasInner
            locations={displayLocations}
            movements={movements}
            activeLocationId={activeLocationId}
            onSelectLocation={onSelectLocation}
            riskByLocationId={risk}
            statsByLocationId={stats}
            focused={!!focusCity}
            onClusterClick={handleClusterClick}
          />
        </MapProvider>
        <div className="mono text-muted" style={{ position: 'absolute', bottom: 8, left: 10, fontSize: 9.5 }}>
          {regionLabel}
        </div>
      </div>
    </div>
  );
}
