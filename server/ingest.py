#!/usr/bin/env python3
"""
TRINETRA Master Dataset ingestion — domain-file pipeline.

data/<domain>/*.xlsx (24 workbooks, per data/dataset-manifest.json)
    -> normalized PostgreSQL tables (see schema.sql)

This replaces the earlier single-wide-sheet ("Master_Data") ingestion path.
The per-domain workbooks under data/ are the source of truth; a combined
Master_Data workbook is no longer read by this script.

EXCLUDED: data/anamolies/TRINETRA_Case_Data.xlsx is a separate
case-narrative artifact (6 free-form case writeups, not person-keyed rows)
and is intentionally not ingested here.

Every domain workbook (except persons and phones) carries an explicit
person_id column, exactly like the old wide sheet's per-person row, just
split one-domain-per-file. The one exception is phones/Phone Details.xlsx,
which carries no person_id column at all — it is positionally aligned with
persons/Personal Details.xlsx (row i of one file belongs to the same person
as row i of the other). A pre-flight check verifies this alignment for
every row BEFORE any database connection or mutation is attempted; if it
fails, the script aborts without touching the database.

Safely repeatable: every table except `persons` is fully reloaded each run
(TRUNCATE ... CASCADE, then re-derived from the domain workbooks), and
`persons` is upserted on person_id. Nothing under data/ is ever modified by
this script.

Usage:
    python3 server/ingest.py                    # full ingest against DATABASE_URL
    python3 server/ingest.py --dry-run           # parse + validate only.
                                                  # No DB connection is made or
                                                  # required (psycopg2 is not
                                                  # even imported in this mode).
    python3 server/ingest.py --spot-check P-0000123
                                                  # after a full ingest, compare
                                                  # this person's DB-loaded
                                                  # records against the source
                                                  # workbooks (default: the
                                                  # first person in the file)
    python3 server/ingest.py --spot-check-only P-0000123
                                                  # skip ingestion; just run the
                                                  # spot check against whatever
                                                  # is already loaded

Env:
    DATABASE_URL   postgres connection string (falls back to server/.env)
"""
import sys
import os
import json
import argparse
import datetime
from collections import defaultdict

import openpyxl

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(HERE)
DATA_DIR = os.path.join(PROJECT_ROOT, "data")
MANIFEST_PATH = os.path.join(DATA_DIR, "dataset-manifest.json")

# data/anamolies/TRINETRA_Case_Data.xlsx — see module docstring.
EXCLUDED_DOMAINS = {"anamolies"}

EXPECTED_PERSON_COUNT = 100000


def load_env():
    env_path = os.path.join(HERE, ".env")
    if os.path.exists(env_path):
        for line in open(env_path):
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())


load_env()
DATABASE_URL = os.environ.get(
    "DATABASE_URL", "postgresql://trinetra:trinetra_dev_pw@localhost:5432/trinetra"
)


def load_domain_files():
    """Reads data/dataset-manifest.json and returns {domain: absolute_path},
    excluding EXCLUDED_DOMAINS. Does not open any workbook."""
    with open(MANIFEST_PATH) as f:
        manifest = json.load(f)
    domains = {}
    for entry in manifest["datasets"]:
        if entry["domain"] in EXCLUDED_DOMAINS:
            continue
        domains[entry["domain"]] = os.path.join(DATA_DIR, entry["file"])
    return domains


# ---- shared field helpers (unchanged parsing/format semantics) --------

def split_field(val):
    """'A | B | ' -> ['A', 'B', None]. None/'' -> []."""
    if val is None:
        return []
    s = str(val)
    if s.strip() == "":
        return []
    return [p.strip() or None for p in s.split("|")]


def at(lst, i):
    return lst[i] if i < len(lst) else None


def to_date(val):
    if val is None:
        return None
    if isinstance(val, (datetime.datetime, datetime.date)):
        return val.date() if isinstance(val, datetime.datetime) else val
    s = str(val).strip()
    return s or None


def to_num(val):
    if val is None:
        return None
    s = str(val).strip()
    if s == "":
        return None
    try:
        return float(s)
    except ValueError:
        return None


def to_int(val):
    n = to_num(val)
    return int(n) if n is not None else None


def open_sheet(path):
    """Opens the workbook (single-sheet, all 23 ingested domains use one
    sheet) and returns (workbook, header_index_map, row_iterator_over_data_rows)."""
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    ws = wb[wb.sheetnames[0]]
    row_iter = ws.iter_rows(values_only=True)
    header = next(row_iter)
    idx = {name: i for i, name in enumerate(header) if name}
    return wb, idx, row_iter


# ---- per-domain ingestion statistics -----------------------------------

class DomainStats:
    def __init__(self, domain, file, table):
        self.domain = domain
        self.file = file
        self.table = table
        self.rows_read = 0
        self.records_built = 0       # sub-records produced (post pipe-split), pre-dedup
        self.records_inserted = 0    # actually sent to the DB after de-duplication
        self.rows_skipped_invalid = 0
        self.duplicates = 0
        self.validation_failures = 0
        self.notes = []

    def line(self):
        base = (
            f"  {self.domain:<24} file={os.path.basename(self.file):<32} table={self.table:<22} "
            f"rows_read={self.rows_read:<8} records_built={self.records_built:<8} "
            f"inserted={self.records_inserted:<8} skipped_invalid={self.rows_skipped_invalid:<6} "
            f"duplicates={self.duplicates:<6} validation_failures={self.validation_failures:<6}"
        )
        if self.notes:
            base += "  NOTES: " + "; ".join(self.notes)
        return base


# ---- collector: accumulates rows for every target table ----------------

class Collector:
    def __init__(self):
        self.persons = []
        self.passports = []
        self.accounts = []
        self.phones = []
        self.devices = []
        self.vehicles = []
        self.social = []
        self.properties = []
        self.transactions = []
        self.calls = []
        self.travel = []
        self.cctv = []
        self.face = []
        self.documents = []
        self.criminal = []
        self.court = []
        self.evidence = []
        self.alerts = []
        self.investigations = []
        self.account_rel = []
        self.person_rel = []
        self.case_meta = {}  # case_id -> dict (from LED Case Details)
        self.case_person_pairs = set()  # (case_id, person_id)
        self.org_names = {}  # org_id -> name
        self.person_org_pairs = set()
        self.location_ids = set()
        self.person_location_pairs = set()

        # cross-domain-file validation aids
        self.known_person_ids = set()   # populated after the persons pass
        self.cctv_event_ids = set()     # populated during the cctv pass

        # Cross-file references (counterparty_person_id, related_person_id,
        # cctv_event_id, ...) that were non-empty but did not resolve against
        # the referenced domain's ID set. These are never silently nulled —
        # see record_unresolved_reference() and the hard gate in run_ingest().
        self.unresolved_references = []

        self.invalid_rows = []
        self.duplicate_person_ids = []
        self.seen_person_ids = set()

        self.stats = {}  # domain -> DomainStats

    def stat(self, domain, file, table):
        s = DomainStats(domain, file, table)
        self.stats[domain] = s
        return s

    # ---- generic multi-valued table helper (unchanged) ------------------
    def multi(self, row, idx, id_col, field_map):
        """field_map: {db_field: excel_col_name or None}. Returns list of
        dicts, one per non-empty id at that pipe-position."""
        ids = split_field(row[idx[id_col]]) if id_col in idx else []
        out = []
        for i, item_id in enumerate(ids):
            if not item_id:
                continue
            rec = {"id": item_id}
            for db_field, excel_col in field_map.items():
                if excel_col is None:
                    rec[db_field] = None
                    continue
                vals = split_field(row[idx[excel_col]]) if excel_col in idx else []
                rec[db_field] = at(vals, i)
            out.append(rec)
        return out

    def add_case_ref(self, case_id, person_id):
        if case_id and person_id:
            self.case_person_pairs.add((case_id, person_id))
            self.case_meta.setdefault(case_id, {})

    def add_location(self, loc_id, person_id=None):
        if loc_id:
            self.location_ids.add(loc_id)
            if person_id:
                self.person_location_pairs.add((person_id, loc_id))

    def valid_person(self, pid):
        return bool(pid) and pid in self.known_person_ids

    def record_unresolved_reference(self, stat, row_num, record_id, field, value):
        """A non-empty cross-file reference that did not resolve. Recorded
        with full context (source file, row, field, value, owning record id)
        and NEVER used to null the field — see the hard gate in run_ingest()."""
        self.unresolved_references.append({
            "domain": stat.domain,
            "file": stat.file,
            "row": row_num,
            "record_id": record_id,
            "field": field,
            "value": value,
        })
        stat.validation_failures += 1


