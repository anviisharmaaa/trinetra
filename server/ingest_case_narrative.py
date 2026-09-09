#!/usr/bin/env python3
"""
TRINETRA case-narrative ingestion -- separate, additive path for the
case-narrative workbook (6 free-form LED-case writeups), excluded from the
main 24-domain ingestion (see ingest.py's EXCLUDED_DOMAINS).

This script NEVER creates persons, cases, or any structured domain record
(accounts/transactions/calls/...), and NEVER modifies ingest.py's tables.
It only writes into case_narrative_notes, and only two things per sheet:
  - PERSONS OF INTEREST    -> one CONNECTION_BASIS note per person
  - CHRONOLOGICAL TIMELINE -> one TIMELINE_EVENT note per row

Person identity is NEVER resolved by a global name lookup. Each sheet's own
PERSONS OF INTEREST table is the only Name -> Person ID map used, and it is
only consulted as a fallback if a Timeline "Person Ref" value isn't already
a bare Person ID (in today's file it always is).

Every Case ID and every Person ID this script is about to write must
already exist in Postgres (`cases`, `persons`) -- this script assumes the
Master Dataset ingestion has already run. Any Case ID or Person ID that
doesn't resolve, or any ambiguous local name, aborts the ENTIRE run with a
full report (sheet, row, value) before anything is written -- mirroring
ingest.py's unresolved-reference fail-fast gate.

Usage:
    python server/ingest_case_narrative.py --dry-run   # connects read-only
                                                         # to validate against
                                                         # live cases/persons,
                                                         # prints exactly what
                                                         # would be inserted,
                                                         # then ROLLS BACK --
                                                         # never commits
    python server/ingest_case_narrative.py              # real import
    python server/ingest_case_narrative.py --file PATH  # override the
                                                         # workbook path
"""
import sys, os, re, hashlib, argparse
import datetime as dt
import openpyxl

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ingest import load_env, DATABASE_URL, to_date  # noqa: E402  (read-only reuse, no changes to ingest.py)

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(HERE)
DEFAULT_FILE = os.path.join(PROJECT_ROOT, "data", "anamolies", "TRINETRA_Case_Data.xlsx")

CASE_ID_RE = re.compile(r"CASE-\d+")


def compress(row):
    return [v for v in row if v is not None and str(v).strip() != ""]


def split_into_blocks(rows):
    blocks, cur = [], []
    for r in rows:
        c = compress(r)
        if not c:
            if cur:
                blocks.append(cur)
                cur = []
        else:
            cur.append(r)
    if cur:
        blocks.append(cur)
    return blocks


def find_block(blocks, title_prefix):
    for b in blocks:
        first = compress(b[0])
        if len(first) == 1 and str(first[0]).upper().startswith(title_prefix):
            return b
    return None


def to_time_str(val):
    if val is None:
        return None
    if isinstance(val, dt.time):
        return val.strftime("%H:%M:%S")
    if isinstance(val, dt.datetime):
        return val.time().strftime("%H:%M:%S")
    s = str(val).strip()
    return s or None


