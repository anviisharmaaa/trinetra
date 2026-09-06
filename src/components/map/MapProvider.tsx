import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { LocationEntity } from '../../types';

interface Bounds { minLat: number; maxLat: number; minLng: number; maxLng: number }

interface MapProviderValue {
  project: (lat: number, lng: number) => { x: number; y: number };
  bounds: Bounds;
}

const MapContext = createContext<MapProviderValue | null>(null);

/**
 * Abstraction boundary: swapping MockIndiaMap for a GoogleMapProvider later
 * only means implementing this same `project` contract against the real
 * map's screen-projection API. No consuming component changes.
 *
 * Bounds are computed from the locations actually being displayed (not
 * every location in the mock dataset) so that a case scoped to one city
 * doesn't get squeezed into a corner by locations belonging to other,
 * geographically distant cases.
 */
export function MapProvider({ children, locations }: { children: ReactNode; locations: LocationEntity[] }) {
  const value = useMemo<MapProviderValue>(() => {
    const pool = locations.length ? locations : [];
    const lats = pool.map((l) => l.metadata.coordinates.lat);
    const lngs = pool.map((l) => l.metadata.coordinates.lng);
    if (lats.length === 0) {
      // No locations to bound — fall back to a small default window so
      // project() never divides by zero.
      lats.push(18.9, 19.1);
      lngs.push(72.7, 72.9);
    }
    const bounds: Bounds = {
      minLat: Math.min(...lats) - 0.02,
      maxLat: Math.max(...lats) + 0.02,
      minLng: Math.min(...lngs) - 0.02,
      maxLng: Math.max(...lngs) + 0.02,
    };
    return {
      bounds,
      project: (lat: number, lng: number) => {
        const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
        const y = 100 - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 100;
        return { x, y };
      },
    };
    // Recompute whenever the displayed location set changes — otherwise
    // switching cases (or zooming into a cluster) keeps stale bounds from
    // whichever case/cluster was mounted first.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations]);

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export function useMapProvider() {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error('useMapProvider must be used within MapProvider');
  return ctx;
}