# ---- pre-flight phone/person positional-mapping safety check -----------

def preflight_phone_person_check(persons_path, phones_path):
    """Runs BEFORE any DB connection or mutation. Verifies:
      a) both files have exactly EXPECTED_PERSON_COUNT data rows
      b) their row counts match each other
      c) every phones row has at least one valid (non-empty) phone id
      d) the positional mapping is internally consistent (persons.phone_id
         matches the first phone id of the same-position phones row, for
         every single row — not just a sample)
    Returns (ok: bool, problems: list[str], persons_order: list[str] | None,
             persons_phone_field: list | None).
    """
    problems = []

    wb1, idx1, rows1 = open_sheet(persons_path)
    if "person_id" not in idx1:
        wb1.close()
        return False, ["persons file has no 'person_id' column"], None, None
    persons_ids = []
    persons_phone_field = []
    has_phone_col = "phone_id" in idx1
    for row in rows1:
        pid = row[idx1["person_id"]]
        persons_ids.append(str(pid).strip() if pid else None)
        persons_phone_field.append(row[idx1["phone_id"]] if has_phone_col else None)
    wb1.close()

    wb2, idx2, rows2 = open_sheet(phones_path)
    if "all_phone_ids" not in idx2:
        wb2.close()
        return False, ["phones file has no 'all_phone_ids' column"], None, None
    phone_groups = []
    for row in rows2:
        phone_groups.append(row[idx2["all_phone_ids"]])
    wb2.close()

    if len(persons_ids) != EXPECTED_PERSON_COUNT:
        problems.append(
            f"persons file has {len(persons_ids)} data rows, expected exactly {EXPECTED_PERSON_COUNT}"
        )
    if len(phone_groups) != EXPECTED_PERSON_COUNT:
        problems.append(
            f"phones file has {len(phone_groups)} data rows, expected exactly {EXPECTED_PERSON_COUNT}"
        )
    if len(persons_ids) != len(phone_groups):
        problems.append(
            f"row-count mismatch: persons={len(persons_ids)} phones={len(phone_groups)} "
            "— positional mapping cannot be established"
        )

    invalid_phone_rows = []
    for i, g in enumerate(phone_groups):
        first_id = str(g).split("|")[0].strip() if g else ""
        if not first_id:
            invalid_phone_rows.append(i)
    if invalid_phone_rows:
        problems.append(
            f"{len(invalid_phone_rows)} phones rows have no valid phone id "
            f"(e.g. row indices {invalid_phone_rows[:5]})"
        )

    cross_check_mismatches = []
    if len(persons_ids) == len(phone_groups) and has_phone_col:
        for i in range(len(persons_ids)):
            declared = persons_phone_field[i]
            group = phone_groups[i]
            actual_first = str(group).split("|")[0].strip() if group else None
            if declared != actual_first:
                cross_check_mismatches.append(i)
        if cross_check_mismatches:
            problems.append(
                f"{len(cross_check_mismatches)} rows fail the persons.phone_id vs "
                f"phones-file cross-check (e.g. row indices {cross_check_mismatches[:5]}) "
                "— positional alignment is not trustworthy"
            )
    elif not has_phone_col:
        problems.append(
            "persons file has no 'phone_id' column — cannot cross-validate positional alignment"
        )

    ok = len(problems) == 0
    return ok, problems, (persons_ids if ok else None), (persons_phone_field if ok else None)


def dedupe_pk(rows, pk_index, stats):
    """Removes rows whose value at pk_index has already been seen (first
    occurrence wins — same effective outcome as the DB's ON CONFLICT DO
    NOTHING, but counted here so duplicates are reported rather than
    silently absorbed)."""
    seen = set()
    out = []
    for r in rows:
        pk = r[pk_index]
        if pk in seen:
            stats.duplicates += 1
            continue
        seen.add(pk)
        out.append(r)
    return out


# ---- per-domain row processors ------------------------------------------
# Each function reads one domain workbook fully, appends parsed records to
# the Collector, and fills in a DomainStats entry. All field-mapping and
# pipe-split semantics are unchanged from the original Master_Data parser —
# only the source (one file per domain instead of one wide sheet) differs.

def process_persons(path, c: Collector):
    stat = c.stat("persons", path, "persons")
    wb, idx, rows = open_sheet(path)
    persons_order = []
    for row in rows:
        stat.rows_read += 1
        pid = row[idx["person_id"]] if "person_id" in idx else None
        if not pid or not str(pid).strip():
            stat.rows_skipped_invalid += 1
            c.invalid_rows.append(("missing person_id", "persons"))
            persons_order.append(None)
            continue
        pid = str(pid).strip()
        if pid in c.seen_person_ids:
            stat.duplicates += 1
            c.duplicate_person_ids.append(pid)
            persons_order.append(pid)  # still needed for phones' positional alignment
            continue
        c.seen_person_ids.add(pid)
        persons_order.append(pid)

        def g(col):
            return row[idx[col]] if col in idx else None

        c.persons.append((
            pid, g("name"), g("alias"), to_date(g("date_of_birth")), g("gender"),
            g("nationality"), g("occupation"), g("address"), g("city"), g("state"),
            g("country"), g("email"), g("risk_level"), g("status"),
        ))
        stat.records_built += 1
    wb.close()
    c.known_person_ids = set(c.seen_person_ids)
    stat.records_inserted = stat.records_built  # persons is upserted, not dedup-filtered here
    return persons_order


