// TRINETRA backend API — serves the ingested Master Dataset from PostgreSQL.
// Excel -> ingest.py -> Postgres -> (this file) -> existing TRINETRA frontend.
//
// Every list endpoint is paginated and every detail endpoint is scoped to a
// single person/case — the 100k-row dataset is never sent to the browser in
// bulk (see README "Performance" section).
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pg from 'pg';

const { Pool } = pg;

// PostgreSQL DATE columns arrive from node-postgres as JS Date objects by
// default. When a route does res.json(...), JSON.stringify() then calls
// Date#toISOString(), which shifts to UTC and adds a time-of-day component
// -- e.g. a stored DATE of 2025-04-01 becomes "2025-03-31T18:30:00.000Z"
// for a server running in IST (UTC+5:30). A DATE has no time-of-day or
// timezone component, so keep it as the plain "YYYY-MM-DD" text Postgres
// already sends on the wire. This is registered once, globally, on the
// driver's type parser -- it fixes every DATE column returned by every
// route (cases.opened_date/closed_date, persons.date_of_birth,
// case_narrative_notes.event_date, transactions.txn_date, etc.), not just
// one endpoint. TIMESTAMPTZ columns (e.g. case_narrative_notes.created_at)
// are unaffected and keep their existing full-instant serialization, which
// is correct for them. event_time / call_time are stored as TEXT, not a
// native TIME type, so they were never affected by this and already come
// back as plain "HH:MM:SS" strings.
// Canonical node-postgres fix: register a raw-passthrough parser directly
// on the DATE OID (1082), rather than relying on `pg.types.builtins.DATE`
// resolving correctly -- this is the literal, driver-documented form.
const DATE_OID = 1082;
pg.types.setTypeParser(DATE_OID, (val) => val);

// --- TEMPORARY DIAGNOSTIC -------------------------------------------------
// Proves, at process boot, whether the override above actually took effect
// on the exact object graph pg's Client/Result use to parse query rows
// (Client -> TypeOverrides -> falls back to the global pg-types registry
// we just patched). If the API still returns a shifted ISO timestamp for
// event_date after seeing "OK" logged here, the running process is not
// this file (e.g. a stale server still bound to the port from before this
// fix was saved) -- restart it fully rather than editing code further.
// Remove this block once the API is confirmed to return plain
// "YYYY-MM-DD" strings.
{
  const registered = pg.types.getTypeParser(DATE_OID, 'text');
  const sample = '2014-01-22';
  const parsed = registered(sample);
  const ok = parsed === sample;
  console.log('[date-parser-diagnostic] builtins.DATE OID =', pg.types.builtins.DATE, '(expected 1082)');
  console.log('[date-parser-diagnostic] registered parser source:', registered.toString());
  console.log(`[date-parser-diagnostic] test parse("${sample}") ->`, JSON.stringify(parsed));
  if (!ok) {
    console.error('[date-parser-diagnostic] *** DATE TYPE PARSER OVERRIDE DID NOT TAKE EFFECT ***');
    console.error('[date-parser-diagnostic] Expected the parser to return the raw string unchanged, got:', parsed);
    console.error('[date-parser-diagnostic] This means either a different pg/pg-types module instance is');
    console.error('[date-parser-diagnostic] being used by the Pool than the one patched here, or this file');
    console.error('[date-parser-diagnostic] is not the code actually running -- check for a stale process.');
  } else {
    console.log('[date-parser-diagnostic] OK -- DATE OID 1082 now returns plain strings.');
  }
}
// ---------------------------------------------------------------------------

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://trinetra:trinetra_dev_pw@localhost:5432/trinetra',
});

const app = express();
app.use(cors());
app.use(express.json());

function page(req) {
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const p = Math.max(parseInt(req.query.page, 10) || 1, 1);
  return { limit, offset: (p - 1) * limit, p };
}

async function q(text, params) {
  const r = await pool.query(text, params);
  return r.rows;
}

function asyncRoute(fn) {
  return (req, res) => fn(req, res).catch((err) => {
    console.error(err);
    res.status(500).json({ error: 'internal_error', message: err.message });
  });
}

// ---------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------
app.get('/api/health', asyncRoute(async (_req, res) => {
  const [{ count }] = await q('SELECT count(*)::int AS count FROM persons');
  res.json({ ok: true, personCount: count });
}));

