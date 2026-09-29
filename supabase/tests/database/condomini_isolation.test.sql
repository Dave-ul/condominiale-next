-- Test pgTAP per l'isolamento tra condomini (audit legale R-1, R-2, R-11).
begin;
select plan(8);

insert into public.condomini (id, nome) values
  ('c0000000-0000-0000-0000-000000000001', 'Condominio Uno'),
  ('c0000000-0000-0000-0000-000000000002', 'Condominio Due');

-- Residente A (condominio 1), residente B (condominio 2), estraneo X (nessun
-- condominio: simula chi si registra dal form pubblico).
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
values
  ('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'resident-a@test.local', crypt('password', gen_salt('bf')), now(), '{}', '{}'),
  ('a0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'resident-b@test.local', crypt('password', gen_salt('bf')), now(), '{}', '{}'),
  ('a0000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'stranger@test.local', crypt('password', gen_salt('bf')), now(), '{}', '{}');

update public.profiles set condominio_id = 'c0000000-0000-0000-0000-000000000001' where id = 'a0000000-0000-0000-0000-000000000001';
update public.profiles set condominio_id = 'c0000000-0000-0000-0000-000000000002' where id = 'a0000000-0000-0000-0000-000000000002';

insert into public.documents (name, file_path, condominio_id) values
  ('Verbale Uno', 'doc-uno.pdf', 'c0000000-0000-0000-0000-000000000001'),
  ('Verbale Due', 'doc-due.pdf', 'c0000000-0000-0000-0000-000000000002'),
  ('Documento non assegnato', 'doc-orfano.pdf', null);

insert into storage.objects (bucket_id, name) values
  ('documenti', 'doc-uno.pdf'),
  ('documenti', 'doc-due.pdf');

-- Residente A
set local role authenticated;
set local request.jwt.claims to '{"sub":"a0000000-0000-0000-0000-000000000001","role":"authenticated"}';

select is(
  (select array_agg(name order by name) from public.documents),
  array['Verbale Uno'],
  'un residente vede solo i documenti del proprio condominio (non quelli di altri edifici né quelli non assegnati)'
);

select is(
  (select array_agg(name order by name) from storage.objects where bucket_id = 'documenti'),
  array['doc-uno.pdf'],
  'un residente può scaricare solo i file del proprio condominio'
);

select is(
  (select count(*)::int from public.condomini),
  1,
  'un residente vede solo il proprio condominio nell''elenco'
);

select throws_ok(
  $$ update public.profiles set condominio_id = 'c0000000-0000-0000-0000-000000000002' where id = 'a0000000-0000-0000-0000-000000000001' $$,
  'P0001',
  'Condominio, interno ed email sono gestiti dall''amministratore',
  'un residente non può spostarsi in un altro condominio'
);

select throws_ok(
  $$ update public.profiles set unit = '99' where id = 'a0000000-0000-0000-0000-000000000001' $$,
  'P0001',
  'Condominio, interno ed email sono gestiti dall''amministratore',
  'un residente non può cambiare il proprio interno'
);

select lives_ok(
  $$ update public.profiles set phone = '000' where id = 'a0000000-0000-0000-0000-000000000001' $$,
  'un residente può ancora aggiornare il proprio telefono'
);

-- Estraneo registrato senza condominio
set local request.jwt.claims to '{"sub":"a0000000-0000-0000-0000-000000000009","role":"authenticated"}';

select is(
  (select count(*)::int from public.documents),
  0,
  'un utente senza condominio assegnato non vede alcun documento (finding R-1)'
);

select is(
  (select count(*)::int from storage.objects where bucket_id = 'documenti'),
  0,
  'un utente senza condominio assegnato non può scaricare alcun file'
);

select * from finish();
rollback;