def process_phones(path, c: Collector, persons_order):
    stat = c.stat("phones", path, "phones_sim")
    wb, idx, rows = open_sheet(path)
    i = 0
    for row in rows:
        stat.rows_read += 1
        pid = persons_order[i] if i < len(persons_order) else None
        i += 1
        if not pid:
            stat.rows_skipped_invalid += 1
            continue
        group = row[idx["all_phone_ids"]] if "all_phone_ids" in idx else None
        ids = split_field(group)
        if not ids or not any(ids):
            stat.rows_skipped_invalid += 1
            continue

        def multi_col(col):
            return split_field(row[idx[col]]) if col in idx else []

        numbers = multi_col("phone_numbers")
        sims = multi_col("sim_ids")
        carriers = multi_col("phone_carriers")
        act = multi_col("phone_activation_dates")
        deact = multi_col("phone_deactivation_dates")
        statuses = multi_col("phone_statuses")
        for j, phone_id in enumerate(ids):
            if not phone_id:
                continue
            c.phones.append((
                phone_id, pid, at(numbers, j), at(sims, j), at(carriers, j),
                to_date(at(act, j)), to_date(at(deact, j)), at(statuses, j),
            ))
            stat.records_built += 1
    wb.close()
    return


def process_passports(path, c: Collector):
    stat = c.stat("passports", path, "passports")
    wb, idx, rows = open_sheet(path)
    for row in rows:
        stat.rows_read += 1
        pid = row[idx["person_id"]] if "person_id" in idx else None
        pid = str(pid).strip() if pid else None
        if not c.valid_person(pid):
            stat.rows_skipped_invalid += 1
            continue

        def g(col):
            return row[idx[col]] if col in idx else None

        passport_id = g("passport_id")
        if not passport_id:
            continue  # no passport for this person — normal sparsity, not invalid
        c.passports.append((
            passport_id, pid, g("passport_number"), g("passport_nationality"),
            to_date(g("passport_issue_date")), to_date(g("passport_expiry_date")),
            g("passport_issuing_country"), g("passport_status"),
        ))
        stat.records_built += 1
    wb.close()


def _generic_multi_domain(path, c: Collector, domain, table, id_col, field_map,
                           append_fn, extra_fn=None):
    """Shared driver for the many domains whose rows are: one row per person,
    with a set of pipe-delimited parallel columns. append_fn(item, pid, c,
    stat, row_num) appends the parsed record(s) — row_num is the workbook's
    1-based row number, for unresolved-reference reporting; extra_fn(item,
    pid, c), if given, runs additional bookkeeping (e.g. case/location
    registration)."""
    stat = c.stat(domain, path, table)
    wb, idx, rows = open_sheet(path)
    row_num = 1  # header occupies row 1
    for row in rows:
        row_num += 1
        stat.rows_read += 1
        pid = row[idx["person_id"]] if "person_id" in idx else None
        pid = str(pid).strip() if pid else None
        if not c.valid_person(pid):
            stat.rows_skipped_invalid += 1
            continue
        items = c.multi(row, idx, id_col, field_map)
        for item in items:
            append_fn(item, pid, c, stat, row_num)
            if extra_fn:
                extra_fn(item, pid, c)
    wb.close()


def process_accounts(path, c: Collector):
    def append(item, pid, c, stat, row_num):
        c.accounts.append((
            item["id"], pid, item["account_type"], item["bank_name"], item["branch"],
            item["account_number"], item["status"], to_date(item["opening_date"]),
            to_date(item["closing_date"]), item["balance_band"], item["risk_level"],
        ))
        stat.records_built += 1

    _generic_multi_domain(path, c, "accounts", "accounts", "account_ids", {
        "account_type": "account_types", "bank_name": "account_bank_names",
        "branch": "account_branches", "account_number": "account_numbers",
        "status": "account_statuses", "opening_date": "account_opening_dates",
        "closing_date": "account_closing_dates", "balance_band": "account_balance_bands",
        "risk_level": "account_risk_levels",
    }, append)


def process_devices(path, c: Collector):
    def append(item, pid, c, stat, row_num):
        c.devices.append((
            item["id"], pid, item["device_type"], item["manufacturer"], item["model"],
            item["imei"], item["os"], to_date(item["first_seen"]), to_date(item["last_seen"]),
            item["status"],
        ))
        stat.records_built += 1

    _generic_multi_domain(path, c, "devices", "devices", "device_ids", {
        "device_type": "device_types", "manufacturer": "device_manufacturers",
        "model": "device_models", "imei": "device_imeis", "os": "device_os_list",
        "first_seen": "device_first_seens", "last_seen": "device_last_seens",
        "status": "device_statuses",
    }, append)


def process_vehicles(path, c: Collector):
    def append(item, pid, c, stat, row_num):
        c.vehicles.append((
            item["id"], pid, item["registration_number"], item["vehicle_type"], item["make"],
            item["model"], item["color"], to_date(item["registration_date"]), item["ownership_status"],
        ))
        stat.records_built += 1

    _generic_multi_domain(path, c, "vehicles", "vehicles", "vehicle_ids", {
        "registration_number": "vehicle_registration_numbers", "vehicle_type": "vehicle_types",
        "make": "vehicle_makes", "model": "vehicle_models", "color": "vehicle_colors",
        "registration_date": "vehicle_registration_dates", "ownership_status": "vehicle_ownership_statuses",
    }, append)


def process_social(path, c: Collector):
    def append(item, pid, c, stat, row_num):
        c.social.append((
            item["id"], pid, item["platform"], item["username"], item["profile_name"],
            to_date(item["created_date"]), item["status"], item["follower_band"], item["risk_level"],
        ))
        stat.records_built += 1

    _generic_multi_domain(path, c, "social-media", "social_media", "social_account_ids", {
        "platform": "social_platforms", "username": "social_usernames",
        "profile_name": "social_profile_names", "created_date": "social_created_dates",
        "status": "social_statuses", "follower_band": "social_follower_bands",
        "risk_level": "social_risk_levels",
    }, append)


def process_properties(path, c: Collector):
    def append(item, pid, c, stat, row_num):
        c.properties.append((
            item["id"], pid, item["property_type"], item["address"], item["location_id"],
            to_date(item["ownership_date"]), item["ownership_status"], item["value_band"],
        ))
        stat.records_built += 1

    def extra(item, pid, c):
        c.add_location(item["location_id"], pid)

    _generic_multi_domain(path, c, "properties", "properties", "property_ids", {
        "property_type": "property_types", "address": "property_addresses",
        "location_id": "property_location_ids", "ownership_date": "property_ownership_dates",
        "ownership_status": "property_ownership_statuses", "value_band": "property_value_bands",
    }, append, extra)


def process_transactions(path, c: Collector):
    def append(item, pid, c, stat, row_num):
        counterparty = item["counterparty_person_id"]
        if counterparty and counterparty not in c.known_person_ids:
            c.record_unresolved_reference(stat, row_num, item["id"], "counterparty_person_id", counterparty)
        c.transactions.append((
            item["id"], pid, item["own_account_id"], item["counterparty_account_id"],
            counterparty, item["transaction_type"], to_num(item["amount"]),
            item["currency"], to_date(item["txn_date"]), item["txn_time"], item["channel"],
            item["merchant"], item["location_id"], item["reference_number"], item["status"],
            to_num(item["risk_score"]),
        ))
        stat.records_built += 1

    def extra(item, pid, c):
        c.add_location(item["location_id"], pid)

    _generic_multi_domain(path, c, "transactions", "transactions", "transaction_ids", {
        "own_account_id": "transaction_own_account_ids", "counterparty_account_id": "transaction_counterparty_account_ids",
        "counterparty_person_id": "transaction_counterparty_person_ids", "transaction_type": "transaction_types",
        "amount": "transaction_amounts", "currency": "transaction_currencies", "txn_date": "transaction_dates",
        "txn_time": "transaction_times", "channel": "transaction_channels", "merchant": "transaction_merchants",
        "location_id": "transaction_location_ids", "reference_number": "transaction_reference_numbers",
        "status": "transaction_statuses", "risk_score": "transaction_risk_scores",
    }, append, extra)


