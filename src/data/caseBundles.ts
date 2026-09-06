// Fully-generated, internally-consistent per-case data bundles for every
// intelligence module (locations, orgs, devices, accounts, documents,
// phones, vehicles, CCTV, face recognition, social media, calls, financial,
// OCR, evidence, alerts and timeline) for OP-002..OP-005.
//
// OP-001 remains hand-authored (see the individual mock*.ts files) as the
// flagship reference case; every other case is built here from a small
// per-case "profile" so that adding a new case never requires touching the
// UI layer — only a new profile + a call to buildCaseBundle().
import type {
  LocationEntity, OrganizationEntity, DeviceEntity, AccountEntity, DocumentEntity,
  PhoneEntity, VehicleEntity, Camera, CCTVEvent, Movement, FaceDetection,
  SocialProfile, SocialConnection, SocialActivity, CallRecord, Transaction,
  CriminalRecord, OcrEntity, Evidence, Alert, TimelineEvent, PersonEntity, Relationship,
} from '../types';
import { mulberry32, pick, pickN, randInt } from './seed';
import { OP002_PERSONS, OP003_PERSONS, OP004_PERSONS, OP005_PERSONS } from './entities/mockPersons';

interface Locality { name: string; lat: number; lng: number; category: string }

export interface CaseProfile {
  caseId: string;
  tag: string; // short id namespace, e.g. '002'
  seed: number;
  anchor: string; // ISO date the case's "now" is relative to
  persons: PersonEntity[];
  localities: Locality[];
  orgNames: { name: string; sector: string }[];
  vehicleModels: { make: string; model: string }[];
  plateState: string;
  theme: 'coastal' | 'realestate' | 'cyberfraud' | 'narcotics';
  documentTitles: { fileName: string; fileType: string; tags: string[] }[];
  closed?: boolean;
}

export interface CaseBundle {
  locations: LocationEntity[];
  organizations: OrganizationEntity[];
  devices: DeviceEntity[];
  accounts: AccountEntity[];
  documents: DocumentEntity[];
  phones: PhoneEntity[];
  vehicles: VehicleEntity[];
  cameras: Camera[];
  cctvEvents: CCTVEvent[];
  movements: Movement[];
  faceDetections: FaceDetection[];
  socialProfiles: SocialProfile[];
  socialConnections: SocialConnection[];
  socialActivity: SocialActivity[];
  calls: CallRecord[];
  transactions: Transaction[];
  criminalRecords: CriminalRecord[];
  ocrEntities: OcrEntity[];
  evidence: Evidence[];
  alerts: Alert[];
  timeline: TimelineEvent[];
  relationships: Relationship[];
}

const BANKS = ['HDFC Bank', 'ICICI Bank', 'Axis Bank', 'State Bank of India', 'Punjab National Bank', 'Bank of Baroda', 'Yes Bank'];
const MODES: Transaction['mode'][] = ['UPI', 'NEFT', 'IMPS', 'RTGS'];

function tsAgo(anchor: string, daysAgo: number, hour: number, minute: number): string {
  const d = new Date(anchor);
  d.setUTCDate(d.getUTCDate() - daysAgo);
  d.setUTCHours(hour, minute, 0, 0);
  return d.toISOString();
}

function pad(n: number, w = 2): string {
  return String(n).padStart(w, '0');
}

