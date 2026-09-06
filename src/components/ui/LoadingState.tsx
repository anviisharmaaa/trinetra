import { useEffect, useState } from 'react';

export function LoadingState({ label = 'LOADING', steps }: { label?: string; steps?: string[] }) {
  const [stepIndex, setStepIndex] = useState(0);
  useEffect(() => {
    if (!steps?.length) return;
    const id = setInterval(() => setStepIndex((i) => Math.min(i + 1, steps.length - 1)), 380);
    return () => clearInterval(id);
  }, [steps]);

  return (
    <div className="empty-state">
      <div className="mono text-cyan" style={{ fontSize: 12, letterSpacing: '0.06em' }}>
        {steps?.length ? steps[stepIndex] : `${label}...`}
      </div>
      <div style={{ width: 220, height: 3, background: 'var(--bg-2)', borderRadius: 2, overflow: 'hidden', border: '1px solid var(--border)' }}>
        <div className="skeleton" style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}

export function SkeletonRows({ count = 5 }: { count?: number }) {
  return (
    <div className="stack gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 32, width: '100%' }} />
      ))}
    </div>
  );
}
