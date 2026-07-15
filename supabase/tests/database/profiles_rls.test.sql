-- Test pgTAP per le RLS policy di public.profiles.
-- Eseguito da `supabase test db` (job CI "db-tests"), richiede lo stack
-- locale Supabase (supabase start) con le migration già applicate.
begin;
select plan(5);

-- Fixture: due residenti reali. L'insert su auth.users fa scattare il
-- trigger on_auth_user_created, che crea automaticamente la riga in
-- public.profiles con role = 'resident'.
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
values
  ('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'resident-a@test.local', crypt('password', gen_salt('bf')), now(), '{}', '{}'),
  ('a0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'resident-b@test.local', crypt('password', gen_salt('bf')), now(), '{}', '{}');

-- Impersoniamo Resident A per il resto del test.
set local role authenticated;
set local request.jwt.claims to '{"sub":"a0000000-0000-0000-0000-000000000001","role":"authenticated"}';

select is(
  (select count(*)::int from public.profiles where id = 'a0000000-0000-0000-0000-000000000001'),
  1,
  'un resident deve poter leggere il proprio profilo'
);

select is(
  (select count(*)::int from public.profiles where id = 'a0000000-0000-0000-0000-000000000002'),
  0,
  'un resident non deve poter leggere il profilo di un altro resident (finding critico dell''audit)'
);

-- Simuliamo il caso in cui il profilo non sia ancora stato creato dal
-- trigger (fallimento del provisioning automatico), per isolare la
-- policy di INSERT.
reset role;
delete from public.profiles where id = 'a0000000-0000-0000-0000-000000000001';
set local role authenticated;
set local request.jwt.claims to '{"sub":"a0000000-0000-0000-0000-000000000001","role":"authenticated"}';

select throws_ok(
  $$ insert into public.profiles (id, full_name, role) values ('a0000000-0000-0000-0000-000000000001', 'Hacker', 'admin') $$,
  '42501',
  null,
  'un utente non deve potersi auto-assegnare il ruolo admin creando il proprio profilo'
);

select lives_ok(
  $$ insert into public.profiles (id, full_name, role) values ('a0000000-0000-0000-0000-000000000001', 'Resident A', 'resident') $$,
  'un utente deve poter creare il proprio profilo con ruolo resident'
);

select throws_ok(
  $$ update public.profiles set role = 'admin' where id = 'a0000000-0000-0000-0000-000000000001' $$,
  'P0001',
  'Non puoi modificare il tuo ruolo',
  'un resident non deve potersi promuovere admin aggiornando il proprio profilo'
);

select * from finish();
rollback;
