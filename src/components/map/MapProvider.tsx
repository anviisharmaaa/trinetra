import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { LocationEntity } from '../../types';

interface Bounds { minLat: number; maxLat: number; minLng: number; maxLng: number }

const MAHARASHTRA_BOUNDS: Bounds = {
  minLat: 15.5,
  maxLat: 22.1,
  minLng: 72.5,
  maxLng: 80.9,
};

interface MapProviderValue {
  project: (lat: number, lng: number) => { x: number; y: number };
  bounds: Bounds;
  zoom: number;
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
}

const MapContext = createContext<MapProviderValue | null>(null);

/**
 * MapLibre owns the geographic view while this provider keeps the existing
 * percentage projection contract used by the investigation overlays.
 */
export function MapProvider({ children, locations }: { children: ReactNode; locations: LocationEntity[] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [, setRevision] = useState(0);
  const bounds = useMemo<Bounds>(() => {
    const pool = locations.length ? locations : [];
    const lats = pool.map((l) => l.metadata.coordinates.lat);
    const lngs = pool.map((l) => l.metadata.coordinates.lng);
    if (lats.length === 0) {
      // No locations to bound — fall back to a small default window so
      // project() never divides by zero.
      lats.push(18.9, 19.1);
      lngs.push(72.7, 72.9);
    }
    return {
      minLat: Math.min(...lats) - 0.02,
      maxLat: Math.max(...lats) + 0.02,
      minLng: Math.min(...lngs) - 0.02,
      maxLng: Math.max(...lngs) + 0.02,
    };
  }, [locations]);
  const fallbackProject = (lat: number, lng: number) => ({
    x: ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100,
    y: 100 - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 100,
  });
  const value: MapProviderValue = {
    bounds,
    project: (lat: number, lng: number) => {
      if (!map || !mapContainer.current) return fallbackProject(lat, lng);
      const point = map.project([lng, lat]);
      const rect = mapContainer.current.getBoundingClientRect();
      return { x: (point.x / rect.width) * 100, y: (point.y / rect.height) * 100 };
    },
    zoom: map?.getZoom() ?? 1,
    zoomIn: () => map?.zoomIn({ duration: 250 }),
    zoomOut: () => map?.zoomOut({ duration: 250 }),
    reset: () => map?.fitBounds([[MAHARASHTRA_BOUNDS.minLng, MAHARASHTRA_BOUNDS.minLat], [MAHARASHTRA_BOUNDS.maxLng, MAHARASHTRA_BOUNDS.maxLat]], { padding: 48, duration: 350 }),
  };

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    const key = import.meta.env.VITE_MAPTILER_KEY;
    if (!key) return;
    const instance = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          maptiler: {
            type: 'raster',
            tiles: [`https://api.maptiler.com/maps/streets-v2-dark/{z}/{x}/{y}.png?key=${key}`],
            tileSize: 256,
          },
          indiaStates: {
            type: 'geojson',
            data: 'https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson',
          },
        },
        layers: [
          { id: 'maptiler-basemap', type: 'raster', source: 'maptiler' },
          {
            id: 'state-boundaries',
            type: 'line',
            source: 'indiaStates',
            paint: { 'line-color': '#48d8ff', 'line-opacity': 0.5, 'line-width': 1.2 },
          },
          {
            id: 'selected-state-fill',
            type: 'fill',
            source: 'indiaStates',
            filter: ['==', ['get', 'NAME_1'], 'Maharashtra'],
            paint: { 'fill-color': '#48d8ff', 'fill-opacity': 0.08 },
          },
          {
            id: 'selected-state-outline',
            type: 'line',
            source: 'indiaStates',
            filter: ['==', ['get', 'NAME_1'], 'Maharashtra'],
            paint: { 'line-color': '#72e2ff', 'line-opacity': 0.95, 'line-width': 2.5 },
          },
        ],
      },
      center: [72.85, 19.05],
      zoom: 10,
      dragPan: true,
      attributionControl: false,
    });
    const refresh = () => setRevision((current) => current + 1);
    instance.on('load', refresh);
    instance.on('move', refresh);
    instance.on('resize', refresh);
    const resizeObserver = new ResizeObserver(() => instance.resize());
    resizeObserver.observe(mapContainer.current);
    mapRef.current = instance;
    setMap(instance);
    return () => {
      resizeObserver.disconnect();
      instance.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map) return;
    map.fitBounds([[MAHARASHTRA_BOUNDS.minLng, MAHARASHTRA_BOUNDS.minLat], [MAHARASHTRA_BOUNDS.maxLng, MAHARASHTRA_BOUNDS.maxLat]], { padding: 48, duration: 0 });
  }, [map]);

  return (
    <MapContext.Provider value={value}>
      <div className="map-provider-shell">
        <div ref={mapContainer} className="maptiler-canvas" aria-label="MapTiler investigation map" />
        <div className="map-overlay-layer">{children}</div>
      </div>
    </MapContext.Provider>
  );
}

export function useMapProvider() {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error('useMapProvider must be used within MapProvider');
  return ctx;
}