export function buildCaseBundle(cfg: CaseProfile): CaseBundle {
  const rand = mulberry32(cfg.seed);
  const { caseId, tag, anchor, persons, localities, orgNames, vehicleModels, plateState } = cfg;
  const primary = persons[0];
  const associates = persons.slice(1);

  // ---- Locations ----
  const locations: LocationEntity[] = localities.map((loc, i) => ({
    id: `LOC-${tag}-${pad(i + 1)}`,
    caseIds: [caseId],
    type: 'location',
    name: loc.name,
    label: loc.category.replace(/_/g, ' ').toUpperCase(),
    status: 'active',
    metadata: { address: loc.name, city: loc.name.split(' ')[0], coordinates: { lat: loc.lat, lng: loc.lng }, category: loc.category },
    sourceIds: [`src-gis-${tag}`],
    createdAt: tsAgo(anchor, 70, 9, 0),
    updatedAt: tsAgo(anchor, randInt(rand, 1, 10), 10, 0),
  }));
  const locFor = (i: number) => locations[i % locations.length];

  // ---- Organizations ----
  const organizations: OrganizationEntity[] = orgNames.map((o, i) => ({
    id: `ORG-${tag}-${pad(i + 1)}`,
    caseIds: [caseId],
    type: 'organization',
    name: o.name,
    status: 'active',
    riskLevel: i === 0 ? 'high' : 'medium',
    metadata: {
      sector: o.sector,
      registrationId: `U${randInt(rand, 10000, 99999)}${plateState}${2015 + randInt(rand, 0, 9)}PTC${randInt(rand, 100000, 999999)}`,
      address: locFor(i).name,
      memberIds: pickN(rand, persons, Math.min(persons.length, 3)).map((p) => p.id),
    },
    sourceIds: [`src-mca-${tag}`],
    createdAt: tsAgo(anchor, 65, 9, 0),
    updatedAt: tsAgo(anchor, randInt(rand, 2, 15), 9, 0),
  }));

  // ---- Devices ----
  const devices: DeviceEntity[] = [primary, ...pickN(rand, associates, Math.min(1, associates.length))].map((p, i) => ({
    id: `DEV-${tag}-${pad(i + 1)}`,
    caseIds: [caseId],
    type: 'device',
    name: `${pick(rand, ['Samsung Galaxy S24', 'Xiaomi Redmi Note 13', 'OnePlus 12R', 'Vivo V29'])} (${p.name})`,
    status: 'active',
    metadata: { deviceType: 'smartphone', serialNumber: `SM-${randInt(rand, 100000, 999999)}`, ownerId: p.id, os: pick(rand, ['Android 14', 'Android 15']) },
    sourceIds: [`src-forensic-${tag}`],
    createdAt: tsAgo(anchor, 40, 9, 0),
    updatedAt: tsAgo(anchor, randInt(rand, 2, 12), 9, 0),
  }));

  // ---- Phones ----
  const carriers = ['Airtel', 'Jio', 'Vi', 'BSNL'];
  const phones: PhoneEntity[] = persons.map((p, i) => ({
    id: `PH-${tag}-${pad(i + 1)}`,
    caseIds: [caseId],
    type: 'phone',
    name: `+91 9${randInt(rand, 1000, 9999)}X XX${randInt(rand, 100, 999)}`,
    status: 'active',
    metadata: { number: `+91 9${randInt(rand, 10000000, 99999999)}`, carrier: pick(rand, carriers), ownerId: p.id },
    sourceIds: [`src-call-${tag}`],
    createdAt: tsAgo(anchor, 60, 9, 0),
    updatedAt: tsAgo(anchor, randInt(rand, 0, 5), 9, 0),
  }));

  // ---- Vehicles ----
  const vehCount = Math.max(2, Math.round(persons.length / 3));
  const vehicles: VehicleEntity[] = Array.from({ length: vehCount }, (_, i) => {
    const vm = pick(rand, vehicleModels);
    const owner = i === 0 ? primary : pick(rand, persons);
    return {
      id: `VEH-${tag}-${pad(i + 1)}`,
      caseIds: [caseId],
      type: 'vehicle' as const,
      name: `${plateState}-${pad(randInt(rand, 1, 42))}-${pick(rand, ['A', 'B', 'C', 'D', 'K', 'X'])}${pick(rand, ['A', 'B', 'C', 'D'])}-${randInt(rand, 1000, 9999)}`,
      status: 'active' as const,
      metadata: { registrationNumber: '', make: vm.make, model: vm.model, color: pick(rand, ['White', 'Grey', 'Black', 'Blue', 'Silver']), ownerId: owner.id, lastSeenLocationId: locFor(i).id },
      sourceIds: [`src-anpr-${tag}`],
      createdAt: tsAgo(anchor, 55, 9, 0),
      updatedAt: tsAgo(anchor, randInt(rand, 0, 8), 9, 0),
    };
  }).map((v) => ({ ...v, metadata: { ...v.metadata, registrationNumber: v.name } }));

  // ---- Accounts ----
  const accountHolders = [primary, ...pickN(rand, associates, Math.min(associates.length, 3)), organizations[0]];
  const accounts: AccountEntity[] = accountHolders.map((holder, i) => {
    const bank = pick(rand, BANKS);
    const last4 = randInt(rand, 1000, 9999);
    return {
      id: `ACC-${tag}-${pad(i + 1)}`,
      caseIds: [caseId],
      type: 'account' as const,
      name: `${bank.split(' ')[0]} •••• ${last4} (${holder.name})`,
      status: 'active' as const,
      riskLevel: i < 2 ? ('medium' as const) : undefined,
      metadata: { accountNumber: `XXXXXXXX${last4}`, bankName: bank, ifsc: `${bank.slice(0, 4).toUpperCase()}0${randInt(rand, 100000, 999999)}`, ownerId: holder.id, balance: randInt(rand, 3000, 4200000) },
      sourceIds: [`src-financial-${tag}`],
      createdAt: tsAgo(anchor, 58, 9, 0),
      updatedAt: tsAgo(anchor, randInt(rand, 0, 6), 9, 0),
    };
  });

  // ---- Documents ----
  const documents: DocumentEntity[] = cfg.documentTitles.map((d, i) => ({
    id: `DOC-${tag}-${pad(i + 1)}`,
    caseIds: [caseId],
    type: 'document',
    name: d.fileName,
    status: 'active',
    metadata: { fileName: d.fileName, fileType: d.fileType, pages: randInt(rand, 1, 6), uploadedAt: tsAgo(anchor, 30 - i * 4, 9, 0), tags: d.tags },
    sourceIds: [`src-doc-${tag}-${i + 1}`],
    createdAt: tsAgo(anchor, 30 - i * 4, 9, 0),
    updatedAt: tsAgo(anchor, 30 - i * 4, 9, 0),
  }));

  // ---- OCR entities (2-3 per document, referencing real people/orgs/locations) ----
  const ocrEntities: OcrEntity[] = [];
  documents.forEach((doc, di) => {
    const person = pick(rand, persons);
    ocrEntities.push({
      id: `OCR-${tag}-${pad(di * 3 + 1)}`, documentId: doc.id, page: 1, text: person.name, entityType: 'PERSON',
      confidence: 0.9 + rand() * 0.09, boundingBox: { x: 0.28, y: 0.2, width: 0.3, height: 0.04 }, linkedEntityId: person.id,
    });
    const org = pick(rand, organizations);
    ocrEntities.push({
      id: `OCR-${tag}-${pad(di * 3 + 2)}`, documentId: doc.id, page: 1, text: org.name, entityType: 'ORGANIZATION',
      confidence: 0.88 + rand() * 0.1, boundingBox: { x: 0.2, y: 0.3, width: 0.4, height: 0.04 }, linkedEntityId: org.id,
    });
    const loc = pick(rand, locations);
    ocrEntities.push({
      id: `OCR-${tag}-${pad(di * 3 + 3)}`, documentId: doc.id, page: doc.metadata.pages && doc.metadata.pages > 1 ? 2 : 1, text: loc.name, entityType: 'LOCATION',
      confidence: 0.85 + rand() * 0.1, boundingBox: { x: 0.18, y: 0.4, width: 0.35, height: 0.035 }, linkedEntityId: loc.id,
    });
  });

  // ---- Cameras ----
  const cameras: Camera[] = locations.map((loc, i) => ({
    id: `CAM-${tag}-${pad(i + 1)}`,
    name: `${loc.name} — ${pick(rand, ['Gate', 'Junction', 'Entrance', 'Perimeter', 'Yard'])}`,
    code: `${tag}-${pad(i + 1)}`,
    locationId: loc.id,
    status: rand() > 0.15 ? 'online' : 'offline',
    coordinates: loc.metadata.coordinates,
    coverage: pick(rand, ['Main Approach', 'Gate Camera', 'Perimeter Watch', 'Yard Overview', 'Access Control']),
  }));

  // ---- CCTV events + movements ----
  const cctvEvents: CCTVEvent[] = [];
  const eventCount = Math.max(6, Math.round(persons.length * 0.9));
  for (let i = 0; i < eventCount; i++) {
    const cam = pick(rand, cameras);
    const person = pick(rand, persons);
    const kind = pick(rand, ['face_match', 'vehicle_detected', 'person_detected', 'movement'] as CCTVEvent['eventType'][]);
    const vehicle = pick(rand, vehicles);
    cctvEvents.push({
      id: `CE-${tag}-${pad(i + 1)}`,
      cameraId: cam.id,
      caseId,
      timestamp: tsAgo(anchor, randInt(rand, 0, 28), randInt(rand, 6, 22), randInt(rand, 0, 59)),
      entityIds: kind === 'vehicle_detected' ? [vehicle.id, person.id] : [person.id],
      eventType: kind,
      confidence: kind === 'person_detected' && rand() < 0.3 ? 0.4 + rand() * 0.25 : 0.75 + rand() * 0.24,
    });
  }
  cctvEvents.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  const movements: Movement[] = Array.from({ length: Math.min(4, locations.length) }, (_, i) => ({
    id: `MV-${tag}-${pad(i + 1)}`,
    entityId: pick(rand, [...persons, ...vehicles]).id,
    caseId,
    fromLocationId: locFor(i).id,
    toLocationId: locFor(i + 1).id,
    timestamp: tsAgo(anchor, randInt(rand, 1, 20), randInt(rand, 6, 21), randInt(rand, 0, 59)),
    cameraId: pick(rand, cameras).id,
  }));

  // ---- Face detections (derived from face_match / person_detected CCTV events) ----
  const faceSourceEvents = cctvEvents.filter((e) => e.eventType === 'face_match' || e.eventType === 'person_detected').slice(0, 8);
  const faceDetections: FaceDetection[] = faceSourceEvents.map((e, i) => {
    const matched = e.eventType === 'face_match' && e.confidence > 0.6;
    return {
      id: `FD-${tag}-${pad(i + 1)}`,
      caseId,
      timestamp: e.timestamp,
      cameraId: e.cameraId,
      frameId: `F-${randInt(rand, 10000, 99999)}`,
      boundingBox: { x: 0.25 + rand() * 0.35, y: 0.18 + rand() * 0.2, width: 0.12 + rand() * 0.05, height: 0.16 + rand() * 0.06 },
      identityId: matched ? e.entityIds[0] : undefined,
      confidence: e.confidence,
      status: matched ? 'matched' : e.confidence > 0.5 ? 'possible-match' : 'unknown',
      attributes: { ageRange: pick(rand, ['25-32', '28-34', '35-42', '40-50']) },
    } as FaceDetection;
  });

  // ---- Social profiles / connections / activity ----
  const socialSubjects = [primary, ...pickN(rand, associates, Math.min(associates.length, 3))];
  const platforms: SocialProfile['platform'][] = ['X', 'Instagram', 'Telegram', 'LinkedIn', 'Facebook'];
  const socialProfiles: SocialProfile[] = socialSubjects.map((p, i) => ({
    id: `SOC-${tag}-${pad(i + 1)}`,
    caseId,
    entityId: p.id,
    platform: pick(rand, platforms),
    handle: `@${p.name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 10)}${randInt(rand, 1, 99)}`,
    displayName: p.name,
    followers: randInt(rand, 40, 2400),
    following: randInt(rand, 30, 800),
    bio: i === 0 ? undefined : pick(rand, ['Trading & logistics', 'Freelance consultant', 'Import / export', undefined]),
    verified: rand() > 0.85,
    createdAt: tsAgo(anchor, randInt(rand, 900, 2400), 0, 0),
    lastActive: tsAgo(anchor, randInt(rand, 0, 5), randInt(rand, 7, 22), 0),
    riskScore: 0.2 + rand() * 0.7,
  } as SocialProfile));
  const socialConnections: SocialConnection[] = socialProfiles.length > 1 ? socialProfiles.slice(1).map((p, i) => ({
    id: `SC-${tag}-${pad(i + 1)}`,
    profileId: socialProfiles[0].id,
    connectedProfileId: p.id,
    strength: 0.3 + rand() * 0.6,
    interactionCount: randInt(rand, 3, 60),
    type: pick(rand, ['mutual', 'frequent_contact', 'follows', 'group_member'] as SocialConnection['type'][]),
  })) : [];
  const socialActivity: SocialActivity[] = socialProfiles.map((p, i) => ({
    id: `SA-${tag}-${pad(i + 1)}`,
    profileId: p.id,
    timestamp: tsAgo(anchor, randInt(rand, 0, 6), randInt(rand, 7, 22), randInt(rand, 0, 59)),
    content: pick(rand, ['Checked in near freight yard', 'Shared a business update', 'Joined a private group', 'Posted from transit location']),
    type: pick(rand, ['post', 'login', 'share', 'message'] as SocialActivity['type'][]),
    locationId: pick(rand, locations).id,
  }));

  // ---- Calls ----
  const calls: CallRecord[] = [];
  const callCount = Math.max(8, Math.round(persons.length * 1.4));
  for (let i = 0; i < callCount; i++) {
    const a = pick(rand, phones);
    let b = pick(rand, phones);
    let guard = 0;
    while (b.id === a.id && guard++ < 5) b = pick(rand, phones);
    calls.push({
      id: `CL-${tag}-${pad(i + 1)}`,
      caseId,
      fromPhoneId: a.id,
      toPhoneId: b.id,
      timestamp: tsAgo(anchor, randInt(rand, 0, 25), randInt(rand, 6, 23), randInt(rand, 0, 59)),
      durationSeconds: randInt(rand, 15, 620),
      type: rand() > 0.1 ? 'voice' : 'sms',
      towerLocationId: pick(rand, locations).id,
      frequencyBand: pick(rand, ['high', 'medium', 'low'] as CallRecord['frequencyBand'][]),
    });
  }

  // ---- Transactions + criminal records ----
  const transactions: Transaction[] = [];
  const txCount = Math.max(6, Math.round(accounts.length * 1.6));
  for (let i = 0; i < txCount; i++) {
    const from = pick(rand, accounts);
    let to = pick(rand, accounts);
    let guard = 0;
    while (to.id === from.id && guard++ < 5) to = pick(rand, accounts);
    const flagged = rand() > 0.6;
    transactions.push({
      id: `TX-${tag}-${pad(i + 1)}`,
      caseId,
      fromAccountId: from.id,
      toAccountId: to.id,
      amount: randInt(rand, 8, 480) * 1000,
      currency: 'INR',
      timestamp: tsAgo(anchor, randInt(rand, 0, 22), randInt(rand, 8, 20), randInt(rand, 0, 59)),
      mode: pick(rand, MODES),
      narration: pick(rand, ['Consultancy fee', 'Vendor payment', 'Advance', 'Reimbursement', 'Loan repayment', 'Freight advance']),
      flagged,
    });
  }
  const criminalRecords: CriminalRecord[] = pickN(rand, persons, Math.min(persons.length, 3)).map((p, i) => ({
    id: `CR-${tag}-${pad(i + 1)}`,
    entityId: p.id,
    caseId,
    filedAt: tsAgo(anchor, randInt(rand, 400, 1800), 0, 0),
    firNumber: `FIR/${2019 + randInt(rand, 0, 6)}/${randInt(rand, 1000, 9999)}`,
    section: pick(rand, ['IPC 420, 120B', 'IPC 379', 'Customs Act 135', 'NDPS Act 8/22', 'PMLA 3/4', 'IT Act 66D']),
    charge: pick(rand, ['Cheating & Criminal Conspiracy', 'Theft', 'Evasion of Customs Duty', 'Smuggling', 'Money Laundering', 'Impersonation for Cheating']),
    status: pick(rand, ['under_investigation', 'charge_sheeted', 'convicted', 'closed'] as CriminalRecord['status'][]),
    station: `${locFor(i).name.split(' ')[0]} Police Station`,
  }));

  // ---- Evidence ----
  const evidenceSpecs: { type: Evidence['type']; title: string; entityIds: string[]; sourceRef: string; confidence: number; collectedBy: string }[] = [
    { type: 'face', title: `Facial match — ${primary.name} at ${locations[0]?.name ?? 'field location'}`, entityIds: [primary.id], sourceRef: `${cameras[0]?.id ?? 'CAM'} / ${faceDetections[0]?.id ?? 'FD'}`, confidence: faceDetections[0]?.confidence ?? 0.9, collectedBy: 'System — Face Recognition Module' },
    { type: 'cctv', title: `ANPR capture — ${vehicles[0]?.name ?? 'vehicle'} near ${locations[1]?.name ?? 'monitored zone'}`, entityIds: [vehicles[0]?.metadata.ownerId ?? primary.id, vehicles[0]?.id ?? ''], sourceRef: `${cameras[1]?.id ?? 'CAM'} / ${cctvEvents[0]?.id ?? 'CE'}`, confidence: 0.9 + rand() * 0.08, collectedBy: 'System — ANPR' },
    { type: 'financial', title: `Flagged transfer chain — ${transactions.filter((t) => t.flagged).length} suspicious transfers`, entityIds: pickN(rand, accounts, 2).map((a) => a.metadata.ownerId ?? a.id), sourceRef: transactions.filter((t) => t.flagged).slice(0, 3).map((t) => t.id).join(', ') || 'N/A', confidence: 0.8 + rand() * 0.15, collectedBy: `Analyst ${pick(rand, ['Meher Fatima', 'Rohan Kulkarni', 'Divya Kapoor', 'Farhan Sheikh'])}` },
    { type: 'document', title: `${documents[0]?.metadata.fileName ?? 'Document'} — seized record`, entityIds: [organizations[0]?.id ?? primary.id], sourceRef: documents[0]?.id ?? 'DOC', confidence: 0.85 + rand() * 0.1, collectedBy: 'Field Team' },
    { type: 'call', title: `High-frequency call pattern — ${persons.length} linked numbers`, entityIds: persons.slice(0, 2).map((p) => p.id), sourceRef: calls.slice(0, 4).map((c) => c.id).join(', '), confidence: 0.85 + rand() * 0.1, collectedBy: 'System — Call Analysis' },
    { type: 'forensic', title: `Device extraction — ${devices[0]?.name ?? 'seized device'}`, entityIds: [primary.id, devices[0]?.id ?? ''], sourceRef: `${devices[0]?.id ?? 'DEV'} / Cellebrite Report FR-${randInt(rand, 1000, 9999)}`, confidence: 0.82 + rand() * 0.12, collectedBy: `Forensic Analyst ${pick(rand, ['Divya Kapoor', 'Karan Mehta'])}` },
  ];
  const evidence: Evidence[] = evidenceSpecs.map((spec, i) => ({
    id: `EVD-${tag}-${pad(i + 1)}`,
    caseId,
    type: spec.type,
    title: spec.title,
    description: `Auto-generated intelligence record for Operation ${cfg.caseId.toUpperCase()} — ${spec.type} evidentiary source.`,
    collectedAt: tsAgo(anchor, randInt(rand, 1, 20), 10, 0),
    collectedBy: spec.collectedBy,
    entityIds: spec.entityIds.filter(Boolean),
    sourceRef: spec.sourceRef,
    confidence: spec.confidence,
    chainOfCustody: [
      { actor: 'System', action: 'Auto-captured / compiled', timestamp: tsAgo(anchor, randInt(rand, 1, 20), 10, 0) },
      { actor: spec.collectedBy, action: 'Reviewed and logged', timestamp: tsAgo(anchor, randInt(rand, 0, 10), 14, 0) },
    ],
    tags: [spec.type, cfg.theme],
  }));

  // ---- Alerts ----
  const alertSeeds: { severity: Alert['severity']; title: string; description: string; entityIds: string[]; source: string }[] = [
    { severity: 'high', title: `Facial match: ${primary.name} detected`, description: `Camera ${cameras[0]?.code ?? '—'} — confidence match at ${locations[0]?.name ?? 'monitored site'}.`, entityIds: [primary.id], source: 'Face Recognition Module' },
    { severity: 'critical', title: 'Layered transaction pattern detected', description: `Multiple transfers routed through linked accounts within 24 hours.`, entityIds: pickN(rand, accounts, 2).map((a) => a.metadata.ownerId ?? a.id), source: 'Financial Intelligence' },
    { severity: 'medium', title: 'New associate link established', description: `Movement correlation links two subjects at ${locations[1]?.name ?? 'a monitored location'}.`, entityIds: pickN(rand, persons, 2).map((p) => p.id), source: 'Network Analysis' },
    { severity: 'low', title: 'Vehicle re-entered monitored zone', description: `${vehicles[0]?.name ?? 'Vehicle'} re-entered a monitored perimeter.`, entityIds: [vehicles[0]?.id ?? ''], source: 'ANPR' },
  ];
  const alerts: Alert[] = alertSeeds.map((a, i) => ({
    id: `AL-${tag}-${pad(i + 1)}`,
    caseId,
    timestamp: tsAgo(anchor, randInt(rand, 0, 15), randInt(rand, 7, 22), randInt(rand, 0, 59)),
    severity: a.severity,
    title: a.title,
    description: a.description,
    entityIds: a.entityIds.filter(Boolean),
    acknowledged: i > 1,
    source: a.source,
  }));

  // ---- Timeline ----
  const timelineSeeds: { title: string; description: string; entityIds: string[]; eventType: TimelineEvent['eventType']; importance: TimelineEvent['importance']; daysAgo: number; locationId?: string }[] = [
    { title: 'Case opened', description: `Operation ${cfg.caseId.toUpperCase()} initiated following intelligence tip.`, entityIds: [primary.id], eventType: 'case', importance: 'medium', daysAgo: 68 },
    { title: `${documents[0]?.metadata.fileName ?? 'Document'} obtained`, description: 'Key document seized via field operation.', entityIds: [organizations[0]?.id ?? primary.id], eventType: 'document', importance: 'medium', daysAgo: 40, locationId: locations[0]?.id },
    { title: `Movement correlation: ${persons[0]?.name.split(' ')[0]} + ${persons[1]?.name.split(' ')[0] ?? 'associate'}`, description: 'Subjects captured together at a monitored junction.', entityIds: persons.slice(0, 2).map((p) => p.id), eventType: 'cctv', importance: 'medium', daysAgo: 20, locationId: locations[0]?.id },
    { title: 'Flagged transfer identified', description: 'Financial intelligence flags a layered transfer pattern.', entityIds: pickN(rand, accounts, 2).map((a) => a.metadata.ownerId ?? a.id), eventType: 'transaction', importance: 'high', daysAgo: 12 },
    { title: `Social activity observed — ${socialSubjects[0]?.name}`, description: 'Social media monitoring flags relevant profile activity.', entityIds: [socialSubjects[0]?.id ?? primary.id], eventType: 'social', importance: 'low', daysAgo: 9 },
    { title: `Facial match: ${primary.name}`, description: `Identified at ${locations[0]?.name ?? 'monitored location'} via CCTV network.`, entityIds: [primary.id], eventType: 'cctv', importance: 'high', daysAgo: 4, locationId: locations[0]?.id },
    { title: `Call: ${persons[0]?.name.split(' ')[0]} → ${persons[1]?.name.split(' ')[0] ?? 'associate'}`, description: 'High-frequency contact pattern continues.', entityIds: persons.slice(0, 2).map((p) => p.id), eventType: 'call', importance: 'medium', daysAgo: 1 },
  ];
  const timeline: TimelineEvent[] = timelineSeeds.map((t, i) => ({
    id: `TL-${tag}-${pad(i + 1)}`,
    caseId,
    timestamp: tsAgo(anchor, t.daysAgo, randInt(rand, 7, 22), randInt(rand, 0, 59)),
    title: t.title,
    description: t.description,
    entityIds: t.entityIds.filter(Boolean),
    locationId: t.locationId,
    eventType: t.eventType,
    source: 'Case Management',
    importance: t.importance,
  }));

  // ---- Cross-entity relationships (so the network graph is genuinely connected,
  //      not just a cluster of associate-to-associate edges) ----
  const relationships: Relationship[] = [];
  let relSeq = 1;
  const rel = (
    sourceId: string, targetId: string, type: Relationship['type'], label: string,
    strength: number, confidence: number, direction: Relationship['direction'] = 'directed',
  ) => {
    relationships.push({
      id: `REL-${tag}-${pad(relSeq++, 3)}`, caseId, sourceId, targetId, type, label, strength, confidence,
      direction, metadata: {}, sourceIds: [`src-gen-${tag}`], createdAt: anchor,
    });
  };

  phones.forEach((ph) => { const owner = ph.metadata.ownerId; if (owner) rel(owner, ph.id, 'owned', 'OWNS', 1, 1); });
  vehicles.forEach((v) => { const owner = v.metadata.ownerId; if (owner) rel(owner, v.id, 'owned', 'OWNS', 0.95, 0.95); });
  accounts.forEach((a) => { const owner = a.metadata.ownerId; if (owner) rel(owner, a.id, 'owned', 'OWNS', 1, 1); });
  devices.forEach((d) => { const owner = d.metadata.ownerId; if (owner) rel(owner, d.id, 'owned', 'OWNS', 0.9, 0.95); });
  organizations.forEach((o) => (o.metadata.memberIds ?? []).forEach((m, i) => rel(m, o.id, 'works_for', i === 0 ? 'DIRECTOR OF' : 'WORKS FOR', 0.85 - i * 0.05, 0.88)));
  persons.forEach((p, i) => { const home = locFor(i); rel(p.id, home.id, 'located_at', 'RESIDES / OPERATES NEAR', 0.8, 0.82, 'directed'); });
  transactions.filter((t) => t.flagged).slice(0, 6).forEach((t) => rel(t.fromAccountId, t.toAccountId, 'transferred_to', 'TRANSFERRED TO', 0.75, 0.8));
  documents.forEach((d, i) => rel(organizations[i % organizations.length]?.id ?? primary.id, d.id, 'associated', 'PARTY TO', 0.8, 0.85));
  cctvEvents.slice(0, 5).forEach((e) => { if (e.entityIds.length > 1) rel(e.entityIds[0], e.entityIds[1], 'appeared_near', 'SEEN WITH', 0.55, 0.6, 'undirected'); });

  return {
    locations, organizations, devices, accounts, documents, phones, vehicles,
    cameras, cctvEvents, movements, faceDetections,
    socialProfiles, socialConnections, socialActivity,
    calls, transactions, criminalRecords, ocrEntities,
    evidence, alerts, timeline, relationships,
  };
}

