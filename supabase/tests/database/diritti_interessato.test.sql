-- Test pgTAP: cancellazione self-service dell'account (audit R-7).
begin;
select plan(4);

insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
values
  ('e0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'resident-a@test.local', crypt('password', gen_salt('bf')), now(), '{}', '{"full_name":"Resident A","unit":"3"}');

insert into public.payments (resident_id, description, amount, due_date)
values ('e0000000-0000-0000-0000-000000000001', 'Quota A', 100, current_date);
insert into public.requests (resident_id, title) values ('e0000000-0000-0000-0000-000000000001', 'Richiesta A');

set local role authenticated;
set local request.jwt.claims to '{"sub":"e0000000-0000-0000-0000-000000000001","role":"authenticated"}';

select lives_ok($$ select public.delete_my_account() $$, 'un residente può cancellare il proprio account');

reset role;

select is((select count(*)::int from public.requests), 0, 'le richieste vengono cancellate con l''account');
select is((select count(*)::int from public.payments where resident_id is null), 1, 'il pagamento resta come documentazione contabile');
select is((select intestatario from public.payments), 'Resident A - Int. 3', 'il pagamento conserva l''intestatario testuale');

select * from finish();
rollback;
