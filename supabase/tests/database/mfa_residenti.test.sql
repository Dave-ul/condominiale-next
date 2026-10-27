-- Test pgTAP per la verifica in due passaggi dei residenti imposta dal
-- database e per i trigger a lista bianca (controllo 27/10/2026, S-2, S-3,
-- S-6, S-7).
begin;
select plan(12);

insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
values
  ('d0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'resident-mfa@test.local', crypt('password', gen_salt('bf')), now(), '{}', '{}'),
  ('d0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'resident-nomfa@test.local', crypt('password', gen_salt('bf')), now(), '{}', '{}');

-- Il residente 1 ha attivato la verifica in due passaggi (fattore verificato).
insert into auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret)
values ('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Portale condominiale', 'totp', 'verified', now(), now(), 'SEGRETODITEST');

insert into public.payments (resident_id, description, amount, due_date, status)
values
  ('d0000000-0000-0000-0000-000000000001', 'Quota MFA', 100, current_date + 30, 'pending'),
  ('d0000000-0000-0000-0000-000000000002', 'Quota senza MFA', 100, current_date + 30, 'pending');

insert into public.requests (resident_id, title, category)
values ('d0000000-0000-0000-0000-000000000001', 'Richiesta MFA', 'guasto');

-- --- Residente 1 con la sola password (aal1) ---
set local role authenticated;
set local request.jwt.claims to '{"sub":"d0000000-0000-0000-0000-000000000001","role":"authenticated","aal":"aal1"}';

select is(
  (select count(*)::int from public.payments),
  0,
  'con la verifica attiva, una sessione aal1 non vede i propri pagamenti'
);

select is(
  (select count(*)::int from public.requests),
  0,
  'con la verifica attiva, una sessione aal1 non vede le proprie richieste'
);

select is(
  (select count(*)::int from public.profiles),
  0,
  'con la verifica attiva, una sessione aal1 non vede il proprio profilo'
);

select throws_ok(
  $$ select public.delete_my_account() $$,
  'P0001',
  'Serve la verifica in due passaggi',
  'con la verifica attiva, una sessione aal1 non cancella l''account'
);

-- --- Residente 1 dopo il codice (aal2) ---
set local request.jwt.claims to '{"sub":"d0000000-0000-0000-0000-000000000001","role":"authenticated","aal":"aal2"}';

select is(
  (select count(*)::int from public.payments),
  1,
  'con la sessione aal2 il residente vede i propri pagamenti'
);

-- intestatario non è fra le colonne che il residente può modificare: prima
-- del 27/10/2026 il trigger a lista nera lo lasciava passare.
select throws_ok(
  $$ update public.payments set intestatario = 'Altro nome', status = 'paid'
     where resident_id = 'd0000000-0000-0000-0000-000000000001' $$,
  'P0001',
  'I residenti possono modificare solo lo stato e la ricevuta del pagamento',
  'un residente non deve poter riscrivere l''intestatario del pagamento'
);

select throws_ok(
  $$ update public.profiles set created_at = now() - interval '1 year'
     where id = 'd0000000-0000-0000-0000-000000000001' $$,
  'P0001',
  'Puoi modificare solo nome e telefono',
  'un residente può modificare solo nome e telefono del proprio profilo'
);

select lives_ok(
  $$ update public.profiles set full_name = 'Nome Inventato', phone = '000'
     where id = 'd0000000-0000-0000-0000-000000000001' $$,
  'un residente deve poter modificare nome e telefono'
);

-- Vincoli lato database (S-6).
select throws_ok(
  $$ insert into public.requests (resident_id, title, category)
     values ('d0000000-0000-0000-0000-000000000001', repeat('x', 121), 'guasto') $$,
  '23514',
  null,
  'il titolo della richiesta non supera i 120 caratteri'
);

select throws_ok(
  $$ insert into public.requests (resident_id, title, category)
     values ('d0000000-0000-0000-0000-000000000001', 'Titolo', 'inventata') $$,
  '23514',
  null,
  'la categoria della richiesta deve essere fra quelle ammesse'
);

-- --- Residente 2, senza verifica attiva: per lui aal1 basta ---
set local request.jwt.claims to '{"sub":"d0000000-0000-0000-0000-000000000002","role":"authenticated","aal":"aal1"}';

select is(
  (select count(*)::int from public.payments),
  1,
  'senza verifica attiva, una sessione aal1 vede i propri pagamenti'
);

reset role;

-- Link Stripe validato anche dal database (S-7), qui come postgres.
select throws_ok(
  $$ insert into public.payments (resident_id, description, amount, stripe_payment_link)
     values ('d0000000-0000-0000-0000-000000000002', 'Quota', 10, 'javascript:alert(1)') $$,
  '23514',
  null,
  'il link di pagamento deve essere un link Stripe'
);

select * from finish();
rollback;
