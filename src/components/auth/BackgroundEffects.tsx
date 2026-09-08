export function BackgroundEffects() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage:
            'linear-gradient(rgba(72,216,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(72,216,255,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 75%)',
        }}
      />
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 40%, rgba(29,125,150,0.14) 0%, transparent 55%)',
        }}
      />
      <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 160px rgba(0,0,0,0.85)' }} />
    </div>
  );
}
