-- SPEC 09 - Seed the staff user used for manual tests.
-- Creates the Supabase Auth user (email/password) and links its public profile
-- to "Guardería Sala Soles". Applied remotely via Supabase MCP
-- (apply_migration name: seed_test_staff_user).
--
-- Credentials, documented for testing only:
--   email: scg@gmail.com
--   password: SCG123
--   full_name: SCG
--   role: staff
--
-- The auth row is created with SQL because the project has no service_role key
-- available to call the Auth admin API. Password is hashed with pgcrypto's
-- bcrypt (extensions.crypt); public.users.id mirrors auth.users.id.

do $$
declare
  v_user_id uuid;
  v_daycare_id uuid;
begin
  select id into v_daycare_id
  from public.daycares
  where name = 'Guardería Sala Soles'
  limit 1;

  if v_daycare_id is null then
    raise exception 'Daycare "Guardería Sala Soles" not found';
  end if;

  select id into v_user_id
  from auth.users
  where email = 'scg@gmail.com'
  limit 1;

  if v_user_id is null then
    v_user_id := gen_random_uuid();

    insert into auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) values (
      '00000000-0000-0000-0000-000000000000',
      v_user_id,
      'authenticated',
      'authenticated',
      'scg@gmail.com',
      extensions.crypt('SCG123', extensions.gen_salt('bf')),
      now(),
      now(),
      now(),
      jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
      jsonb_build_object('full_name', 'SCG'),
      '',
      '',
      '',
      ''
    );

    insert into auth.identities (
      id,
      user_id,
      provider_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) values (
      gen_random_uuid(),
      v_user_id,
      v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', 'scg@gmail.com'),
      'email',
      now(),
      now(),
      now()
    );
  else
    update auth.users
    set encrypted_password = extensions.crypt('SCG123', extensions.gen_salt('bf')),
        email_confirmed_at = coalesce(email_confirmed_at, now()),
        updated_at = now()
    where id = v_user_id;
  end if;

  insert into public.users (id, daycare_id, role, status, full_name)
  values (v_user_id, v_daycare_id, 'staff', 'active', 'SCG')
  on conflict (id) do update
    set daycare_id = excluded.daycare_id,
        role = excluded.role,
        status = excluded.status,
        full_name = excluded.full_name,
        updated_at = now();
end
$$;