def process_calls(path, c: Collector):
    def append(item, pid, c, stat, row_num):
        counterparty = item["counterparty_person_id"]
        if counterparty and counterparty not in c.known_person_ids:
            c.record_unresolved_reference(stat, row_num, item["id"], "counterparty_person_id", counterparty)
        c.calls.append((
            item["id"], pid, item["caller_phone_id"], item["receiver_phone_id"],
            counterparty, item["call_type"], to_date(item["call_date"]),
            item["call_time"], item["duration"], item["location_id"], item["device_id"],
            to_num(item["risk_score"]),
        ))
        stat.records_built += 1

    def extra(item, pid, c):
        c.add_location(item["location_id"], pid)

    _generic_multi_domain(path, c, "calls", "calls", "call_ids", {
        "caller_phone_id": "call_caller_phone_ids", "receiver_phone_id": "call_receiver_phone_ids",
        "counterparty_person_id": "call_counterparty_person_ids", "call_type": "call_types",
        "call_date": "call_dates", "call_time": "call_times", "duration": "call_durations",
        "location_id": "call_location_ids", "device_id": "call_device_ids", "risk_score": "call_risk_scores",
    }, append, extra)


def process_travel(path, c: Collector):
    def append(item, pid, c, stat, row_num):
        c.travel.append((
            item["id"], pid, item["ticket_id"], item["travel_type"], to_date(item["booking_date"]),
            to_date(item["departure_date"]), item["departure_time"], to_date(item["arrival_date"]),
            item["arrival_time"], item["origin_location_id"], item["destination_location_id"],
            item["booking_reference"], item["seat_class"], item["payment_account_id"],
            item["vehicle_or_flight_number"], item["status"],
        ))
        stat.records_built += 1

    def extra(item, pid, c):
        c.add_location(item["origin_location_id"], pid)
        c.add_location(item["destination_location_id"], pid)

    _generic_multi_domain(path, c, "travel", "travel", "travel_ids", {
        "ticket_id": "ticket_ids", "travel_type": "travel_types", "booking_date": "travel_booking_dates",
        "departure_date": "travel_departure_dates", "departure_time": "travel_departure_times",
        "arrival_date": "travel_arrival_dates", "arrival_time": "travel_arrival_times",
        "origin_location_id": "travel_origin_location_ids", "destination_location_id": "travel_destination_location_ids",
        "booking_reference": "travel_booking_references", "seat_class": "travel_seat_classes",
        "payment_account_id": "travel_payment_account_ids", "vehicle_or_flight_number": "travel_vehicle_or_flight_numbers",
        "status": "travel_statuses",
    }, append, extra)


def process_cctv(path, c: Collector):
    def append(item, pid, c, stat, row_num):
        c.cctv.append((
            item["id"], pid, item["camera_id"], item["location_id"], item["vehicle_id"],
            to_date(item["event_date"]), item["event_time"], item["event_type"], item["direction"],
            to_num(item["confidence"]), item["image_reference"], to_num(item["risk_score"]),
        ))
        stat.records_built += 1
        c.cctv_event_ids.add(item["id"])

    def extra(item, pid, c):
        c.add_location(item["location_id"], pid)

    _generic_multi_domain(path, c, "cctv", "cctv", "cctv_event_ids", {
        "camera_id": "cctv_camera_ids", "location_id": "cctv_location_ids", "vehicle_id": "cctv_vehicle_ids",
        "event_date": "cctv_event_dates", "event_time": "cctv_event_times", "event_type": "cctv_event_types",
        "direction": "cctv_directions", "confidence": "cctv_confidences", "image_reference": "cctv_image_references",
        "risk_score": "cctv_risk_scores",
    }, append, extra)


def process_face(path, c: Collector):
    def append(item, pid, c, stat, row_num):
        cctv_event_id = item["cctv_event_id"]
        if cctv_event_id and cctv_event_id not in c.cctv_event_ids:
            c.record_unresolved_reference(stat, row_num, item["id"], "cctv_event_id", cctv_event_id)
        c.face.append((
            item["id"], pid, cctv_event_id, item["detected_name"], to_num(item["confidence"]),
            to_date(item["match_date"]), item["match_time"], item["verification_status"], item["evidence_id"],
        ))
        stat.records_built += 1

    _generic_multi_domain(path, c, "face-matches", "face_recognition", "face_match_ids", {
        "cctv_event_id": "face_cctv_event_ids", "detected_name": "face_detected_names",
        "confidence": "face_confidences", "match_date": "face_match_dates", "match_time": "face_match_times",
        "verification_status": "face_verification_statuses", "evidence_id": "face_evidence_ids",
    }, append)


def process_documents(path, c: Collector):
    def append(item, pid, c, stat, row_num):
        c.documents.append((
            item["id"], pid, item["organization_id"], item["case_id"], item["document_type"],
            item["document_number"], to_date(item["issue_date"]), to_date(item["expiry_date"]),
            item["issuing_authority"], item["status"], item["source_reference"],
        ))
        stat.records_built += 1

    def extra(item, pid, c):
        c.add_case_ref(item["case_id"], pid)

    _generic_multi_domain(path, c, "documents", "documents", "document_ids", {
        "organization_id": "document_organization_ids", "case_id": "document_case_ids",
        "document_type": "document_types", "document_number": "document_numbers",
        "issue_date": "document_issue_dates", "expiry_date": "document_expiry_dates",
        "issuing_authority": "document_issuing_authorities", "status": "document_statuses",
        "source_reference": "document_source_references",
    }, append, extra)


def process_criminal(path, c: Collector):
    def append(item, pid, c, stat, row_num):
        c.criminal.append((
            item["id"], pid, item["case_id"], item["fir_number"], item["offence"],
            item["legal_section"], to_date(item["incident_date"]), to_date(item["filing_date"]),
            item["status"], item["court"], item["outcome"],
        ))
        stat.records_built += 1

    def extra(item, pid, c):
        c.add_case_ref(item["case_id"], pid)

    _generic_multi_domain(path, c, "criminal-records", "criminal_records", "criminal_record_ids", {
        "case_id": "criminal_case_ids", "fir_number": "fir_numbers", "offence": "offences",
        "legal_section": "legal_sections", "incident_date": "incident_dates", "filing_date": "filing_dates",
        "status": "criminal_statuses", "court": "criminal_courts", "outcome": "criminal_outcomes",
    }, append, extra)


