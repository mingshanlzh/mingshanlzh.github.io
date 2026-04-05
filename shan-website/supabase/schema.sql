-- =========================================================
-- Shan Jiang Academic Website â Supabase Schema v2
-- Run this entire file in your Supabase SQL Editor.
-- =========================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- âââ HELPER: is_admin() ââââââââââââââââââââââââââââââââââââââââââââââââââââââ
-- Returns true if the currently authenticated user has role = 'admin'
create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.user_profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- âââ USER PROFILES (extends Supabase Auth) âââââââââââââââââââââââââââââââââââ
create table if not exists public.user_profiles (
  id           uuid references auth.users(id) on delete cascade primary key,
  display_name text,
  role         text default 'viewer',  -- 'admin' | 'viewer'
  created_at   timestamptz default now()
);
alter table public.user_profiles enable row level security;
create policy "users read own profile" on public.user_profiles
  for select using (auth.uid() = id);
create policy "admin full access profiles" on public.user_profiles
  for all using (public.is_admin());

-- âââ GUEST ACCOUNTS ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
create table if not exists public.guest_accounts (
  id                 uuid default uuid_generate_v4() primary key,
  username           text unique not null,
  password           text not null,
  display_name       text,
  collaborator_label text,
  active             boolean default true,
  created_at         timestamptz default now()
);
alter table public.guest_accounts enable row level security;
-- Block direct anonymous access; use the RPC function instead
create policy "no direct anon read" on public.guest_accounts
  for select using (public.is_admin());
create policy "admin manage guests" on public.guest_accounts
  for all using (public.is_admin());

-- RPC: verify guest credentials (runs with elevated privileges, bypasses RLS)
create or replace function public.guest_login(p_username text, p_password text)
returns jsonb language plpgsql security definer as $$
declare
  acct public.guest_accounts;
begin
  select * into acct
  from public.guest_accounts
  where username = p_username
    and password = p_password
    and active = true;

  if acct.id is null then
    return null;
  end if;

  return jsonb_build_object(
    'id',                acct.id,
    'username',          acct.username,
    'display_name',      coalesce(acct.display_name, acct.username),
    'collaborator_label', acct.collaborator_label
  );
end;
$$;
grant execute on function public.guest_login(text, text) to anon, authenticated;

-- âââ PAGE VISIBILITY âââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
create table if not exists public.page_config (
  page_id    text primary key,
  visible    boolean default true,
  updated_at timestamptz default now()
);
alter table public.page_config enable row level security;
create policy "public read page config" on public.page_config
  for select using (true);
create policy "admin manage page config" on public.page_config
  for all using (public.is_admin());

insert into public.page_config (page_id, visible) values
  ('publications', true), ('cv', true),          ('projects', true),
  ('teaching', true),     ('supervision', true),  ('talks', true),
  ('news', true),         ('research', true),     ('media', true),
  ('awards', true),       ('services', true),     ('affiliations', true),
  ('blog', true),         ('contact', true)
on conflict (page_id) do nothing;

-- âââ CONTACT MESSAGES ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
create table if not exists public.contact_messages (
  id             uuid default uuid_generate_v4() primary key,
  name           text not null,
  email          text not null,
  subject        text,
  message        text not null,
  guest_username text,          -- set when sent by a logged-in guest
  read           boolean default false,
  created_at     timestamptz default now()
);
alter table public.contact_messages enable row level security;
create policy "anyone can send message" on public.contact_messages
  for insert with check (true);
create policy "admin manages messages" on public.contact_messages
  for all using (public.is_admin());

-- âââ AWARDS & GRANTS âââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
create table if not exists public.awards (
  id           uuid default uuid_generate_v4() primary key,
  entry_type   text not null default 'award',  -- 'award' | 'grant'
  title        text not null,
  organisation text,   -- for awards
  year         integer, -- for awards
  funder       text,   -- for grants
  amount       text,   -- for grants
  period       text,   -- for grants
  role         text,   -- for grants
  link         text,
  sort_order   integer default 0,
  created_at   timestamptz default now()
);
alter table public.awards enable row level security;
create policy "public read awards" on public.awards
  for select using (true);
create policy "admin manage awards" on public.awards
  for all using (public.is_admin());

-- âââ PUBLICATIONS ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
create table if not exists public.publications (
  id         uuid default uuid_generate_v4() primary key,
  title      text not null,
  authors    text,                              -- display string, e.g. "Jiang S, Smith J, et al."
  journal    text,
  year       integer,
  volume     text,
  pages      text,
  doi        text,
  url        text,
  pdf        text,
  tags       text[] default '{}',
  featured   boolean default false,
  pub_type   text default 'journal',            -- 'journal'|'conference'|'book'|'preprint'
  status     text default 'published',          -- 'published'|'in_press'|'preprint'
  sort_order integer default 0,
  created_at timestamptz default now()
);
alter table public.publications enable row level security;
create policy "public read publications" on public.publications
  for select using (true);
create policy "admin manage publications" on public.publications
  for all using (public.is_admin());

-- âââ PROJECTS ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
create table if not exists public.projects (
  id                  uuid default uuid_generate_v4() primary key,
  title               text not null,
  description         text,
  summary             text,                        -- guest-visible summary
  status              text default 'active',       -- 'active' | 'completed' | 'paused'
  tags                text[] default '{}',
  collaborator_labels text[] default '{}',
  notice              text,
  notice_type         text default 'info',         -- 'info' | 'warning' | 'success'
  documents           jsonb default '[]',
  last_updated        text,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);
alter table public.projects enable row level security;
create policy "public read projects" on public.projects
  for select using (true);
create policy "admin manage projects" on public.projects
  for all using (public.is_admin());

-- âââ AFTER RUNNING THIS FILE âââââââââââââââââââââââââââââââââââââââââââââââââ
-- 1. Go to Authentication â Users â Add User and sign up with shan.jiang@mq.edu.au
-- 2. Then run:
--    INSERT INTO public.user_profiles (id, display_name, role)
--    VALUES ('<paste-your-user-id-here>', 'Shan Jiang', 'admin');
-- 3. Your admin account is now active.
-- 4. Go to Project Settings â API to get your URL and anon key.
-- 5. Add them as GitHub secrets: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
