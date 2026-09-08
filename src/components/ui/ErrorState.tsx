import { AlertTriangle } from 'lucide-react';

export function ErrorState({ title, sourceRef, message, onRetry }: { title: string; sourceRef?: string; message?: string; onRetry?: () => void }) {
  return (
    <div className="error-state">
      <div className="row gap-2">
        <AlertTriangle size={16} color="var(--danger)" />
        <strong style={{ fontSize: 13 }}>{title}</strong>
      </div>
      {sourceRef && <div className="mono">SOURCE: {sourceRef}</div>}
      {message && <div className="text-secondary" style={{ fontSize: 12 }}>{message}</div>}
      <div className="row gap-2">
        {onRetry && <button className="btn btn-sm" onClick={onRetry} type="button">RETRY</button>}
        <button className="btn btn-sm btn-ghost" type="button">VIEW CACHED DATA</button>
      </div>
    </div>
  );
}
