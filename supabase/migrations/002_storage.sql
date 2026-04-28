insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "portfolio_assets_public_read" on storage.objects;
drop policy if exists "portfolio_assets_auth_upload" on storage.objects;
drop policy if exists "portfolio_assets_auth_update" on storage.objects;
drop policy if exists "portfolio_assets_auth_delete" on storage.objects;

create policy "portfolio_assets_public_read"
  on storage.objects for select
  using (bucket_id = 'portfolio-assets');

create policy "portfolio_assets_auth_upload"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated');

create policy "portfolio_assets_auth_update"
  on storage.objects for update
  using (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated')
  with check (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated');

create policy "portfolio_assets_auth_delete"
  on storage.objects for delete
  using (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated');
