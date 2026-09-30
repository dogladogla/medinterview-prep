-- 0003_user_activity (M4–M9)
-- Per-user practice data. Every table is private to its owner via RLS.
-- anon gets nothing; authenticated users can only touch their own rows.

create type interview.session_mode   as enum ('mock', 'practice');
create type interview.reading_status as enum ('unread', 'read', 'bookmarked');
create type interview.chat_status    as enum ('active', 'ended');

-- ---------------------------------------------------------------------
-- Mock / practice sessions and answers
-- ---------------------------------------------------------------------
create table interview.mock_sessions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null default auth.uid() references interview.profiles(id) on delete cascade,
  mode            interview.session_mode not null default 'mock',
  format          interview.interview_format,
  university_id   uuid references interview.universities(id) on delete set null,
  question_ids    uuid[] not null check (cardinality(question_ids) between 1 and 12),
  prep_seconds    int not null default 60 check (prep_seconds between 0 and 600),
  answer_seconds  int not null default 300 check (answer_seconds between 30 and 1200),
  started_at      timestamptz not null default now(),
  completed_at    timestamptz,
  total_score     numeric(3,2) check (total_score between 1 and 5),
  feedback_json   jsonb
);
create index mock_sessions_user_idx on interview.mock_sessions (user_id, started_at desc);

create table interview.mock_answers (
  id              uuid primary key default gen_random_uuid(),
  session_id      uuid not null references interview.mock_sessions(id) on delete cascade,
  question_id     uuid not null references interview.questions(id) on delete cascade,
  position        smallint not null check (position between 0 and 11),
  answer_text     text not null check (char_length(answer_text) <= 8000),
  ai_feedback     jsonb,
  score           jsonb,
  overall_score   numeric(3,2) check (overall_score between 1 and 5),
  prompt_version  text,
  model           text,
  feedback_error  text,
  created_at      timestamptz not null default now(),
  unique (session_id, position)
);
create index mock_answers_question_idx on interview.mock_answers (question_id);

-- ---------------------------------------------------------------------
-- AI interviewer sessions
-- ---------------------------------------------------------------------
create table interview.interviewer_sessions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null default auth.uid() references interview.profiles(id) on delete cascade,
  persona_id      uuid not null references interview.interviewer_personas(id),
  university_id   uuid references interview.universities(id) on delete set null,
  transcript      jsonb not null default '[]' check (jsonb_typeof(transcript) = 'array'),
  status          interview.chat_status not null default 'active',
  started_at      timestamptz not null default now(),
  ended_at        timestamptz,
  ai_summary      jsonb,
  prompt_version  text,
  model           text
);
create index interviewer_sessions_user_idx on interview.interviewer_sessions (user_id, started_at desc);

-- ---------------------------------------------------------------------
-- Progress
-- ---------------------------------------------------------------------
create table interview.user_progress (
  user_id            uuid not null default auth.uid() references interview.profiles(id) on delete cascade,
  question_id        uuid not null references interview.questions(id) on delete cascade,
  confidence         smallint check (confidence between 1 and 5),
  times_attempted    int not null default 0 check (times_attempted >= 0),
  last_attempted_at  timestamptz,
  starred            boolean not null default false,
  notes              text check (char_length(notes) <= 4000),
  last_score         numeric(3,2) check (last_score between 1 and 5),
  next_review_at     timestamptz,
  updated_at         timestamptz not null default now(),
  primary key (user_id, question_id)
);
create index user_progress_review_idx on interview.user_progress (user_id, next_review_at);

create table interview.reading_progress (
  user_id          uuid not null default auth.uid() references interview.profiles(id) on delete cascade,
  reading_item_id  uuid not null references interview.reading_items(id) on delete cascade,
  status           interview.reading_status not null default 'unread',
  notes            text check (char_length(notes) <= 4000),
  updated_at       timestamptz not null default now(),
  primary key (user_id, reading_item_id)
);

create table interview.framework_views (
  user_id       uuid not null default auth.uid() references interview.profiles(id) on delete cascade,
  framework_id  uuid not null references interview.frameworks(id) on delete cascade,
  viewed_at     timestamptz not null default now(),
  primary key (user_id, framework_id)
);

create trigger user_progress_updated_at    before update on interview.user_progress    for each row execute function interview.set_updated_at();
create trigger reading_progress_updated_at before update on interview.reading_progress for each row execute function interview.set_updated_at();

