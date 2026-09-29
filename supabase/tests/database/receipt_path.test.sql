-- Test pgTAP: receipt_path deve stare nella cartella del residente (audit R-11).
begin;
select plan(2);

insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
values
  ('d0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'resident-a@test.local', crypt('password', gen_salt('bf')), now(), '{}', '{}');

insert into public.payments (resident_id, description, amount, due_date, status)
values ('d0000000-0000-0000-0000-000000000001', 'Quota A', 100, current_date + 30, 'pending');

set local role authenticated;
set local request.jwt.claims to '{"sub":"d0000000-0000-0000-0000-000000000001","role":"authenticated"}';

select throws_ok(
  $$ update public.payments set status = 'paid', receipt_path = 'd0000000-0000-0000-0000-000000000002/altrui.pdf' $$,
  'P0001',
  'La ricevuta deve trovarsi nella propria cartella',
  'un residente non può collegare al pagamento la ricevuta di un altro'
);

select lives_ok(
  $$ update public.payments set status = 'paid', receipt_path = 'd0000000-0000-0000-0000-000000000001/mia.pdf' $$,
  'un residente può collegare una ricevuta nella propria cartella'
);

select * from finish();
rollback;
