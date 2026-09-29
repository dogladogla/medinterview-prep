-- 0001_foundation (M1)
-- App lives in its own schema `interview` inside the shared aqa-bio-mastery project.
-- Auth (auth.users) is shared with other apps, so there is NO trigger on auth.users:
-- profiles are created lazily by the app on first sign-in.

create schema if not exists interview;

grant usage on schema interview to anon, authenticated, service_role;
alter default privileges in schema interview grant select on tables to anon, authenticated;
alter default privileges in schema interview grant all on tables to service_role;
alter default privileges in schema interview grant all on sequences to service_role;
alter default privileges in schema interview grant execute on functions to anon, authenticated, service_role;

create type interview.user_tier as enum ('free', 'pro', 'premium');
create type interview.applicant_type as enum ('school_leaver', 'graduate', 'international', 'reapplicant');

create or replace function interview.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------
create table interview.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  display_name    text check (char_length(display_name) <= 80),
  applicant_type  interview.applicant_type,
  tier            interview.user_tier not null default 'free',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger profiles_updated_at before update on interview.profiles
  for each row execute function interview.set_updated_at();

alter table interview.profiles enable row level security;

create policy "profiles: read own" on interview.profiles
  for select to authenticated using (id = (select auth.uid()));

create policy "profiles: insert own" on interview.profiles
  for insert to authenticated with check (id = (select auth.uid()));

create policy "profiles: update own" on interview.profiles
  for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- Users must never set their own tier: column-level grants only.
revoke all on interview.profiles from anon, authenticated;
grant select on interview.profiles to authenticated;
grant insert (id, display_name, applicant_type) on interview.profiles to authenticated;
grant update (display_name, applicant_type) on interview.profiles to authenticated;

-- ---------------------------------------------------------------------
-- feature_flags (all features free at launch)
-- ---------------------------------------------------------------------
create table interview.feature_flags (
  key                  text primary key,
  description          text not null,
  free_enabled         boolean not null default true,
  pro_enabled          boolean not null default true,
  premium_enabled      boolean not null default true,
  free_daily_limit     int check (free_daily_limit >= 0),
  pro_daily_limit      int check (pro_daily_limit >= 0),
  premium_daily_limit  int check (premium_daily_limit >= 0)
);

alter table interview.feature_flags enable row level security;
create policy "feature_flags: public read" on interview.feature_flags
  for select to anon, authenticated using (true);

revoke all on interview.feature_flags from anon, authenticated;
grant select on interview.feature_flags to anon, authenticated;

insert into interview.feature_flags (key, description) values
  ('ai_feedback',    'AI rubric feedback on typed answers'),
  ('mock_station',   'Timed mock stations'),
  ('ai_interviewer', 'AI interviewer text chat'),
  ('progress',       'Progress dashboard and spaced repetition');

-- Expose the schema to the Data API (same pattern as the existing `chem` schema).
alter role authenticator set pgrst.db_schemas = 'public, chem, interview';
notify pgrst, 'reload config';
