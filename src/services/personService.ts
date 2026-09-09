// Real-backend person data access — talks to the Express API in server/
// (which reads the ingested Master Dataset from PostgreSQL) rather than the
// small in-memory mock dataset in src/data/. Person ID is always the
// authoritative key; names are for display only.
import { apiGet, NotFoundError } from './apiClient';
import type { PersonEntity, TimelineEvent } from '../types';

export interface ApiPersonSummary {
  person_id: string;
  name: string;
  alias: string | null;
  risk_level: string | null;
  status: string | null;
  city: string | null;
  nationality: string | null;
  occupation: string | null;
}

export interface ApiPersonDetail extends ApiPersonSummary {
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  state: string | null;
  country: string | null;
  email: string | null;
  passport: { passport_number: string } | null;
  counts: Record<string, string>;
  caseIds: string[];
}

/** Every generic `/api/persons/:id/<resource>` sub-resource route exposed by
 * server/index.js. Rows are returned as-is from Postgres (raw column names)
 * — the Person View renders them generically (see RecordListPanel) rather
 * than the frontend needing a bespoke type per table. `getFullPerson` above
 * predates this and independently fetches a name-only projection of
 * organizations/vehicles/phones/accounts/locations for older callers; this
 * list additionally covers those five in full-column form for the Person
 * View's per-category panels. */
export const PERSON_RECORD_RESOURCES = [
  'accounts',
  'phones',
  'devices',
  'vehicles',
  'social-media',
  'organizations',
  'properties',
  'transactions',
  'calls',
  'travel',
  'cctv',
  'face-recognition',
  'documents',
  'criminal-records',
  'court-records',
  'evidence',
  'alerts',
  'investigations',
  'locations',
] as const;
export type PersonRecordResource = (typeof PERSON_RECORD_RESOURCES)[number];

export type PersonRecordRow = Record<string, string | number | boolean | null>;

function riskLevel(r: string | null | undefined): PersonEntity['riskLevel'] {
  const v = (r ?? '').toLowerCase();
  return v === 'critical' || v === 'high' || v === 'medium' || v === 'low' ? v : 'unknown';
}

/** Minimal-but-type-complete PersonEntity used by the Case Builder's search/select
 * flow (EntityPicker) and anywhere else the app expects the generic Entity shape. */