// ---- Case profiles ----

const OP002_PROFILE: CaseProfile = {
  caseId: 'case-op002', tag: '002', seed: 4002, anchor: '2026-09-03T18:05:00.000Z',
  persons: OP002_PERSONS,
  localities: [
    { name: 'Ratnagiri Fishing Harbour', lat: 16.9902, lng: 73.312, category: 'port_area' },
    { name: 'Malvan Jetty', lat: 16.0625, lng: 73.4644, category: 'port_area' },
    { name: 'Vengurla Creek', lat: 15.8544, lng: 73.6339, category: 'port_area' },
    { name: 'Devgad Market Road', lat: 16.3793, lng: 73.3821, category: 'commercial' },
    { name: 'Guhagar Residency', lat: 17.4833, lng: 73.1833, category: 'residential' },
    { name: 'Sawantwadi Transit Yard', lat: 15.9046, lng: 73.8143, category: 'transit_hub' },
  ],
  orgNames: [
    { name: 'Konkan Blue Marine Pvt Ltd', sector: 'Marine Exports' },
    { name: 'Sahyadri Coastal Traders', sector: 'General Trading' },
  ],
  vehicleModels: [{ make: 'Tata', model: 'Ace Pickup' }, { make: 'Mahindra', model: 'Bolero Camper' }, { make: 'Force', model: 'Traveller' }],
  plateState: 'MH',
  theme: 'coastal',
  documentTitles: [
    { fileName: 'BoatRegistration_SagarKanya2.pdf', fileType: 'identity', tags: ['identity', 'vessel'] },
    { fileName: 'ExportLicence_KonkanBlueMarine.pdf', fileType: 'contract', tags: ['contract', 'trade'] },
    { fileName: 'FuelLedger_Q3.pdf', fileType: 'financial', tags: ['financial'] },
  ],
};

