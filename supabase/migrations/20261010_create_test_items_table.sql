-- Retro mirror - reproduces the SQL applied remotely via Supabase MCP
-- (version 20261010190711, apply_migration name: create_test_items_table).
-- The table was later dropped outside the migration history: see
-- 20261022_drop_test_items_table.sql.

create table if not exists public.test_items (
  id bigint generated always as identity primary key,
  name text not null,
  value text
);

alter table public.test_items enable row level security;

create policy "test_items_select_authenticated"
  on public.test_items
  for select
  to authenticated
  using (true);

create policy "test_items_insert_authenticated"
  on public.test_items
  for insert
  to authenticated
  with check (true);
