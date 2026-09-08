import { CommandPalette } from './CommandPalette';
import { useUIStore } from '../../store/uiStore';

export function GlobalOverlays() {
  const toasts = useUIStore((s) => s.toasts);
  const dismissToast = useUIStore((s) => s.dismissToast);

  return (
    <>
      <CommandPalette />
      <div style={{ position: 'fixed', top: 56, right: 16, zIndex: 90, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            className="panel fade-in"
            style={{ padding: '8px 12px', fontSize: 12, minWidth: 220, borderColor: t.tone === 'danger' ? 'var(--danger-dim)' : 'var(--border-active)', cursor: 'pointer' }}
            onClick={() => dismissToast(t.id)}
          >
            {t.message}
          </div>
        ))}
      </div>
    </>
  );
}
