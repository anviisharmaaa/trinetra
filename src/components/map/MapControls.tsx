import { ZoomIn, ZoomOut, Locate } from 'lucide-react';

export function MapControls({ zoom, onZoomIn, onZoomOut, onReset }: { zoom: number; onZoomIn: () => void; onZoomOut: () => void; onReset: () => void }) {
  return (
    <div className="stack gap-1" style={{ position: 'absolute', top: 10, right: 10, zIndex: 5 }}>
      <button className="icon-btn" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }} onClick={onZoomIn} aria-label="Zoom in" type="button"><ZoomIn size={14} /></button>
      <button className="icon-btn" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }} onClick={onZoomOut} aria-label="Zoom out" type="button"><ZoomOut size={14} /></button>
      <button className="icon-btn" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }} onClick={onReset} aria-label="Reset view" type="button"><Locate size={14} /></button>
      <span className="mono text-muted" style={{ fontSize: 9, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
    </div>
  );
}
