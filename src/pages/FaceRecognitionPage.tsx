import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFaceStore } from '../store/faceStore';
import { FaceViewer } from '../components/face/FaceViewer';
import { MatchList } from '../components/face/MatchList';
import { FaceTimeline } from '../components/face/FaceTimeline';
import { LoadingState } from '../components/ui/LoadingState';
import { useInvestigationStore } from '../store/investigationStore';

export function FaceRecognitionPage() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { status, detections, loadForCase } = useFaceStore();
  const selectEntity = useInvestigationStore((s) => s.selectEntity);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => { if (caseId) loadForCase(caseId); }, [caseId, loadForCase]);
  useEffect(() => { setActiveId(detections[0]?.id ?? null); }, [detections]);

  const active = detections.find((d) => d.id === activeId) ?? null;

  function viewDossier(entityId: string) {
    selectEntity(entityId);
    navigate(`/cases/${caseId}/person/${entityId}`);
  }

  if (status === 'loading') return <LoadingState label="RUNNING FACE ANALYTICS" />;

  return (
    <div className="stack" style={{ height: '100%' }}>
      <div className="row" style={{ flex: 1, minHeight: 0, alignItems: 'stretch' }}>
        <div style={{ width: 280, borderRight: '1px solid var(--border)', padding: 10, overflowY: 'auto' }}>
          <div className="system-label" style={{ marginBottom: 8 }}>DETECTIONS</div>
          <MatchList detections={detections} activeId={activeId} onSelect={setActiveId} onViewDossier={viewDossier} />
        </div>
        <div style={{ flex: 1, padding: 12, minWidth: 0 }}>
          <FaceViewer detection={active} />
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-2)' }}>
        <div className="system-label" style={{ padding: '6px 12px 0' }}>DETECTION TIMELINE</div>
        <FaceTimeline detections={detections} activeId={activeId} onSelect={setActiveId} />
      </div>
    </div>
  );
}