const OP003_PROFILE: CaseProfile = {
  caseId: 'case-op003', tag: '003', seed: 4003, anchor: '2026-09-01T11:40:00.000Z',
  persons: OP003_PERSONS,
  localities: [
    { name: 'Connaught Place', lat: 28.6315, lng: 77.2167, category: 'commercial' },
    { name: 'Gurugram Cyber Hub', lat: 28.4949, lng: 77.0891, category: 'commercial' },
    { name: 'Noida Sector 62', lat: 28.6139, lng: 77.391, category: 'commercial' },
    { name: 'Chandigarh Sector 17', lat: 30.741, lng: 76.7828, category: 'commercial' },
    { name: 'Jaipur Vaishali Nagar', lat: 26.9124, lng: 75.7139, category: 'residential' },
    { name: 'Faridabad Industrial Estate', lat: 28.4089, lng: 77.3178, category: 'industrial' },
    { name: 'Sonipat Warehouse Cluster', lat: 28.9931, lng: 77.0151, category: 'industrial' },
  ],
  orgNames: [
    { name: 'Northstar Realty Ventures', sector: 'Real Estate' },
    { name: 'Chandra Buildwell Pvt Ltd', sector: 'Construction & Real Estate' },
    { name: 'Apex Benami Holdings', sector: 'Investment Holding' },
  ],
  vehicleModels: [{ make: 'Toyota', model: 'Fortuner' }, { make: 'Mahindra', model: 'XUV700' }, { make: 'Honda', model: 'City' }],
  plateState: 'DL',
  theme: 'realestate',
  documentTitles: [
    { fileName: 'SaleDeed_SonipatPlot14.pdf', fileType: 'property', tags: ['property'] },
    { fileName: 'BenamiDeclaration_ApexHoldings.pdf', fileType: 'financial', tags: ['financial', 'benami'] },
    { fileName: 'LoanAgreement_NorthstarRealty.pdf', fileType: 'contract', tags: ['contract'] },
    { fileName: 'ShellCompanyFilings_MCA.pdf', fileType: 'financial', tags: ['financial', 'shell'] },
  ],
};

