import { useEffect, useRef, useState, type ReactNode } from 'react';
import { CCTVControls } from './CCTVControls';

/**
 * Real HTML5 video playback for a single camera's recorded footage, with its
 * own transport controls. Renders nothing about *which* camera/event is
 * showing — that's `CCTVOverlay`'s job, passed in as `overlay` so it can
 * layer between the video and the controls bar.
 *
 * Mount this keyed by camera id (`key={camera.id}` at the call site) so
 * switching cameras gets a clean remount instead of carrying over playback
 * state from a different physical feed. Switching *events* on the same
 * camera should NOT remount — it should just re-seek — which is what
 * `seekToken` is for.
 */
export function CCTVVideoPlayer({
  src, poster, seekSeconds, seekToken, onError, overlay,
}: {
  src: string;
  poster?: string;
  seekSeconds: number;
  seekToken: string;
  onError: () => void;
  overlay?: ReactNode;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(seekSeconds);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);

  // A newly selected event/detection on the SAME camera re-seeks the
  // already-loaded video rather than reloading it.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !readyRef.current) return;
    v.currentTime = seekSeconds;
    setCurrentTime(seekSeconds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seekToken]);

  useEffect(() => {
    function onFsChange() { setFullscreen(document.fullscreenElement === containerRef.current); }
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  function handleLoadedMetadata() {
    const v = videoRef.current;
    if (!v) return;
    readyRef.current = true;
    setDuration(v.duration || 0);
    v.currentTime = seekSeconds;
    setCurrentTime(seekSeconds);
  }

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {}); else v.pause();
  }
  function handleSeek(t: number) {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = t;
    setCurrentTime(t);
  }
  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }
  function handleVolumeChange(vol: number) {
    const v = videoRef.current;
    if (!v) return;
    v.volume = vol;
    setVolume(vol);
    const shouldMute = vol === 0;
    v.muted = shouldMute;
    setMuted(shouldMute);
  }
  function handleRateChange(r: number) {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = r;
    setRate(r);
  }
  function toggleFullscreen() {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else el.requestFullscreen?.().catch(() => {});
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%', background: '#000', overflow: 'hidden' }}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={muted}
        playsInline
        preload="metadata"
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={onError}
      />
      {overlay}
      <CCTVControls
        playing={playing}
        currentTime={currentTime}
        duration={duration}
        muted={muted}
        volume={volume}
        rate={rate}
        fullscreen={fullscreen}
        onTogglePlay={togglePlay}
        onSeek={handleSeek}
        onToggleMute={toggleMute}
        onVolumeChange={handleVolumeChange}
        onRateChange={handleRateChange}
        onToggleFullscreen={toggleFullscreen}
      />
    </div>
  );
}
