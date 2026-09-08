import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileBarChart, Printer, Loader2 } from 'lucide-react';
import { caseService } from '../services/caseService';
import { evidenceService } from '../services/evidenceService';
import { timelineService } from '../services/timelineService';
import { getEntitiesByCase } from '../data';
import { runStagedOperation } from '../utils/mockDelay';
import { Panel } from '../components/ui/Panel';
import { LoadingState } from '../components/ui/LoadingState';
import type { Case, Evidence, TimelineEvent, Entity } from '../types';
import { formatDate, formatDateTime } from '../utils/formatters';

type ReportType = 'summary' | 'entities' | 'evidence' | 'timeline';

const REPORT_TYPES: { key: ReportType; label: string; description: string }[] = [
  { key: 'summary', label: 'CASE SUMMARY', description: 'Overview, status, priority, key statistics and lead investigator.' },
  { key: 'entities', label: 'ENTITY REGISTER', description: 'Full register of persons, organizations, vehicles and devices linked to this case.' },
  { key: 'evidence', label: 'EVIDENCE LOG', description: 'Chain-of-custody log for all collected evidentiary material.' },
  { key: 'timeline', label: 'CHRONOLOGICAL REPORT', description: 'Sequenced narrative of all recorded events in the investigation.' },
];

const STEPS = [
  { label: 'COMPILING CASE RECORD...', atMs: 0 },
  { label: 'CROSS-REFERENCING ENTITIES...', atMs: 350 },
  { label: 'VALIDATING EVIDENCE CHAIN...', atMs: 700 },
  { label: 'FORMATTING REPORT...', atMs: 1000 },
  { label: 'REPORT READY', atMs: 1250 },
];

