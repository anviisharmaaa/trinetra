import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockCalls } from '../data';
import { getEntityById } from '../data';
import { Panel } from '../components/ui/Panel';
import { SearchInput } from '../components/ui/SearchInput';
import { EmptyState } from '../components/ui/EmptyState';
import type { CallRecord } from '../types';
import { formatDateTime, formatDuration } from '../utils/formatters';

export function CallRecordsPage() {
  const { caseId } = useParams();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<CallRecord | null>(null);

  const calls = useMemo(() => mockCalls.filter((c) => c.caseId === caseId), [caseId]);

  useEffect(() => { setSelected(calls[0] ?? null); }, [calls]);

  const phoneName = (id: string) => {
    const phone = getEntityById(id);
    const owner = phone && (phone.metadata as { ownerId?: string }).ownerId;
    const ownerEntity = owner ? getEntityById(owner) : undefined;
    return ownerEntity ? `${ownerEntity.name} (${phone?.name})` : phone?.name ?? id;
  };

  const filtered = calls.filter((c) => !query || phoneName(c.fromPhoneId).toLowerCase().includes(query.toLowerCase()) || phoneName(c.toPhoneId).toLowerCase().includes(query.toLowerCase()));

  const pairs = useMemo(() => {
    const map = new Map<string, { from: string; to: string; count: number }>();
    for (const c of calls) {
      const key = [c.fromPhoneId, c.toPhoneId].sort().join('--');
      const entry = map.get(key) ?? { from: c.fromPhoneId, to: c.toPhoneId, count: 0 };
      entry.count += 1;
      map.set(key, entry);
    }
    return [...map.values()];
  }, [calls]);

  if (calls.length === 0) return <EmptyState title="NO CALL RECORDS FOUND" hint="No call data source is linked to this case." />;

  return (
    <div className="split-3">
      <div className="stack" style={{ padding: 10 }}>
        <SearchInput value={query} onChange={setQuery} placeholder="Search by name or number…" />
        <div className="system-label" style={{ margin: '10px 0 6px' }}>CALL FREQUENCY</div>
        <div className="stack gap-1">
          {pairs.map((p) => (
            <div key={p.from + p.to} className="row" style={{ justifyContent: 'space-between', fontSize: 11.5, padding: '4px 0' }}>
              <span className="text-secondary" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>{phoneName(p.from).split(' ')[0]} ↔ {phoneName(p.to).split(' ')[0]}</span>
              <span className="text-cyan mono">{p.count}×</span>
            </div>
          ))}
        </div>
      </div>

      <div className="scroll-region" style={{ padding: 12 }}>
        <Panel title="CALL RECORDS — CHRONOLOGICAL" noPadding>
          <table className="data-table">
            <thead><tr><th>Timestamp</th><th>From</th><th>To</th><th>Duration</th><th>Type</th></tr></thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className={selected?.id === c.id ? 'selected' : ''} onClick={() => setSelected(c)}>
                  <td className="mono">{formatDateTime(c.timestamp)}</td>
                  <td>{phoneName(c.fromPhoneId)}</td>
                  <td>{phoneName(c.toPhoneId)}</td>
                  <td className="mono">{formatDuration(c.durationSeconds)}</td>
                  <td><span className="badge badge-neutral">{c.type}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>

      <div className="stack" style={{ padding: 12 }}>
        <div className="system-label" style={{ marginBottom: 8 }}>CALL DETAILS</div>
        {!selected ? <span className="text-muted" style={{ fontSize: 12 }}>Select a call record.</span> : (
          <div className="stack gap-2">
            <Detail label="FROM" value={phoneName(selected.fromPhoneId)} />
            <Detail label="TO" value={phoneName(selected.toPhoneId)} />
            <Detail label="DATE" value={formatDateTime(selected.timestamp)} />
            <Detail label="DURATION" value={formatDuration(selected.durationSeconds)} />
            <Detail label="FREQUENCY" value={selected.frequencyBand?.toUpperCase() ?? 'N/A'} />
            <Detail label="RELATED LOCATION" value={selected.towerLocationId ? getEntityById(selected.towerLocationId)?.name ?? '—' : '—'} />
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="stack" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6 }}>
      <span className="system-label">{label}</span>
      <span style={{ fontSize: 13 }}>{value}</span>
    </div>
  );
}
