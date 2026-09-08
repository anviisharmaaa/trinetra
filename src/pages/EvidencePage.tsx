import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ShieldCheck, Video } from 'lucide-react';
import { useEvidenceStore } from '../store/evidenceStore';
import { useInvestigationStore } from '../store/investigationStore';
import { DataTable } from '../components/ui/DataTable';
import type { Column } from '../components/ui/DataTable';
import { Panel } from '../components/ui/Panel';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { Tabs } from '../components/ui/Tabs';
import { EmptyState } from '../components/ui/EmptyState';
import { getEntityById } from '../data';
import type { Evidence, EvidenceType } from '../types';
import { formatDateTime } from '../utils/formatters';
import { EvidenceThumb } from '../components/ui/EntityImage';
import { evidenceImage } from '../config/imageAssets';
import { parseCctvSourceRef } from '../utils/crossModuleLinks';

const TYPE_TABS: { key: EvidenceType | 'all'; label: string }[] = [
  { key: 'all', label: 'ALL' },
  { key: 'cctv', label: 'CCTV' },
  { key: 'face', label: 'FACE' },
  { key: 'financial', label: 'FINANCIAL' },
  { key: 'document', label: 'DOCUMENT' },
  { key: 'call', label: 'CALL' },
  { key: 'forensic', label: 'FORENSIC' },
  { key: 'social', label: 'SOCIAL' },
];

