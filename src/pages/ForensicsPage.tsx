import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HardDrive, ShieldCheck, FileSearch } from 'lucide-react';
import { evidenceService } from '../services/evidenceService';
import { getEntityById } from '../data';
import { Panel } from '../components/ui/Panel';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import type { Evidence } from '../types';
import { formatDateTime } from '../utils/formatters';
import { useInvestigationStore } from '../store/investigationStore';

export function ForensicsPage() {
  const { caseId } = useParams();
  const { selectedEntityId, selectEntity } = useInvestigationStore();
  const [records, setRecords] = useState<Evidence[] | null>(null);
  const [active, setActive] = useState<Evidence | null>(null);

  useEffect(() => {
    if (!caseId) return;
    evidenceService.listByCase(caseId).then((all) => {
      const forensic = all.filter((e) => e.type === 'forensic');
      setRecords(forensic);
      setActive(forensic[0] ?? null);
    });
  }, [caseId]);

  if (records === null) return <LoadingState label="RUNNING FORENSIC ANALYSIS" />;

  return (
    <div className="split-2">
      <div className="scroll-region stack gap-2" style={{ padding: 12 }}>
        <div className="system-label" style={{ marginBottom: 4 }}>FORENSIC EXAMINATIONS</div>
        {records.length === 0 && <EmptyState title="No forensic records" hint="No digital or document forensics have been logged for this case." />}
        {records.map((r) => (
          <button
            key={r.id}
            type="button"
            className="panel"
            style={{ textAlign: 'left', cursor: 'pointer', border: '1px solid ' + (active?.id === r.id ? 'var(--cyan-dim)' : 'var(--border)'), padding: 12 }}
            onClick={() => setActive(r)}
          >
            <div className="row gap-2" style={{ marginBottom: 6 }}>
              {r.tags.includes('device-extraction') ? <HardDrive size={14} color="var(--cyan)" /> : <FileSearch size={14} color="var(--cyan)" />}
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>{r.title}</span>
            </div>
            <div className="text-secondary" style={{ fontSize: 12, marginBottom: 6 }}>{r.description}</div>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="text-muted mono" style={{ fontSize: 10.5 }}>{formatDateTime(r.collectedAt)} · {r.collectedBy}</span>
              {r.confidence !== undefined && <span className="badge badge-info">{Math.round(r.confidence * 100)}% CONF.</span>}
            </div>
          </button>
        ))}
      </div>

      <div className="scroll-region" style={{ padding: 12 }}>
        {!active ? (
          <span className="text-muted" style={{ fontSize: 12 }}>Select a forensic examination record.</span>
        ) : (
          <div className="stack gap-3">
            <Panel title="EXAMINATION SUMMARY">
              <div className="stack gap-2">
                <Row label="SOURCE REFERENCE" value={active.sourceRef} />
                <Row label="COLLECTED BY" value={active.collectedBy} />
                <Row label="COLLECTED AT" value={formatDateTime(active.collectedAt)} />
                {active.confidence !== undefined && <Row label="CONFIDENCE" value={`${Math.round(active.confidence * 100)}%`} />}
              </div>
            </Panel>

            <Panel title="LINKED ENTITIES">
              <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
                {active.entityIds.map((id) => {
                  const ent = getEntityById(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      className={`badge ${selectedEntityId === id ? 'badge-info' : 'badge-neutral'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                      onClick={() => selectEntity(id)}
                    >
                      {ent?.name ?? id}
                    </button>
                  );
                })}
              </div>
            </Panel>

            <Panel title="CHAIN OF CUSTODY" actions={<ShieldCheck size={14} color="var(--success)" />}>
              <div className="stack gap-2">
                {active.chainOfCustody.map((c, i) => (
                  <div key={i} className="stack" style={{ borderLeft: '2px solid var(--border-active)', paddingLeft: 10 }}>
                    <span style={{ fontSize: 12.5 }}>{c.action}</span>
                    <span className="text-muted mono" style={{ fontSize: 10.5 }}>{c.actor} · {formatDateTime(c.timestamp)}</span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="TAGS">
              <div className="row gap-1" style={{ flexWrap: 'wrap' }}>
                {active.tags.map((t) => <span key={t} className="badge badge-neutral">{t}</span>)}
              </div>
            </Panel>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="row" style={{ justifyContent: 'space-between', fontSize: 12.5 }}>
      <span className="text-muted">{label}</span>
      <span className="mono">{value}</span>
    </div>
  );
}
