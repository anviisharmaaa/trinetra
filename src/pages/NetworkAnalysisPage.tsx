import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GraphToolbar } from '../components/graph/GraphToolbar';
import { GraphFilters } from '../components/graph/GraphFilters';
import { GraphLegend } from '../components/graph/GraphLegend';
import { RadialNetworkGraph } from '../components/graph/RadialNetworkGraph';
import { NetworkGraph } from '../components/graph/NetworkGraph';
import { NetworkTable } from '../components/graph/NetworkTable';
import { EntityDetails } from '../components/graph/EntityDetails';
import { RelationshipDetails } from '../components/graph/RelationshipDetails';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { useGraphStore } from '../store/graphStore';
import { useInvestigationStore } from '../store/investigationStore';
import { useCaseStore } from '../store/caseStore';
import { useCaseIntelligenceStore } from '../store/caseIntelligenceStore';
import { buildSubjectGraph } from '../components/graph/subjectGraph';
import { getEntityById, mockRelationships } from '../data';
import { DEFAULT_ANALYSIS_STEPS } from '../utils/mockDelay';

export function NetworkAnalysisPage() {
  const { caseId } = useParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const {
    status, error, loadCaseGraph, entities, relationships, filters, hiddenIds,
    viewMode, layout, searchQuery, centerEntityId, primarySubjectId, expandedGroups, setCenter, expandGroup,
  } = useGraphStore();
  const { selectedEntityId, selectedRelationshipId, selectEntity, selectRelationship } = useInvestigationStore();
  const { cases } = useCaseStore();
  const { allPersonIds, loadCase: loadCaseIntelligence } = useCaseIntelligenceStore();

  const activeCase = cases.find((c) => c.id === caseId);
  const realPersonIds = useMemo(() => {
    if (!caseId) return [];
    const linked = caseId === activeCase?.id ? allPersonIds : [];
    return linked.filter((id) => !getEntityById(id));
  }, [activeCase?.id, allPersonIds, caseId]);

  useEffect(() => {
    if (caseId) loadCaseIntelligence(caseId);
  }, [caseId, loadCaseIntelligence]);

  useEffect(() => {
    if (caseId) loadCaseGraph(caseId, realPersonIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId, loadCaseGraph, realPersonIds.join(',')]);

  useEffect(() => {
    function onFsChange() { setIsFullscreen(!!document.fullscreenElement); }
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const filteredEntities = useMemo(
    () => entities.filter((e) => filters.entityTypes.has(e.type) && !hiddenIds.has(e.id)),
    [entities, filters.entityTypes, hiddenIds],
  );
  const filteredIds = useMemo(() => new Set(filteredEntities.map((e) => e.id)), [filteredEntities]);
  const filteredRelationships = useMemo(
    () => relationships.filter(
      (r) => filters.relationshipTypes.has(r.type) && r.strength >= filters.minStrength && filteredIds.has(r.sourceId) && filteredIds.has(r.targetId),
    ),
    [relationships, filters.relationshipTypes, filters.minStrength, filteredIds],
  );

  const handleSelectNode = useCallback((id: string) => {
    setCenter(id);
    selectEntity(id);
  }, [setCenter, selectEntity]);

  const subjectGraph = useMemo(
    () => buildSubjectGraph({ centerId: centerEntityId, entities: filteredEntities, relationships: filteredRelationships, expandedGroups }),
    [centerEntityId, filteredEntities, filteredRelationships, expandedGroups],
  );

  // Force-directed view needs a flat node/edge list of the same bounded set.
  const forceEntities = useMemo(() => {
    if (!subjectGraph.center) return [];
    const ids = new Set([subjectGraph.center.id, ...subjectGraph.groups.flatMap((g) => g.visible.map((n) => n.entity.id))]);
    return filteredEntities.filter((e) => ids.has(e.id));
  }, [subjectGraph, filteredEntities]);
  const forceRelationships = useMemo(() => {
    if (!subjectGraph.center) return [];
    return subjectGraph.groups.flatMap((g) => g.visible.map((n) => n.relationship));
  }, [subjectGraph]);

  const panelEntityId = selectedEntityId ?? centerEntityId;
  // A selected/centered node might be a real Master Dataset person, which
  // won't be in the mock dataset getEntityById reads from — fall back to
  // whatever loadCaseGraph already fetched into the store for this case.
  const panelEntity = panelEntityId
    ? (getEntityById(panelEntityId) ?? entities.find((e) => e.id === panelEntityId))
    : undefined;
  const panelRelationship = selectedRelationshipId ? mockRelationships.find((r) => r.id === selectedRelationshipId) : undefined;

  function toggleFullscreen() {
    if (!canvasRef.current) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else canvasRef.current.requestFullscreen();
  }

  return (
    <div className="stack" style={{ height: '100%' }}>
      <GraphToolbar
        filtersOpen={filtersOpen}
        onToggleFilters={() => setFiltersOpen((v) => !v)}
        legendOpen={legendOpen}
        onToggleLegend={() => setLegendOpen((v) => !v)}
        onZoomIn={() => setZoom((z) => Math.min(z + 0.15, 2))}
        onZoomOut={() => setZoom((z) => Math.max(z - 0.15, 0.5))}
        onResetZoom={() => setZoom(1)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onRecenter={() => {
          if (primarySubjectId) handleSelectNode(primarySubjectId);
        }}
        canRecenter={!!primarySubjectId}
      />
      <div className="row" style={{ flex: 1, minHeight: 0, alignItems: 'stretch' }}>
        <div ref={canvasRef} style={{ flex: 1, position: 'relative', minWidth: 0, background: 'var(--bg-1)' }}>
          {status === 'loading' && <LoadingState steps={DEFAULT_ANALYSIS_STEPS.map((s) => s.label)} />}
          {status === 'error' && <div style={{ padding: 20 }}><ErrorState title="NETWORK DATA UNAVAILABLE" sourceRef={error ?? undefined} /></div>}
          {(status === 'ready' || status === 'partial') && entities.length === 0 && (
            <EmptyState title="NO RELATIONSHIPS FOUND" hint="No connections match the current filters." />
          )}
          {(status === 'ready' || status === 'partial') && entities.length > 0 && (
            <>
              {/*
                All three views stay mounted and are toggled with
                visibility/pointer-events rather than a conditional
                mount/unmount or `display: none`. Two reasons: (1) Cytoscape
                (NetworkGraph, the Force layout) runs its own rAF-driven
                animation loop independent of React, and destroying/
                recreating its core on every layout switch let a stray
                in-flight animation frame fire against an already-torn-down
                instance and crash the page; (2) Cytoscape initialized
                inside a `display:none` (zero-size) container never builds
                a working renderer at all, which crashes the same way the
                first time its layout finishes. `visibility:hidden` keeps
                real layout dimensions the whole time, so neither happens.
              */}
              <div style={{ position: 'absolute', inset: 0, visibility: viewMode === 'table' ? 'visible' : 'hidden', pointerEvents: viewMode === 'table' ? 'auto' : 'none' }}>
                <NetworkTable
                  entities={filteredEntities}
                  relationships={filteredRelationships}
                  searchQuery={searchQuery}
                  onSelectEntity={handleSelectNode}
                />
              </div>
              <div style={{ position: 'absolute', inset: 0, visibility: viewMode === 'graph' && layout === 'force-directed' ? 'visible' : 'hidden', pointerEvents: viewMode === 'graph' && layout === 'force-directed' ? 'auto' : 'none' }}>
                <NetworkGraph entities={forceEntities} relationships={forceRelationships} onSelectNode={handleSelectNode} />
              </div>
              <div style={{ position: 'absolute', inset: 0, visibility: viewMode === 'graph' && layout !== 'force-directed' ? 'visible' : 'hidden', pointerEvents: viewMode === 'graph' && layout !== 'force-directed' ? 'auto' : 'none' }}>
                <RadialNetworkGraph
                  mode={layout === 'hierarchical' ? 'hierarchical' : 'radial'}
                  centerId={centerEntityId}
                  entities={filteredEntities}
                  relationships={filteredRelationships}
                  expandedGroups={expandedGroups}
                  selectedEntityId={panelEntityId}
                  zoom={zoom}
                  onSelectNode={handleSelectNode}
                  onExpandGroup={expandGroup}
                />
              </div>
              {viewMode === 'graph' && legendOpen && <GraphLegend onClose={() => setLegendOpen(false)} />}
              {viewMode === 'graph' && filtersOpen && <GraphFilters />}
            </>
          )}
        </div>

        <div className="scroll-region" style={{ width: 300, flexShrink: 0, borderLeft: '1px solid var(--border)', padding: 14, background: 'var(--bg-2)' }}>
          {!panelEntity && !panelRelationship && (
            <span className="text-muted" style={{ fontSize: 12 }}>Select an entity to inspect its profile, connections, and evidence.</span>
          )}
          {panelRelationship && <RelationshipDetails relationship={panelRelationship} />}
          {!panelRelationship && panelEntity && (
            <EntityDetails entity={panelEntity} onSelectEntity={(id) => { handleSelectNode(id); selectRelationship(null); }} />
          )}
        </div>
      </div>
    </div>
  );
}
