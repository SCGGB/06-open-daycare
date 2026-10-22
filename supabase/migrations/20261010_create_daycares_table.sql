-- Retro mirror - reproduces the SQL applied remotely via Supabase MCP
-- (version 20261010192727, apply_migration name: create_daycares_table).
-- Superseded by 20261010_recreate_daycares_table.sql, which drops and
-- recreates public.daycares.

create table public.daycares (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

alter table public.daycares enable row level security;

insert into public.daycares (name) values ('Guardería Sala Soles');
