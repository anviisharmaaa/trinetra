import type { ElementDefinition, LayoutOptions, StylesheetStyle } from 'cytoscape';
import type { Entity, Relationship } from '../../types';
import { ENTITY_COLORS, RISK_COLORS } from '../../utils/entityMeta';
import type { GraphLayout } from '../../store/graphStore';

/**
 * The UI never touches Cytoscape's internal structures directly outside
 * this adapter — investigation state (entities/relationships) goes in,
 * Cytoscape element definitions come out. Swapping the graph library
 * later only means rewriting this file.
 */
export function toElements(entities: Entity[], relationships: Relationship[]): ElementDefinition[] {
  const entityIds = new Set(entities.map((e) => e.id));
  const nodes: ElementDefinition[] = entities.map((e) => ({
    data: {
      id: e.id,
      label: e.name,
      type: e.type,
      risk: (e as { riskLevel?: string }).riskLevel ?? 'unknown',
      color: ENTITY_COLORS[e.type],
      riskColor: RISK_COLORS[(e as { riskLevel?: string }).riskLevel ?? 'unknown'],
    },
  }));
  const edges: ElementDefinition[] = relationships
    .filter((r) => entityIds.has(r.sourceId) && entityIds.has(r.targetId))
    .map((r) => ({
      data: {
        id: r.id,
        source: r.sourceId,
        target: r.targetId,
        label: r.label,
        type: r.type,
        strength: r.strength,
      },
    }));
  return [...nodes, ...edges];
}

export function graphStylesheet(): StylesheetStyle[] {
  return [
    {
      selector: 'node',
      style: {
        'background-color': 'data(color)',
        'label': 'data(label)',
        'color': '#8298a3',
        'font-size': 9,
        'text-valign': 'bottom',
        'text-margin-y': 6,
        'width': 26,
        'height': 26,
        'border-width': 2,
        'border-color': 'data(riskColor)',
        'text-outline-width': 0,
      },
    },
    {
      selector: 'node[type = "person"]',
      style: { shape: 'ellipse' },
    },
    {
      selector: 'node[type = "location"]',
      style: { shape: 'diamond' },
    },
    {
      selector: 'node[type = "organization"]',
      style: { shape: 'round-rectangle' },
    },
    {
      selector: 'node[type = "vehicle"]',
      style: { shape: 'hexagon' },
    },
    {
      selector: 'node[type = "phone"], node[type = "device"]',
      style: { shape: 'round-triangle' },
    },
    {
      selector: 'node[type = "account"], node[type = "document"]',
      style: { shape: 'round-rectangle' },
    },
    {
      selector: 'edge',
      style: {
        'width': 'mapData(strength, 0, 1, 0.6, 3.2)',
        'line-color': '#315363',
        'target-arrow-color': '#315363',
        'target-arrow-shape': 'triangle',
        'arrow-scale': 0.7,
        'curve-style': 'bezier',
        'label': 'data(label)',
        'font-size': 7.5,
        'color': '#50616a',
        'text-rotation': 'autorotate',
        'text-background-color': '#081018',
        'text-background-opacity': 0.85,
        'text-background-padding': '1px',
      },
    },
    {
      selector: 'node:selected',
      style: {
        'border-color': '#48d8ff',
        'border-width': 3,
        'background-color': '#48d8ff',
      },
    },
    {
      selector: 'edge:selected',
      style: { 'line-color': '#48d8ff', 'target-arrow-color': '#48d8ff', width: 3 },
    },
    {
      selector: '.faded',
      style: { opacity: 0.12 },
    },
    {
      selector: '.highlighted',
      style: { 'z-index': 999 },
    },
  ];
}

export function layoutOptionsFor(layout: GraphLayout): LayoutOptions {
  switch (layout) {
    case 'force-directed':
    default:
      // Used only for the bounded subject-graph (center + direct
      // connections), never the whole case — avoidOverlap plus generous
      // spacing keeps it legible instead of a dense cloud.
      return {
        name: 'cose',
        animate: true,
        nodeRepulsion: () => 12000,
        idealEdgeLength: () => 140,
        avoidOverlap: true,
        nodeOverlap: 24,
        padding: 40,
      } as LayoutOptions;
  }
}