export function toPersonEntity(p: ApiPersonSummary): PersonEntity {
  return {
    id: p.person_id,
    caseIds: [],
    type: 'person',
    name: p.name,
    status: (p.status ?? '').toLowerCase() === 'active' ? 'active' : 'inactive',
    riskLevel: riskLevel(p.risk_level),
    metadata: { nationality: p.nationality ?? undefined, occupation: p.occupation ?? undefined },
    sourceIds: ['master-dataset'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/** Full-detail conversion (identity panel needs DOB/address/gender/passport
 * too, which the search-result summary above doesn't carry). Shared by
 * `getFullPerson` and any page (Person View) that fetches the detail record
 * directly. */
export function toPersonEntityFromDetail(detail: ApiPersonDetail): PersonEntity {
  return {
    id: detail.person_id,
    caseIds: detail.caseIds,
    type: 'person',
    name: detail.name,
    status: (detail.status ?? '').toLowerCase() === 'active' ? 'active' : 'inactive',
    riskLevel: riskLevel(detail.risk_level),
    metadata: {
      dateOfBirth: detail.date_of_birth ?? undefined,
      nationality: detail.nationality ?? undefined,
      occupation: detail.occupation ?? undefined,
      address: detail.address ? `${detail.address}${detail.city ? `, ${detail.city}` : ''}` : undefined,
      gender: detail.gender ?? undefined,
      idNumber: detail.passport?.passport_number,
    },
    sourceIds: ['master-dataset'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function dedupeIds(ids: Iterable<string>): string[] {
  return [...new Set([...ids].filter(Boolean))];
}

export const personService = {
  /** Person search against the real backend — by name OR Person ID. Paginated;
   * never returns more than `limit` at a time. */
  async search(query: string, limit = 8): Promise<PersonEntity[]> {
    const q = query.trim();
    if (!q) return [];
    const res = await apiGet<{ data: ApiPersonSummary[] }>(`/api/persons?search=${encodeURIComponent(q)}&limit=${limit}`);
    return res.data.map(toPersonEntity);
  },

  async getPersonRaw(personId: string): Promise<ApiPersonDetail | null> {
    try {
      return await apiGet<ApiPersonDetail>(`/api/persons/${encodeURIComponent(personId)}`);
    } catch (err) {
      if (err instanceof NotFoundError) return null;
      throw err;
    }
  },

  /** Full dossier for the Person View: identity + resolved (name-bearing)
   * associated records, fetched from the real backend in parallel. Returns
   * null if this Person ID doesn't exist in the master dataset (caller
   * should then fall back to the legacy mock dataset for old demo cases). */
  async getFullPerson(personId: string): Promise<{
    person: PersonEntity;
    idNumber?: string;
    associations: { organizations: { id: string; name: string }[]; vehicles: { id: string; name: string }[]; phones: { id: string; name: string }[]; accounts: { id: string; name: string }[]; locations: { id: string; name: string }[] };
    caseIds: string[];
  } | null> {
    const detail = await this.getPersonRaw(personId);
    if (!detail) return null;

    const [orgs, vehicles, phones, accounts, locations] = await Promise.all([
      apiGet<{ data: { organization_id: string; name: string | null }[] }>(`/api/persons/${personId}/organizations`).catch(() => ({ data: [] })),
      apiGet<{ data: { vehicle_id: string; registration_number: string | null }[] }>(`/api/persons/${personId}/vehicles`).catch(() => ({ data: [] })),
      apiGet<{ data: { phone_id: string; phone_number: string | null }[] }>(`/api/persons/${personId}/phones`).catch(() => ({ data: [] })),
      apiGet<{ data: { account_id: string; bank_name: string | null; account_number: string | null }[] }>(`/api/persons/${personId}/accounts`).catch(() => ({ data: [] })),
      apiGet<{ data: { location_id: string }[] }>(`/api/persons/${personId}/locations`).catch(() => ({ data: [] })),
    ]);

    return {
      person: toPersonEntityFromDetail(detail),
      idNumber: detail.passport?.passport_number,
      associations: {
        organizations: orgs.data.map((o) => ({ id: o.organization_id, name: o.name || o.organization_id })),
        vehicles: vehicles.data.map((v) => ({ id: v.vehicle_id, name: v.registration_number || v.vehicle_id })),
        phones: phones.data.map((p) => ({ id: p.phone_id, name: p.phone_number || p.phone_id })),
        accounts: accounts.data.map((a) => ({ id: a.account_id, name: [a.bank_name, a.account_number].filter(Boolean).join(' • ') || a.account_id })),
        locations: locations.data.map((l) => ({ id: l.location_id, name: l.location_id })),
      },
      caseIds: detail.caseIds,
    };
  },

  /** One generic person-scoped sub-resource (see PERSON_RECORD_RESOURCES).
   * These routes always respond 200 with `{ data: [] }` when there are no
   * rows — they never 404 — so the only error that can surface here is a
   * genuinely unreachable/failed backend (ApiUnavailableError, or a 5xx),
   * which callers should treat as "backend unavailable", never as "empty". */
  async getRecords(personId: string, resource: PersonRecordResource): Promise<PersonRecordRow[]> {
    const res = await apiGet<{ data: PersonRecordRow[] }>(`/api/persons/${encodeURIComponent(personId)}/${resource}`);
    return res.data;
  },

  async getRecordsForPeople(personIds: string[], resource: PersonRecordResource): Promise<Array<PersonRecordRow & { personId: string }>> {
    const ids = dedupeIds(personIds);
    if (ids.length === 0) return [];

    const batches = await Promise.all(
      ids.map(async (personId) => {
        try {
          const rows = await this.getRecords(personId, resource);
          return rows.map((row) => ({ ...row, personId }));
        } catch {
          return [] as Array<PersonRecordRow & { personId: string }>;
        }
      }),
    );

    return batches.flat();
  },

  /** Every remaining sub-resource in one call, for the Person View. Throws
   * (propagating ApiUnavailableError) if the backend can't be reached at
   * all, rather than masking a down backend as "no records". */
  async getAllRecords(personId: string): Promise<Record<PersonRecordResource, PersonRecordRow[]>> {
    const entries = await Promise.all(
      PERSON_RECORD_RESOURCES.map(async (resource) => [resource, await this.getRecords(personId, resource)] as const),
    );
    return Object.fromEntries(entries) as Record<PersonRecordResource, PersonRecordRow[]>;
  },

  async getRelationships(personId: string): Promise<{ entity: { id: string; name: string }; relationship: { label: string } }[]> {
    const res = await apiGet<{
      accountRelationships: { related_person_id: string | null; related_person_name: string | null; relationship_type: string | null }[];
      personRelationships: { related_person_id: string | null; related_person_name: string | null; relationship_type: string | null }[];
    }>(`/api/persons/${personId}/relationships`);
    const all = [...res.accountRelationships, ...res.personRelationships];
    return all
      .filter((r) => r.related_person_id)
      .map((r) => ({ entity: { id: r.related_person_id as string, name: r.related_person_name || (r.related_person_id as string) }, relationship: { label: r.relationship_type || 'RELATED' } }));
  },

  async getTimeline(personId: string): Promise<TimelineEvent[]> {
    const res = await apiGet<{ data: { date: string; type: string; label: string | null; ref_id: string }[] }>(`/api/persons/${personId}/timeline`);
    return res.data.map((ev) => ({
      id: ev.ref_id,
      caseId: '',
      timestamp: ev.date,
      title: `${ev.label ?? ev.type.toUpperCase()} · ${ev.ref_id}`,
      entityIds: [personId],
      eventType: (['call', 'transaction', 'cctv', 'document'].includes(ev.type) ? ev.type : 'case') as TimelineEvent['eventType'],
      source: 'Master Dataset',
      importance: 'medium',
    }));
  },

  async getNetwork(personId: string, depth = 1): Promise<{ nodes: { id: string; name: string; riskLevel: string | null }[]; edges: { source: string; target: string; type: string; label: string | null }[] }> {
    return apiGet(`/api/persons/${personId}/network?depth=${depth}`);
  },
};
