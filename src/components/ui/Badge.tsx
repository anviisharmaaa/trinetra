import type { ReactNode } from 'react';

export function Badge({ tone = 'neutral', children }: { tone?: 'critical' | 'high' | 'medium' | 'low' | 'info' | 'neutral'; children: ReactNode }) {
  const toneClass = tone === 'critical' ? 'badge-high' : `badge-${tone}`;
  return <span className={`badge ${toneClass}`}>{children}</span>;
}

export function StatusDot({ status }: { status: 'active' | 'monitoring' | 'closed' | 'online' | 'offline' | string }) {
  return <span className={`status-dot ${status}`} />;
}