export function EvidencePage() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { status, evidence, loadCase } = useEvidenceStore();
  const selectEntity = useInvestigationStore((s) => s.selectEntity);
  const [typeFilter, setTypeFilter] = useState<EvidenceType | 'all'>('all');
  const [selected, setSelected] = useState<Evidence | null>(null);

  useEffect(() => { if (caseId) loadCase(caseId); }, [caseId, loadCase]);

  // Deep-link support for "View in Evidence" coming from CCTV: `?item=EV-XXX`
  // selects that record the moment its case's evidence has loaded.
  const itemParam = searchParams.get('item');
  useEffect(() => {
    if (!itemParam || status !== 'ready') return;
    const match = evidence.find((e) => e.id === itemParam);
    if (match) setSelected(match);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemParam, status, evidence]);

  if (status === 'loading' || status === 'idle') return <LoadingState label="COMPILING EVIDENCE INDEX" />;
  if (status === 'error') return <ErrorState title="EVIDENCE INDEX UNAVAILABLE" message="Unable to compile evidence records for this case." onRetry={() => caseId && loadCase(caseId)} />;

  const filtered = typeFilter === 'all' ? evidence : evidence.filter((e) => e.type === typeFilter);
  const cctvRef = selected && (selected.type === 'cctv' || selected.type === 'face') ? parseCctvSourceRef(selected.sourceRef) : null;

  // TITLE is the largest flexible column (evidence titles run long — "Facial
  // match — Arjun Malhotra at Sea Breeze Apartments"); TYPE/COLLECTED/CONF.
  // stay compact since their content is always short; COLLECTED BY is
  // moderate but flexible since some sources are long ("System — Face
  // Recognition Module"). Every `minWidth` below is the measured pixel
  // width of the single longest word/token that can actually appear in that
  // column across all 5 cases' generated evidence (e.g. TITLE's floor
  // covers "MH-02-CQ-4521", an ANPR plate token; TYPE's covers the
  // "DOCUMENT" badge, its widest type label) plus cell padding and a small
  // buffer — tight enough to avoid unnecessary local scrolling, never tight
  // enough to force a word to break mid-character.
  const columns: Column<Evidence>[] = [
    {
      // 60px, not 52px: the 36px thumbnail plus the cell's 20px of
      // horizontal padding needs 56px — 52px was clipping/overflowing the
      // image by 4px on every row (found via automated overflow measurement).
      key: 'thumb', header: '', width: '60px',
      render: (e) => <EvidenceThumb evidenceId={e.id} evidenceType={e.type} src={evidenceImage(e.id)} size={36} />,
    },
    { key: 'title', header: 'TITLE', minWidth: 136, flex: 3, render: (e) => e.title, sortValue: (e) => e.title },
    {
      key: 'type', header: 'TYPE', minWidth: 108, flex: 0.5,
      render: (e) => <span className="badge badge-neutral" style={{ whiteSpace: 'nowrap' }}>{e.type.toUpperCase()}</span>,
      sortValue: (e) => e.type,
    },
    {
      key: 'collectedAt', header: 'COLLECTED', minWidth: 84, flex: 0.7, truncate: true, cellClassName: 'mono',
      render: (e) => formatDateTime(e.collectedAt), sortValue: (e) => e.collectedAt,
    },
    { key: 'collectedBy', header: 'COLLECTED BY', minWidth: 98, flex: 1.3, render: (e) => e.collectedBy },
    {
      key: 'confidence', header: 'CONF.', minWidth: 52, flex: 0.4, align: 'right',
      render: (e) => (e.confidence !== undefined ? `${Math.round(e.confidence * 100)}%` : '—'), sortValue: (e) => e.confidence ?? 0,
    },
  ];

  return (
    <div className="split-2">
      <div className="scroll-region stack" style={{ padding: 12, minWidth: 0 }}>
        <Tabs items={TYPE_TABS.map((t) => ({ key: t.key, label: t.label, count: t.key === 'all' ? evidence.length : evidence.filter((e) => e.type === t.key).length }))} active={typeFilter} onChange={(k) => setTypeFilter(k as EvidenceType | 'all')} />
        <div style={{ marginTop: 10, minWidth: 0 }}>
          <DataTable columns={columns} rows={filtered} selectedId={selected?.id} onRowClick={setSelected} emptyLabel="NO EVIDENCE OF THIS TYPE" />
        </div>
      </div>

      <div className="scroll-region" style={{ padding: 12 }}>
        {!selected ? (
          <EmptyState
            title="SELECT AN EVIDENCE RECORD"
            hint="Choose an evidence item to inspect its source, chain of custody, linked entities, confidence, and related timeline events."
          />
        ) : (
          <div className="stack gap-3">
            <div className="row gap-3" style={{ alignItems: 'flex-start' }}>
              <EvidenceThumb evidenceId={selected.id} evidenceType={selected.type} src={evidenceImage(selected.id)} size={64} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="row gap-2" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="section-title" style={{ flex: 1, minWidth: 0, overflowWrap: 'break-word' }}>{selected.title}</span>
                  <span className="badge badge-neutral" style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>{selected.type.toUpperCase()}</span>
                </div>
                <div className="text-secondary" style={{ fontSize: 12.5, marginTop: 6, overflowWrap: 'break-word' }}>{selected.description}</div>
              </div>
            </div>

            <Panel title="LINKED ENTITIES">
              <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
                {selected.entityIds.map((id) => {
                  const ent = getEntityById(id);
                  return (
                    <button key={id} type="button" className="badge badge-info" style={{ cursor: 'pointer', border: 'none' }} onClick={() => selectEntity(id)}>
                      {ent?.name ?? id}
                    </button>
                  );
                })}
              </div>
            </Panel>

            <Panel title="CHAIN OF CUSTODY" actions={<ShieldCheck size={14} color="var(--success)" />}>
              <div className="stack gap-2">
                {selected.chainOfCustody.map((c, i) => (
                  <div key={i} className="stack" style={{ borderLeft: '2px solid var(--border-active)', paddingLeft: 10 }}>
                    <span style={{ fontSize: 12.5 }}>{c.action}</span>
                    <span className="text-muted mono" style={{ fontSize: 10.5 }}>{c.actor} · {formatDateTime(c.timestamp)}</span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="SOURCE / TAGS">
              <div className="stack gap-2">
                <div className="mono" style={{ fontSize: 12 }}>{selected.sourceRef}</div>
                <div className="row gap-1" style={{ flexWrap: 'wrap' }}>
                  {selected.tags.map((t) => <span key={t} className="badge badge-neutral">{t}</span>)}
                </div>
                {cctvRef && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ alignSelf: 'flex-start' }}
                    onClick={() => navigate(
                      cctvRef.refId.startsWith('CE-')
                        ? `/cases/${caseId}/cctv?camera=${cctvRef.cameraId}&event=${cctvRef.refId}`
                        : `/cases/${caseId}/cctv?camera=${cctvRef.cameraId}`,
                    )}
                  >
                    <Video size={12} /> VIEW IN CCTV
                  </button>
                )}
              </div>
            </Panel>
          </div>
        )}
      </div>
    </div>
  );
}
