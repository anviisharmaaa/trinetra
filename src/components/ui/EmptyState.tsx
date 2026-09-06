import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

export function EmptyState({ icon, title, hint, action }: { icon?: ReactNode; title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="empty-state">
      {icon ?? <Inbox size={28} />}
      <div className="empty-state-title">{title}</div>
      {hint && <div className="text-muted" style={{ fontSize: 12, maxWidth: 320 }}>{hint}</div>}
      {action}
    </div>
  );
}
