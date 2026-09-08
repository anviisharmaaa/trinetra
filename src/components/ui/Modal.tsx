import type { ReactNode } from 'react';
import { X } from 'lucide-react';

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: ReactNode; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        {title && (
          <div className="drawer-header">
            <span className="section-title">{title}</span>
            <button className="icon-btn" onClick={onClose} aria-label="Close" type="button"><X size={16} /></button>
          </div>
        )}
        <div className="panel-body">{children}</div>
      </div>
    </div>
  );
}
