/**
 * Fictional intelligence-network data that drives the Cases Dashboard hero
 * globe. Kept separate from the per-case entity/relationship data in
 * `src/data` — this is dashboard-level "where is our attention in the
 * world right now" flavour, not a real case graph.
 */

export interface GlobeNode {
  id: string;
  lat: number;
  lng: number;
  label: string;
  hq?: boolean;
  ring?: boolean;
  ringPeriod?: number;
  entities: number;
  connections: number;
  investigations: number;
}

export interface GlobeArc {
  source: string;
  target: string;
}

export const GLOBE_NODES: GlobeNode[] = [
  { id: 'mumbai', lat: 19.076, lng: 72.8777, label: 'Mumbai', hq: true, ring: true, ringPeriod: 3600, entities: 96, connections: 210, investigations: 3 },
  { id: 'delhi', lat: 28.6139, lng: 77.209, label: 'Delhi', ring: true, ringPeriod: 4800, entities: 68, connections: 152, investigations: 2 },
  { id: 'ahmedabad', lat: 23.0225, lng: 72.5714, label: 'Ahmedabad', ring: true, ringPeriod: 5200, entities: 21, connections: 34, investigations: 1 },
  { id: 'bengaluru', lat: 12.9716, lng: 77.5946, label: 'Bengaluru', entities: 15, connections: 22, investigations: 1 },
  { id: 'kolkata', lat: 22.5726, lng: 88.3639, label: 'Kolkata', ring: true, ringPeriod: 4200, entities: 9, connections: 13, investigations: 1 },
  { id: 'chennai', lat: 13.0827, lng: 80.2707, label: 'Chennai', entities: 7, connections: 11, investigations: 1 },
  { id: 'dubai', lat: 25.2048, lng: 55.2708, label: 'Dubai', ring: true, ringPeriod: 4500, entities: 18, connections: 29, investigations: 2 },
  { id: 'singapore', lat: 1.3521, lng: 103.8198, label: 'Singapore', ring: true, ringPeriod: 6000, entities: 11, connections: 16, investigations: 1 },
  { id: 'london', lat: 51.5074, lng: -0.1278, label: 'London', entities: 6, connections: 9, investigations: 1 },
];

export const GLOBE_ARCS: GlobeArc[] = [
  { source: 'mumbai', target: 'delhi' },
  { source: 'mumbai', target: 'ahmedabad' },
  { source: 'mumbai', target: 'bengaluru' },
  { source: 'mumbai', target: 'chennai' },
  { source: 'mumbai', target: 'dubai' },
  { source: 'mumbai', target: 'singapore' },
  { source: 'mumbai', target: 'london' },
  { source: 'delhi', target: 'kolkata' },
  { source: 'delhi', target: 'dubai' },
  { source: 'bengaluru', target: 'singapore' },
  { source: 'chennai', target: 'dubai' },
  { source: 'kolkata', target: 'singapore' },
];

export function findNode(id: string): GlobeNode {
  const node = GLOBE_NODES.find((n) => n.id === id);
  if (!node) throw new Error(`Unknown globe node: ${id}`);
  return node;
}
