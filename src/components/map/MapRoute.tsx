import { useMapProvider } from './MapProvider';
import type { Movement } from '../../types';
import { getEntityById } from '../../data';

export function MapRoute({ movement }: { movement: Movement }) {
  const { project } = useMapProvider();
  const from = getEntityById(movement.fromLocationId);
  const to = getEntityById(movement.toLocationId);
  if (!from || from.type !== 'location' || !to || to.type !== 'location') return null;
  const p1 = project(from.metadata.coordinates.lat, from.metadata.coordinates.lng);
  const p2 = project(to.metadata.coordinates.lat, to.metadata.coordinates.lng);
  return (
    <line
      x1={`${p1.x}%`} y1={`${p1.y}%`} x2={`${p2.x}%`} y2={`${p2.y}%`}
      stroke="var(--cyan-dim)" strokeWidth={1.5} strokeDasharray="4 3"
    />
  );
}