export function ReportsPage() {
  const { caseId } = useParams();
  const [activeCase, setActiveCase] = useState<Case | null>(null);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [reportType, setReportType] = useState<ReportType | null>(null);
  const [generating, setGenerating] = useState(false);
  const [stage, setStage] = useState('');

  useEffect(() => {
    if (!caseId) return;
    Promise.all([caseService.getCase(caseId), evidenceService.listByCase(caseId), timelineService.listByCase(caseId)]).then(([c, ev, tl]) => {
      setActiveCase(c ?? null);
      setEvidence(ev);
      setTimeline(tl);
      setEntities(getEntitiesByCase(caseId));
    });
  }, [caseId]);

  async function generate(type: ReportType) {
    setGenerating(true);
    setReportType(null);
    await runStagedOperation(STEPS, (label) => setStage(label));
    setGenerating(false);
    setReportType(type);
  }

  if (!activeCase) return <LoadingState label="LOADING CASE RECORD" />;

  return (
    <div className="split-2">
      <div className="scroll-region stack gap-3" style={{ padding: 16 }}>
        <div className="system-label">GENERATE REPORT</div>
        {REPORT_TYPES.map((rt) => (
          <button
            key={rt.key}
            type="button"
            className="panel"
            style={{ textAlign: 'left', padding: 14, cursor: 'pointer', border: '1px solid ' + (reportType === rt.key ? 'var(--cyan-dim)' : 'var(--border)') }}
            onClick={() => generate(rt.key)}
            disabled={generating}
          >
            <div className="row gap-2" style={{ marginBottom: 4 }}>
              <FileBarChart size={14} color="var(--cyan)" />
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>{rt.label}</span>
            </div>
            <span className="text-muted" style={{ fontSize: 11.5 }}>{rt.description}</span>
          </button>
        ))}
      </div>

      <div className="scroll-region" style={{ padding: 16 }}>
        {generating ? (
          <div className="stack gap-2" style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Loader2 size={20} className="spin" color="var(--cyan)" />
            <span className="mono text-cyan" style={{ fontSize: 11.5 }}>{stage}</span>
          </div>
        ) : !reportType ? (
          <span className="text-muted" style={{ fontSize: 12 }}>Select a report type to generate a preview.</span>
        ) : (
          <div className="stack gap-3">
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="page-title">{REPORT_TYPES.find((r) => r.key === reportType)?.label}</div>
                <div className="text-muted mono" style={{ fontSize: 10.5 }}>GENERATED {formatDateTime(new Date().toISOString())} · {activeCase.code}</div>
              </div>
              <button type="button" className="btn btn-sm btn-ghost" onClick={() => window.print()}>
                <Printer size={12} style={{ marginRight: 4, verticalAlign: -2 }} />EXPORT / PRINT
              </button>
            </div>

            {reportType === 'summary' && (
              <Panel title="CASE SUMMARY">
                <div className="stack gap-2">
                  <Row label="CASE NAME" value={activeCase.name} />
                  <Row label="CASE CODE" value={activeCase.code} />
                  <Row label="STATUS" value={activeCase.status.toUpperCase()} />
                  <Row label="PRIORITY" value={activeCase.priority.toUpperCase()} />
                  <Row label="CLASSIFICATION" value={activeCase.classification.toUpperCase()} />
                  <Row label="LEAD INVESTIGATOR" value={activeCase.investigatorLead} />
                  <Row label="OPENED" value={formatDate(activeCase.createdAt)} />
                  <Row label="LAST UPDATED" value={formatDate(activeCase.updatedAt)} />
                  <div className="text-secondary" style={{ fontSize: 12.5, marginTop: 8 }}>{activeCase.description}</div>
                  <div className="row gap-3" style={{ marginTop: 8, flexWrap: 'wrap' }}>
                    <Stat label="Persons" value={activeCase.stats.personCount} />
                    <Stat label="Vehicles" value={activeCase.stats.vehicleCount} />
                    <Stat label="Entities" value={activeCase.stats.entityCount} />
                    <Stat label="Relationships" value={activeCase.stats.relationshipCount} />
                    <Stat label="Locations" value={activeCase.stats.locationCount} />
                    <Stat label="Events" value={activeCase.stats.eventCount} />
                    <Stat label="Alerts" value={activeCase.stats.alertCount} />
                    <Stat label="Evidence" value={activeCase.stats.evidenceCount} />
                  </div>
                </div>
              </Panel>
            )}

            {reportType === 'entities' && (
              <Panel title={`ENTITY REGISTER (${entities.length})`} noPadding>
                <table className="data-table">
                  <thead><tr><th>ID</th><th>NAME</th><th>TYPE</th><th>STATUS</th></tr></thead>
                  <tbody>
                    {entities.map((e) => (
                      <tr key={e.id}>
                        <td className="mono">{e.id}</td>
                        <td>{e.name}</td>
                        <td><span className="badge badge-neutral">{e.type.toUpperCase()}</span></td>
                        <td>{e.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Panel>
            )}

            {reportType === 'evidence' && (
              <Panel title={`EVIDENCE LOG (${evidence.length})`}>
                <div className="stack gap-3">
                  {evidence.map((ev) => (
                    <div key={ev.id} style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 10 }}>
                      <div className="row" style={{ justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 12.5, fontWeight: 600 }}>{ev.title}</span>
                        <span className="text-muted mono" style={{ fontSize: 10.5 }}>{ev.id}</span>
                      </div>
                      <div className="text-secondary" style={{ fontSize: 11.5, margin: '4px 0' }}>{ev.description}</div>
                      <div className="text-muted mono" style={{ fontSize: 10 }}>
                        {ev.chainOfCustody.length} custody event(s) · collected {formatDateTime(ev.collectedAt)} by {ev.collectedBy}
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {reportType === 'timeline' && (
              <Panel title={`CHRONOLOGICAL REPORT (${timeline.length} events)`}>
                <div className="stack gap-2">
                  {timeline.map((ev) => (
                    <div key={ev.id} className="row gap-3" style={{ fontSize: 12 }}>
                      <span className="mono text-muted" style={{ minWidth: 130 }}>{formatDateTime(ev.timestamp)}</span>
                      <span>{ev.title}</span>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            <div className="text-muted" style={{ fontSize: 10, textAlign: 'center', marginTop: 8 }}>
              TRINETRA — SIMULATION MODE · REPORT GENERATED FOR DEMONSTRATION PURPOSES ONLY
            </div>
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

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="stack" style={{ minWidth: 90 }}>
      <span className="value-large">{value}</span>
      <span className="system-label">{label}</span>
    </div>
  );
}
