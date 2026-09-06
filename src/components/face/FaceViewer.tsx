import { useState } from 'react';
import { VideoOff } from 'lucide-react';
import type { FaceDetection } from '../../types';
import { FaceBoundingBox } from './FaceBoundingBox';
import { getEntityById } from '../../data';
import { EntityImage } from '../ui/EntityImage';
import { cctvFrameImage } from '../../config/imageAssets';
import { cctvDetectionVideo } from '../../config/cctvVideoAssets';
import { CCTVVideoPlayer } from '../cctv/CCTVVideoPlayer';
import { formatDateTime } from '../../utils/formatters';

function FaceVideoUnavailable({ detection }: { detection: FaceDetection }) {
  return (
    <div
      style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 10,
        background: 'repeating-linear-gradient(180deg,#060a0f,#060a0f 2px,#080d13 2px,#080d13 4px)',
      }}
    >
      <VideoOff size={22} className="text-muted" />
      <span className="mono text-muted" style={{ fontSize: 11, letterSpacing: '0.08em' }}>VIDEO SOURCE UNAVAILABLE</span>
      <div className="stack gap-1" style={{ alignItems: 'center', marginTop: 4 }}>
        <span className="text-secondary" style={{ fontSize: 12 }}>{detection.cameraId}</span>
        <span className="mono text-muted" style={{ fontSize: 9.5 }}>FRAME {detection.frameId} · {formatDateTime(detection.timestamp)}</span>
      </div>
    </div>
  );
}

export function FaceViewer({ detection }: { detection: FaceDetection | null }) {
  const [videoFailed, setVideoFailed] = useState(false);

  if (!detection) {
    return <div className="empty-state" style={{ height: '100%' }}><span className="empty-state-title">NO DETECTION SELECTED</span></div>;
  }

  const entity = detection.identityId ? getEntityById(detection.identityId) : undefined;
  const videoRef = cctvDetectionVideo(detection.id);
  const showVideo = !videoFailed && !!videoRef;

  // Kept out of the video's bottom transport-controls zone by living entirely
  // in the top band: camera/frame id top-left, real face bounding box (from
  // FaceDetection.boundingBox — never a fabricated one), status/identity
  // badges just beneath it.
  const infoOverlay = (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
      <div style={{ position: 'absolute', top: 10, left: 10 }} className="mono text-cyan">{detection.cameraId} · FRAME {detection.frameId}</div>
      <FaceBoundingBox detection={detection} />
      <div className="row gap-2" style={{ position: 'absolute', top: 34, left: 10 }}>
        <span className="badge badge-info">{detection.status.replace('-', ' ').toUpperCase()}</span>
        {entity && <span className="badge badge-neutral">{entity.name}</span>}
      </div>
    </div>
  );

  return (
    <div style={{ position: 'relative', height: '100%', border: '1px solid var(--border)', overflow: 'hidden' }}>
      {showVideo ? (
        <CCTVVideoPlayer
          key={detection.cameraId}
          src={videoRef.source}
          poster={cctvFrameImage(detection.frameId)}
          seekSeconds={videoRef.offsetSeconds}
          seekToken={detection.id}
          onError={() => setVideoFailed(true)}
          overlay={infoOverlay}
        />
      ) : (
        <>
          <EntityImage
            src={cctvFrameImage(detection.frameId)}
            alt={detection.cameraId}
            style={{ width: '100%', height: '100%' }}
            fallback={<FaceVideoUnavailable detection={detection} />}
          />
          <div className="scanline" />
          {infoOverlay}
        </>
      )}
    </div>
  );
}
