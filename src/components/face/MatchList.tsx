import type { FaceDetection } from '../../types';
import { MatchCard } from './MatchCard';

export function MatchList({ detections, activeId, onSelect, onViewDossier }: { detections: FaceDetection[]; activeId: string | null; onSelect: (id: string) => void; onViewDossier: (entityId: string) => void }) {
  if (detections.length === 0) {
    return <span className="text-muted" style={{ fontSize: 12 }}>No detections in the current view.</span>;
  }
  return (
    <div className="stack gap-2">
      {detections.map((d) => (
        <MatchCard
          key={d.id}
          detection={d}
          active={activeId === d.id}
          onClick={() => onSelect(d.id)}
          onViewDossier={d.identityId ? () => onViewDossier(d.identityId!) : undefined}
        />
      ))}
    </div>
  );
}
