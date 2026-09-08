import { Camera as CameraIcon } from 'lucide-react';
import type { Camera, CCTVEvent } from '../../types';
import { getEntityById } from '../../data';

export function CameraList({ cameras, events, activeCameraId, onSelect }: { cameras: Camera[]; events: CCTVEvent[]; activeCameraId: string | null; onSelect: (id: string) => void }) {
  return (
    <div className="stack gap-1">
      {cameras.map((cam) => {
        const count = events.filter((e) => e.cameraId === cam.id).length;
        const location = getEntityById(cam.locationId);
        return (
          <button
            key={cam.id}
            type="button"
            onClick={() => onSelect(cam.id)}
            className="row gap-2"
            style={{
              background: activeCameraId === cam.id ? 'var(--cyan-glow)' : 'none',
              border: '1px solid ' + (activeCameraId === cam.id ? 'var(--cyan-dim)' : 'transparent'),
              borderRadius: 4, padding: 8, cursor: 'pointer', color: 'inherit', textAlign: 'left',
            }}
          >
            <CameraIcon size={14} color={cam.status === 'online' ? 'var(--success)' : 'var(--danger)'} />
            <div className="stack" style={{ minWidth: 0, flex: 1 }}>
              <span style={{ fontSize: 12 }}>{cam.code} — {cam.name}</span>
              <span className="text-muted" style={{ fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {location?.name ?? cam.coverage}
              </span>
            </div>
            <span className={`status-dot ${cam.status}`} />
            {count > 0 && <span className="badge badge-info" style={{ fontSize: 9 }}>{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
