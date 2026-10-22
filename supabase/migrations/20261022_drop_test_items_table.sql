-- SPEC 08 - Record the cleanup of public.test_items.
-- The table was dropped manually after 20261010194835 (recreate_daycares_table)
-- and the drop was never registered in the migration history, so the repo
-- could not reproduce the remote state. This migration is a no-op on a
-- database where the table no longer exists.

drop table if exists public.test_items cascade;
