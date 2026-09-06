import { useState } from 'react';
import type { Camera, CCTVEvent } from '../../types';
import { DetectionOverlay } from './DetectionOverlay';
import { CCTVOverlay } from './CCTVOverlay';
import { CCTVVideoPlayer } from './CCTVVideoPlayer';
import { CCTVUnavailable } from './CCTVUnavailable';
import { EntityImage } from '../ui/EntityImage';
import { getEntityById } from '../../data';
import { cctvFrameImage } from '../../config/imageAssets';
import { cctvEventVideo, cctvVideoSource } from '../../config/cctvVideoAssets';
import { titleCase } from '../../utils/formatters';

/**
 * Camera feed for one camera, keyed by camera.id at the call site so a
 * camera switch gets a clean remount (fresh player, fresh fallback state)
 * while switching events on the SAME camera just re-seeks in place.
 */
function CCTVCameraFeed({ camera, activeEvent }: { camera: Camera; activeEvent: CCTVEvent | null }) {
  const [videoFailed, setVideoFailed] = useState(false);
  const location = getEntityById(camera.locationId);

  // Architecture: one video source per CAMERA. An event only ever changes
  // *where in that camera's clip* we seek to, never which file loads.
  const videoRef = activeEvent ? cctvEventVideo(activeEvent.id) : null;
  const source = videoRef?.source ?? cctvVideoSource(camera.id);
  const offsetSeconds = videoRef?.offsetSeconds ?? 0;
  const seekToken = activeEvent?.id ?? camera.id;

  if (videoFailed) {
    return (
      <EntityImage
        src={cctvFrameImage(activeEvent?.id ?? camera.id)}
        alt={camera.code}
        style={{ width: '100%', height: '100%' }}
        fallback={<CCTVUnavailable camera={camera} event={activeEvent} />}
      />
    );
  }

  return (
    <CCTVVideoPlayer
      key={camera.id}
      src={source}
      poster={cctvFrameImage(activeEvent?.id ?? camera.id)}
      seekSeconds={offsetSeconds}
      seekToken={seekToken}
      onError={() => setVideoFailed(true)}
      overlay={
        <>
          <CCTVOverlay
            cameraCode={camera.code}
            locationLabel={location?.name}
            timestamp={activeEvent?.timestamp}
            eventTypeLabel={activeEvent ? titleCase(activeEvent.eventType) : undefined}
          />
          <DetectionOverlay event={activeEvent} />
        </>
      }
    />
  );
}

export function CCTVViewer({ camera, activeEvent }: { camera: Camera | null; activeEvent: CCTVEvent | null }) {
  if (!camera) {
    return (
      <div className="empty-state" style={{ height: '100%' }}>
        <span className="empty-state-title">NO CAMERA SELECTED</span>
      </div>
    );
  }
  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden', border: '1px solid var(--border)' }}>
      {camera.status === 'offline' ? (
        <div className="empty-state" style={{ height: '100%' }}>
          <span className="empty-state-title text-danger">CAMERA OFFLINE</span>
          <span className="text-muted" style={{ fontSize: 12 }}>{camera.name} is not currently transmitting.</span>
        </div>
      ) : (
        <CCTVCameraFeed camera={camera} activeEvent={activeEvent} />
      )}
    </div>
  );
}