def process_court(path, c: Collector):
    def append(item, pid, c, stat, row_num):
        c.court.append((
            item["id"], pid, item["case_id"], item["court_name"], item["case_number"],
            to_date(item["hearing_date"]), item["case_type"], item["status"], item["outcome"],
        ))
        stat.records_built += 1

    def extra(item, pid, c):
        c.add_case_ref(item["case_id"], pid)

    _generic_multi_domain(path, c, "courts", "court_records", "court_record_ids", {
        "case_id": "court_case_ids", "court_name": "court_names", "case_number": "court_case_numbers",
        "hearing_date": "court_hearing_dates", "case_type": "court_case_types", "status": "court_statuses",
        "outcome": "court_outcomes",
    }, append, extra)


def process_led_cases(path, c: Collector):
    def append(item, pid, c, stat, row_num):
        c.case_meta[item["id"]] = {
            "case_number": item["case_number"], "title": item["title"], "case_type": item["case_type"],
            "priority": item["priority"], "status": item["status"],
            "opened_date": to_date(item["opened_date"]), "closed_date": to_date(item["closed_date"]),
        }
        stat.records_built += 1

    def extra(item, pid, c):
        c.add_case_ref(item["id"], pid)

    _generic_multi_domain(path, c, "led-cases", "cases + case_persons", "led_case_ids", {
        "case_number": "led_case_numbers", "title": "led_case_titles", "case_type": "led_case_types",
        "priority": "led_case_priorities", "status": "led_case_statuses",
        "opened_date": "led_case_opened_dates", "closed_date": "led_case_closed_dates",
    }, append, extra)


def process_evidence(path, c: Collector):
    def append(item, pid, c, stat, row_num):
        c.evidence.append((
            item["id"], pid, item["case_id"], item["evidence_type"], item["source_type"],
            item["source_record_id"], to_date(item["collection_date"]), item["collection_time"],
            item["description"], to_num(item["confidence"]), item["verification_status"],
        ))
        stat.records_built += 1

    def extra(item, pid, c):
        c.add_case_ref(item["case_id"], pid)

    _generic_multi_domain(path, c, "evidence", "evidence", "evidence_ids", {
        "case_id": "evidence_case_ids", "evidence_type": "evidence_types", "source_type": "evidence_source_types",
        "source_record_id": "evidence_source_record_ids", "collection_date": "evidence_collection_dates",
        "collection_time": "evidence_collection_times", "description": "evidence_descriptions",
        "confidence": "evidence_confidences", "verification_status": "evidence_verification_statuses",
    }, append, extra)


def process_alerts(path, c: Collector):
    def append(item, pid, c, stat, row_num):
        c.alerts.append((
            item["id"], pid, item["case_id"], item["account_id"], item["transaction_id"],
            item["location_id"], item["evidence_id"], item["alert_type"], item["severity"],
            to_date(item["created_date"]), item["created_time"], item["status"], item["description"],
        ))
        stat.records_built += 1

    def extra(item, pid, c):
        c.add_case_ref(item["case_id"], pid)
        c.add_location(item["location_id"], pid)

    _generic_multi_domain(path, c, "alerts", "alerts", "alert_ids", {
        "case_id": "alert_case_ids", "account_id": "alert_account_ids", "transaction_id": "alert_transaction_ids",
        "location_id": "alert_location_ids", "evidence_id": "alert_evidence_ids", "alert_type": "alert_types",
        "severity": "alert_severities", "created_date": "alert_created_dates", "created_time": "alert_created_times",
        "status": "alert_statuses", "description": "alert_descriptions",
    }, append, extra)


def process_investigations(path, c: Collector):
    def append(item, pid, c, stat, row_num):
        c.investigations.append((
            item["id"], pid, item["case_id"], item["investigator_id"], item["investigation_type"],
            to_date(item["start_date"]), to_date(item["end_date"]), item["status"], item["priority"],
        ))
        stat.records_built += 1

    def extra(item, pid, c):
        c.add_case_ref(item["case_id"], pid)

    _generic_multi_domain(path, c, "investigations", "investigations", "investigation_ids", {
        "case_id": "investigation_case_ids", "investigator_id": "investigator_ids",
        "investigation_type": "investigation_types", "start_date": "investigation_start_dates",
        "end_date": "investigation_end_dates", "status": "investigation_statuses",
        "priority": "investigation_priorities",
    }, append, extra)


def process_account_rel(path, c: Collector):
    def append(item, pid, c, stat, row_num):
        related = item["related_person_id"]
        if related and related not in c.known_person_ids:
            c.record_unresolved_reference(stat, row_num, item["id"], "related_person_id", related)
        c.account_rel.append((
            item["id"], pid, related, item["related_person_name"],
            item["relationship_type"], to_int(item["interaction_count"]), item["value_band"],
            to_date(item["first_seen"]), to_date(item["last_seen"]), item["strength"],
            to_int(item["evidence_count"]), item["verification_status"],
        ))
        stat.records_built += 1

    _generic_multi_domain(path, c, "account-relationships", "account_relationships", "account_relationship_ids", {
        "related_person_id": "account_related_person_ids", "related_person_name": "account_related_person_names",
        "relationship_type": "account_relationship_types", "interaction_count": "account_relationship_interaction_counts",
        "value_band": "account_relationship_value_bands", "first_seen": "account_relationship_first_seens",
        "last_seen": "account_relationship_last_seens", "strength": "account_relationship_strengths",
        "evidence_count": "account_relationship_evidence_counts",
        "verification_status": "account_relationship_verification_statuses",
    }, append)


def process_person_rel(path, c: Collector):
    def append(item, pid, c, stat, row_num):
        related = item["related_person_id"]
        if related and related not in c.known_person_ids:
            c.record_unresolved_reference(stat, row_num, item["id"], "related_person_id", related)
        c.person_rel.append((
            item["id"], pid, related, item["related_person_name"],
            item["relationship_type"], to_int(item["interaction_count"]),
            to_date(item["first_seen"]), to_date(item["last_seen"]), item["strength"],
            to_int(item["evidence_count"]), item["verification_status"],
        ))
        stat.records_built += 1

    _generic_multi_domain(path, c, "related-persons", "person_relationships", "related_person_relationship_ids", {
        "related_person_id": "related_person_ids", "related_person_name": "related_person_names",
        "relationship_type": "related_person_relationship_types", "interaction_count": "related_person_interaction_counts",
        "first_seen": "related_person_first_seens", "last_seen": "related_person_last_seens",
        "strength": "related_person_relationship_strengths", "evidence_count": "related_person_evidence_counts",
        "verification_status": "related_person_verification_statuses",
    }, append)


def process_organisations(path, c: Collector):
    stat = c.stat("organisations", path, "organizations + person_organizations")
    wb, idx, rows = open_sheet(path)
    for row in rows:
        stat.rows_read += 1
        pid = row[idx["person_id"]] if "person_id" in idx else None
        pid = str(pid).strip() if pid else None
        if not c.valid_person(pid):
            stat.rows_skipped_invalid += 1
            continue

        def g(col):
            return row[idx[col]] if col in idx else None

        org_ids = split_field(g("related_organization_ids"))
        org_names = split_field(g("related_organization_names"))
        for i, oid in enumerate(org_ids):
            if not oid:
                continue
            c.org_names[oid] = at(org_names, i)
            c.person_org_pairs.add((pid, oid))
            stat.records_built += 1

        for loc_id in split_field(g("related_location_ids")):
            c.add_location(loc_id, pid)
    wb.close()


# ---- bulk load ------------------------------------------------------------