def parse_sheet(ws, sheet_name):
    """Returns (case_id, persons_of_interest, timeline, errors).
    persons_of_interest: [{person_id, name, connection_basis, row_num}]
    timeline: [{date, time, description, person_ref, row_num}]
    Row numbers are 1-based, matching what you'd see in Excel."""
    rows = list(ws.iter_rows(values_only=True))
    blocks = split_into_blocks(rows)
    errors = []

    title_row = compress(blocks[0][0])[0]
    m = CASE_ID_RE.search(str(title_row))
    case_id = m.group(0) if m else None
    if not case_id:
        errors.append(f"{sheet_name}: could not find a Case ID in the title row {title_row!r}")

    poi_block = find_block(blocks, "PERSONS OF INTEREST")
    persons_of_interest = []
    if poi_block:
        header = compress(poi_block[1])
        idx = {name: i for i, name in enumerate(header)}
        for row in poi_block[2:]:
            row_num = rows.index(row) + 1
            pid = row[idx["Person ID"]] if "Person ID" in idx else None
            basis = row[idx["Connection Basis"]] if "Connection Basis" in idx else None
            if not pid:
                continue
            persons_of_interest.append({
                "person_id": str(pid).strip(),
                "name": str(row[idx["Name"]]).strip() if "Name" in idx and row[idx["Name"]] else None,
                "connection_basis": str(basis).strip() if basis else None,
                "row_num": row_num,
            })
    else:
        errors.append(f"{sheet_name}: no PERSONS OF INTEREST section found")

    tl_block = find_block(blocks, "CHRONOLOGICAL TIMELINE")
    timeline = []
    if tl_block:
        header = compress(tl_block[1])
        idx = {name: i for i, name in enumerate(header)}
        for row in tl_block[2:]:
            row_num = rows.index(row) + 1
            desc = row[idx["Event Description"]] if "Event Description" in idx else None
            ref = row[idx["Person Ref"]] if "Person Ref" in idx else None
            if not desc:
                continue
            timeline.append({
                "date": row[idx["Date"]] if "Date" in idx else None,
                "time": row[idx["Time"]] if "Time" in idx else None,
                "description": str(desc).strip(),
                "person_ref": str(ref).strip() if ref else None,
                "row_num": row_num,
            })
    else:
        errors.append(f"{sheet_name}: no CHRONOLOGICAL TIMELINE section found")

    return case_id, persons_of_interest, timeline, errors


def resolve_person_ref(value, poi_ids, poi_by_name):
    """A Timeline Person Ref is normally already a Person ID (today's file
    always has this). If it isn't one of this sheet's own POI Person IDs,
    fall back to resolving it as a Name against this SAME sheet's POI table
    only -- never a global name lookup. Returns a Person ID or None."""
    if value in poi_ids:
        return value
    if value in poi_by_name:
        return poi_by_name[value]
    return None


def note_id(case_id, kind, source_ref):
    """Deterministic -- same source row always produces the same id, so a
    second run's INSERT ... ON CONFLICT (id) DO NOTHING is a true no-op."""
    digest = hashlib.sha1(f"{case_id}|{kind}|{source_ref}".encode()).hexdigest()[:16]
    return f"CNOTE-{digest}"


def build_notes(file_path):
    """Pure parsing + resolution, no DB. Returns (notes, errors) where
    `notes` is a list of dicts ready to insert and `errors` is every
    unresolved case_id/person_id/ambiguous-name found (sheet, row, value)."""
    wb = openpyxl.load_workbook(file_path, read_only=True, data_only=True)
    file_basename = os.path.basename(file_path)
    notes = []
    errors = []

    for sheet_name in wb.sheetnames:
        ws = wb[sheet_name]
        case_id, poi, timeline, parse_errors = parse_sheet(ws, sheet_name)
        errors.extend(parse_errors)
        if not case_id:
            continue

        poi_ids = {p["person_id"] for p in poi}

        # Duplicate names within this one sheet would make name-based
        # fallback resolution ambiguous -- fail loudly rather than guess.
        name_counts = {}
        for p in poi:
            if p["name"]:
                name_counts[p["name"]] = name_counts.get(p["name"], 0) + 1
        ambiguous_names = {n for n, cnt in name_counts.items() if cnt > 1}
        for name in ambiguous_names:
            errors.append(
                f"{sheet_name}: name {name!r} appears {name_counts[name]} times in "
                f"PERSONS OF INTEREST -- name-based fallback resolution is ambiguous for this sheet"
            )
        poi_by_name = {p["name"]: p["person_id"] for p in poi if p["name"] and p["name"] not in ambiguous_names}

        for p in poi:
            if not p["connection_basis"]:
                continue
            source_ref = f"{file_basename}!{sheet_name}!row{p['row_num']}"
            notes.append({
                "id": note_id(case_id, "CONNECTION_BASIS", source_ref),
                "case_id": case_id,
                "person_id": p["person_id"],
                "kind": "CONNECTION_BASIS",
                "event_date": None,
                "event_time": None,
                "text": p["connection_basis"],
                "source_ref": source_ref,
            })

        for ev in timeline:
            source_ref = f"{file_basename}!{sheet_name}!row{ev['row_num']}"
            resolved_pid = None
            if ev["person_ref"]:
                resolved_pid = resolve_person_ref(ev["person_ref"], poi_ids, poi_by_name)
                if resolved_pid is None:
                    errors.append(
                        f"{sheet_name} row {ev['row_num']}: Timeline Person Ref {ev['person_ref']!r} "
                        f"is not in this sheet's own PERSONS OF INTEREST table"
                    )
                    continue
            notes.append({
                "id": note_id(case_id, "TIMELINE_EVENT", source_ref),
                "case_id": case_id,
                "person_id": resolved_pid,
                "kind": "TIMELINE_EVENT",
                "event_date": to_date(ev["date"]),
                "event_time": to_time_str(ev["time"]),
                "text": ev["description"],
                "source_ref": source_ref,
            })

    wb.close()
    return notes, errors