const OP004_PROFILE: CaseProfile = {
  caseId: 'case-op004', tag: '004', seed: 4004, anchor: '2026-02-18T16:00:00.000Z',
  persons: OP004_PERSONS,
  localities: [
    { name: 'Hinjewadi IT Park', lat: 18.5913, lng: 73.7389, category: 'commercial' },
    { name: 'Nagpur Civil Lines', lat: 21.1499, lng: 79.0806, category: 'residential' },
    { name: 'Pune Camp', lat: 18.5122, lng: 73.8567, category: 'commercial' },
  ],
  orgNames: [
    { name: 'Zenlite BPO Services', sector: 'Business Process Outsourcing' },
    { name: 'Quickpay Fintech Solutions', sector: 'Fintech / Payments' },
  ],
  vehicleModels: [{ make: 'Maruti Suzuki', model: 'Baleno' }, { make: 'Hyundai', model: 'Verna' }],
  plateState: 'MH',
  theme: 'cyberfraud',
  documentTitles: [
    { fileName: 'ForgedKYC_MuleAccount07.pdf', fileType: 'identity', tags: ['identity', 'forged'] },
    { fileName: 'MuleAccountOpeningForm.pdf', fileType: 'financial', tags: ['financial'] },
    { fileName: 'ChargeSheet_SilentLedger.pdf', fileType: 'contract', tags: ['legal'] },
  ],
  closed: true,
};

