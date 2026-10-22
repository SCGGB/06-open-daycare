-- SPEC 07 - Recreate public.daycares and seed the default daycare.
-- Source of truth for the migration pattern: this file mirrors the SQL applied
-- remotely via Supabase MCP (apply_migration name: recreate_daycares_table).

drop table if exists public.daycares cascade;

create table public.daycares (
  id uuid primary key default gen_random_uuid(),
  name text,
  created_at timestamptz not null default now()
);

alter table public.daycares enable row level security;

insert into public.daycares (name)
select 'Guardería Sala Soles'
where not exists (
  select 1 from public.daycares where name = 'Guardería Sala Soles'
);
