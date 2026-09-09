-- TRINETRA Master Dataset — normalized PostgreSQL schema.
-- Person ID is the authoritative identifier everywhere. Names are display
-- data only and are never used to resolve or deduplicate a person.
--
-- Safely re-runnable: ingest.py truncates every table below (except
-- `persons`, which is upserted) and reloads it from the Excel master
-- dataset each run, so this file can also be re-applied at any time.

CREATE TABLE IF NOT EXISTS persons (
  person_id     TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  alias         TEXT,
  date_of_birth DATE,
  gender        TEXT,
  nationality   TEXT,
  occupation    TEXT,
  address       TEXT,
  city          TEXT,
  state         TEXT,
  country       TEXT,
  email         TEXT,
  risk_level    TEXT,
  status        TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_persons_name ON persons (lower(name));
CREATE INDEX IF NOT EXISTS idx_persons_risk ON persons (risk_level);

CREATE TABLE IF NOT EXISTS passports (
  passport_id      TEXT PRIMARY KEY,
  person_id        TEXT UNIQUE REFERENCES persons(person_id),
  passport_number  TEXT,
  nationality      TEXT,
  issue_date       DATE,
  expiry_date      DATE,
  issuing_country  TEXT,
  status           TEXT
);

CREATE TABLE IF NOT EXISTS accounts (
  account_id      TEXT PRIMARY KEY,
  person_id       TEXT REFERENCES persons(person_id),
  account_type    TEXT,
  bank_name       TEXT,
  branch          TEXT,
  account_number  TEXT,
  status          TEXT,
  opening_date    DATE,
  closing_date    DATE,
  balance_band    TEXT,
  risk_level      TEXT
);
CREATE INDEX IF NOT EXISTS idx_accounts_person ON accounts (person_id);

CREATE TABLE IF NOT EXISTS phones_sim (
  phone_id          TEXT PRIMARY KEY,
  person_id         TEXT REFERENCES persons(person_id),
  phone_number      TEXT,
  sim_id            TEXT,
  carrier           TEXT,
  activation_date   DATE,
  deactivation_date DATE,
  status            TEXT
);
CREATE INDEX IF NOT EXISTS idx_phones_person ON phones_sim (person_id);

CREATE TABLE IF NOT EXISTS devices (
  device_id     TEXT PRIMARY KEY,
  person_id     TEXT REFERENCES persons(person_id),
  device_type   TEXT,
  manufacturer  TEXT,
  model         TEXT,
  imei          TEXT,
  os            TEXT,
  first_seen    DATE,
  last_seen     DATE,
  status        TEXT
);
CREATE INDEX IF NOT EXISTS idx_devices_person ON devices (person_id);

CREATE TABLE IF NOT EXISTS vehicles (
  vehicle_id            TEXT PRIMARY KEY,
  person_id             TEXT REFERENCES persons(person_id),
  registration_number   TEXT,
  vehicle_type          TEXT,
  make                  TEXT,
  model                 TEXT,
  color                 TEXT,
  registration_date     DATE,
  ownership_status      TEXT
);
CREATE INDEX IF NOT EXISTS idx_vehicles_person ON vehicles (person_id);

CREATE TABLE IF NOT EXISTS social_media (
  social_account_id  TEXT PRIMARY KEY,
  person_id          TEXT REFERENCES persons(person_id),
  platform           TEXT,
  username           TEXT,
  profile_name       TEXT,
  created_date       DATE,
  status             TEXT,
  follower_band      TEXT,
  risk_level         TEXT
);
CREATE INDEX IF NOT EXISTS idx_social_person ON social_media (person_id);

CREATE TABLE IF NOT EXISTS properties (
  property_id        TEXT PRIMARY KEY,
  person_id          TEXT REFERENCES persons(person_id),
  property_type      TEXT,
  address            TEXT,
  location_id        TEXT,
  ownership_date     DATE,
  ownership_status   TEXT,
  value_band         TEXT
);
CREATE INDEX IF NOT EXISTS idx_properties_person ON properties (person_id);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties (location_id);

CREATE TABLE IF NOT EXISTS transactions (
  transaction_id            TEXT PRIMARY KEY,
  person_id                 TEXT REFERENCES persons(person_id),
  own_account_id            TEXT,
  counterparty_account_id   TEXT,
  counterparty_person_id    TEXT REFERENCES persons(person_id),
  transaction_type          TEXT,
  amount                    NUMERIC,
  currency                  TEXT,
  txn_date                  DATE,
  txn_time                  TEXT,
  channel                   TEXT,
  merchant                  TEXT,
  location_id               TEXT,
  reference_number          TEXT,
  status                    TEXT,
  risk_score                NUMERIC
);
CREATE INDEX IF NOT EXISTS idx_txn_person ON transactions (person_id);
CREATE INDEX IF NOT EXISTS idx_txn_counterparty ON transactions (counterparty_person_id);
CREATE INDEX IF NOT EXISTS idx_txn_date ON transactions (txn_date);

CREATE TABLE IF NOT EXISTS calls (
  call_id                  TEXT PRIMARY KEY,
  person_id                TEXT REFERENCES persons(person_id),
  caller_phone_id          TEXT,
  receiver_phone_id        TEXT,
  counterparty_person_id   TEXT REFERENCES persons(person_id),
  call_type                TEXT,
  call_date                DATE,
  call_time                TEXT,
  duration                 TEXT,
  location_id              TEXT,
  device_id                TEXT,
  risk_score               NUMERIC
);
CREATE INDEX IF NOT EXISTS idx_calls_person ON calls (person_id);
CREATE INDEX IF NOT EXISTS idx_calls_counterparty ON calls (counterparty_person_id);
CREATE INDEX IF NOT EXISTS idx_calls_date ON calls (call_date);

CREATE TABLE IF NOT EXISTS travel (
  travel_id                    TEXT PRIMARY KEY,
  person_id                    TEXT REFERENCES persons(person_id),
  ticket_id                    TEXT,
  travel_type                  TEXT,
  booking_date                 DATE,
  departure_date                DATE,
  departure_time                TEXT,
  arrival_date                  DATE,
  arrival_time                  TEXT,
  origin_location_id            TEXT,
  destination_location_id       TEXT,
  booking_reference             TEXT,
  seat_class                    TEXT,
  payment_account_id            TEXT,
  vehicle_or_flight_number      TEXT,
  status                        TEXT
);
CREATE INDEX IF NOT EXISTS idx_travel_person ON travel (person_id);
CREATE INDEX IF NOT EXISTS idx_travel_departure ON travel (departure_date);

CREATE TABLE IF NOT EXISTS cctv (
  cctv_event_id   TEXT PRIMARY KEY,
  person_id       TEXT REFERENCES persons(person_id),
  camera_id       TEXT,
  location_id     TEXT,
  vehicle_id      TEXT,
  event_date      DATE,
  event_time      TEXT,
  event_type      TEXT,
  direction       TEXT,
  confidence      NUMERIC,
  image_reference TEXT,
  risk_score      NUMERIC
);
CREATE INDEX IF NOT EXISTS idx_cctv_person ON cctv (person_id);
CREATE INDEX IF NOT EXISTS idx_cctv_location ON cctv (location_id);

CREATE TABLE IF NOT EXISTS face_recognition (
  face_match_id         TEXT PRIMARY KEY,
  person_id             TEXT REFERENCES persons(person_id),
  cctv_event_id         TEXT REFERENCES cctv(cctv_event_id),
  detected_name         TEXT,
  confidence            NUMERIC,
  match_date            DATE,
  match_time            TEXT,
  verification_status   TEXT,
  evidence_id           TEXT
);
CREATE INDEX IF NOT EXISTS idx_face_person ON face_recognition (person_id);

CREATE TABLE IF NOT EXISTS documents (
  document_id           TEXT PRIMARY KEY,
  person_id             TEXT REFERENCES persons(person_id),
  organization_id       TEXT,
  case_id               TEXT,
  document_type         TEXT,
  document_number       TEXT,
  issue_date            DATE,
  expiry_date           DATE,
  issuing_authority     TEXT,
  status                TEXT,
  source_reference      TEXT
);
CREATE INDEX IF NOT EXISTS idx_documents_person ON documents (person_id);
CREATE INDEX IF NOT EXISTS idx_documents_case ON documents (case_id);

CREATE TABLE IF NOT EXISTS criminal_records (
  criminal_record_id  TEXT PRIMARY KEY,
  person_id           TEXT REFERENCES persons(person_id),
  case_id             TEXT,
  fir_number          TEXT,
  offence             TEXT,
  legal_section       TEXT,
  incident_date       DATE,
  filing_date         DATE,
  status              TEXT,
  court               TEXT,
  outcome             TEXT
);
CREATE INDEX IF NOT EXISTS idx_criminal_person ON criminal_records (person_id);
CREATE INDEX IF NOT EXISTS idx_criminal_case ON criminal_records (case_id);

CREATE TABLE IF NOT EXISTS court_records (
  court_record_id  TEXT PRIMARY KEY,
  person_id        TEXT REFERENCES persons(person_id),
  case_id          TEXT,
  court_name       TEXT,
  case_number      TEXT,
  hearing_date     DATE,
  case_type        TEXT,
  status           TEXT,
  outcome          TEXT
);
CREATE INDEX IF NOT EXISTS idx_court_person ON court_records (person_id);
CREATE INDEX IF NOT EXISTS idx_court_case ON court_records (case_id);

-- "Cases" = LED Case Details (the investigative case file). Existing frontend
-- Case Builder cases stay in the frontend mock case store for now (see final
-- report) — this table is the real, dataset-backed case catalogue.
CREATE TABLE IF NOT EXISTS cases (
  case_id       TEXT PRIMARY KEY,
  case_number   TEXT,
  title         TEXT,
  case_type     TEXT,
  priority      TEXT,
  status        TEXT,
  opened_date   DATE,
  closed_date   DATE
);

CREATE TABLE IF NOT EXISTS case_persons (
  case_id    TEXT REFERENCES cases(case_id),
  person_id  TEXT REFERENCES persons(person_id),
  PRIMARY KEY (case_id, person_id)
);
CREATE INDEX IF NOT EXISTS idx_case_persons_case ON case_persons (case_id);
CREATE INDEX IF NOT EXISTS idx_case_persons_person ON case_persons (person_id);

CREATE TABLE IF NOT EXISTS evidence (
  evidence_id           TEXT PRIMARY KEY,
  person_id             TEXT REFERENCES persons(person_id),
  case_id               TEXT REFERENCES cases(case_id),
  evidence_type         TEXT,
  source_type           TEXT,
  source_record_id      TEXT,
  collection_date       DATE,
  collection_time       TEXT,
  description           TEXT,
  confidence            NUMERIC,
  verification_status   TEXT
);
CREATE INDEX IF NOT EXISTS idx_evidence_person ON evidence (person_id);
CREATE INDEX IF NOT EXISTS idx_evidence_case ON evidence (case_id);

CREATE TABLE IF NOT EXISTS alerts (
  alert_id        TEXT PRIMARY KEY,
  person_id       TEXT REFERENCES persons(person_id),
  case_id         TEXT REFERENCES cases(case_id),
  account_id      TEXT,
  transaction_id  TEXT,
  location_id     TEXT,
  evidence_id     TEXT,
  alert_type      TEXT,
  severity        TEXT,
  created_date    DATE,
  created_time    TEXT,
  status          TEXT,
  description     TEXT
);
CREATE INDEX IF NOT EXISTS idx_alerts_person ON alerts (person_id);
CREATE INDEX IF NOT EXISTS idx_alerts_case ON alerts (case_id);

CREATE TABLE IF NOT EXISTS investigations (
  investigation_id     TEXT PRIMARY KEY,
  person_id            TEXT REFERENCES persons(person_id),
  case_id              TEXT REFERENCES cases(case_id),
  investigator_id      TEXT,
  investigation_type   TEXT,
  start_date           DATE,
  end_date             DATE,
  status               TEXT,
  priority             TEXT
);
CREATE INDEX IF NOT EXISTS idx_investigations_person ON investigations (person_id);
CREATE INDEX IF NOT EXISTS idx_investigations_case ON investigations (case_id);

-- Relationships -------------------------------------------------------

CREATE TABLE IF NOT EXISTS account_relationships (
  account_relationship_id  TEXT PRIMARY KEY,
  person_id                TEXT REFERENCES persons(person_id),
  related_person_id        TEXT REFERENCES persons(person_id),
  related_person_name      TEXT,
  relationship_type        TEXT,
  interaction_count        INTEGER,
  value_band               TEXT,
  first_seen               DATE,
  last_seen                DATE,
  strength                 TEXT,
  evidence_count           INTEGER,
  verification_status      TEXT
);
CREATE INDEX IF NOT EXISTS idx_acct_rel_person ON account_relationships (person_id);
CREATE INDEX IF NOT EXISTS idx_acct_rel_related ON account_relationships (related_person_id);

CREATE TABLE IF NOT EXISTS person_relationships (
  relationship_id        TEXT PRIMARY KEY,
  person_id              TEXT REFERENCES persons(person_id),
  related_person_id      TEXT REFERENCES persons(person_id),
  related_person_name    TEXT,
  relationship_type      TEXT,
  interaction_count      INTEGER,
  first_seen             DATE,
  last_seen              DATE,
  strength                TEXT,
  evidence_count          INTEGER,
  verification_status     TEXT
);
CREATE INDEX IF NOT EXISTS idx_person_rel_person ON person_relationships (person_id);
CREATE INDEX IF NOT EXISTS idx_person_rel_related ON person_relationships (related_person_id);

CREATE TABLE IF NOT EXISTS organizations (
  organization_id  TEXT PRIMARY KEY,
  name             TEXT
);

CREATE TABLE IF NOT EXISTS person_organizations (
  person_id        TEXT REFERENCES persons(person_id),
  organization_id  TEXT REFERENCES organizations(organization_id),
  PRIMARY KEY (person_id, organization_id)
);
CREATE INDEX IF NOT EXISTS idx_person_orgs_person ON person_organizations (person_id);

-- Locations: the master dataset only carries location IDs (no separate
-- "Location Details" sheet with names/coordinates), so this table is
-- populated with the distinct IDs seen across every *_location_id column.
-- See final report for this limitation.
CREATE TABLE IF NOT EXISTS locations (
  location_id  TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS person_locations (
  person_id    TEXT REFERENCES persons(person_id),
  location_id  TEXT REFERENCES locations(location_id),
  PRIMARY KEY (person_id, location_id)
);
CREATE INDEX IF NOT EXISTS idx_person_locations_person ON person_locations (person_id);

-- Case-narrative notes: free-text content from the case-narrative workbook
-- (data/anamolies/TRINETRA_Case_Data.xlsx) that doesn't fit the normalized
-- domain tables -- why a person is linked to a case (CONNECTION_BASIS), and
-- narrated timeline events (TIMELINE_EVENT). Always references a case (and
-- usually a person) that must already exist from the main ingestion -- this
-- table never creates persons or cases, only annotates them. Populated by
-- server/ingest_case_narrative.py, never by server/ingest.py.
CREATE TABLE IF NOT EXISTS case_narrative_notes (
  id           TEXT PRIMARY KEY,
  case_id      TEXT NOT NULL REFERENCES cases(case_id),
  person_id    TEXT REFERENCES persons(person_id),
  kind         TEXT NOT NULL,   -- 'CONNECTION_BASIS' | 'TIMELINE_EVENT'
  event_date   DATE,            -- TIMELINE_EVENT only; NULL for CONNECTION_BASIS
  event_time   TEXT,            -- TIMELINE_EVENT only; NULL for CONNECTION_BASIS
  text         TEXT NOT NULL,
  source_ref   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_case_narrative_case ON case_narrative_notes (case_id);
CREATE INDEX IF NOT EXISTS idx_case_narrative_person ON case_narrative_notes (person_id);
CREATE INDEX IF NOT EXISTS idx_case_narrative_kind ON case_narrative_notes (kind);
CREATE INDEX IF NOT EXISTS idx_case_narrative_event_date ON case_narrative_notes (event_date);
