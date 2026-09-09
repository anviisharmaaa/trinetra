import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Share2, Phone, Landmark, Camera, FileText, Gavel, Smartphone, CreditCard, Car,
  Building2, Home, Plane, ScanFace, Gauge, Siren, ShieldAlert, BellRing, Users,
} from 'lucide-react';
import { PersonHeader } from '../components/dossier/PersonHeader';
import { RecordListPanel } from '../components/dossier/RecordListPanel';
import { Panel } from '../components/ui/Panel';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { entityService } from '../services/entityService';
import { timelineService } from '../services/timelineService';
import { personService, toPersonEntityFromDetail, PERSON_RECORD_RESOURCES, type PersonRecordResource, type PersonRecordRow } from '../services/personService';
import { ApiUnavailableError } from '../services/apiClient';
import { getEntityById } from '../data';
import type { PersonEntity, Entity, TimelineEvent } from '../types';
import { useInvestigationStore } from '../store/investigationStore';
import { formatDateTime } from '../utils/formatters';

type RelatedRow = { entity: { id: string; name: string }; relationship: { label: string } };
type LoadStatus = 'loading' | 'ready' | 'not-found' | 'backend-down' | 'error';
type Source = 'mock' | 'live';

// Display config for every generic Master Dataset sub-resource — which
// columns make a good compact title/subtitle/date for that domain's rows.
// See RecordListPanel: anything not listed here is still fully visible by
// expanding a row, this only shapes the one-line summary.
const RECORD_PANELS: Record<PersonRecordResource, { label: string; icon: ReactNode; idField: string; titleFields: string[]; subtitleFields?: string[]; dateField?: string }> = {
  accounts: { label: 'Accounts', icon: <CreditCard size={13} />, idField: 'account_id', titleFields: ['bank_name', 'account_type'], subtitleFields: ['account_number', 'branch'], dateField: 'opening_date' },
  phones: { label: 'Phone Numbers', icon: <Phone size={13} />, idField: 'phone_id', titleFields: ['phone_number'], subtitleFields: ['carrier', 'status'], dateField: 'activation_date' },
  devices: { label: 'Devices', icon: <Smartphone size={13} />, idField: 'device_id', titleFields: ['manufacturer', 'model', 'device_type'], subtitleFields: ['os', 'imei'], dateField: 'last_seen' },
  vehicles: { label: 'Vehicles', icon: <Car size={13} />, idField: 'vehicle_id', titleFields: ['registration_number'], subtitleFields: ['make', 'model', 'color'], dateField: 'registration_date' },
  'social-media': { label: 'Social Media', icon: <Share2 size={13} />, idField: 'social_account_id', titleFields: ['platform'], subtitleFields: ['username', 'profile_name'], dateField: 'created_date' },
  organizations: { label: 'Organizations', icon: <Building2 size={13} />, idField: 'organization_id', titleFields: ['name'] },
  properties: { label: 'Properties', icon: <Home size={13} />, idField: 'property_id', titleFields: ['property_type'], subtitleFields: ['address'], dateField: 'ownership_date' },
  transactions: { label: 'Transactions', icon: <Landmark size={13} />, idField: 'transaction_id', titleFields: ['transaction_type'], subtitleFields: ['amount', 'currency', 'merchant'], dateField: 'txn_date' },
  calls: { label: 'Call Records', icon: <Phone size={13} />, idField: 'call_id', titleFields: ['call_type'], subtitleFields: ['duration'], dateField: 'call_date' },
  travel: { label: 'Travel', icon: <Plane size={13} />, idField: 'travel_id', titleFields: ['travel_type'], subtitleFields: ['origin_location_id', 'destination_location_id'], dateField: 'departure_date' },
  cctv: { label: 'CCTV Events', icon: <Camera size={13} />, idField: 'cctv_event_id', titleFields: ['event_type'], subtitleFields: ['camera_id', 'location_id'], dateField: 'event_date' },
  'face-recognition': { label: 'Face Matches', icon: <ScanFace size={13} />, idField: 'face_match_id', titleFields: ['detected_name'], subtitleFields: ['verification_status'], dateField: 'match_date' },
  documents: { label: 'Documents', icon: <FileText size={13} />, idField: 'document_id', titleFields: ['document_type'], subtitleFields: ['document_number', 'issuing_authority'], dateField: 'issue_date' },
  'criminal-records': { label: 'Criminal Records', icon: <Gavel size={13} />, idField: 'criminal_record_id', titleFields: ['offence'], subtitleFields: ['fir_number', 'legal_section'], dateField: 'incident_date' },
  'court-records': { label: 'Court Records', icon: <Gauge size={13} />, idField: 'court_record_id', titleFields: ['case_type'], subtitleFields: ['court_name', 'case_number'], dateField: 'hearing_date' },
  evidence: { label: 'Evidence', icon: <ShieldAlert size={13} />, idField: 'evidence_id', titleFields: ['evidence_type'], subtitleFields: ['description'], dateField: 'collection_date' },
  alerts: { label: 'Alerts', icon: <BellRing size={13} />, idField: 'alert_id', titleFields: ['alert_type'], subtitleFields: ['severity', 'description'], dateField: 'created_date' },
  investigations: { label: 'Investigations', icon: <Siren size={13} />, idField: 'investigation_id', titleFields: ['investigation_type'], subtitleFields: ['status', 'priority'], dateField: 'start_date' },
  locations: { label: 'Locations', icon: <Landmark size={13} />, idField: 'location_id', titleFields: [] },
};

