import { useMemo } from 'react';
import type { Entity, Relationship } from '../../types';
import { DataTable } from '../ui/DataTable';
import type { Column } from '../ui/DataTable';
import { ENTITY_LABELS } from '../../utils/entityMeta';
import { titleCase, formatDate } from '../../utils/formatters';

/**
 * The escape hatch for dense cases: every relationship as a flat, sortable
 * list rather than a picture. No layout, no spacing problem, no overlap —
 * just data, for the moments an analyst wants to scan or export rather
 * than visually explore.
 */
export function NetworkTable({
  entities, relationships, searchQuery, onSelectEntity,
}: {
  entities: Entity[];
  relationships: Relationship[];
  searchQuery: string;
  onSelectEntity: (id: string) => void;
}) {
  const entityById = useMemo(() => new Map(entities.map((e) => [e.id, e])), [entities]);

  const rows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return relationships.filter((r) => {
      if (!q) return true;
      const source = entityById.get(r.sourceId)?.name.toLowerCase() ?? '';
      const target = entityById.get(r.targetId)?.name.toLowerCase() ?? '';
      return source.includes(q) || target.includes(q) || r.label.toLowerCase().includes(q);
    });
  }, [relationships, searchQuery, entityById]);

  const columns: Column<Relationship>[] = [
    {
      key: 'source', header: 'ENTITY', width: '24%',
      render: (r) => <EntityCell entity={entityById.get(r.sourceId)} onClick={onSelectEntity} />,
      sortValue: (r) => entityById.get(r.sourceId)?.name ?? r.sourceId,
    },
    {
      key: 'label', header: 'RELATIONSHIP', width: '18%',
      render: (r) => <span className="badge badge-info">{r.label}</span>,
      sortValue: (r) => r.label,
    },
    {
      key: 'target', header: 'ENTITY', width: '24%',
      render: (r) => <EntityCell entity={entityById.get(r.targetId)} onClick={onSelectEntity} />,
      sortValue: (r) => entityById.get(r.targetId)?.name ?? r.targetId,
    },
    {
      key: 'strength', header: 'STRENGTH', width: '12%',
      render: (r) => (
        <div className="row gap-2" style={{ alignItems: 'center' }}>
          <div style={{ width: 44, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${Math.round(r.strength * 100)}%`, height: '100%', background: 'var(--cyan)' }} />
          </div>
          <span className="mono text-muted" style={{ fontSize: 10.5 }}>{Math.round(r.strength * 100)}%</span>
        </div>
      ),
      sortValue: (r) => r.strength,
    },
    {
      key: 'type', header: 'TYPE', width: '12%',
      render: (r) => <span className="text-muted" style={{ fontSize: 11.5 }}>{titleCase(r.type)}</span>,
      sortValue: (r) => r.type,
    },
    {
      key: 'createdAt', header: 'ESTABLISHED', width: '10%',
      render: (r) => <span className="mono text-muted" style={{ fontSize: 10.5 }}>{formatDate(r.createdAt)}</span>,
      sortValue: (r) => r.createdAt,
    },
  ];

  return (
    <div className="scroll-region" style={{ padding: 12, height: '100%' }}>
      <DataTable columns={columns} rows={rows.map((r) => ({ ...r }))} emptyLabel="NO RELATIONSHIPS FOUND" emptyHint="Adjust your search to see more results." />
    </div>
  );
}

function EntityCell({ entity, onClick }: { entity?: Entity; onClick: (id: string) => void }) {
  if (!entity) return <span className="text-muted">—</span>;
  return (
    <button
      type="button"
      className="row gap-2"
      style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, textAlign: 'left' }}
      onClick={() => onClick(entity.id)}
    >
      <span>{entity.name}</span>
      <span className="text-muted" style={{ fontSize: 10 }}>{ENTITY_LABELS[entity.type]}</span>
    </button>
  );
}
