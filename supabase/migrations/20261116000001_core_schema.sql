-- Core schema: content (topics, collections, lessons, segments) and
-- learning activity (profiles, study sessions, attempts).
-- Progress is never stored pre-aggregated: dashboards derive it from
-- study_sessions, mirroring src/lib/domain/progress.ts.

create extension if not exists pgcrypto;

-- ---------- Enums ----------
create type public.cefr_level as enum ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');
create type public.difficulty as enum ('easy', 'medium', 'hard');
create type public.learning_method as enum ('dictation', 'shadowing');
create type public.media_type as enum ('youtube', 'audio');
create type public.accent as enum ('us', 'uk', 'au');

-- ---------- Content ----------
create table public.topics (
  slug text primary key check (slug ~ '^[a-z0-9-]+$'),
  name text not null,
  icon text not null default 'sparkles',
  sort_order int not null default 0
);

create table public.collections (
  slug text primary key check (slug ~ '^[a-z0-9-]+$'),
  name text not null,
  description text not null default '',
  sort_order int not null default 0
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title text not null,
  description text not null default '',
  level public.cefr_level not null,
  difficulty public.difficulty not null,
  collection_slug text not null references public.collections (slug) on update cascade,
  methods public.learning_method[] not null check (cardinality(methods) > 0),
  media_type public.media_type not null,
  media_id text,
  thumbnail_url text,
  duration_sec int not null check (duration_sec > 0),
  segment_count int not null default 0 check (segment_count >= 0),
  accent public.accent not null default 'us',
  is_pro boolean not null default false,
  learner_count int not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  -- accent-insensitive search; unaccent is not immutable, so search_text is filled by the app/seed
  search_text text not null default ''
);

create index lessons_level_idx on public.lessons (level) where published_at is not null;
create index lessons_published_idx on public.lessons (published_at desc);
create index lessons_learners_idx on public.lessons (learner_count desc);

create table public.lesson_topics (
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  topic_slug text not null references public.topics (slug) on update cascade on delete cascade,
  primary key (lesson_id, topic_slug)
);
create index lesson_topics_topic_idx on public.lesson_topics (topic_slug);

create table public.segments (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  idx int not null check (idx >= 0),
  start_ms int not null check (start_ms >= 0),
  end_ms int not null,
  text text not null,
  unique (lesson_id, idx),
  check (end_ms > start_ms)
);

-- ---------- Users & activity ----------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  avatar_url text,
  level public.cefr_level not null default 'A2',
  daily_goal_minutes int not null default 15 check (daily_goal_minutes between 5 and 240),
  time_zone text not null default 'Asia/Ho_Chi_Minh',
  is_pro boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  method public.learning_method not null,
  started_at timestamptz not null default now(),
  duration_sec int not null default 0 check (duration_sec >= 0),
  segments_completed int not null default 0 check (segments_completed >= 0),
  score smallint not null default 0 check (score between 0 and 100)
);
create index study_sessions_user_time_idx on public.study_sessions (user_id, started_at desc);
create index study_sessions_user_lesson_idx on public.study_sessions (user_id, lesson_id, method);

create table public.dictation_attempts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.study_sessions (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  segment_id uuid not null references public.segments (id) on delete cascade,
  input_text text not null check (char_length(input_text) <= 2000),
  score smallint not null check (score between 0 and 100),
  diff jsonb not null default '[]'::jsonb,
  hints_used smallint not null default 0,
  created_at timestamptz not null default now()
);
create index dictation_attempts_user_idx on public.dictation_attempts (user_id, created_at desc);

create table public.shadowing_attempts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.study_sessions (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  segment_id uuid not null references public.segments (id) on delete cascade,
  audio_path text not null,
  score smallint check (score between 0 and 100),
  assessment jsonb,
  created_at timestamptz not null default now()
);
create index shadowing_attempts_user_idx on public.shadowing_attempts (user_id, created_at desc);

-- ---------- Housekeeping ----------
create function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger profiles_touch before update on public.profiles
for each row execute function public.touch_updated_at();

-- Create a profile row for every new auth user.
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)));
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();
