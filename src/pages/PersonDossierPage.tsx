import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Share2, Phone, Landmark, Camera, FileText, Gavel } from 'lucide-react';
import { PersonHeader } from '../components/dossier/PersonHeader';
import { Panel } from '../components/ui/Panel';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { entityService } from '../services/entityService';
import { timelineService } from '../services/timelineService';
import { getEntityById } from '../data';
import type { PersonEntity, Entity, TimelineEvent } from '../types';
import { useInvestigationStore } from '../store/investigationStore';
import { formatDateTime } from '../utils/formatters';

export function PersonDossierPage() {
  const { caseId, personId } = useParams();
  const navigate = useNavigate();
  const selectEntity = useInvestigationStore((s) => s.selectEntity);
  const [person, setPerson] = useState<PersonEntity | null | undefined>(undefined);
  const [related, setRelated] = useState<{ entity: Entity; relationship: { label: string } }[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    if (!personId) return;
    setPerson(undefined);
    entityService.getEntity(personId).then((e) => {
      setPerson((e as PersonEntity) ?? null);
      if (e) selectEntity(e.id);
    });
    entityService.getRelatedEntities(personId).then(setRelated);
    if (caseId) timelineService.listByCase(caseId, { entityId: personId }).then(setTimeline);
  }, [personId, caseId, selectEntity]);

  if (person === undefined) return <LoadingState label="LOADING DOSSIER" />;
  if (person === null) return <EmptyState title="PERSON NOT FOUND" hint="This identity could not be resolved." />;

  const md = person.metadata;
  const orgs = (md.organizationIds ?? []).map(getEntityById).filter(Boolean) as Entity[];
  const vehicles = (md.vehicleIds ?? []).map(getEntityById).filter(Boolean) as Entity[];
  const phones = (md.phoneIds ?? []).map(getEntityById).filter(Boolean) as Entity[];
  const accounts = (md.accountIds ?? []).map(getEntityById).filter(Boolean) as Entity[];
  const locations = (md.locationIds ?? []).map(getEntityById).filter(Boolean) as Entity[];

  return (
    <div className="stack" style={{ height: '100%' }}>
      <PersonHeader person={person} />
      <div className="scroll-region page-container">
        <div className="row gap-2" style={{ marginBottom: 16, flexWrap: 'wrap' }}>
          <QuickNav icon={<Share2 size={12} />} label="NETWORK" onClick={() => navigate(`/cases/${caseId}/network`)} />
          <QuickNav icon={<Share2 size={12} />} label="SOCIAL" onClick={() => navigate(`/cases/${caseId}/social-media`)} />
          <QuickNav icon={<Phone size={12} />} label="CALLS" onClick={() => navigate(`/cases/${caseId}/call-records`)} />
          <QuickNav icon={<Gavel size={12} />} label="CRIMINAL" onClick={() => navigate(`/cases/${caseId}/criminal-records`)} />
          <QuickNav icon={<Camera size={12} />} label="CCTV" onClick={() => navigate(`/cases/${caseId}/cctv`)} />
          <QuickNav icon={<Landmark size={12} />} label="FINANCIAL" onClick={() => navigate(`/cases/${caseId}/financial`)} />
          <QuickNav icon={<FileText size={12} />} label="DOCUMENTS" onClick={() => navigate(`/cases/${caseId}/documents`)} />
        </div>

        <div className="row gap-3" style={{ alignItems: 'flex-start' }}>
          <div className="stack gap-3" style={{ flex: 1, minWidth: 300 }}>
            <Panel title="IDENTITY">
              <div className="stack gap-1">
                <Field label="Date of Birth" value={md.dateOfBirth} />
                <Field label="Nationality" value={md.nationality} />
                <Field label="Gender" value={md.gender} />
                <Field label="Occupation" value={md.occupation} />
                <Field label="Address" value={md.address} />
                <Field label="ID Number" value={md.idNumber} />
              </div>
            </Panel>

            <Panel title="ASSOCIATED ENTITIES">
              <AssocGroup title="Organizations" items={orgs} />
              <AssocGroup title="Vehicles" items={vehicles} />
              <AssocGroup title="Phone Numbers" items={phones} />
              <AssocGroup title="Accounts" items={accounts} />
              <AssocGroup title="Locations" items={locations} />
            </Panel>
          </div>

          <div className="stack gap-3" style={{ flex: 1, minWidth: 300 }}>
            <Panel title="RELATIONSHIPS" actions={<button className="btn btn-sm" type="button" onClick={() => navigate(`/cases/${caseId}/network`)}>OPEN GRAPH</button>}>
              <div className="stack gap-1">
                {related.length === 0 && <span className="text-muted" style={{ fontSize: 12 }}>No relationships recorded.</span>}
                {related.slice(0, 10).map((r) => (
                  <div key={r.entity.id} className="row" style={{ justifyContent: 'space-between', fontSize: 12.5, padding: '4px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span>{r.entity.name}</span>
                    <span className="text-muted" style={{ fontSize: 10.5 }}>{r.relationship.label}</span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="ACTIVITY" actions={<button className="btn btn-sm" type="button" onClick={() => navigate(`/cases/${caseId}/timeline`)}>FULL TIMELINE</button>}>
              <div className="stack gap-2">
                {timeline.length === 0 && <span className="text-muted" style={{ fontSize: 12 }}>No recorded activity.</span>}
                {timeline.slice(0, 6).map((ev) => (
                  <div key={ev.id} className="stack" style={{ borderLeft: '2px solid var(--border-active)', paddingLeft: 8 }}>
                    <span style={{ fontSize: 12 }}>{ev.title}</span>
                    <span className="text-muted mono" style={{ fontSize: 10 }}>{formatDateTime(ev.timestamp)}</span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="INTELLIGENCE">
              <div className="stack gap-2">
                <div className="system-label">RISK INDICATORS</div>
                <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12.5, color: 'var(--text-secondary)' }}>
                  <li>Frequent contact pattern with known associates</li>
                  <li>Repeated presence at monitored freight locations</li>
                  {person.riskLevel === 'high' && <li className="text-danger">Linked to flagged financial transfers</li>}
                </ul>
                <div className="system-label" style={{ marginTop: 6 }}>ANALYST NOTES</div>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0 }}>
                  Subject continues to show consistent movement between residence and freight yard. Recommend continued surveillance and financial trace on linked accounts.
                </p>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickNav({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return <button className="btn btn-sm" type="button" onClick={onClick}>{icon} {label}</button>;
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="row" style={{ justifyContent: 'space-between', fontSize: 12.5, padding: '4px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <span className="text-muted">{label}</span>
      <span style={{ textAlign: 'right', maxWidth: '65%' }}>{value}</span>
    </div>
  );
}

function AssocGroup({ title, items }: { title: string; items: Entity[] }) {
  if (items.length === 0) return null;
  return (
    <div style={{ marginBottom: 8 }}>
      <div className="system-label" style={{ marginBottom: 4 }}>{title}</div>
      <div className="stack gap-1">
        {items.map((e) => (
          <div key={e.id} className="row" style={{ justifyContent: 'space-between', fontSize: 12.5 }}>
            <span>{e.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
