import { ScanFace } from 'lucide-react';
import type { FaceDetection } from '../../types';
import { getEntityById } from '../../data';
import { formatTime } from '../../utils/formatters';
import { PersonAvatar } from '../ui/EntityImage';
import { personImage } from '../../config/imageAssets';

export function MatchCard({ detection, active, onClick, onViewDossier }: { detection: FaceDetection; active: boolean; onClick: () => void; onViewDossier?: () => void }) {
  const entity = detection.identityId ? getEntityById(detection.identityId) : undefined;
  return (
    <div
      className="panel"
      style={{ padding: 10, cursor: 'pointer', borderColor: active ? 'var(--cyan-dim)' : undefined, background: active ? 'var(--cyan-glow)' : undefined }}
      onClick={onClick}
    >
      <div className="row gap-2">
        {entity ? (
          <PersonAvatar personId={entity.id} name={entity.name} src={personImage(entity.id, entity.name)} size={34} square />
        ) : (
          <div style={{ width: 34, height: 34, borderRadius: 4, background: 'var(--bg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ScanFace size={16} color="var(--cyan)" />
          </div>
        )}
        <div className="stack" style={{ minWidth: 0, flex: 1 }}>
          <span style={{ fontSize: 12.5 }}>{entity?.name ?? 'UNRESOLVED IDENTITY'}</span>
          <span className="text-muted" style={{ fontSize: 10 }}>{detection.cameraId} · {formatTime(detection.timestamp)}</span>
        </div>
        <span className="badge badge-info">{Math.round(detection.confidence * 100)}%</span>
      </div>
      {entity && onViewDossier && (
        <button type="button" className="btn btn-sm" style={{ marginTop: 8, width: '100%' }} onClick={(e) => { e.stopPropagation(); onViewDossier(); }}>
          VIEW DOSSIER
        </button>
      )}
    </div>
  );
}
