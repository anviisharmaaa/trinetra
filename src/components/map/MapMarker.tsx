import { MapPin } from 'lucide-react';
import { useMapProvider } from './MapProvider';
import type { LocationEntity } from '../../types';
import { RISK_COLORS } from '../../utils/entityMeta';

/**
 * A restrained investigation-map pin: cyan/blue by default (never the
 * every-marker-is-red look), with a small risk-colored ring only when a
 * location is actually flagged. Only the active marker gets a persistent
 * label chip — everything else relies on the native title tooltip, so the
 * map doesn't turn into a wall of overlapping text.
 */
export function MapMarker({
  location, active, risk, onClick,
}: {
  location: LocationEntity;
  active: boolean;
  risk?: 'critical' | 'high' | 'medium' | 'low' | 'unknown';
  onClick: () => void;
}) {
  const { project } = useMapProvider();
  const { x, y } = project(location.metadata.coordinates.lat, location.metadata.coordinates.lng);
  const ringColor = risk && (risk === 'critical' || risk === 'high') ? RISK_COLORS[risk] : 'var(--cyan-dim)';

  if (active) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={location.name}
        style={{
          position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -100%)',
          background: 'none', border: 'none', cursor: 'pointer', padding: 0, zIndex: 4,
        }}
      >
        <MapPin size={26} color="var(--cyan)" fill="var(--cyan-glow)" />
        <span
          className="mono"
          style={{
            position: 'absolute', top: -4, left: '112%', fontSize: 10, background: 'var(--bg-0)',
            border: '1px solid var(--cyan-dim)', color: 'var(--cyan)', padding: '1px 6px', whiteSpace: 'nowrap', borderRadius: 2,
          }}
        >
          {location.name}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      title={location.name}
      style={{
        position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)',
        background: 'none', border: 'none', cursor: 'pointer', padding: 4, zIndex: 2,
      }}
    >
      <span
        style={{
          display: 'block', width: 9, height: 9, borderRadius: '50%',
          background: 'var(--bg-1)', border: `2px solid ${ringColor}`,
          boxShadow: risk === 'critical' ? `0 0 6px ${ringColor}99` : 'none',
        }}
      />
    </button>
  );
}
