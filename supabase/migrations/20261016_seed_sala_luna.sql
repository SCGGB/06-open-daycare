-- SPEC 08 - Version the second daycare row that was inserted manually on
-- 2026-10-16, outside the migration history.
-- Idempotent seed: re-running it does not duplicate the row.

insert into public.daycares (name)
select 'Sala Luna'
where not exists (
  select 1 from public.daycares where name = 'Sala Luna'
);
