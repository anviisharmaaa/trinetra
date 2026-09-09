import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Car, Users, MapPin, CalendarClock, Share2, Gauge, TrendingUp, TrendingDown, FolderLock } from 'lucide-react';
import { useCaseStore } from '../store/caseStore';
import { entityService } from '../services/entityService';
import { timelineService } from '../services/timelineService';
import { evidenceService } from '../services/evidenceService';
import { LoadingState } from '../components/ui/LoadingState';
import { Panel } from '../components/ui/Panel';
import { ENTITY_LABELS, riskBadgeClass } from '../utils/entityMeta';
import { formatRelativeTime } from '../utils/formatters';
import { computeCaseRisk } from '../utils/riskAssessment';
import { getEntityById } from '../data';
import { personService } from '../services/personService';
import type { Entity, PersonEntity, TimelineEvent, Evidence } from '../types';
import { useInvestigationStore } from '../store/investigationStore';
import { useCaseIntelligenceStore } from '../store/caseIntelligenceStore';
import { PersonAvatar } from '../components/ui/EntityImage';
import { personImage } from '../config/imageAssets';
import { LedCaseOverview } from '../components/cases/LedCaseOverview';

/** Resolves a Person ID against the small in-memory demo dataset first,
 * then the real Master Dataset backend — so a Case Builder link to a real
 * dataset person (not just a demo person) still resolves and displays here. */
async function resolveCasePerson(id: string): Promise<Entity | undefined> {
  const mock = getEntityById(id);
  if (mock && mock.type === 'person') return mock;
  const raw = await personService.getPersonRaw(id);
  if (!raw) return undefined;
  return {
    id: raw.person_id, caseIds: [], type: 'person', name: raw.name,
    riskLevel: (raw.risk_level ?? 'unknown').toLowerCase() as Entity['riskLevel'],
    status: (raw.status ?? '').toLowerCase() === 'active' ? 'active' : 'inactive',
    metadata: { nationality: raw.nationality ?? undefined, occupation: raw.occupation ?? undefined },
    sourceIds: ['master-dataset'], createdAt: '', updatedAt: '',
  } as Entity;
}