def bulk(cur, sql, rows, page_size=5000):
    if rows:
        from psycopg2.extras import execute_values
        execute_values(cur, sql, rows, page_size=page_size)


def run_ingest(domains, dry_run=False):
    c = Collector()

    persons_path = domains["persons"]
    phones_path = domains["phones"]

    print("=== Pre-flight: persons/phones positional-mapping safety check ===")
    ok, problems, _persons_order_unused, _phone_field_unused = preflight_phone_person_check(
        persons_path, phones_path
    )
    if not ok:
        print("PRE-FLIGHT CHECK FAILED — aborting before any database mutation:")
        for p in problems:
            print(f"  - {p}")
        sys.exit(1)
    print(f"  OK: both files have exactly {EXPECTED_PERSON_COUNT} rows, row counts match, "
          f"every phones row has a valid phone id, and the full 100% positional "
          f"cross-check against persons.phone_id passed with 0 mismatches.")

    print("\n=== Parsing domain workbooks ===")
    print("Parsing persons/Personal Details.xlsx ...")
    persons_order = process_persons(persons_path, c)

    print("Parsing phones/Phone Details.xlsx (positional person_id derivation)...")
    process_phones(phones_path, c, persons_order)

    parse_steps = [
        ("passports", process_passports),
        ("accounts", process_accounts),
        ("devices", process_devices),
        ("vehicles", process_vehicles),
        ("social-media", process_social),
        ("properties", process_properties),
        ("led-cases", process_led_cases),   # before other case-referencing domains
        ("transactions", process_transactions),
        ("calls", process_calls),
        ("travel", process_travel),
        ("cctv", process_cctv),             # before face-matches (FK: cctv_event_id)
        ("face-matches", process_face),
        ("documents", process_documents),
        ("criminal-records", process_criminal),
        ("courts", process_court),
        ("evidence", process_evidence),
        ("alerts", process_alerts),
        ("investigations", process_investigations),
        ("account-relationships", process_account_rel),
        ("related-persons", process_person_rel),
        ("organisations", process_organisations),
    ]
    for domain, fn in parse_steps:
        print(f"Parsing {domain} ({os.path.basename(domains[domain])}) ...")
        fn(domains[domain], c)

    print("\n=== Per-domain parse report ===")
    for domain in ["persons", "phones", "passports", "accounts", "devices", "vehicles",
                   "social-media", "properties", "led-cases", "transactions", "calls",
                   "travel", "cctv", "face-matches", "documents", "criminal-records",
                   "courts", "evidence", "alerts", "investigations",
                   "account-relationships", "related-persons", "organisations"]:
        print(c.stats[domain].line())

    print(f"\nUnique persons parsed: {len(c.known_person_ids)}")
    print(f"Duplicate person_ids skipped (within persons file): {len(c.duplicate_person_ids)}")
    print(f"Invalid rows skipped (persons file, missing person_id): {len(c.invalid_rows)}")
    print(f"Distinct organizations referenced: {len(c.org_names)}")
    print(f"Distinct locations referenced: {len(c.location_ids)}")
    print(f"Distinct case ids referenced (any domain): {len(c.case_meta)}")

    # ---- hard gate: unresolved cross-file references -------------------
    # counterparty_person_id / related_person_id / cctv_event_id values that
    # were non-empty but did not resolve against the referenced domain's ID
    # set are never nulled and never loaded. If any exist, ingestion stops
    # here — before any database connection is made — rather than loading a
    # partially-corrupted dataset or silently discarding the bad reference.
    print(f"\n=== Unresolved cross-file references ===")
    if c.unresolved_references:
        print(f"BLOCKING: {len(c.unresolved_references)} non-empty cross-file reference(s) "
              f"did not resolve. None of these were nulled or dropped — ingestion is "
              f"aborting before any database mutation. Fix the source data (or confirm "
              f"this is expected) and re-run.\n")
        for v in c.unresolved_references:
            print(f"  [{v['domain']}] file={os.path.basename(v['file'])} row={v['row']} "
                  f"record={v['record_id']} field={v['field']} invalid_value={v['value']!r}")
        sys.exit(1)
    print("  OK: 0 unresolved cross-file references — every non-empty "
          "counterparty_person_id / related_person_id / cctv_event_id resolved.")

    if dry_run:
        print("\n=== DRY RUN — no database connection was made, nothing was written ===")
        return c, persons_order

    # ---- connect + load -----------------------------------------------
    import psycopg2

    print("\nConnecting to Postgres...")
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = False
    cur = conn.cursor()

    print("Applying schema...")
    with open(os.path.join(HERE, "schema.sql")) as f:
        cur.execute(f.read())

    print("Truncating tables for a clean, repeatable reload...")
    cur.execute("""
        TRUNCATE TABLE
          face_recognition, cctv, documents, criminal_records, court_records,
          evidence, alerts, investigations, case_persons, cases,
          account_relationships, person_relationships,
          person_organizations, organizations,
          person_locations, locations,
          transactions, calls, travel,
          accounts, phones_sim, devices, vehicles, social_media, properties, passports,
          persons
        CASCADE
    """)

    print("Loading persons...")
    bulk(cur, """
        INSERT INTO persons (person_id, name, alias, date_of_birth, gender, nationality,
          occupation, address, city, state, country, email, risk_level, status)
        VALUES %s
        ON CONFLICT (person_id) DO UPDATE SET
          name=EXCLUDED.name, alias=EXCLUDED.alias, date_of_birth=EXCLUDED.date_of_birth,
          gender=EXCLUDED.gender, nationality=EXCLUDED.nationality, occupation=EXCLUDED.occupation,
          address=EXCLUDED.address, city=EXCLUDED.city, state=EXCLUDED.state, country=EXCLUDED.country,
          email=EXCLUDED.email, risk_level=EXCLUDED.risk_level, status=EXCLUDED.status, updated_at=now()
    """, c.persons)
    conn.commit()
    c.stats["persons"].records_inserted = len(c.persons)
    print(f"  {len(c.persons)} persons committed.")

    def load(domain, rows, sql, pk_index=0):
        stat = c.stats[domain]
        deduped = dedupe_pk(rows, pk_index, stat)
        bulk(cur, sql, deduped)
        stat.records_inserted = len(deduped)

    print("Loading passports, accounts, phones, devices, vehicles, social media, properties...")
    load("passports", c.passports,
         "INSERT INTO passports (passport_id, person_id, passport_number, nationality, issue_date, expiry_date, issuing_country, status) VALUES %s ON CONFLICT DO NOTHING")
    load("accounts", c.accounts, "INSERT INTO accounts VALUES %s ON CONFLICT DO NOTHING")
    load("phones", c.phones, "INSERT INTO phones_sim VALUES %s ON CONFLICT DO NOTHING")
    load("devices", c.devices, "INSERT INTO devices VALUES %s ON CONFLICT DO NOTHING")
    load("vehicles", c.vehicles, "INSERT INTO vehicles VALUES %s ON CONFLICT DO NOTHING")
    load("social-media", c.social, "INSERT INTO social_media VALUES %s ON CONFLICT DO NOTHING")
    load("properties", c.properties, "INSERT INTO properties VALUES %s ON CONFLICT DO NOTHING")
    conn.commit()

    print("Loading cases + case_persons...")
    case_rows = []
    for cid, meta in c.case_meta.items():
        case_rows.append((cid, meta.get("case_number"), meta.get("title"), meta.get("case_type"),
                           meta.get("priority"), meta.get("status"), meta.get("opened_date"), meta.get("closed_date")))
    bulk(cur, "INSERT INTO cases VALUES %s ON CONFLICT DO NOTHING", case_rows)
    bulk(cur, "INSERT INTO case_persons VALUES %s ON CONFLICT DO NOTHING", list(c.case_person_pairs))
    conn.commit()
    c.stats["led-cases"].records_inserted = len(case_rows)
    print(f"  {len(case_rows)} cases, {len(c.case_person_pairs)} case-person links.")

    print("Loading transactions, calls, travel, cctv, face recognition, documents, criminal/court records...")
    load("transactions", c.transactions, "INSERT INTO transactions VALUES %s ON CONFLICT DO NOTHING")
    load("calls", c.calls, "INSERT INTO calls VALUES %s ON CONFLICT DO NOTHING")
    load("travel", c.travel, "INSERT INTO travel VALUES %s ON CONFLICT DO NOTHING")
    load("cctv", c.cctv, "INSERT INTO cctv VALUES %s ON CONFLICT DO NOTHING")
    conn.commit()
    load("face-matches", c.face, "INSERT INTO face_recognition VALUES %s ON CONFLICT DO NOTHING")
    load("documents", c.documents, "INSERT INTO documents VALUES %s ON CONFLICT DO NOTHING")
    load("criminal-records", c.criminal, "INSERT INTO criminal_records VALUES %s ON CONFLICT DO NOTHING")
    load("courts", c.court, "INSERT INTO court_records VALUES %s ON CONFLICT DO NOTHING")
    conn.commit()

    print("Loading evidence, alerts, investigations...")
    load("evidence", c.evidence, "INSERT INTO evidence VALUES %s ON CONFLICT DO NOTHING")
    load("alerts", c.alerts, "INSERT INTO alerts VALUES %s ON CONFLICT DO NOTHING")
    load("investigations", c.investigations, "INSERT INTO investigations VALUES %s ON CONFLICT DO NOTHING")
    conn.commit()

    print("Loading relationships, organizations, locations...")
    load("account-relationships", c.account_rel, "INSERT INTO account_relationships VALUES %s ON CONFLICT DO NOTHING")
    load("related-persons", c.person_rel, "INSERT INTO person_relationships VALUES %s ON CONFLICT DO NOTHING")
    bulk(cur, "INSERT INTO organizations VALUES %s ON CONFLICT DO NOTHING", list(c.org_names.items()))
    bulk(cur, "INSERT INTO person_organizations VALUES %s ON CONFLICT DO NOTHING", list(c.person_org_pairs))
    bulk(cur, "INSERT INTO locations VALUES %s ON CONFLICT DO NOTHING", [(l,) for l in c.location_ids])
    bulk(cur, "INSERT INTO person_locations VALUES %s ON CONFLICT DO NOTHING", list(c.person_location_pairs))
    conn.commit()
    c.stats["organisations"].records_inserted = len(c.person_org_pairs)

    print("\n=== Final per-domain insert report ===")
    for domain in ["persons", "phones", "passports", "accounts", "devices", "vehicles",
                   "social-media", "properties", "led-cases", "transactions", "calls",
                   "travel", "cctv", "face-matches", "documents", "criminal-records",
                   "courts", "evidence", "alerts", "investigations",
                   "account-relationships", "related-persons", "organisations"]:
        print(c.stats[domain].line())

    # ---- post-ingestion validation --------------------------------------
    run_post_ingest_validation(cur)

    # ---- automatic spot check on one real person ------------------------
    spot_person = persons_order[0] if persons_order and persons_order[0] else next(iter(c.known_person_ids))
    print(f"\n=== Automatic spot check: {spot_person} ===")
    run_spot_check(cur, domains, persons_order, spot_person)

    cur.close()
    conn.close()
    print("\nIngestion complete.")
    return c, persons_order