export function PersonDossierPage() {
  const { caseId, personId } = useParams();
  const navigate = useNavigate();
  const selectEntity = useInvestigationStore((s) => s.selectEntity);

  const [status, setStatus] = useState<LoadStatus>('loading');
  const [source, setSource] = useState<Source | null>(null);
  const [person, setPerson] = useState<PersonEntity | null>(null);
  const [idNumber, setIdNumber] = useState<string | undefined>(undefined);
  const [mockAssoc, setMockAssoc] = useState<{ orgs: Entity[]; vehicles: Entity[]; phones: Entity[]; accounts: Entity[]; locations: Entity[] }>({ orgs: [], vehicles: [], phones: [], accounts: [], locations: [] });
  const [records, setRecords] = useState<Record<PersonRecordResource, PersonRecordRow[]> | null>(null);
  const [related, setRelated] = useState<RelatedRow[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!personId) return;
    let cancelled = false;
    setStatus('loading');
    setSource(null);

    // Every Person ID is checked against the small in-memory demo dataset
    // first — this is what keeps every existing demo case (e.g. OP-001)
    // working exactly as before. Anything not found there is a real Master
    // Dataset Person ID and is fetched live from Express. A real ID whose
    // fetch fails because the backend is unreachable gets an explicit
    // "backend unavailable" state — it is never silently swapped for mock
    // data.
    const mockEntity = getEntityById(personId);
    if (mockEntity && mockEntity.type === 'person') {
      const md = (mockEntity as PersonEntity).metadata;
      Promise.all([
        entityService.getRelatedEntities(personId),
        caseId ? timelineService.listByCase(caseId, { entityId: personId }) : Promise.resolve([] as TimelineEvent[]),
      ]).then(([rel, tl]) => {
        if (cancelled) return;
        setPerson(mockEntity as PersonEntity);
        setMockAssoc({
          orgs: (md.organizationIds ?? []).map(getEntityById).filter(Boolean) as Entity[],
          vehicles: (md.vehicleIds ?? []).map(getEntityById).filter(Boolean) as Entity[],
          phones: (md.phoneIds ?? []).map(getEntityById).filter(Boolean) as Entity[],
          accounts: (md.accountIds ?? []).map(getEntityById).filter(Boolean) as Entity[],
          locations: (md.locationIds ?? []).map(getEntityById).filter(Boolean) as Entity[],
        });
        setRelated(rel as RelatedRow[]);
        setTimeline(tl);
        setSource('mock');
        setStatus('ready');
        selectEntity(mockEntity.id);
      });
      return () => { cancelled = true; };
    }

    (async () => {
      try {
        const raw = await personService.getPersonRaw(personId);
        if (cancelled) return;
        if (!raw) { setStatus('not-found'); return; }

        const [allRecords, rels, tl] = await Promise.all([
          personService.getAllRecords(personId),
          personService.getRelationships(personId),
          personService.getTimeline(personId),
        ]);
        if (cancelled) return;

        setPerson(toPersonEntityFromDetail(raw));
        setIdNumber(raw.passport?.passport_number);
        setRecords(allRecords);
        setRelated(rels as RelatedRow[]);
        setTimeline(tl);
        setSource('live');
        setStatus('ready');
        selectEntity(raw.person_id);
      } catch (err) {
        if (cancelled) return;
        setStatus(err instanceof ApiUnavailableError ? 'backend-down' : 'error');
      }
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personId, caseId, selectEntity, retryKey]);

  const retry = useCallback(() => setRetryKey((k) => k + 1), []);

  if (status === 'loading') return <LoadingState label="LOADING DOSSIER" />;
  if (status === 'not-found') return <EmptyState title="PERSON NOT FOUND" hint="This identity could not be resolved." />;
  if (status === 'backend-down') {
    return (
      <div style={{ padding: 20 }}>
        <ErrorState
          title="MASTER DATASET BACKEND UNAVAILABLE"
          message={`Could not reach the TRINETRA API for Person ID ${personId}. Start the Express server (server/index.js) and Postgres, then retry.`}
          onRetry={retry}
        />
      </div>
    );
  }
  if (status === 'error' || !person) {
    return (
      <div style={{ padding: 20 }}>
        <ErrorState title="FAILED TO LOAD PERSON" message="An unexpected error occurred while loading this record." onRetry={retry} />
      </div>
    );
  }

  const md = person.metadata;
  const isLive = source === 'live';

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
          {isLive && <span className="badge badge-info" style={{ marginLeft: 'auto' }}><Users size={11} style={{ marginRight: 4, verticalAlign: -2 }} />MASTER DATASET</span>}
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
                <Field label="ID Number" value={idNumber ?? md.idNumber} />
              </div>
            </Panel>

            {!isLive && (
              <Panel title="ASSOCIATED ENTITIES">
                <AssocGroup title="Organizations" items={mockAssoc.orgs} />
                <AssocGroup title="Vehicles" items={mockAssoc.vehicles} />
                <AssocGroup title="Phone Numbers" items={mockAssoc.phones} />
                <AssocGroup title="Accounts" items={mockAssoc.accounts} />
                <AssocGroup title="Locations" items={mockAssoc.locations} />
              </Panel>
            )}

            {isLive && records && PERSON_RECORD_RESOURCES.map((resource) => {
              const cfg = RECORD_PANELS[resource];
              return (
                <RecordListPanel
                  key={resource}
                  title={cfg.label}
                  icon={cfg.icon}
                  records={records[resource]}
                  idField={cfg.idField}
                  titleFields={cfg.titleFields}
                  subtitleFields={cfg.subtitleFields}
                  dateField={cfg.dateField}
                />
              );
            })}
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

            {!isLive && (
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
            )}
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
