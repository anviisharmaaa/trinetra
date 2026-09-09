-- Case Builder: `cases` + `case_entities` tables (hybrid architecture)
--
-- HYBRID ARCHITECTURE BOUNDARY — read this before touching anything else:
--   - This migration creates ONLY case-management tables in Supabase.
--   - Person / account / phone / vehicle / transaction / ... investigation
--     data (the TRINETRA Master Dataset — 100k persons, ~1.9M records) is
--     NOT stored here and must never be ingested into Supabase. It lives in
--     a separate, self-hosted PostgreSQL database behind the Express API in
--     server/, which this migration does not touch.
--   - `case_entities.person_id` below is a bare reference (a Person ID, or
--     for "related" links, any other entity id) — the actual record is
--     always resolved live from the Express API at read time. Person data
--     is never duplicated into Supabase.
--
-- OWNERSHIP / ACCESS MODEL:
--   Every case belongs to the analyst who created it (`created_by`),
--   enforced by Row Level Security with per-owner policies below. This is
--   deliberately NOT a blanket "any authenticated user can read/write
--   everything" policy. It is structured so team-based case sharing can be
--   added later (e.g. a `case_members` join table plus an additional `OR
--   exists(...)` clause in each policy) without loosening this baseline.
--
-- This project's existing Supabase authentication (auth.users, sessions,
-- login/signup) is untouched by this migration.
--
-- NOTE: This file is NOT executed automatically by any tooling in this
-- repository. Run it yourself against your Supabase project (SQL editor,
-- or `supabase db push` / the Supabase CLI migration workflow).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- cases
-- ---------------------------------------------------------------------------
create table if not exists public.cases (
  id               text primary key,
  code             text not null,
  name             text not null,
  description      text not null default '',
  status           text not null default 'active'
                     check (status in ('active', 'monitoring', 'closed')),
  priority         text not null default 'medium'
                     check (priority in ('critical', 'high', 'medium', 'low')),
  classification   text not null default 'restricted'
                     check (classification in ('restricted', 'confidential', 'secret')),
  investigator_lead text not null default '',
  team             text[] not null default '{}',
  pinned           boolean not null default false,
  created_by       uuid not null references auth.users(id) on delete cascade,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists cases_created_by_idx on public.cases (created_by);
create index if not exists cases_status_idx on public.cases (status);
create index if not exists cases_updated_at_idx on public.cases (updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cases_set_updated_at on public.cases;
create trigger cases_set_updated_at
  before update on public.cases
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- case_entities — links a case to Victim / Suspect / Related-entity Person
-- IDs. Deliberately minimal: case_id, person_id, role, entity_type. No
-- person data (name, risk level, etc.) is ever stored here.
-- ---------------------------------------------------------------------------
create table if not exists public.case_entities (
  id           uuid primary key default gen_random_uuid(),
  case_id      text not null references public.cases(id) on delete cascade,
  person_id    text not null,
  entity_type  text not null default 'person',
  role         text not null check (role in ('victim', 'suspect', 'related')),
  created_by   uuid not null references auth.users(id) on delete cascade,
  created_at   timestamptz not null default now()
);

create index if not exists case_entities_case_id_idx on public.case_entities (case_id);
create index if not exists case_entities_person_id_idx on public.case_entities (person_id);
create unique index if not exists case_entities_unique_link
  on public.case_entities (case_id, person_id, role);

-- ---------------------------------------------------------------------------
-- Row Level Security — owner-based, not blanket "authenticated" access.
-- ---------------------------------------------------------------------------
alter table public.cases enable row level security;
alter table public.case_entities enable row level security;

drop policy if exists "cases_select_own" on public.cases;
create policy "cases_select_own" on public.cases
  for select
  using (auth.uid() = created_by);

drop policy if exists "cases_insert_own" on public.cases;
create policy "cases_insert_own" on public.cases
  for insert
  with check (auth.uid() = created_by);

drop policy if exists "cases_update_own" on public.cases;
create policy "cases_update_own" on public.cases
  for update
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

drop policy if exists "cases_delete_own" on public.cases;
create policy "cases_delete_own" on public.cases
  for delete
  using (auth.uid() = created_by);

drop policy if exists "case_entities_select_own" on public.case_entities;
create policy "case_entities_select_own" on public.case_entities
  for select
  using (auth.uid() = created_by);

drop policy if exists "case_entities_insert_own" on public.case_entities;
create policy "case_entities_insert_own" on public.case_entities
  for insert
  with check (auth.uid() = created_by);

drop policy if exists "case_entities_update_own" on public.case_entities;
create policy "case_entities_update_own" on public.case_entities
  for update
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

drop policy if exists "case_entities_delete_own" on public.case_entities;
create policy "case_entities_delete_own" on public.case_entities
  for delete
  using (auth.uid() = created_by);

-- ---------------------------------------------------------------------------
-- Future extension point (not created by this migration): to support
-- shared/team cases later, add a `case_members(case_id, user_id, role)`
-- table and widen each policy's `using`/`with check` to:
--   auth.uid() = created_by
--   or exists (select 1 from case_members m where m.case_id = cases.id and m.user_id = auth.uid())
-- ---------------------------------------------------------------------------
