import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useCCTVStore } from '../store/cctvStore';
import { useInvestigationStore } from '../store/investigationStore';
import { CameraList } from '../components/cctv/CameraList';
import { CCTVViewer } from '../components/cctv/CCTVViewer';
import { CCTVTimeline } from '../components/cctv/CCTVTimeline';
import { CCTVEventDetails } from '../components/cctv/CCTVEventDetails';
import { SearchInput } from '../components/ui/SearchInput';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';

// Selection here is driven by the URL (`?camera=`, `?event=`) rather than
// plain component state, on purpose: it's what makes refresh, browser
// back/forward, and sharing/deep-linking a direct CCTV URL all work
// correctly, per the module's QA requirements. `investigationStore`'s
// `selectedCameraId` (set elsewhere, e.g. from the Locations module) is
// only ever a *hint* consumed once on arrival — the URL always wins once
// it has its own value, and it's what stays authoritative afterward.
export function CCTVPage() {
  const { caseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { status, error, cameras, events, loadCase } = useCCTVStore();
  const selectedCameraHint = useInvestigationStore((s) => s.selectedCameraId);
  const clearCameraHint = useInvestigationStore((s) => s.selectCamera);
  const [query, setQuery] = useState('');

  useEffect(() => { if (caseId) loadCase(caseId); }, [caseId, loadCase]);

  const cameraParam = searchParams.get('camera');
  const eventParam = searchParams.get('event');

  // Once cameras are loaded for this case, resolve the actual active camera:
  // URL param (if it names a camera that exists in THIS case) wins; else the
  // cross-module hint (if valid for this case); else the first camera. Then
  // make sure the URL reflects that choice, so it's always shareable/
  // refreshable — even when the user never explicitly picked one.
  useEffect(() => {
    if (status !== 'ready' || cameras.length === 0) return;
    const validParam = cameraParam && cameras.some((c) => c.id === cameraParam) ? cameraParam : null;
    const validHint = selectedCameraHint && cameras.some((c) => c.id === selectedCameraHint) ? selectedCameraHint : null;
    const resolved = validParam ?? validHint ?? cameras[0].id;
    if (resolved !== cameraParam) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('camera', resolved);
        if (!validParam) next.delete('event'); // switching camera (not just confirming URL) resets event choice
        return next;
      }, { replace: true });
    }
    if (validHint) clearCameraHint(null); // consume the one-shot hint so it doesn't stick across later navigations
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, cameras, caseId]);

  const activeCameraId = cameraParam && cameras.some((c) => c.id === cameraParam) ? cameraParam : (cameras[0]?.id ?? null);
  const activeCamera = cameras.find((c) => c.id === activeCameraId) ?? null;
  const cameraEvents = events.filter((e) => e.cameraId === activeCameraId);
  const activeEvent = cameraEvents.find((e) => e.id === eventParam) ?? cameraEvents[0] ?? null;

  function selectCamera(id: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('camera', id);
      next.delete('event');
      return next;
    });
  }
  function selectEvent(id: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('event', id);
      return next;
    });
  }

  if (status === 'loading') return <LoadingState label="LOADING CCTV ARCHIVE" />;
  if (status === 'error') return <div style={{ padding: 20 }}><ErrorState title="DATA SOURCE UNAVAILABLE" sourceRef={error ?? undefined} /></div>;
  if (cameras.length === 0) return <EmptyState title="NO CAMERAS LINKED" hint="No CCTV sources are associated with this case." />;

  const filteredCameras = cameras.filter((c) => !query || c.name.toLowerCase().includes(query.toLowerCase()) || c.code.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="stack" style={{ height: '100%' }}>
      <div className="row" style={{ flex: 1, minHeight: 0, alignItems: 'stretch' }}>
        <div className="stack" style={{ width: 260, borderRight: '1px solid var(--border)', padding: 10, overflowY: 'auto' }}>
          <SearchInput value={query} onChange={setQuery} placeholder="Search cameras…" />
          <div style={{ marginTop: 10 }}>
            <CameraList cameras={filteredCameras} events={events} activeCameraId={activeCameraId} onSelect={selectCamera} />
          </div>
        </div>
        <div style={{ flex: 1, padding: 12, minWidth: 0 }}>
          <CCTVViewer camera={activeCamera} activeEvent={activeEvent} />
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-2)' }}>
        <CCTVEventDetails event={activeEvent} />
      </div>
      <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-2)' }}>
        <div className="system-label" style={{ padding: '6px 12px 0' }}>VIDEO TIMELINE</div>
        <CCTVTimeline events={cameraEvents} activeId={activeEvent?.id ?? null} onSelect={selectEvent} />
      </div>
    </div>
  );
}