PK_UNIQUENESS_TABLES = [
    ("persons", "person_id"),
    ("passports", "passport_id"),
    ("accounts", "account_id"),
    ("phones_sim", "phone_id"),
    ("devices", "device_id"),
    ("vehicles", "vehicle_id"),
    ("social_media", "social_account_id"),
    ("properties", "property_id"),
    ("transactions", "transaction_id"),
    ("calls", "call_id"),
    ("travel", "travel_id"),
    ("cctv", "cctv_event_id"),
    ("face_recognition", "face_match_id"),
    ("documents", "document_id"),
    ("criminal_records", "criminal_record_id"),
    ("court_records", "court_record_id"),
    ("cases", "case_id"),
    ("evidence", "evidence_id"),
    ("alerts", "alert_id"),
    ("investigations", "investigation_id"),
    ("account_relationships", "account_relationship_id"),
    ("person_relationships", "relationship_id"),
    ("organizations", "organization_id"),
    ("locations", "location_id"),
]

FK_ORPHAN_CHECKS = [
    ("passports", "person_id", "persons", "person_id"),
    ("accounts", "person_id", "persons", "person_id"),
    ("phones_sim", "person_id", "persons", "person_id"),
    ("devices", "person_id", "persons", "person_id"),
    ("vehicles", "person_id", "persons", "person_id"),
    ("social_media", "person_id", "persons", "person_id"),
    ("properties", "person_id", "persons", "person_id"),
    ("transactions", "person_id", "persons", "person_id"),
    ("transactions", "counterparty_person_id", "persons", "person_id"),
    ("calls", "person_id", "persons", "person_id"),
    ("calls", "counterparty_person_id", "persons", "person_id"),
    ("travel", "person_id", "persons", "person_id"),
    ("cctv", "person_id", "persons", "person_id"),
    ("face_recognition", "person_id", "persons", "person_id"),
    ("face_recognition", "cctv_event_id", "cctv", "cctv_event_id"),
    ("documents", "person_id", "persons", "person_id"),
    ("documents", "case_id", "cases", "case_id"),
    ("criminal_records", "person_id", "persons", "person_id"),
    ("criminal_records", "case_id", "cases", "case_id"),
    ("court_records", "person_id", "persons", "person_id"),
    ("court_records", "case_id", "cases", "case_id"),
    ("case_persons", "person_id", "persons", "person_id"),
    ("case_persons", "case_id", "cases", "case_id"),
    ("evidence", "person_id", "persons", "person_id"),
    ("evidence", "case_id", "cases", "case_id"),
    ("alerts", "person_id", "persons", "person_id"),
    ("alerts", "case_id", "cases", "case_id"),
    ("investigations", "person_id", "persons", "person_id"),
    ("investigations", "case_id", "cases", "case_id"),
    ("account_relationships", "person_id", "persons", "person_id"),
    ("account_relationships", "related_person_id", "persons", "person_id"),
    ("person_relationships", "person_id", "persons", "person_id"),
    ("person_relationships", "related_person_id", "persons", "person_id"),
    ("person_organizations", "person_id", "persons", "person_id"),
    ("person_organizations", "organization_id", "organizations", "organization_id"),
    ("person_locations", "person_id", "persons", "person_id"),
    ("person_locations", "location_id", "locations", "location_id"),
]


