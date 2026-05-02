do $$
declare
  constraint_name text;
begin
  select conname
  into constraint_name
  from pg_constraint
  where conrelid = 'public.projects'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) like '%tag in%';

  if constraint_name is not null then
    execute format('alter table public.projects drop constraint %I', constraint_name);
  end if;
end $$;

alter table public.projects
  add constraint projects_tag_check
  check (tag in ('INFRA', 'WEB', 'DEMO'));
