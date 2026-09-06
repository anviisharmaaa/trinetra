export function ClusterMarker({ x, y, label, count, onClick }: { x: number; y: number; label: string; count: number; onClick: () => void }) {
  const size = Math.min(44, 26 + count * 1.6);
  return (
    <button
      type="button"
      onClick={onClick}
      title={`${label} — ${count} locations`}
      style={{
        position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)',
        background: 'none', border: 'none', cursor: 'pointer', padding: 0, zIndex: 3,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
      }}
    >
      <span
        className="mono"
        style={{
          width: size, height: size, borderRadius: '50%',
          background: 'rgba(72,216,255,0.14)', border: '1.5px solid var(--cyan-dim)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--cyan)', fontSize: 13, fontWeight: 700,
        }}
      >
        {count}
      </span>
      <span
        className="mono"
        style={{
          fontSize: 9.5, color: 'var(--text-secondary)', background: 'var(--bg-0)',
          border: '1px solid var(--border)', borderRadius: 2, padding: '1px 5px', whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </button>
  );
}