const OP005_PROFILE: CaseProfile = {
  caseId: 'case-op005', tag: '005', seed: 4005, anchor: '2026-09-04T12:00:00.000Z',
  persons: OP005_PERSONS,
  localities: [
    { name: 'Jodhpur Transport Nagar', lat: 26.2389, lng: 73.0243, category: 'transit_hub' },
    { name: 'Barmer Border Checkpost', lat: 25.7521, lng: 71.3961, category: 'border_checkpoint' },
    { name: 'Kandla Port', lat: 23.0333, lng: 70.2167, category: 'port_area' },
    { name: 'Bhuj Industrial Area', lat: 23.242, lng: 69.6669, category: 'industrial' },
    { name: 'Ahmedabad Naroda GIDC', lat: 23.0731, lng: 72.665, category: 'industrial' },
    { name: 'Jaisalmer Transit Camp', lat: 26.9157, lng: 70.9083, category: 'transit_hub' },
  ],
  orgNames: [
    { name: 'Thar Logistics & Carriers', sector: 'Road Freight & Transport' },
    { name: 'Rann Exim Trading Co.', sector: 'Import / Export' },
  ],
  vehicleModels: [{ make: 'Tata', model: '1613 Container Truck' }, { make: 'Ashok Leyland', model: 'Cargo Truck' }, { make: 'Mahindra', model: 'Bolero Pickup' }],
  plateState: 'RJ',
  theme: 'narcotics',
  documentTitles: [
    { fileName: 'TransportPermit_TharLogistics.pdf', fileType: 'contract', tags: ['contract', 'transport'] },
    { fileName: 'HawalaLedger_Seized.pdf', fileType: 'financial', tags: ['financial', 'hawala'] },
    { fileName: 'CustomsManifest_KandlaPort.pdf', fileType: 'property', tags: ['customs'] },
  ],
};

export const OP002_BUNDLE = buildCaseBundle(OP002_PROFILE);
export const OP003_BUNDLE = buildCaseBundle(OP003_PROFILE);
export const OP004_BUNDLE = buildCaseBundle(OP004_PROFILE);
export const OP005_BUNDLE = buildCaseBundle(OP005_PROFILE);

export const ALL_BUNDLES = [OP002_BUNDLE, OP003_BUNDLE, OP004_BUNDLE, OP005_BUNDLE];
