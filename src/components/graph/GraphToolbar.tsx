import { Maximize, Minimize, Info, SlidersHorizontal, ZoomIn, ZoomOut, RotateCcw, Crosshair, Shrink } from 'lucide-react';
import { useGraphStore } from '../../store/graphStore';
import type { GraphLayout, GraphViewMode } from '../../store/graphStore';
import { GraphSearch } from './GraphSearch';

const LAYOUTS: { key: GraphLayout; label: string }[] = [
  { key: 'radial', label: 'RADIAL' },
  { key: 'hierarchical', label: 'HIERARCHY' },
  { key: 'force-directed', label: 'FORCE' },
];

const VIEWS: { key: GraphViewMode; label: string }[] = [
  { key: 'graph', label: 'GRAPH' },
  { key: 'table', label: 'TABLE' },
];

export function GraphToolbar({
  onToggleFilters, filtersOpen, onToggleLegend, legendOpen,
  onZoomIn, onZoomOut, onResetZoom, isFullscreen, onToggleFullscreen,
  onRecenter, canRecenter,
}: {
  onToggleFilters: () => void; filtersOpen: boolean;
  onToggleLegend: () => void; legendOpen: boolean;
  onZoomIn: () => void; onZoomOut: () => void; onResetZoom: () => void;
  isFullscreen: boolean; onToggleFullscreen: () => void;
  onRecenter: () => void; canRecenter: boolean;
}) {
  const viewMode = useGraphStore((s) => s.viewMode);
  const setViewMode = useGraphStore((s) => s.setViewMode);
  const layout = useGraphStore((s) => s.layout);
  const setLayout = useGraphStore((s) => s.setLayout);
  const setCenter = useGraphStore((s) => s.setCenter);
  const collapseAllGroups = useGraphStore((s) => s.collapseAllGroups);
  const hasExpanded = useGraphStore((s) => s.expandedGroups.size > 0);

  return (
    <div className="row gap-2" style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)', flexWrap: 'wrap' }}>
      <span className="page-title" style={{ fontSize: 13, marginRight: 4 }}>NETWORK ANALYSIS</span>

      <div className="row gap-0" style={{ border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
        {VIEWS.map((v) => (
          <button
            key={v.key}
            type="button"
            className={`btn btn-sm ${viewMode === v.key ? 'btn-primary' : ''}`}
            style={{ borderRadius: 0, border: 'none' }}
            onClick={() => setViewMode(v.key)}
          >
            {v.label}
          </button>
        ))}
      </div>

      <GraphSearch onPick={(id) => setCenter(id)} />

      {viewMode === 'graph' && (
        <>
          <select className="select" value={layout} onChange={(e) => setLayout(e.target.value as GraphLayout)} style={{ fontSize: 11 }}>
            {LAYOUTS.map((l) => <option key={l.key} value={l.key}>{l.label}</option>)}
          </select>

          <button className="btn btn-sm" type="button" onClick={onRecenter} disabled={!canRecenter} title="Recenter on primary subject">
            <Crosshair size={12} /> RECENTER
          </button>

          {layout !== 'force-directed' && (
            <button className="btn btn-sm" type="button" onClick={collapseAllGroups} disabled={!hasExpanded} title="Collapse expanded relationship groups">
              <Shrink size={12} /> COLLAPSE
            </button>
          )}

          <div className="row gap-0">
            <button className="icon-btn" type="button" onClick={onZoomOut} aria-label="Zoom out"><ZoomOut size={13} /></button>
            <button className="icon-btn" type="button" onClick={onResetZoom} aria-label="Reset zoom"><RotateCcw size={13} /></button>
            <button className="icon-btn" type="button" onClick={onZoomIn} aria-label="Zoom in"><ZoomIn size={13} /></button>
          </div>

          <button className={`btn btn-sm ${legendOpen ? 'btn-primary' : ''}`} type="button" onClick={onToggleLegend}>
            <Info size={12} /> LEGEND
          </button>
          <button className={`btn btn-sm ${filtersOpen ? 'btn-primary' : ''}`} type="button" onClick={onToggleFilters}>
            <SlidersHorizontal size={12} /> FILTERS
          </button>
          <button className="btn btn-sm" type="button" onClick={onToggleFullscreen}>
            {isFullscreen ? <Minimize size={12} /> : <Maximize size={12} />} {isFullscreen ? 'EXIT' : 'FULLSCREEN'}
          </button>
        </>
      )}
    </div>
  );
}
