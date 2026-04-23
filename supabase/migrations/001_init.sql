-- Profile table
create table if not exists profile (
  id uuid primary key default gen_random_uuid(),
  hero_title text,
  hero_subtitle text,
  about_text text,
  avatar_url text,
  updated_at timestamptz default now()
);

alter table profile enable row level security;

create policy "public_read_profile"
  on profile for select using (true);

create policy "auth_all_profile"
  on profile for all using (auth.role() = 'authenticated');

-- Projects table
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  tags text[],
  live_url text,
  github_url text,
  image_url text,
  display_order int default 0,
  created_at timestamptz default now()
);

alter table projects enable row level security;

create policy "public_read_projects"
  on projects for select using (true);

create policy "auth_all_projects"
  on projects for all using (auth.role() = 'authenticated');

-- Skills table
create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  created_at timestamptz default now()
);

alter table skills enable row level security;

create policy "public_read_skills"
  on skills for select using (true);

create policy "auth_all_skills"
  on skills for all using (auth.role() = 'authenticated');

-- Messages table
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

alter table messages enable row level security;

create policy "public_insert_messages"
  on messages for insert with check (true);

create policy "auth_all_messages"
  on messages for all using (auth.role() = 'authenticated');

-- Seed a default profile row
insert into profile (hero_title, hero_subtitle, about_text)
values (
  'Hi, I''m Gun',
  'Full-Stack Developer',
  'I build fast, beautiful web applications. Let''s work together!'
)
on conflict do nothing;