export function CaseDashboardPage() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { cases } = useCaseStore();
  const { allPersonIds, loadCase: loadCaseIntelligence } = useCaseIntelligenceStore();
  const selectEntity = useInvestigationStore((s) => s.selectEntity);
  const [people, setPeople] = useState<PersonEntity[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [activity, setActivity] = useState<TimelineEvent[]>([]);
  const [milestones, setMilestones] = useState<TimelineEvent[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [caseEntities, setCaseEntities] = useState<{ victims: Entity[]; suspects: Entity[]; related: Entity[] }>({ victims: [], suspects: [], related: [] });

  useEffect(() => {
    if (!caseId) return;
    setLoading(true);
    Promise.all([
      entityService.listByCase(caseId),
      timelineService.listByCase(caseId),
      evidenceService.listByCase(caseId),
    ]).then(([ents, timeline, ev]) => {
      setEntities(ents);
      setPeople(ents.filter((e): e is PersonEntity => e.type === 'person'));
      setActivity([...timeline].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 6));
      setMilestones([...timeline].sort((a, b) => a.timestamp.localeCompare(b.timestamp)));
      setEvidence([...ev].sort((a, b) => b.collectedAt.localeCompare(a.collectedAt)).slice(0, 5));
      setLoading(false);
    });
  }, [caseId]);

  const activeCase = cases.find((c) => c.id === caseId);
  const locations = entities.filter((e) => e.type === 'location');

  // Linked-entity ids on the case are optional (older cases predate this
  // field), so a missing array simply resolves to nothing — never an error.
  // Each Person ID is resolved against the demo dataset first, then the real
  // Master Dataset backend, so a case can link either a legacy demo person
  // or a real ingested Person ID; related entities (any type) stay on the
  // demo dataset for now.
  useEffect(() => {
    if (!activeCase) return;
    let cancelled = false;
    loadCaseIntelligence(activeCase.id);
    Promise.all([
      Promise.all((allPersonIds ?? []).map(resolveCasePerson)),
      Promise.all((allPersonIds ?? []).map(() => Promise.resolve(undefined))),
    ]).then(([resolved]) => {
      if (cancelled) return;
      const linkedPeople = resolved.filter((e): e is Entity => !!e);
      setCaseEntities({
        victims: linkedPeople.filter((e) => activeCase.victimPersonIds?.includes(e.id) ?? false),
        suspects: linkedPeople.filter((e) => activeCase.suspectPersonIds?.includes(e.id) ?? false),
        related: (activeCase.relatedEntityIds ?? []).map(getEntityById).filter((e): e is Entity => !!e),
      });
    });
    return () => { cancelled = true; };
  }, [activeCase, allPersonIds, loadCaseIntelligence]);

  if (!activeCase) return <LoadingState label="LOADING CASE" />;

  // Real LED case (Postgres `cases`, e.g. "CASE-0001427") -- a completely
  // separate render path driven by the narrative endpoint, never the
  // Supabase-oriented overview below. The Supabase analyst-case rendering
  // for every other case is untouched by this branch.
  if (activeCase.isLedCase) return <LedCaseOverview caseId={activeCase.id} />;

  const risk = computeCaseRisk(activeCase);
  const DeltaIcon = risk.delta >= 0 ? TrendingUp : TrendingDown;

  const { victims, suspects, related: relatedEntities } = caseEntities;
  const hasCaseEntities = victims.length > 0 || suspects.length > 0 || relatedEntities.length > 0;

  function openEntity(entity: Entity) {
    selectEntity(entity.id);
    if (entity.type === 'person') navigate(`/cases/${caseId}/person/${entity.id}`);
    else if (entity.type === 'location') navigate(`/cases/${caseId}/location`);
    else navigate(`/cases/${caseId}/network`);
  }

  return (
    <div className="scroll-region page-container" style={{ height: '100%' }}>
      <div className="row gap-3" style={{ marginBottom: 16, flexWrap: 'wrap' }}>
        <StatTile icon={<Users size={15} />} label="Persons" value={activeCase.stats.personCount} />
        <StatTile icon={<Car size={15} />} label="Vehicles" value={activeCase.stats.vehicleCount} />
        <StatTile icon={<MapPin size={15} />} label="Locations" value={activeCase.stats.locationCount} />
        <StatTile icon={<CalendarClock size={15} />} label="Events" value={activeCase.stats.eventCount} />
        <StatTile icon={<Share2 size={15} />} label="Relationships" value={activeCase.stats.relationshipCount} />
        <div className="panel" style={{ padding: '10px 16px', flex: 1, minWidth: 190, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="text-cyan"><Gauge size={15} /></span>
          <div className="stack" style={{ flex: 1 }}>
            <div className="row gap-2" style={{ alignItems: 'baseline' }}>
              <span className="value-large">{risk.score}</span>
              <span className={`row gap-1 ${risk.delta >= 0 ? 'text-danger' : 'text-success'}`} style={{ fontSize: 10.5 }}>
                <DeltaIcon size={11} />{Math.abs(risk.delta)}
              </span>
            </div>
            <span className="system-label">Risk Assessment · {risk.label}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingState label="BUILDING CASE OVERVIEW" />
      ) : (
        <>
          {hasCaseEntities && (
            <Panel title="CASE ENTITIES" className="fade-in" style={{ marginBottom: 16 } as CSSProperties}>
              <div className="case-entities-panel-group">
                <CaseEntityGroup label="VICTIMS" entities={victims} onOpen={openEntity} emptyLabel="No victim linked." />
                <CaseEntityGroup label="SUSPECTS" entities={suspects} onOpen={openEntity} emptyLabel="No suspects linked." />
                <CaseEntityGroup label="RELATED ENTITIES" entities={relatedEntities} onOpen={openEntity} emptyLabel="No related entities linked." />
              </div>
            </Panel>
          )}

          <div className="row gap-3" style={{ alignItems: 'flex-start' }}>
            <Panel title="KEY PEOPLE" className="fade-in" style={{ flex: 1, minWidth: 280 } as CSSProperties}>
              <div className="stack gap-2">
                {people.slice(0, 6).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="row gap-2"
                    style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', padding: '6px 4px', color: 'inherit' }}
                    onClick={() => { selectEntity(p.id); navigate(`/cases/${caseId}/person/${p.id}`); }}
                  >
                    <PersonAvatar personId={p.id} name={p.name} src={personImage(p.id, p.name)} size={26} />
                    <span style={{ flex: 1, fontSize: 12.5 }}>{p.name}</span>
                    <span className={riskBadgeClass(p.riskLevel)}>{p.riskLevel ?? 'unknown'}</span>
                  </button>
                ))}
                <button type="button" className="row gap-2 text-muted" style={{ background: 'none', border: '1px dashed var(--border)', borderRadius: 4, padding: '6px 8px', cursor: 'pointer', fontSize: 11.5 }} onClick={() => navigate(`/cases/${caseId}/network`)}>
                  <Plus size={13} /> VIEW ALL IN NETWORK
                </button>
              </div>
            </Panel>

            <Panel title="NETWORK GRAPH" className="fade-in" style={{ flex: 1.4, minWidth: 320 } as CSSProperties} actions={<button className="btn btn-sm" type="button" onClick={() => navigate(`/cases/${caseId}/network`)}>OPEN NETWORK</button>}>
              <MiniNetworkPreview entities={entities} />
            </Panel>

            <Panel title="RECENT ACTIVITY" className="fade-in" style={{ flex: 1, minWidth: 280 } as CSSProperties}>
              <div className="stack gap-2">
                {activity.length === 0 && <span className="text-muted" style={{ fontSize: 12 }}>No recent activity.</span>}
                {activity.map((ev) => (
                  <div key={ev.id} className="stack" style={{ borderLeft: '2px solid var(--border-active)', paddingLeft: 8 }}>
                    <span style={{ fontSize: 12 }}>{ev.title}</span>
                    <span className="text-muted" style={{ fontSize: 10.5 }}>{formatRelativeTime(ev.timestamp)} · {ev.source}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <div className="row gap-3" style={{ marginTop: 16, alignItems: 'flex-start' }}>
            <Panel title={`KEY LOCATIONS (${locations.length})`} style={{ flex: 1, minWidth: 280 } as CSSProperties}>
              <div className="stack gap-1">
                {locations.slice(0, 8).map((l) => (
                  <button key={l.id} type="button" className="row" style={{ justifyContent: 'space-between', fontSize: 12, background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '4px 0' }} onClick={() => navigate(`/cases/${caseId}/location`)}>
                    <span>{l.name}</span>
                    <span className="text-muted" style={{ fontSize: 10.5 }}>{(l as { label?: string }).label}</span>
                  </button>
                ))}
                {locations.length === 0 && <span className="text-muted" style={{ fontSize: 12 }}>No locations on file.</span>}
              </div>
            </Panel>

            <Panel title="RECENT EVIDENCE" style={{ flex: 1, minWidth: 280 } as CSSProperties} actions={<button className="btn btn-sm" type="button" onClick={() => navigate(`/cases/${caseId}/evidence`)}>OPEN EVIDENCE</button>}>
              <div className="stack gap-2">
                {evidence.length === 0 && <span className="text-muted" style={{ fontSize: 12 }}>No evidence logged yet.</span>}
                {evidence.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    className="row gap-2"
                    style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', padding: '4px 0', color: 'inherit' }}
                    onClick={() => navigate(`/cases/${caseId}/evidence`)}
                  >
                    <FolderLock size={12} color="var(--cyan)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div className="stack" style={{ minWidth: 0 }}>
                      <span style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</span>
                      <span className="text-muted mono" style={{ fontSize: 10 }}>{e.type.toUpperCase()} · {formatRelativeTime(e.collectedAt)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </Panel>

            <Panel title="TIMELINE MILESTONES" style={{ flex: 1.4, minWidth: 320 } as CSSProperties} actions={<button className="btn btn-sm" type="button" onClick={() => navigate(`/cases/${caseId}/timeline`)}>OPEN TIMELINE</button>}>
              <TimelineMilestoneStrip events={milestones} />
            </Panel>
          </div>
        </>
      )}
    </div>
  );
}

function CaseEntityGroup({
  label, entities, onOpen, emptyLabel,
}: {
  label: string; entities: Entity[]; onOpen: (entity: Entity) => void; emptyLabel: string;
}) {
  return (
    <div className="stack gap-1">
      <span className="system-label">{label} ({entities.length})</span>
      {entities.length === 0 && <span className="text-muted" style={{ fontSize: 12 }}>{emptyLabel}</span>}
      {entities.map((e) => (
        <button key={e.id} type="button" className="case-entity-row" onClick={() => onOpen(e)}>
          <PersonAvatar
            personId={e.id}
            name={e.name}
            src={e.type === 'person' ? personImage(e.id, e.name) : undefined}
            size={26}
            square={e.type !== 'person'}
          />
          <div className="stack" style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 12.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.name}</span>
            <span className="text-muted mono" style={{ fontSize: 10 }}>{e.id}</span>
          </div>
          <span className={e.type === 'person' ? riskBadgeClass(e.riskLevel) : 'badge badge-neutral'} style={{ fontSize: 9.5 }}>
            {e.type === 'person' ? (e.riskLevel ?? 'unknown') : ENTITY_LABELS[e.type]}
          </span>
        </button>
      ))}
    </div>
  );
}

function StatTile({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="panel" style={{ padding: '10px 16px', flex: 1, minWidth: 130, display: 'flex', alignItems: 'center', gap: 10 }}>
      <span className="text-cyan">{icon}</span>
      <div className="stack">
        <span className="value-large">{value}</span>
        <span className="system-label">{label}</span>
      </div>
    </div>
  );
}

function MiniNetworkPreview({ entities }: { entities: Entity[] }) {
  const people = entities.filter((e) => e.type === 'person').slice(0, 5);
  if (people.length === 0) return <div className="text-muted" style={{ fontSize: 12 }}>No entities to preview.</div>;
  return (
    <svg viewBox="0 0 300 160" style={{ width: '100%', height: 160 }}>
      <circle cx={150} cy={80} r={5} fill="var(--cyan)" />
      {people.map((p, i) => {
        const angle = (i / people.length) * Math.PI * 2;
        const x = 150 + Math.cos(angle) * 100;
        const y = 80 + Math.sin(angle) * 55;
        return (
          <g key={p.id}>
            <line x1={150} y1={80} x2={x} y2={y} stroke="var(--border-active)" strokeWidth={1} />
            <circle cx={x} cy={y} r={4} fill="var(--cyan-dim)" />
            <text x={x} y={y - 8} fill="var(--text-secondary)" fontSize={9} textAnchor="middle">{p.name.split(' ')[0]}</text>
          </g>
        );
      })}
    </svg>
  );
}

function TimelineMilestoneStrip({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) return <div className="text-muted" style={{ fontSize: 12 }}>No timeline events yet.</div>;
  const shown = events.slice(-6);
  return (
    <div className="row" style={{ position: 'relative', paddingTop: 6, overflowX: 'auto', gap: 0 }}>
      <div style={{ position: 'absolute', top: 15, left: 8, right: 8, height: 1, background: 'var(--border-active)' }} />
      {shown.map((ev) => (
        <div key={ev.id} className="stack" style={{ flex: 1, minWidth: 96, alignItems: 'center', position: 'relative', padding: '0 4px' }}>
          <span
            className="status-dot"
            style={{
              zIndex: 1, width: 8, height: 8, borderRadius: '50%',
              background: ev.importance === 'high' ? 'var(--danger)' : ev.importance === 'medium' ? 'var(--warning)' : 'var(--cyan-dim)',
            }}
          />
          <span className="text-muted mono" style={{ fontSize: 9, marginTop: 6 }}>{formatRelativeTime(ev.timestamp)}</span>
          <span style={{ fontSize: 10.5, textAlign: 'center', lineHeight: 1.25 }}>{ev.title}</span>
        </div>
      ))}
    </div>
  );
}
