import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { financialService } from '../services/financialService';
import { getEntityById } from '../data';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Panel } from '../components/ui/Panel';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import type { CriminalRecord } from '../types';
import { formatDate, titleCase } from '../utils/formatters';
import { PersonAvatar } from '../components/ui/EntityImage';
import { personImage } from '../config/imageAssets';

function statusTone(status: CriminalRecord['status']): 'critical' | 'high' | 'medium' | 'low' | 'neutral' {
  switch (status) {
    case 'convicted': return 'high';
    case 'charge_sheeted': return 'medium';
    case 'under_investigation': return 'medium';
    case 'acquitted': return 'low';
    default: return 'neutral';
  }
}

export function CriminalRecordsPage() {
  const { caseId } = useParams();
  const [records, setRecords] = useState<CriminalRecord[] | null>(null);
  const [selected, setSelected] = useState<CriminalRecord | null>(null);

  useEffect(() => {
    if (!caseId) return;
    financialService.listCriminalRecords(undefined, caseId).then((r) => {
      setRecords(r);
      setSelected(r[0] ?? null);
    });
  }, [caseId]);

  // Column priorities: FIR NUMBER/STATUS/FILED are compact and stable (an
  // id, a badge, a date never need to grow with viewport width); SUBJECT
  // and CHARGE are the flexible, information-carrying columns and get the
  // largest share of any extra room. Every `minWidth` below is the measured
  // pixel width (at the table's real font/padding) of the single longest
  // word that can actually appear in this column across all 5 cases' data
  // (hand-authored OP-001 + the OP-002..005 generator pools in seed.ts /
  // caseBundles.ts), plus cell padding and a small rendering-variance
  // buffer — e.g. CHARGE's floor covers "Impersonation" (its longest single
  // token), SUBJECT's covers "Chowdhury" (the longest surname). That
  // guarantees a word can never be forced to break mid-character, while
  // keeping every floor as tight as that guarantee allows. If the panel is
  // ever narrower than the sum of those floors, the table scrolls
  // horizontally within its own container instead (see .gtable-container).
  const columns: Column<CriminalRecord>[] = [
    {
      key: 'firNumber', header: 'FIR NUMBER', minWidth: 76, flex: 0.6, truncate: true, cellClassName: 'mono',
      render: (r) => r.firNumber,
    },
    {
      key: 'entity', header: 'SUBJECT', minWidth: 124, flex: 1.7,
      render: (r) => {
        const subject = getEntityById(r.entityId);
        return (
          <div className="row gap-2" style={{ alignItems: 'center', minWidth: 0 }}>
            {subject && <PersonAvatar personId={subject.id} name={subject.name} src={personImage(subject.id, subject.name)} size={22} />}
            <span style={{ minWidth: 0, overflowWrap: 'break-word' }}>{subject?.name ?? r.entityId}</span>
          </div>
        );
      },
      sortValue: (r) => getEntityById(r.entityId)?.name ?? r.entityId,
    },
    { key: 'charge', header: 'CHARGE', minWidth: 112, flex: 2.0, render: (r) => r.charge },
    { key: 'section', header: 'SECTION', minWidth: 80, flex: 0.9, render: (r) => r.section },
    {
      key: 'status', header: 'STATUS', minWidth: 132, flex: 0.9,
      // Deliberately NOT `whiteSpace: nowrap` — "Under Investigation" is the
      // longest status value (measured ~132px incl. padding as a single
      // line), which would force this column wider than its fair share.
      // Allowing the badge to wrap to two lines ("UNDER" / "INVESTIGATION")
      // keeps the column compact while never truncating or shrinking the
      // status text.
      render: (r) => <span className={`badge badge-${statusTone(r.status)}`}>{titleCase(r.status)}</span>,
      sortValue: (r) => r.status,
    },
    {
      key: 'filedAt', header: 'FILED', minWidth: 64, flex: 0.5, truncate: true, cellClassName: 'mono',
      render: (r) => formatDate(r.filedAt), sortValue: (r) => r.filedAt,
    },
  ];

  if (records === null) return <LoadingState label="LOADING CRIMINAL RECORDS" />;

  return (
    <div className="split-2">
      <div className="scroll-region" style={{ padding: 12 }}>
        <Panel title="CRIMINAL RECORDS" noPadding>
          <DataTable columns={columns} rows={records} selectedId={selected?.id} onRowClick={setSelected} emptyHint="No criminal history linked to entities in this case." />
        </Panel>
      </div>
      <div className="scroll-region" style={{ padding: 16 }}>
        <div className="system-label" style={{ marginBottom: 8 }}>RECORD DETAILS</div>
        {!selected ? (
          <EmptyState title="SELECT A CRIMINAL RECORD" hint="Choose a record from the list to view its FIR number, charge, section, status and filing details." />
        ) : (
          <div className="stack gap-2" style={{ maxWidth: 640 }}>
            {(() => {
              const subject = getEntityById(selected.entityId);
              return subject ? (
                <div className="row gap-2" style={{ alignItems: 'center', marginBottom: 4, minWidth: 0 }}>
                  <PersonAvatar personId={subject.id} name={subject.name} src={personImage(subject.id, subject.name)} size={40} />
                  <span style={{ fontSize: 14, fontWeight: 600, overflowWrap: 'break-word', minWidth: 0 }}>{subject.name}</span>
                </div>
              ) : null;
            })()}
            <Detail label="FIR NUMBER" value={selected.firNumber} mono />
            <Detail label="SUBJECT" value={getEntityById(selected.entityId)?.name ?? selected.entityId} />
            <Detail label="SECTION" value={selected.section} />
            <Detail label="CHARGE" value={selected.charge} />
            <Detail label="STATUS" value={titleCase(selected.status)} />
            <Detail label="STATION" value={selected.station} />
            <Detail label="FILED" value={formatDate(selected.filedAt)} mono />
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="stack" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6 }}>
      <span className="system-label">{label}</span>
      <span className={mono ? 'mono' : undefined} style={{ fontSize: 13, overflowWrap: 'break-word' }}>{value}</span>
    </div>
  );
}
