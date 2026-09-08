import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { useEffect } from 'react';

export function Drawer({ open, onClose, title, children, actions }: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode; actions?: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-label="Details panel">
        <div className="drawer-header">
          <span className="section-title">{title}</span>
          <div className="row gap-2">
            {actions}
            <button className="icon-btn" onClick={onClose} aria-label="Close" type="button"><X size={16} /></button>
          </div>
        </div>
        <div className="drawer-body">{children}</div>
      </aside>
    </>
  );
}
