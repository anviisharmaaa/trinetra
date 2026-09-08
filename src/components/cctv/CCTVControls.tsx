import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { formatDuration } from '../../utils/formatters';

const RATES = [0.5, 1, 1.5, 2] as const;

export function CCTVControls({
  playing, currentTime, duration, muted, volume, rate, fullscreen,
  onTogglePlay, onSeek, onToggleMute, onVolumeChange, onRateChange, onToggleFullscreen,
}: {
  playing: boolean;
  currentTime: number;
  duration: number;
  muted: boolean;
  volume: number;
  rate: number;
  fullscreen: boolean;
  onTogglePlay: () => void;
  onSeek: (t: number) => void;
  onToggleMute: () => void;
  onVolumeChange: (v: number) => void;
  onRateChange: (r: number) => void;
  onToggleFullscreen: () => void;
}) {
  const safeDuration = duration > 0 && Number.isFinite(duration) ? duration : 0;
  return (
    <div
      style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 3,
        background: 'linear-gradient(0deg, rgba(5,8,13,0.92) 0%, rgba(5,8,13,0.78) 65%, transparent 100%)',
        padding: '18px 10px 8px',
      }}
    >
      <input
        type="range"
        className="mono"
        min={0}
        max={safeDuration || 1}
        step={0.1}
        value={Math.min(currentTime, safeDuration || 0)}
        onChange={(e) => onSeek(Number(e.target.value))}
        aria-label="Seek"
        style={{ width: '100%', accentColor: 'var(--cyan)', cursor: 'pointer', display: 'block', height: 4 }}
      />
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
        <div className="row gap-2" style={{ alignItems: 'center' }}>
          <button type="button" className="btn btn-ghost btn-sm" aria-label={playing ? 'Pause' : 'Play'} onClick={onTogglePlay} style={{ padding: 4 }}>
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button type="button" className="btn btn-ghost btn-sm" aria-label={muted ? 'Unmute' : 'Mute'} onClick={onToggleMute} style={{ padding: 4 }}>
            {muted || volume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            aria-label="Volume"
            style={{ width: 56, accentColor: 'var(--cyan)', cursor: 'pointer' }}
          />
          <span className="mono text-muted" style={{ fontSize: 10.5, whiteSpace: 'nowrap' }}>
            {formatDuration(Math.floor(currentTime))} / {formatDuration(Math.floor(safeDuration))}
          </span>
        </div>
        <div className="row gap-2" style={{ alignItems: 'center' }}>
          <select
            value={rate}
            onChange={(e) => onRateChange(Number(e.target.value))}
            aria-label="Playback speed"
            className="mono"
            style={{
              background: 'var(--panel)', color: 'var(--text-secondary)', border: '1px solid var(--border)',
              borderRadius: 3, fontSize: 10.5, padding: '2px 4px', cursor: 'pointer',
            }}
          >
            {RATES.map((r) => <option key={r} value={r}>{r}×</option>)}
          </select>
          <button type="button" className="btn btn-ghost btn-sm" aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'} onClick={onToggleFullscreen} style={{ padding: 4 }}>
            {fullscreen ? <Minimize size={13} /> : <Maximize size={13} />}
          </button>
        </div>
      </div>
    </div>
  );
}
