-- Row Level Security.
-- Content is readable by everyone (published only); writes go through the
-- service role / admin tooling. Learning data is private to its owner.

alter table public.topics enable row level security;
alter table public.collections enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_topics enable row level security;
alter table public.segments enable row level security;
alter table public.profiles enable row level security;
alter table public.study_sessions enable row level security;
alter table public.dictation_attempts enable row level security;
alter table public.shadowing_attempts enable row level security;

-- Content: public read
create policy "topics readable" on public.topics for select using (true);
create policy "collections readable" on public.collections for select using (true);
create policy "published lessons readable" on public.lessons
  for select using (published_at is not null and published_at <= now());
create policy "lesson topics readable" on public.lesson_topics for select using (
  exists (select 1 from public.lessons l where l.id = lesson_id and l.published_at <= now())
);
create policy "segments of published lessons readable" on public.segments for select using (
  exists (select 1 from public.lessons l where l.id = lesson_id and l.published_at <= now())
);

-- Profiles: owner only (is_pro is changed by billing via service role, not by the user)
create policy "own profile readable" on public.profiles
  for select using (auth.uid() = id);
create policy "own profile updatable" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
-- A column-level REVOKE does not override Supabase's default table-level grant,
-- so drop table-level UPDATE and grant back only the user-editable columns.
revoke update on public.profiles from authenticated, anon;
grant update (display_name, avatar_url, level, daily_goal_minutes, time_zone)
  on public.profiles to authenticated;

-- Activity: owner only
create policy "own sessions" on public.study_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own dictation attempts" on public.dictation_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own shadowing attempts" on public.shadowing_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