def run_post_ingest_validation(cur):
    print("\n=== Post-ingestion validation ===")

    cur.execute("SELECT count(*) FROM persons")
    person_count = cur.fetchone()[0]
    status = "OK" if person_count == EXPECTED_PERSON_COUNT else "MISMATCH"
    print(f"  [{status}] persons count = {person_count} (expected {EXPECTED_PERSON_COUNT})")

    print("\n  -- Primary-key uniqueness --")
    for table, pk in PK_UNIQUENESS_TABLES:
        cur.execute(f"SELECT count(*), count(DISTINCT {pk}) FROM {table}")
        total, distinct = cur.fetchone()
        status = "OK" if total == distinct else "MISMATCH"
        print(f"  [{status}] {table}.{pk}: total={total} distinct={distinct}")

    print("\n  -- Foreign-key orphan checks --")
    for child_table, child_col, parent_table, parent_col in FK_ORPHAN_CHECKS:
        cur.execute(f"""
            SELECT count(*) FROM {child_table} c
            LEFT JOIN {parent_table} p ON c.{child_col} = p.{parent_col}
            WHERE c.{child_col} IS NOT NULL AND p.{parent_col} IS NULL
        """)
        orphans = cur.fetchone()[0]
        status = "OK" if orphans == 0 else "ORPHANS FOUND"
        print(f"  [{status}] {child_table}.{child_col} -> {parent_table}.{parent_col}: {orphans} orphan rows")


SPOT_CHECK_DOMAINS = [
    # (domain, id_col_in_file, table, pk_col_in_table)
    ("passports", "passport_id", "passports", "passport_id"),      # single-valued
    ("accounts", "account_ids", "accounts", "account_id"),
    ("devices", "device_ids", "devices", "device_id"),
    ("vehicles", "vehicle_ids", "vehicles", "vehicle_id"),
    ("social-media", "social_account_ids", "social_media", "social_account_id"),
    ("properties", "property_ids", "properties", "property_id"),
    ("transactions", "transaction_ids", "transactions", "transaction_id"),
    ("calls", "call_ids", "calls", "call_id"),
    ("travel", "travel_ids", "travel", "travel_id"),
    ("cctv", "cctv_event_ids", "cctv", "cctv_event_id"),
    ("face-matches", "face_match_ids", "face_recognition", "face_match_id"),
    ("documents", "document_ids", "documents", "document_id"),
    ("criminal-records", "criminal_record_ids", "criminal_records", "criminal_record_id"),
    ("courts", "court_record_ids", "court_records", "court_record_id"),
    ("evidence", "evidence_ids", "evidence", "evidence_id"),
    ("alerts", "alert_ids", "alerts", "alert_id"),
    ("investigations", "investigation_ids", "investigations", "investigation_id"),
    ("account-relationships", "account_relationship_ids", "account_relationships", "account_relationship_id"),
    ("related-persons", "related_person_relationship_ids", "person_relationships", "relationship_id"),
]


def run_spot_check(cur, domains, persons_order, person_id):
    mismatches = 0

    # phones (positional)
    if person_id in persons_order:
        i = persons_order.index(person_id)
        wb, idx, rows = open_sheet(domains["phones"])
        phone_row = None
        for j, row in enumerate(rows):
            if j == i:
                phone_row = row
                break
        wb.close()
        expected_phones = set(split_field(phone_row[idx["all_phone_ids"]])) if phone_row else set()
        cur.execute("SELECT phone_id FROM phones_sim WHERE person_id = %s", (person_id,))
        actual_phones = {r[0] for r in cur.fetchall()}
        status = "MATCH" if expected_phones == actual_phones else "MISMATCH"
        if status == "MISMATCH":
            mismatches += 1
        print(f"  [{status}] phones: source={sorted(expected_phones)} db={sorted(actual_phones)}")

    for domain, id_col, table, pk_col in SPOT_CHECK_DOMAINS:
        path = domains[domain]
        wb, idx, rows = open_sheet(path)
        expected_ids = set()
        for row in rows:
            pid = row[idx["person_id"]] if "person_id" in idx else None
            if pid and str(pid).strip() == person_id:
                if domain == "passports":
                    val = row[idx[id_col]] if id_col in idx else None
                    if val:
                        expected_ids.add(val)
                else:
                    expected_ids.update(x for x in split_field(row[idx[id_col]]) if x)
                break  # one row per person in every domain file
        wb.close()

        cur.execute(f"SELECT {pk_col} FROM {table} WHERE person_id = %s", (person_id,))
        actual_ids = {r[0] for r in cur.fetchall()}
        status = "MATCH" if expected_ids == actual_ids else "MISMATCH"
        if status == "MISMATCH":
            mismatches += 1
        print(f"  [{status}] {domain}: source={sorted(expected_ids)} db={sorted(actual_ids)}")

    # organizations via junction table
    wb, idx, rows = open_sheet(domains["organisations"])
    expected_orgs = set()
    for row in rows:
        pid = row[idx["person_id"]] if "person_id" in idx else None
        if pid and str(pid).strip() == person_id:
            expected_orgs.update(x for x in split_field(row[idx["related_organization_ids"]]) if x)
            break
    wb.close()
    cur.execute("SELECT organization_id FROM person_organizations WHERE person_id = %s", (person_id,))
    actual_orgs = {r[0] for r in cur.fetchall()}
    status = "MATCH" if expected_orgs == actual_orgs else "MISMATCH"
    if status == "MISMATCH":
        mismatches += 1
    print(f"  [{status}] organizations: source={sorted(expected_orgs)} db={sorted(actual_orgs)}")

    print(f"\n  Spot check for {person_id}: {mismatches} mismatch(es) out of "
          f"{len(SPOT_CHECK_DOMAINS) + 2} categories compared.")


def spot_check_only(domains, person_id):
    import psycopg2
    print(f"Connecting to Postgres for spot-check-only run against {person_id} ...")
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    wb, idx, rows = open_sheet(domains["persons"])
    persons_order = [str(r[idx["person_id"]]).strip() if r[idx["person_id"]] else None for r in rows]
    wb.close()
    print(f"=== Spot check: {person_id} ===")
    run_spot_check(cur, domains, persons_order, person_id)
    cur.close()
    conn.close()


def main():
    parser = argparse.ArgumentParser(description="TRINETRA Master Dataset ingestion (domain-file pipeline)")
    parser.add_argument("--dry-run", action="store_true",
                         help="Parse and validate every domain workbook; make no DB connection and no DB changes.")
    parser.add_argument("--spot-check", metavar="PERSON_ID", default=None,
                         help="After a full ingest, spot-check this person instead of the default (first person in the file).")
    parser.add_argument("--spot-check-only", metavar="PERSON_ID", default=None,
                         help="Skip ingestion entirely; just spot-check this person against whatever is already loaded.")
    args = parser.parse_args()

    domains = load_domain_files()
    required = {"persons", "phones"}
    missing = required - set(domains.keys())
    if missing:
        print(f"ERROR: dataset-manifest.json is missing required domain(s): {missing}")
        sys.exit(1)

    if args.spot_check_only:
        spot_check_only(domains, args.spot_check_only)
        return

    run_ingest(domains, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
