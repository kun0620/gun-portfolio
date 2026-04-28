create extension if not exists pgcrypto;

create table if not exists public.profile (
  id uuid primary key default gen_random_uuid(),
  tagline_en text,
  tagline_th text,
  bio_en text[],
  bio_th text[],
  stat_1_value text default '5+',
  stat_1_label_en text default 'Years in factory IT',
  stat_1_label_th text default 'ปีในสายงาน IT โรงงาน',
  stat_2_value text default '2',
  stat_2_label_en text default 'Manufacturing companies',
  stat_2_label_th text default 'บริษัทอุตสาหกรรม',
  stat_3_value text default '3.75',
  stat_3_label_en text default 'GPA — top of class',
  stat_3_label_th text default 'เกรดเฉลี่ย',
  email text,
  phone text,
  location_en text,
  location_th text,
  github_url text,
  linkedin_url text,
  line_id text,
  photo_url text,
  cv_url text,
  wechat_qr_url text,
  updated_at timestamptz default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  tag text not null check (tag in ('INFRA', 'WEB')),
  name_en text not null,
  name_th text not null,
  sub_en text,
  sub_th text,
  body_en text,
  body_th text,
  stack text[] default '{}',
  metrics jsonb,
  featured boolean default false,
  case_study_url text,
  github_url text,
  live_url text,
  display_order int default 0,
  created_at timestamptz default now()
);

create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  range_en text not null,
  range_th text not null,
  role text not null,
  org_en text,
  org_th text,
  body_en text,
  body_th text,
  display_order int default 0,
  created_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

alter table public.profile
  add column if not exists tagline_en text,
  add column if not exists tagline_th text,
  add column if not exists bio_en text[],
  add column if not exists bio_th text[],
  add column if not exists stat_1_value text default '5+',
  add column if not exists stat_1_label_en text default 'Years in factory IT',
  add column if not exists stat_1_label_th text default 'ปีในสายงาน IT โรงงาน',
  add column if not exists stat_2_value text default '2',
  add column if not exists stat_2_label_en text default 'Manufacturing companies',
  add column if not exists stat_2_label_th text default 'บริษัทอุตสาหกรรม',
  add column if not exists stat_3_value text default '3.75',
  add column if not exists stat_3_label_en text default 'GPA — top of class',
  add column if not exists stat_3_label_th text default 'เกรดเฉลี่ย',
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists location_en text,
  add column if not exists location_th text,
  add column if not exists github_url text,
  add column if not exists linkedin_url text,
  add column if not exists line_id text,
  add column if not exists photo_url text,
  add column if not exists cv_url text,
  add column if not exists wechat_qr_url text,
  add column if not exists updated_at timestamptz default now();

alter table public.projects
  add column if not exists tag text,
  add column if not exists name_en text,
  add column if not exists name_th text,
  add column if not exists sub_en text,
  add column if not exists sub_th text,
  add column if not exists body_en text,
  add column if not exists body_th text,
  add column if not exists stack text[] default '{}',
  add column if not exists metrics jsonb,
  add column if not exists featured boolean default false,
  add column if not exists case_study_url text,
  add column if not exists github_url text,
  add column if not exists live_url text,
  add column if not exists display_order int default 0,
  add column if not exists created_at timestamptz default now();

alter table public.experience
  add column if not exists range_en text,
  add column if not exists range_th text,
  add column if not exists role text,
  add column if not exists org_en text,
  add column if not exists org_th text,
  add column if not exists body_en text,
  add column if not exists body_th text,
  add column if not exists display_order int default 0,
  add column if not exists created_at timestamptz default now();

alter table public.profile enable row level security;
alter table public.projects enable row level security;
alter table public.experience enable row level security;
alter table public.messages enable row level security;

drop policy if exists "profile_public_read" on public.profile;
drop policy if exists "profile_auth_write" on public.profile;
drop policy if exists "projects_public_read" on public.projects;
drop policy if exists "projects_auth_write" on public.projects;
drop policy if exists "experience_public_read" on public.experience;
drop policy if exists "experience_auth_write" on public.experience;
drop policy if exists "messages_anon_insert" on public.messages;
drop policy if exists "messages_auth_read" on public.messages;
drop policy if exists "messages_auth_update" on public.messages;

create policy "profile_public_read" on public.profile for select using (true);
create policy "profile_auth_write" on public.profile for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "projects_public_read" on public.projects for select using (true);
create policy "projects_auth_write" on public.projects for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "experience_public_read" on public.experience for select using (true);
create policy "experience_auth_write" on public.experience for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "messages_anon_insert" on public.messages for insert to anon with check (true);
create policy "messages_auth_read" on public.messages for select using (auth.role() = 'authenticated');
create policy "messages_auth_update" on public.messages for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
