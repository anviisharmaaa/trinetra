import { X } from 'lucide-react';
import type { ReactNode } from 'react';

export interface ActiveFilter {
  key: string;
  label: string;
}

export function FilterBar({ filters, onRemove, onClearAll, children }: { filters: ActiveFilter[]; onRemove: (key: string) => void; onClearAll: () => void; children?: ReactNode }) {
  if (filters.length === 0 && !children) return null;
  return (
    <div className="filter-bar">
      {children}
      {filters.map((f) => (
        <span key={f.key} className="filter-chip">
          {f.label}
          <button type="button" onClick={() => onRemove(f.key)} aria-label={`Remove filter ${f.label}`}>
            <X size={11} />
          </button>
        </span>
      ))}
      {filters.length > 0 && (
        <button type="button" className="btn btn-ghost btn-sm" onClick={onClearAll}>CLEAR ALL</button>
      )}
    </div>
  );
}
