import { useState, type CSSProperties, type ReactNode } from 'react';
import { VideoOff } from 'lucide-react';

/**
 * The single place that ever renders a real `public/images/...` file.
 * If `src` is missing, or the file 404s, it renders `fallback` instead —
 * silently, with no broken-image icon and no layout shift. This is what
 * lets every page reference an image path unconditionally (via
 * `src/config/imageAssets.ts`) without caring whether the real asset has
 * been dropped in yet.
 */
export function EntityImage({
  src, alt, fallback, style, className,
}: {
  src?: string;
  alt: string;
  fallback: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return <div className={className} style={style}>{fallback}</div>;
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ objectFit: 'cover', ...style }}
      onError={() => setFailed(true)}
    />
  );
}

const AVATAR_PALETTE = ['#48d8ff', '#e45c68', '#53d39c', '#d7ad58', '#a78bfa', '#f0b429', '#48a0ff'];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function initials(name: string): string {
  const parts = name.replace(/\(.*?\)/g, '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Portrait with graceful initials-avatar fallback. Used for people everywhere. */
export function PersonAvatar({
  personId, name, src, size = 40, square = false,
}: {
  personId: string; name: string; src?: string; size?: number; square?: boolean;
}) {
  const color = AVATAR_PALETTE[hashString(personId) % AVATAR_PALETTE.length];
  return (
    <EntityImage
      src={src}
      alt={name}
      style={{
        width: size, height: size, borderRadius: square ? 6 : '50%',
        flexShrink: 0, border: `1px solid ${color}55`,
      }}
      fallback={
        <div
          style={{
            width: size, height: size, borderRadius: square ? 6 : '50%', flexShrink: 0,
            background: `${color}22`, border: `1px solid ${color}55`, color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: Math.max(10, size * 0.36), fontWeight: 700, letterSpacing: '0.02em',
          }}
        >
          {initials(name)}
        </div>
      }
    />
  );
}

const LOCATION_CATEGORY_GLYPH: Record<string, string> = {
  residential: '🏠', commercial: '🏢', industrial: '🏭', port_area: '⚓',
  airport: '✈', transit_hub: '🚉', warehouse: '📦', border_checkpoint: '🚧',
};

/** Location thumbnail with a graceful category-icon fallback. */
export function LocationThumb({
  locationId, name, category, src, style,
}: {
  locationId: string; name: string; category?: string; src?: string; style?: CSSProperties;
}) {
  const color = AVATAR_PALETTE[hashString(locationId) % AVATAR_PALETTE.length];
  const glyph = (category && LOCATION_CATEGORY_GLYPH[category]) || '📍';
  return (
    <EntityImage
      src={src}
      alt={name}
      style={{ width: '100%', height: 120, borderRadius: 6, ...style }}
      fallback={
        <div
          style={{
            width: '100%', height: style?.height ?? 120, borderRadius: 6,
            background: `linear-gradient(135deg, ${color}26, var(--bg-2))`,
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4,
          }}
        >
          <span style={{ fontSize: 26, filter: 'grayscale(0.15)' }}>{glyph}</span>
          <span className="text-muted mono" style={{ fontSize: 9, letterSpacing: '0.05em' }}>NO IMAGE ON FILE</span>
        </div>
      }
    />
  );
}

/** Evidence item thumbnail with a graceful type-icon fallback. */
export function EvidenceThumb({
  evidenceId, evidenceType, src, size = 44,
}: {
  evidenceId: string; evidenceType: string; src?: string; size?: number;
}) {
  const color = AVATAR_PALETTE[hashString(evidenceId) % AVATAR_PALETTE.length];
  return (
    <EntityImage
      src={src}
      alt={evidenceType}
      style={{ width: size, height: size, borderRadius: 6, flexShrink: 0 }}
      fallback={
        <div
          style={{
            width: size, height: size, borderRadius: 6, flexShrink: 0,
            background: `${color}1a`, border: `1px solid ${color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color, fontSize: 9, fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase',
          }}
        >
          {evidenceType.slice(0, 3)}
        </div>
      }
    />
  );
}

/**
 * A captured-frame placeholder (CCTV cameras, face-recognition detections).
 * There is no synthetic photo to fall back to here — this IS the visual,
 * a deliberately "redacted archival frame" look — but it still accepts a
 * real frame image (via imageAssets.cctvFrameImage) and will show that
 * instead the moment one is dropped into public/images/cctv/.
 */
export function FramePlaceholder({
  src, label, sublabel, compact = false,
}: {
  src?: string; label: string; sublabel?: string; compact?: boolean;
}) {
  return (
    <EntityImage
      src={src}
      alt={label}
      style={{ width: '100%', height: '100%' }}
      fallback={
        <div
          style={{
            width: '100%', height: '100%',
            background: 'repeating-linear-gradient(180deg,#060a0f,#060a0f 2px,#080d13 2px,#080d13 4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: compact ? 0 : 6,
            overflow: 'hidden',
          }}
        >
          {compact ? (
            <VideoOff size={14} className="text-muted" />
          ) : (
            <>
              <span className="mono text-muted" style={{ fontSize: 10, letterSpacing: '0.08em' }}>NO FRAME CAPTURED</span>
              <span className="mono text-muted" style={{ fontSize: 9, opacity: 0.7 }}>{label}{sublabel ? ` · ${sublabel}` : ''}</span>
            </>
          )}
        </div>
      }
    />
  );
}
