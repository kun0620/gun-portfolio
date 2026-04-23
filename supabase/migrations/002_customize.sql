-- Add customize columns to profile table
alter table profile
  add column if not exists social_links jsonb default '[]',
  add column if not exists accent_color text default '#1D9E75',
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists seo_og_image text;
