import { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import type { Core, NodeSingular, EdgeSingular } from 'cytoscape';
import type { Entity, Relationship } from '../../types';
import { toElements, graphStylesheet, layoutOptionsFor } from './graphAdapter';
import { useInvestigationStore } from '../../store/investigationStore';
import { GraphContextMenu } from './GraphContextMenu';

/**
 * The "Force" layout option: a bounded force-directed fallback. It only
 * ever receives the same capped subject-graph (center + direct
 * connections, minus anything collapsed into an overflow chip) that the
 * Radial/Hierarchical views draw — never the whole case — so it can't
 * regress into the old "everything at once" cloud.
 */
export function NetworkGraph({ entities, relationships, onSelectNode }: { entities: Entity[]; relationships: Relationship[]; onSelectNode: (id: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  // The 'cose' layout runs its own animation loop (rAF-driven), independent
  // of React. Stopping it explicitly before re-running or destroying the
  // core avoids a stray frame firing against an already-torn-down instance
  // (which cytoscape surfaces as a cryptic "reading 'notify' of null").
  const layoutRef = useRef<ReturnType<Core['layout']> | null>(null);
  const { selectRelationship, selectedEntityId } = useInvestigationStore();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; nodeId: string } | null>(null);
  const onSelectNodeRef = useRef(onSelectNode);
  onSelectNodeRef.current = onSelectNode;

  // Init cytoscape once
  useEffect(() => {
    if (!containerRef.current) return;
    const cy = cytoscape({
      container: containerRef.current,
      style: graphStylesheet(),
      minZoom: 0.2,
      maxZoom: 3,
      wheelSensitivity: 0.25,
    });
    cyRef.current = cy;

    cy.on('tap', 'node', (e) => {
      onSelectNodeRef.current(e.target.id());
      setContextMenu(null);
    });
    cy.on('tap', 'edge', (e) => {
      selectRelationship(e.target.id());
      setContextMenu(null);
    });
    cy.on('tap', (e) => {
      if (e.target === cy) {
        setContextMenu(null);
      }
    });
    cy.on('cxttap', 'node', (e) => {
      const pos = e.renderedPosition;
      setContextMenu({ x: pos.x, y: pos.y, nodeId: e.target.id() });
    });

    function onFit() {
      cy.fit(undefined, 40);
    }
    window.addEventListener('trinetra:graph-fit', onFit);

    // NetworkAnalysisPage keeps this mounted and toggles it with CSS
    // display rather than mounting/unmounting on every layout switch (that
    // churn is what caused the cose layout's own animation loop to fire
    // against an already-destroyed core). A hidden container reports 0x0,
    // so re-fit whenever it becomes visible again.
    const ro = new ResizeObserver(() => {
      if (containerRef.current && containerRef.current.clientWidth > 0) {
        cy.resize();
        cy.fit(undefined, 40);
      }
    });
    ro.observe(containerRef.current);

    return () => {
      window.removeEventListener('trinetra:graph-fit', onFit);
      ro.disconnect();
      try { layoutRef.current?.stop(); } catch { /* already stopped/torn down */ }
      try { cy.stop(true, true); } catch { /* already stopped/torn down */ }
      // cose's animation loop schedules its own requestAnimationFrame calls
      // independent of React. stop() prevents it from scheduling further
      // frames, but a frame already in flight when we get here still fires
      // once more — destroying synchronously here means that stray frame
      // runs against a core with no renderer and crashes. Deferring the
      // actual destroy two frames lets any such in-flight frame finish
      // against a still-live core first.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          try { cy.destroy(); } catch { /* defensive: never let teardown crash the page */ }
        });
      });
      layoutRef.current = null;
      cyRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync elements
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    layoutRef.current?.stop();
    cy.elements().remove();
    cy.add(toElements(entities, relationships));
    layoutRef.current = cy.layout(layoutOptionsFor('force-directed'));
    layoutRef.current.run();
  }, [entities, relationships]);

  // Selection highlight sync
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.nodes().unselect();
    if (selectedEntityId) {
      const n = cy.getElementById(selectedEntityId);
      if (n.length) n.select();
    }
  }, [selectedEntityId]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%', background: 'var(--bg-1)' }} />
      {contextMenu && (
        <GraphContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          nodeId={contextMenu.nodeId}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}

export function focusOnNode(cy: Core | null, nodeId: string) {
  if (!cy) return;
  const node = cy.getElementById(nodeId) as NodeSingular;
  if (node.length) cy.animate({ center: { eles: node }, zoom: 1.4 }, { duration: 300 });
}

export type { NodeSingular, EdgeSingular };