def run(file_path, dry_run):
    notes, parse_errors = build_notes(file_path)

    import psycopg2
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    try:
        case_ids = sorted({n["case_id"] for n in notes})
        person_ids = sorted({n["person_id"] for n in notes if n["person_id"]})

        cur.execute("SELECT case_id FROM cases WHERE case_id = ANY(%s)", (case_ids,))
        found_cases = {r[0] for r in cur.fetchall()}
        missing_cases = set(case_ids) - found_cases

        cur.execute("SELECT person_id FROM persons WHERE person_id = ANY(%s)", (person_ids,))
        found_persons = {r[0] for r in cur.fetchall()}
        missing_persons = set(person_ids) - found_persons

        errors = parse_errors[:]
        errors += [f"Case ID {c} not found in Postgres `cases`" for c in sorted(missing_cases)]
        errors += [f"Person ID {p} not found in Postgres `persons`" for p in sorted(missing_persons)]

        if errors:
            print(f"\nBLOCKING: {len(errors)} validation failure(s) -- nothing will be written.\n")
            for e in errors:
                print(f"  - {e}")
            conn.rollback()
            sys.exit(1)

        cur.execute("SELECT id FROM case_narrative_notes WHERE id = ANY(%s)", ([n["id"] for n in notes],))
        already_present = {r[0] for r in cur.fetchall()}
        new_count = len(notes) - len(already_present)

        by_kind = {}
        for n in notes:
            by_kind[n["kind"]] = by_kind.get(n["kind"], 0) + 1

        print(f"Cases: {len(case_ids)} (all resolved)   Persons referenced: {len(person_ids)} (all resolved)")
        print(f"Notes to write: {len(notes)} total  ({by_kind})")
        print(f"  already present (no-op on conflict): {len(already_present)}")
        print(f"  new: {new_count}")

        if dry_run:
            print("\n=== DRY RUN -- rolling back, nothing was written ===")
            conn.rollback()
            return

        from psycopg2.extras import execute_values
        execute_values(
            cur,
            "INSERT INTO case_narrative_notes "
            "(id, case_id, person_id, kind, event_date, event_time, text, source_ref) "
            "VALUES %s ON CONFLICT (id) DO NOTHING",
            [
                (n["id"], n["case_id"], n["person_id"], n["kind"], n["event_date"], n["event_time"], n["text"], n["source_ref"])
                for n in notes
            ],
        )
        conn.commit()
        print("\nCommitted.")
    finally:
        cur.close()
        conn.close()


def main():
    load_env()
    parser = argparse.ArgumentParser(description="TRINETRA case-narrative ingestion")
    parser.add_argument("--file", default=DEFAULT_FILE, help="Path to the case-narrative workbook")
    parser.add_argument("--dry-run", action="store_true", help="Validate and report only; connects read-only and always rolls back")
    args = parser.parse_args()
    run(args.file, args.dry_run)


if __name__ == "__main__":
    main()