// ---------------------------------------------------------------------
// Persons
// ---------------------------------------------------------------------
app.get('/api/persons', asyncRoute(async (req, res) => {
  const { limit, offset, p } = page(req);
  const search = (req.query.search || '').trim();
  let rows, total;
  if (search) {
    const isIdLike = /^p-?\d+$/i.test(search.replace(/\s+/g, ''));
    const idParam = isIdLike ? `%${search.replace(/\s+/g, '').toUpperCase()}%` : `%${search}%`;
    rows = await q(
      `SELECT person_id, name, alias, risk_level, status, city, nationality, occupation
       FROM persons
       WHERE person_id ILIKE $1 OR name ILIKE $2
       ORDER BY name ASC LIMIT $3 OFFSET $4`,
      [idParam, `%${search}%`, limit, offset],
    );
    const [{ count }] = await q(
      `SELECT count(*)::int AS count FROM persons WHERE person_id ILIKE $1 OR name ILIKE $2`,
      [idParam, `%${search}%`],
    );
    total = count;
  } else {
    rows = await q(
      `SELECT person_id, name, alias, risk_level, status, city, nationality, occupation
       FROM persons ORDER BY name ASC LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
    const [{ count }] = await q('SELECT count(*)::int AS count FROM persons');
    total = count;
  }
  res.json({ data: rows, page: p, limit, total });
}));

app.get('/api/persons/:personId', asyncRoute(async (req, res) => {
  const { personId } = req.params;
  const [person] = await q('SELECT * FROM persons WHERE person_id = $1', [personId]);
  if (!person) return res.status(404).json({ error: 'not_found' });
  const [passport] = await q('SELECT * FROM passports WHERE person_id = $1', [personId]);
  const counts = await q(
    `SELECT
       (SELECT count(*) FROM accounts WHERE person_id=$1) AS accounts,
       (SELECT count(*) FROM phones_sim WHERE person_id=$1) AS phones,
       (SELECT count(*) FROM devices WHERE person_id=$1) AS devices,
       (SELECT count(*) FROM vehicles WHERE person_id=$1) AS vehicles,
       (SELECT count(*) FROM social_media WHERE person_id=$1) AS social_media,
       (SELECT count(*) FROM properties WHERE person_id=$1) AS properties,
       (SELECT count(*) FROM transactions WHERE person_id=$1) AS transactions,
       (SELECT count(*) FROM calls WHERE person_id=$1) AS calls,
       (SELECT count(*) FROM travel WHERE person_id=$1) AS travel,
       (SELECT count(*) FROM cctv WHERE person_id=$1) AS cctv,
       (SELECT count(*) FROM face_recognition WHERE person_id=$1) AS face_recognition,
       (SELECT count(*) FROM documents WHERE person_id=$1) AS documents,
       (SELECT count(*) FROM criminal_records WHERE person_id=$1) AS criminal_records,
       (SELECT count(*) FROM court_records WHERE person_id=$1) AS court_records,
       (SELECT count(*) FROM evidence WHERE person_id=$1) AS evidence,
       (SELECT count(*) FROM alerts WHERE person_id=$1) AS alerts,
       (SELECT count(*) FROM investigations WHERE person_id=$1) AS investigations,
       (SELECT count(*) FROM case_persons WHERE person_id=$1) AS cases
    `,
    [personId],
  );
  const caseIds = await q('SELECT case_id FROM case_persons WHERE person_id=$1', [personId]);
  res.json({ ...person, passport: passport || null, counts: counts[0], caseIds: caseIds.map((r) => r.case_id) });
}));

// Generic person-scoped sub-resource endpoints -------------------------
const subResources = {
  accounts: 'SELECT * FROM accounts WHERE person_id=$1 ORDER BY account_id',
  phones: 'SELECT * FROM phones_sim WHERE person_id=$1 ORDER BY phone_id',
  devices: 'SELECT * FROM devices WHERE person_id=$1 ORDER BY device_id',
  vehicles: 'SELECT * FROM vehicles WHERE person_id=$1 ORDER BY vehicle_id',
  'social-media': 'SELECT * FROM social_media WHERE person_id=$1 ORDER BY social_account_id',
  properties: 'SELECT * FROM properties WHERE person_id=$1 ORDER BY property_id',
  transactions: 'SELECT * FROM transactions WHERE person_id=$1 ORDER BY txn_date DESC NULLS LAST',
  calls: 'SELECT * FROM calls WHERE person_id=$1 ORDER BY call_date DESC NULLS LAST',
  travel: 'SELECT * FROM travel WHERE person_id=$1 ORDER BY departure_date DESC NULLS LAST',
  cctv: 'SELECT * FROM cctv WHERE person_id=$1 ORDER BY event_date DESC NULLS LAST',
  'face-recognition': 'SELECT * FROM face_recognition WHERE person_id=$1 ORDER BY match_date DESC NULLS LAST',
  documents: 'SELECT * FROM documents WHERE person_id=$1 ORDER BY issue_date DESC NULLS LAST',
  'criminal-records': 'SELECT * FROM criminal_records WHERE person_id=$1 ORDER BY incident_date DESC NULLS LAST',
  'court-records': 'SELECT * FROM court_records WHERE person_id=$1 ORDER BY hearing_date DESC NULLS LAST',
  evidence: 'SELECT * FROM evidence WHERE person_id=$1 ORDER BY collection_date DESC NULLS LAST',
  alerts: 'SELECT * FROM alerts WHERE person_id=$1 ORDER BY created_date DESC NULLS LAST',
  investigations: 'SELECT * FROM investigations WHERE person_id=$1 ORDER BY start_date DESC NULLS LAST',
  organizations: `SELECT o.* FROM organizations o JOIN person_organizations po ON po.organization_id=o.organization_id WHERE po.person_id=$1`,
  locations: `SELECT l.* FROM locations l JOIN person_locations pl ON pl.location_id=l.location_id WHERE pl.person_id=$1`,
};
for (const [path, sql] of Object.entries(subResources)) {
  app.get(`/api/persons/:personId/${path}`, asyncRoute(async (req, res) => {
    res.json({ data: await q(sql, [req.params.personId]) });
  }));
}

app.get('/api/persons/:personId/relationships', asyncRoute(async (req, res) => {
  const { personId } = req.params;
  const account = await q('SELECT * FROM account_relationships WHERE person_id=$1', [personId]);
  const direct = await q('SELECT * FROM person_relationships WHERE person_id=$1', [personId]);
  res.json({ accountRelationships: account, personRelationships: direct });
}));

// Network — 1-hop (default) or 2-hop graph around a person, built from
// actual relationship/transaction/call records. Capped so the browser never
// has to render the whole 100k-person graph.
app.get('/api/persons/:personId/network', asyncRoute(async (req, res) => {
  const { personId } = req.params;
  const depth = Math.min(parseInt(req.query.depth, 10) || 1, 2);
  const cap = Math.min(parseInt(req.query.limit, 10) || 40, 100);

  const [center] = await q('SELECT person_id, name, risk_level FROM persons WHERE person_id=$1', [personId]);
  if (!center) return res.status(404).json({ error: 'not_found' });

  const nodes = new Map([[center.person_id, { id: center.person_id, name: center.name, riskLevel: center.risk_level, type: 'person' }]]);
  const edges = [];
  let frontier = [personId];

  for (let hop = 0; hop < depth && nodes.size < cap; hop++) {
    const next = [];
    for (const pid of frontier) {
      if (nodes.size >= cap) break;
      const rels = await q(
        `SELECT related_person_id AS other, relationship_type AS label, 'relationship' AS kind FROM person_relationships WHERE person_id=$1 AND related_person_id IS NOT NULL
         UNION ALL
         SELECT related_person_id AS other, relationship_type AS label, 'account' AS kind FROM account_relationships WHERE person_id=$1 AND related_person_id IS NOT NULL
         UNION ALL
         SELECT counterparty_person_id AS other, transaction_type AS label, 'transaction' AS kind FROM transactions WHERE person_id=$1 AND counterparty_person_id IS NOT NULL
         UNION ALL
         SELECT counterparty_person_id AS other, call_type AS label, 'call' AS kind FROM calls WHERE person_id=$1 AND counterparty_person_id IS NOT NULL
         LIMIT $2`,
        [pid, cap],
      );
      for (const r of rels) {
        if (nodes.size >= cap) break;
        edges.push({ source: pid, target: r.other, type: r.kind, label: r.label });
        if (!nodes.has(r.other)) next.push(r.other);
      }
    }
    if (next.length) {
      const found = await q(
        `SELECT person_id, name, risk_level FROM persons WHERE person_id = ANY($1::text[])`,
        [next],
      );
      for (const p of found) {
        if (!nodes.has(p.person_id) && nodes.size < cap) {
          nodes.set(p.person_id, { id: p.person_id, name: p.name, riskLevel: p.risk_level, type: 'person' });
        }
      }
    }
    frontier = next;
  }

  res.json({ nodes: [...nodes.values()], edges: edges.filter((e) => nodes.has(e.source) && nodes.has(e.target)) });
}));

// Timeline — union of every dated record for this person, sorted.
app.get('/api/persons/:personId/timeline', asyncRoute(async (req, res) => {
  const { personId } = req.params;
  const limit = Math.min(parseInt(req.query.limit, 10) || 200, 500);
  const rows = await q(
    `
    SELECT txn_date AS date, 'transaction' AS type, transaction_type AS label, transaction_id AS ref_id FROM transactions WHERE person_id=$1 AND txn_date IS NOT NULL
    UNION ALL
    SELECT call_date, 'call', call_type, call_id FROM calls WHERE person_id=$1 AND call_date IS NOT NULL
    UNION ALL
    SELECT departure_date, 'travel', travel_type, travel_id FROM travel WHERE person_id=$1 AND departure_date IS NOT NULL
    UNION ALL
    SELECT event_date, 'cctv', event_type, cctv_event_id FROM cctv WHERE person_id=$1 AND event_date IS NOT NULL
    UNION ALL
    SELECT incident_date, 'criminal_record', offence, criminal_record_id FROM criminal_records WHERE person_id=$1 AND incident_date IS NOT NULL
    UNION ALL
    SELECT hearing_date, 'court_record', case_type, court_record_id FROM court_records WHERE person_id=$1 AND hearing_date IS NOT NULL
    UNION ALL
    SELECT collection_date, 'evidence', evidence_type, evidence_id FROM evidence WHERE person_id=$1 AND collection_date IS NOT NULL
    UNION ALL
    SELECT created_date, 'alert', alert_type, alert_id FROM alerts WHERE person_id=$1 AND created_date IS NOT NULL
    ORDER BY date DESC
    LIMIT $2
    `,
    [personId, limit],
  );
  res.json({ data: rows });
}));

// ---------------------------------------------------------------------
// Cases
// ---------------------------------------------------------------------
app.get('/api/cases', asyncRoute(async (req, res) => {
  const { limit, offset, p } = page(req);
  const search = (req.query.search || '').trim();
  const params = search ? [`%${search}%`, limit, offset] : [limit, offset];
  const where = search ? 'WHERE case_id ILIKE $1 OR title ILIKE $1 OR case_number ILIKE $1' : '';
  const rows = await q(`SELECT * FROM cases ${where} ORDER BY opened_date DESC NULLS LAST LIMIT $${search ? 2 : 1} OFFSET $${search ? 3 : 2}`, params);
  const [{ count }] = await q(`SELECT count(*)::int AS count FROM cases ${where}`, search ? [`%${search}%`] : []);
  res.json({ data: rows, page: p, limit, total: count });
}));

app.get('/api/cases/:caseId', asyncRoute(async (req, res) => {
  const { caseId } = req.params;
  const [caseRow] = await q('SELECT * FROM cases WHERE case_id=$1', [caseId]);
  if (!caseRow) return res.status(404).json({ error: 'not_found' });
  const persons = await q(
    `SELECT p.person_id, p.name, p.risk_level, p.status FROM persons p
     JOIN case_persons cp ON cp.person_id = p.person_id WHERE cp.case_id=$1`,
    [caseId],
  );
  const evidence = await q('SELECT * FROM evidence WHERE case_id=$1', [caseId]);
  const alerts = await q('SELECT * FROM alerts WHERE case_id=$1', [caseId]);
  const investigations = await q('SELECT * FROM investigations WHERE case_id=$1', [caseId]);
  const narrative = await q(
    'SELECT * FROM case_narrative_notes WHERE case_id=$1 ORDER BY event_date NULLS LAST, created_at',
    [caseId],
  );
  res.json({ ...caseRow, persons, evidence, alerts, investigations, narrative });
}));

// Case-narrative notes for a case (CONNECTION_BASIS and/or TIMELINE_EVENT),
// populated separately by server/ingest_case_narrative.py -- never by the
// main Master Dataset ingestion.
app.get('/api/cases/:caseId/narrative', asyncRoute(async (req, res) => {
  const { caseId } = req.params;
  const kind = req.query.kind; // CONNECTION_BASIS | TIMELINE_EVENT
  const rows = kind
    ? await q(
        'SELECT * FROM case_narrative_notes WHERE case_id=$1 AND kind=$2 ORDER BY event_date NULLS LAST, created_at',
        [caseId, kind],
      )
    : await q(
        'SELECT * FROM case_narrative_notes WHERE case_id=$1 ORDER BY event_date NULLS LAST, created_at',
        [caseId],
      );
  res.json({ data: rows });
}));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`TRINETRA API listening on :${port}`));
