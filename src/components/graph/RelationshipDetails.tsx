import type { Relationship } from '../../types';
import { getEntityById } from '../../data';
import { useInvestigationStore } from '../../store/investigationStore';
import { titleCase, formatDate } from '../../utils/formatters';

export function RelationshipDetails({ relationship }: { relationship: Relationship }) {
  const selectEntity = useInvestigationStore((s) => s.selectEntity);
  const source = getEntityById(relationship.sourceId);
  const target = getEntityById(relationship.targetId);

  return (
    <div className="stack gap-3">
      <div className="system-label">RELATIONSHIP</div>
      <div className="stack gap-2">
        <button type="button" className="row gap-2" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 4, padding: 8, cursor: 'pointer', color: 'inherit' }} onClick={() => source && selectEntity(source.id)}>
          <span style={{ flex: 1, fontSize: 13 }}>{source?.name ?? relationship.sourceId}</span>
        </button>
        <div className="row" style={{ justifyContent: 'center' }}>
          <span className="badge badge-info">{relationship.label}</span>
        </div>
        <button type="button" className="row gap-2" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 4, padding: 8, cursor: 'pointer', color: 'inherit' }} onClick={() => target && selectEntity(target.id)}>
          <span style={{ flex: 1, fontSize: 13 }}>{target?.name ?? relationship.targetId}</span>
        </button>
      </div>

      <div className="stack gap-1">
        <Row label="TYPE" value={titleCase(relationship.type)} />
        <Row label="DIRECTION" value={relationship.direction ?? 'undirected'} />
        <Row label="STRENGTH" value={`${Math.round(relationship.strength * 100)}%`} />
        {relationship.confidence !== undefined && <Row label="CONFIDENCE" value={`${Math.round(relationship.confidence * 100)}%`} />}
        <Row label="ESTABLISHED" value={formatDate(relationship.createdAt)} />
        <Row label="SOURCES" value={relationship.sourceIds.join(', ')} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="row" style={{ justifyContent: 'space-between', fontSize: 12, borderBottom: '1px solid var(--border-subtle)', padding: '5px 0' }}>
      <span className="text-muted">{label}</span>
      <span>{value}</span>
    </div>
  );
}