-- ---------------------------------------------------------------------
-- AI usage quotas. Users can read their own counts; writes only happen
-- through consume_ai_quota(), which checks and increments atomically.
-- ---------------------------------------------------------------------
create table interview.ai_usage (
  user_id      uuid not null references interview.profiles(id) on delete cascade,
  feature_key  text not null references interview.feature_flags(key) on delete cascade,
  day          date not null default (now() at time zone 'Europe/London')::date,
  count        int not null default 0,
  primary key (user_id, feature_key, day)
);

create or replace function interview.consume_ai_quota(p_feature text)
returns table (allowed boolean, used int, daily_limit int)
language plpgsql security definer set search_path = '' as $$
declare
  v_uid   uuid := auth.uid();
  v_tier  interview.user_tier;
  v_flag  interview.feature_flags%rowtype;
  v_limit int;
  v_enabled boolean;
  v_used  int;
  v_day   date := (now() at time zone 'Europe/London')::date;
begin
  if v_uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;
  select tier into v_tier from interview.profiles where id = v_uid;
  if v_tier is null then
    raise exception 'profile missing' using errcode = 'P0002';
  end if;
  select * into v_flag from interview.feature_flags where key = p_feature;
  if not found then
    return query select false, 0, 0; return;
  end if;
  v_enabled := case v_tier when 'free' then v_flag.free_enabled when 'pro' then v_flag.pro_enabled else v_flag.premium_enabled end;
  v_limit   := case v_tier when 'free' then v_flag.free_daily_limit when 'pro' then v_flag.pro_daily_limit else v_flag.premium_daily_limit end;
  if not v_enabled then
    return query select false, 0, 0; return;
  end if;

  insert into interview.ai_usage (user_id, feature_key, day, count)
  values (v_uid, p_feature, v_day, 0)
  on conflict (user_id, feature_key, day) do nothing;

  -- Row lock makes check-then-increment atomic under concurrent requests.
  select u.count into v_used from interview.ai_usage u
   where u.user_id = v_uid and u.feature_key = p_feature and u.day = v_day for update;

  if v_limit is not null and v_used >= v_limit then
    return query select false, v_used, v_limit; return;
  end if;

  update interview.ai_usage u set count = u.count + 1
   where u.user_id = v_uid and u.feature_key = p_feature and u.day = v_day;
  return query select true, v_used + 1, v_limit;
end $$;

revoke all on function interview.consume_ai_quota(text) from public, anon;
grant execute on function interview.consume_ai_quota(text) to authenticated;

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------
alter table interview.mock_sessions        enable row level security;
alter table interview.mock_answers         enable row level security;
alter table interview.interviewer_sessions enable row level security;
alter table interview.user_progress        enable row level security;
alter table interview.reading_progress     enable row level security;
alter table interview.framework_views      enable row level security;
alter table interview.ai_usage             enable row level security;

create policy "mock_sessions: own" on interview.mock_sessions for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- Answers belong to whoever owns the parent session.
create policy "mock_answers: own via session" on interview.mock_answers for all to authenticated
  using (exists (select 1 from interview.mock_sessions s where s.id = session_id and s.user_id = (select auth.uid())))
  with check (exists (select 1 from interview.mock_sessions s where s.id = session_id and s.user_id = (select auth.uid())));

create policy "interviewer_sessions: own" on interview.interviewer_sessions for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "user_progress: own" on interview.user_progress for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "reading_progress: own" on interview.reading_progress for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "framework_views: own" on interview.framework_views for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "ai_usage: read own" on interview.ai_usage for select to authenticated
  using (user_id = (select auth.uid()));

-- Users may delete their own profile row's dependent data via cascades; allow profile delete.
create policy "profiles: delete own" on interview.profiles for delete to authenticated
  using (id = (select auth.uid()));
grant delete on interview.profiles to authenticated;

-- Grants (default privileges gave anon SELECT on new tables — remove it).
revoke all on interview.mock_sessions, interview.mock_answers, interview.interviewer_sessions,
  interview.user_progress, interview.reading_progress, interview.framework_views, interview.ai_usage
  from anon, authenticated;
grant select, insert, update, delete on interview.mock_sessions, interview.mock_answers,
  interview.interviewer_sessions, interview.user_progress, interview.reading_progress,
  interview.framework_views to authenticated;
grant select on interview.ai_usage to authenticated;

-- Daily AI caps (free tier). Tunable later without code changes.
update interview.feature_flags set free_daily_limit = 40, pro_daily_limit = 100, premium_daily_limit = 200 where key = 'ai_feedback';
update interview.feature_flags set free_daily_limit = 60, pro_daily_limit = 150, premium_daily_limit = 300 where key = 'ai_interviewer';

notify pgrst, 'reload schema';
