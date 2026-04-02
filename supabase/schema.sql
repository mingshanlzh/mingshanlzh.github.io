-- =========================================================
-- Shan Jiang Academic Website — Supabase Schema
-- Run this in your Supabase SQL editor to initialise all tables.
-- =========================================================

-- Enable row level security extension
create extension if not exists "uuid-ossp";

-- ─── USERS / COLLABORATORS ───────────────────────────────────────────────────
-- Supabase Auth handles authentication; this table stores extra profile data.
create table public.user_profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  display_name text,
  affiliation  text,
  role         text default 'collaborator', -- 'admin' | 'collaborator'
  created_at   timestamptz default now()
);

alter table public.user_profiles enable row level security;

-- Users can read their own profile
create policy "user read own profile" on public.user_profiles
  for select using (auth.uid() = id);
-- Only admin can write profiles
create policy "admin manage profiles" on public.user_profiles
  for all using (
    exists (
      select 1 from public.user_profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ─── PROJECTS ────────────────────────────────────────────────────────────────
create table public.projects (
  id            uuid default uuid_generate_v4() primary key,
  title         text not null,
  description   text,
  milestone     int default 0, -- index into milestones array
  tags          text[] default '{}',
  last_updated  timestamptz default now(),
  created_at    timestamptz default now(),
  visible       boolean default true
);

alter table public.projects enable row level security;

-- ─── PROJECT MEMBERSHIPS ─────────────────────────────────────────────────────
create table public.project_members (
  project_id uuid references public.projects(id) on delete cascade,
  user_id    uuid references auth.users(id) on delete cascade,
  primary key (project_id, user_id)
);

alter table public.project_members enable row level security;

-- Collaborators can see only their own projects
create policy "member sees own projects" on public.projects
  for select using (
    exists (
      select 1 from public.project_members pm
      where pm.project_id = id and pm.user_id = auth.uid()
    )
    or
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid() and up.role = 'admin'
    )
  );

create policy "member sees own memberships" on public.project_members
  for select using (user_id = auth.uid());

-- Admin can do everything on projects
create policy "admin manage projects" on public.projects
  for all using (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid() and up.role = 'admin'
    )
  );

-- ─── DOCUMENT UPLOADS ────────────────────────────────────────────────────────
create table public.uploads (
  id          uuid default uuid_generate_v4() primary key,
  project_id  uuid references public.projects(id) on delete cascade,
  uploader_id uuid references auth.users(id) on delete set null,
  filename    text not null,
  storage_path text not null,  -- path in Supabase Storage bucket 'uploads'
  note        text,
  created_at  timestamptz default now()
);

alter table public.uploads enable row level security;

create policy "uploader sees own uploads" on public.uploads
  for select using (uploader_id = auth.uid());
create policy "member uploads to project" on public.uploads
  for insert with check (
    exists (
      select 1 from public.project_members pm
      where pm.project_id = project_id and pm.user_id = auth.uid()
    )
  );
create policy "admin sees all uploads" on public.uploads
  for all using (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid() and up.role = 'admin'
    )
  );

-- ─── CV DOWNLOAD REQUESTS ────────────────────────────────────────────────────
create table public.cv_requests (
  id          uuid default uuid_generate_v4() primary key,
  name        text not null,
  email       text not null,
  affiliation text,
  reason      text,
  approved    boolean default false,
  created_at  timestamptz default now()
);

alter table public.cv_requests enable row level security;

-- Anyone can insert a request (public form)
create policy "public submit cv request" on public.cv_requests
  for insert with check (true);
-- Only admin can read/approve
create policy "admin manage cv requests" on public.cv_requests
  for all using (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid() and up.role = 'admin'
    )
  );

-- ─── CONTACT MESSAGES ────────────────────────────────────────────────────────
create table public.contact_messages (
  id          uuid default uuid_generate_v4() primary key,
  name        text not null,
  email       text not null,
  subject     text,
  message     text not null,
  read        boolean default false,
  created_at  timestamptz default now()
);

alter table public.contact_messages enable row level security;

create policy "public send message" on public.contact_messages
  for insert with check (true);
create policy "admin read messages" on public.contact_messages
  for all using (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid() and up.role = 'admin'
    )
  );

-- ─── NEWS ITEMS ──────────────────────────────────────────────────────────────
create table public.news_items (
  id          uuid default uuid_generate_v4() primary key,
  type        text not null, -- 'publication' | 'talk' | 'award' | 'media' | 'blog'
  title       text not null,
  summary     text,
  link        text,
  item_date   date not null,
  tags        text[] default '{}',
  created_at  timestamptz default now()
);

alter table public.news_items enable row level security;

create policy "public read news" on public.news_items
  for select using (true);
create policy "admin manage news" on public.news_items
  for all using (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid() and up.role = 'admin'
    )
  );

-- ─── PAGE VISIBILITY ─────────────────────────────────────────────────────────
create table public.page_config (
  page_id   text primary key,
  visible   boolean default true,
  updated_at timestamptz default now()
);

alter table public.page_config enable row level security;

create policy "public read page config" on public.page_config
  for select using (true);
create policy "admin manage page config" on public.page_config
  for all using (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid() and up.role = 'admin'
    )
  );

-- Seed default page visibility
insert into public.page_config (page_id, visible) values
  ('publications', true), ('cv', true), ('projects', true),
  ('teaching', true), ('supervision', true), ('talks', true),
  ('news', true), ('research', true), ('media', true),
  ('awards', true), ('services', true), ('affiliations', true),
  ('blog', true), ('contact', true);

-- =========================================================
-- STORAGE BUCKET (run in Supabase dashboard or via CLI)
-- =========================================================
-- create storage bucket 'uploads' (private)
-- create storage bucket 'cv' (private — only admin can generate signed URLs)
-- create storage bucket 'slides' (public — for teaching/talk slides)
