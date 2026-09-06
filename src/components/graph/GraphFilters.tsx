import { useGraphStore, ALL_ENTITY_TYPES, ALL_REL_TYPES } from '../../store/graphStore';
import { ENTITY_LABELS } from '../../utils/entityMeta';
import { titleCase } from '../../utils/formatters';

export function GraphFilters() {
  const filters = useGraphStore((s) => s.filters);
  const toggleEntityTypeFilter = useGraphStore((s) => s.toggleEntityTypeFilter);
  const toggleRelationshipTypeFilter = useGraphStore((s) => s.toggleRelationshipTypeFilter);
  const setMinStrength = useGraphStore((s) => s.setMinStrength);

  return (
    <div className="stack gap-3 panel fade-in" style={{ position: 'absolute', top: 8, right: 8, padding: 14, width: 240, maxHeight: 'calc(100% - 16px)', overflowY: 'auto', zIndex: 6 }}>
      <div>
        <div className="system-label" style={{ marginBottom: 6 }}>ENTITY TYPES</div>
        <div className="stack gap-1">
          {ALL_ENTITY_TYPES.map((t) => (
            <label key={t} className="row gap-2" style={{ fontSize: 12, cursor: 'pointer' }}>
              <input type="checkbox" checked={filters.entityTypes.has(t)} onChange={() => toggleEntityTypeFilter(t)} />
              {ENTITY_LABELS[t]}
            </label>
          ))}
        </div>
      </div>
      <div>
        <div className="system-label" style={{ marginBottom: 6 }}>RELATIONSHIPS</div>
        <div className="stack gap-1">
          {ALL_REL_TYPES.map((t) => (
            <label key={t} className="row gap-2" style={{ fontSize: 12, cursor: 'pointer' }}>
              <input type="checkbox" checked={filters.relationshipTypes.has(t)} onChange={() => toggleRelationshipTypeFilter(t)} />
              {titleCase(t)}
            </label>
          ))}
        </div>
      </div>
      <div>
        <div className="system-label" style={{ marginBottom: 6 }}>RELATIONSHIP STRENGTH</div>
        <div className="row gap-2">
          <span className="text-muted" style={{ fontSize: 10 }}>WEAK</span>
          <input
            type="range" min={0} max={1} step={0.05} value={filters.minStrength}
            onChange={(e) => setMinStrength(Number(e.target.value))}
            style={{ flex: 1 }}
          />
          <span className="text-muted" style={{ fontSize: 10 }}>STRONG</span>
        </div>
      </div>
    </div>
  );
}
