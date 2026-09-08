import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export function CollapsibleSection({
  title, defaultOpen = true, children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="row gap-1"
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit',
          padding: '4px 0', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <span className="system-label">{title}</span>
        {open ? <ChevronDown size={13} className="text-muted" /> : <ChevronRight size={13} className="text-muted" />}
      </button>
      {open && <div style={{ paddingTop: 2 }}>{children}</div>}
    </div>
  );
}
