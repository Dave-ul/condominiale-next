-- Test pgTAP per le RLS policy di public.payments e public.requests:
-- isolamento tra residenti, visibilità admin, e limiti sull'update che un
-- resident può fare sul proprio pagamento.
begin;
select plan(7);

insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
values
  ('b0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'resident-a@test.local', crypt('password', gen_salt('bf')), now(), '{}', '{}'),
  ('b0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'resident-b@test.local', crypt('password', gen_salt('bf')), now(), '{}', '{}'),
  ('b0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin-c@test.local', crypt('password', gen_salt('bf')), now(), '{}', '{}');

-- Promuoviamo il terzo utente ad admin. Il trigger trg_enforce_profile_update
-- blocca ogni cambio di ruolo che non arrivi già da un admin (comprese le
-- modifiche dirette via SQL), quindi lo disabilitiamo solo per questa
-- singola operazione di fixture, come si farebbe in produzione per
-- promuovere il primissimo amministratore.
set local session_replication_role = replica;
update public.profiles set role = 'admin' where id = 'b0000000-0000-0000-0000-000000000003';
set local session_replication_role = origin;

-- Pagamenti e richieste di A e B, creati come postgres (bypassa la RLS).
insert into public.payments (resident_id, description, amount, due_date, status)
values
  ('b0000000-0000-0000-0000-000000000001', 'Quota A', 100, current_date + 30, 'pending'),
  ('b0000000-0000-0000-0000-000000000002', 'Quota B', 150, current_date + 30, 'pending');

insert into public.requests (resident_id, title, category)
values
  ('b0000000-0000-0000-0000-000000000001', 'Richiesta A', 'guasto'),
  ('b0000000-0000-0000-0000-000000000002', 'Richiesta B', 'guasto');

-- --- Come Resident A ---
set local role authenticated;
set local request.jwt.claims to '{"sub":"b0000000-0000-0000-0000-000000000001","role":"authenticated"}';

select is(
  (select count(*)::int from public.payments),
  1,
  'un resident deve vedere solo i propri pagamenti'
);

select is(
  (select count(*)::int from public.requests),
  1,
  'un resident deve vedere solo le proprie richieste'
);

-- La policy `payments_update_resident` richiede, nel WITH CHECK, che la
-- riga risultante abbia status = 'paid': un update che non tocca lo status
-- verrebbe già respinto dalla RLS (42501) prima ancora di arrivare al
-- trigger. Per testare davvero il trigger, il tentativo malevolo deve
-- impostare anche status = 'paid' (così supera la RLS) mentre cambia un
-- campo che il trigger deve proteggere: deve fallire con l'eccezione del
-- trigger (P0001), non con un semplice 0-righe silenzioso.
select throws_ok(
  $$ update public.payments set amount = 1, status = 'paid' where resident_id = 'b0000000-0000-0000-0000-000000000001' $$,
  'P0001',
  'I residenti possono modificare solo lo stato e la ricevuta del pagamento',
  'un resident non deve poter modificare l''importo del proprio pagamento'
);

select lives_ok(
  $$ update public.payments set status = 'paid', receipt_path = 'b0000000-0000-0000-0000-000000000001/ricevuta.pdf'
     where resident_id = 'b0000000-0000-0000-0000-000000000001' $$,
  'un resident deve poter segnare come pagato il proprio pagamento pending'
);

-- La RLS filtra la riga di un altro resident prima che raggiunga il
-- trigger: l'update non ha alcun effetto (0 righe toccate) invece di
-- sollevare un errore.
update public.payments set status = 'paid' where resident_id = 'b0000000-0000-0000-0000-000000000002';

select is(
  (select status from public.payments where resident_id = 'b0000000-0000-0000-0000-000000000002'),
  'pending',
  'un resident non deve poter modificare il pagamento di un altro resident'
);

-- --- Come Admin C ---
reset role;
set local role authenticated;
set local request.jwt.claims to '{"sub":"b0000000-0000-0000-0000-000000000003","role":"authenticated"}';

select is(
  (select count(*)::int from public.payments),
  2,
  'un admin deve vedere i pagamenti di tutti i residenti'
);

select is(
  (select count(*)::int from public.requests),
  2,
  'un admin deve vedere le richieste di tutti i residenti'
);

select * from finish();
rollback;
