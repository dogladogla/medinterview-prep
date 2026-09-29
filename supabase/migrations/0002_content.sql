-- 0002_content (M2)
-- Content tables for the `interview` schema. Content is public-read (published only);
-- writes happen only through the seed pipeline (service role / migration role).

create type interview.interview_format    as enum ('mmi', 'panel', 'group', 'online', 'oxbridge');
create type interview.framework_category  as enum ('ethics', 'reflection', 'communication', 'structure');
create type interview.reading_source_type as enum ('gmc', 'nhs', 'book', 'article', 'report', 'guidance', 'law', 'case');
create type interview.content_status      as enum ('draft', 'published');
create type interview.persona_style       as enum ('warm', 'neutral', 'clinical', 'probing');

-- ---------------------------------------------------------------------
create table interview.universities (
  id                       uuid primary key default gen_random_uuid(),
  slug                     text not null unique,
  name                     text not null,
  interview_formats        interview.interview_format[] not null default '{}',
  overview                 text,
  interview_format_detail  text,
  interview_style_notes    text,                         -- injected into AI prompts
  what_they_look_for       jsonb not null default '[]' check (jsonb_typeof(what_they_look_for) = 'array'),
  key_values               jsonb not null default '[]' check (jsonb_typeof(key_values) = 'array'),
  typical_question_themes  jsonb not null default '[]' check (jsonb_typeof(typical_question_themes) = 'array'),
  preparation_tips         jsonb not null default '[]' check (jsonb_typeof(preparation_tips) = 'array'),
  external_links           jsonb not null default '[]' check (jsonb_typeof(external_links) = 'array'),
  last_verified_at         date,
  status                   interview.content_status not null default 'draft',
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create table interview.categories (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  description  text,
  sort_order   int not null default 0,
  icon         text
);

create table interview.questions (
  id                     uuid primary key default gen_random_uuid(),
  slug                   text not null unique,
  category_id            uuid not null references interview.categories(id) on delete restrict,
  formats                interview.interview_format[] not null check (cardinality(formats) > 0),
  difficulty             smallint not null check (difficulty between 1 and 5),
  question_text          text not null,
  station_brief          text,                                   -- scenario/data for MMI-style stations
  what_is_being_tested   text,
  follow_ups             jsonb not null default '[]' check (jsonb_typeof(follow_ups) = 'array'),
  model_answer_scaffold  jsonb not null default '[]' check (jsonb_typeof(model_answer_scaffold) = 'array'),
  model_answer_exemplar  text,
  exemplar_annotations   jsonb not null default '[]' check (jsonb_typeof(exemplar_annotations) = 'array'),
  key_points             jsonb not null default '[]' check (jsonb_typeof(key_points) = 'array'),
  common_pitfalls        jsonb not null default '[]' check (jsonb_typeof(common_pitfalls) = 'array'),
  tags                   text[] not null default '{}',
  status                 interview.content_status not null default 'draft',
  search                 tsvector generated always as (
                           setweight(to_tsvector('english', question_text), 'A') ||
                           setweight(to_tsvector('english', coalesce(station_brief, '')), 'B')
                         ) stored,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);
create index questions_category_idx on interview.questions (category_id);
create index questions_formats_idx  on interview.questions using gin (formats);
create index questions_tags_idx     on interview.questions using gin (tags);
create index questions_search_idx   on interview.questions using gin (search);

-- No rows for a question = applies to all universities.
create table interview.question_universities (
  question_id    uuid not null references interview.questions(id) on delete cascade,
  university_id  uuid not null references interview.universities(id) on delete cascade,
  primary key (question_id, university_id)
);
create index question_universities_uni_idx on interview.question_universities (university_id);

create table interview.frameworks (
  id                          uuid primary key default gen_random_uuid(),
  slug                        text not null unique,
  name                        text not null,
  category                    interview.framework_category not null,
  summary                     text not null,
  when_to_use                 text,
  steps                       jsonb not null default '[]' check (jsonb_typeof(steps) = 'array'),
  worked_example              text,
  worked_example_question_id  uuid references interview.questions(id) on delete set null,
  common_mistakes             jsonb not null default '[]' check (jsonb_typeof(common_mistakes) = 'array'),
  sort_order                  int not null default 0,
  status                      interview.content_status not null default 'draft',
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

-- One join table = bidirectional question <-> framework links.
create table interview.question_frameworks (
  question_id   uuid not null references interview.questions(id) on delete cascade,
  framework_id  uuid not null references interview.frameworks(id) on delete cascade,
  is_primary    boolean not null default false,
  primary key (question_id, framework_id)
);
create index question_frameworks_fw_idx on interview.question_frameworks (framework_id);

create table interview.reading_items (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  title             text not null,
  source_type       interview.reading_source_type not null,
  author            text,
  url               text,
  edition_note      text,
  summary           text not null,               -- original summary, never source text
  why_it_matters    text,
  key_takeaways     jsonb not null default '[]' check (jsonb_typeof(key_takeaways) = 'array'),
  how_to_use_it     text,
  difficulty        smallint check (difficulty between 1 and 5),
  last_verified_at  date,
  status            interview.content_status not null default 'draft',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table interview.reading_item_categories (
  reading_item_id  uuid not null references interview.reading_items(id) on delete cascade,
  category_id      uuid not null references interview.categories(id) on delete cascade,
  primary key (reading_item_id, category_id)
);

create table interview.reading_item_questions (
  reading_item_id  uuid not null references interview.reading_items(id) on delete cascade,
  question_id      uuid not null references interview.questions(id) on delete cascade,
  primary key (reading_item_id, question_id)
);
create index reading_item_questions_q_idx on interview.reading_item_questions (question_id);

create table interview.university_reading_items (
  university_id    uuid not null references interview.universities(id) on delete cascade,
  reading_item_id  uuid not null references interview.reading_items(id) on delete cascade,
  primary key (university_id, reading_item_id)
);

-- System prompts live in code (/lib/ai/prompts), not here.
create table interview.interviewer_personas (
  id                      uuid primary key default gen_random_uuid(),
  slug                    text not null unique,
  name                    text not null,
  style                   interview.persona_style not null,
  description             text,
  follow_up_style         text,
  prompt_key              text not null,
  affinity_university_id  uuid references interview.universities(id) on delete set null,
  sort_order              int not null default 0,
  is_active               boolean not null default true
);

create table interview.profile_target_universities (
  profile_id     uuid not null references interview.profiles(id) on delete cascade,
  university_id  uuid not null references interview.universities(id) on delete cascade,
  primary key (profile_id, university_id)
);

-- updated_at
create trigger universities_updated_at  before update on interview.universities  for each row execute function interview.set_updated_at();
create trigger questions_updated_at     before update on interview.questions     for each row execute function interview.set_updated_at();
create trigger frameworks_updated_at    before update on interview.frameworks    for each row execute function interview.set_updated_at();
create trigger reading_items_updated_at before update on interview.reading_items for each row execute function interview.set_updated_at();

-- RLS
alter table interview.universities                enable row level security;
alter table interview.categories                  enable row level security;
alter table interview.questions                   enable row level security;
alter table interview.question_universities       enable row level security;
alter table interview.frameworks                  enable row level security;
alter table interview.question_frameworks         enable row level security;
alter table interview.reading_items               enable row level security;
alter table interview.reading_item_categories     enable row level security;
alter table interview.reading_item_questions      enable row level security;
alter table interview.university_reading_items    enable row level security;
alter table interview.interviewer_personas        enable row level security;
alter table interview.profile_target_universities enable row level security;

create policy "universities: read published"  on interview.universities  for select to anon, authenticated using (status = 'published');
create policy "categories: read"               on interview.categories    for select to anon, authenticated using (true);
create policy "questions: read published"      on interview.questions     for select to anon, authenticated using (status = 'published');
create policy "frameworks: read published"     on interview.frameworks    for select to anon, authenticated using (status = 'published');
create policy "reading_items: read published"  on interview.reading_items for select to anon, authenticated using (status = 'published');
create policy "personas: read active"          on interview.interviewer_personas for select to anon, authenticated using (is_active);
create policy "q_unis: read"   on interview.question_universities    for select to anon, authenticated using (true);
create policy "q_fws: read"    on interview.question_frameworks      for select to anon, authenticated using (true);
create policy "ri_cats: read"  on interview.reading_item_categories  for select to anon, authenticated using (true);
create policy "ri_qs: read"    on interview.reading_item_questions   for select to anon, authenticated using (true);
create policy "uni_ri: read"   on interview.university_reading_items for select to anon, authenticated using (true);

create policy "targets: read own"   on interview.profile_target_universities for select to authenticated using (profile_id = (select auth.uid()));
create policy "targets: insert own" on interview.profile_target_universities for insert to authenticated with check (profile_id = (select auth.uid()));
create policy "targets: delete own" on interview.profile_target_universities for delete to authenticated using (profile_id = (select auth.uid()));

-- Grants: content read-only for clients; target list is the only user-writable table here.
revoke all on all tables in schema interview from anon, authenticated;
grant select on interview.profiles to authenticated;
grant insert (id, display_name, applicant_type) on interview.profiles to authenticated;
grant update (display_name, applicant_type) on interview.profiles to authenticated;
grant select on interview.feature_flags to anon, authenticated;
grant select on
  interview.universities, interview.categories, interview.questions, interview.question_universities,
  interview.frameworks, interview.question_frameworks, interview.reading_items,
  interview.reading_item_categories, interview.reading_item_questions, interview.university_reading_items,
  interview.interviewer_personas
to anon, authenticated;
grant select, insert, delete on interview.profile_target_universities to authenticated;

notify pgrst, 'reload schema';
