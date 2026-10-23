-- SPEC 09 - Enum types and public.users profile table linked to auth.users.
-- Source of truth for the migration applied remotely via Supabase MCP
-- (apply_migration name: users_table_and_enums).
--
-- Access model (option C): explicit policies based on auth.uid(), no auth.role().
-- A user can read and update only their own row. Column privileges prevent
-- self-escalation of role, status and daycare_id.

-- Enums ---------------------------------------------------------------------

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typname = 'user_role'
  ) then
    create type public.user_role as enum ('staff', 'parent', 'admin');
  end if;

  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typname = 'user_status'
  ) then
    create type public.user_status as enum ('pending', 'active');
  end if;
end
$$;

-- Table ---------------------------------------------------------------------

drop table if exists public.users cascade;

create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  daycare_id uuid references public.daycares (id),
  role public.user_role not null,
  status public.user_status not null default 'active',
  full_name text not null,
  avatar_url text,
  notify_on_post boolean not null default true,
  daily_summary_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint users_daycare_required_for_non_admin
    check (role = 'admin' or daycare_id is not null)
);

create index users_daycare_id_idx on public.users (daycare_id);

-- updated_at ----------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

-- RLS -----------------------------------------------------------------------

alter table public.users enable row level security;

drop policy if exists users_select_own on public.users;
create policy users_select_own on public.users
for select to authenticated
using ((select auth.uid()) = id);

drop policy if exists users_update_own on public.users;
create policy users_update_own on public.users
for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- Privileges: authenticated can read their row and update only profile columns.
-- role, status and daycare_id stay out of the UPDATE grant to prevent
-- self-escalation; use the service role (or a future admin flow) to change them.

revoke all on public.users from anon, authenticated;
grant select on public.users to authenticated;
grant update (full_name, avatar_url, notify_on_post, daily_summary_enabled)
  on public.users to authenticated;
