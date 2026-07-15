-- Fix di sicurezza e integrità dati emersi dall'audit del progetto.
--
-- 1) profiles_select era `auth.role() = 'authenticated'`: qualunque
--    condomino autenticato poteva leggere nome, email, telefono e interno
--    di TUTTI gli altri residenti (esposizione GDPR). Ora limitata al
--    proprio profilo o all'amministratore.
-- 2) profiles_insert non vincolava la colonna `role`: se il provisioning
--    automatico (trigger handle_new_user) fosse mai fallito, un utente
--    avrebbe potuto auto-inserirsi con `role = 'admin'`. Ora il client può
--    inserire solo il proprio profilo con ruolo 'resident'.
-- 3) handle_new_user() inghiottiva qualsiasi errore (`exception when
--    others then return new`), lasciando utenti autenticati senza profilo
--    in modo silenzioso. Ora l'errore viene loggato e rilanciato: il
--    signup fallisce visibilmente invece di lasciare uno stato inconsistente.
-- 4) Bucket storage `documenti`/`ricevute` non avevano limiti di
--    dimensione/mime-type: l'`accept` dell'input file è solo lato client
--    ed è bypassabile. Ora applicati anche lato storage.
-- 5) Policy storage duplicata "Autenticati leggono documenti" (ridondante
--    con `documenti_select`, residuo della migration fix_storage_rls):
--    rimossa.
-- 6) payments non aveva alcun vincolo sull'importo: ora richiesto > 0.
-- 7) payments_update_resident referenziava uno stato 'overdue' mai
--    ammesso dal CHECK su `status` (solo pending/paid/verified) e mai
--    impostato da nessun processo: riferimento morto, rimosso. Lo stato
--    "scaduto" è ora calcolato in UI da `status = 'pending'` + `due_date`
--    passata, senza bisogno di un job schedulato.
-- 8) Le funzioni trigger (mai pensate per essere chiamate direttamente)
--    restavano eseguibili via RPC pubblica da anon/authenticated: revocato
--    l'EXECUTE. get_my_role() resta invece eseguibile da anon/authenticated
--    perché è invocata direttamente dalle policy RLS in fase di valutazione.

-- ---------------------------------------------------------------------
-- 1) profiles_select: solo il proprio profilo o l'amministratore
-- ---------------------------------------------------------------------

drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select using (auth.uid() = id or get_my_role() = 'admin');

-- ---------------------------------------------------------------------
-- 2) profiles_insert: il client può crearsi solo come 'resident'
-- ---------------------------------------------------------------------

drop policy if exists "profiles_insert" on public.profiles;
create policy "profiles_insert" on public.profiles
  for insert with check (auth.uid() = id and role = 'resident');

-- ---------------------------------------------------------------------
-- 3) handle_new_user: non inghiottire più gli errori silenziosamente
-- ---------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  insert into public.profiles (id, full_name, email, unit, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    coalesce(new.raw_user_meta_data->>'unit', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    'resident'
  )
  on conflict (id) do nothing;
  return new;
exception
  when others then
    raise warning 'handle_new_user: creazione profilo fallita per %: %', new.id, sqlerrm;
    raise;
end;
$function$;

-- ---------------------------------------------------------------------
-- 4) Limiti dimensione/mime-type sui bucket storage
-- ---------------------------------------------------------------------

update storage.buckets
set file_size_limit = 10485760, -- 10 MB
    allowed_mime_types = array[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png'
    ]
where id = 'documenti';

update storage.buckets
set file_size_limit = 10485760, -- 10 MB
    allowed_mime_types = array['application/pdf', 'image/jpeg', 'image/png']
where id = 'ricevute';

-- ---------------------------------------------------------------------
-- 5) Rimozione policy storage duplicata
-- ---------------------------------------------------------------------

drop policy if exists "Autenticati leggono documenti" on storage.objects;

-- ---------------------------------------------------------------------
-- 6) Importo pagamento sempre positivo
-- ---------------------------------------------------------------------

alter table public.payments drop constraint if exists payments_amount_positive;
alter table public.payments add constraint payments_amount_positive check (amount > 0);

-- ---------------------------------------------------------------------
-- 7) payments_update_resident: rimosso il riferimento morto a 'overdue'
-- ---------------------------------------------------------------------

drop policy if exists "payments_update_resident" on public.payments;
create policy "payments_update_resident" on public.payments
  for update
  using (resident_id = auth.uid() and status = 'pending')
  with check (resident_id = auth.uid() and status = 'paid');

-- ---------------------------------------------------------------------
-- 8) Le funzioni trigger non devono essere chiamabili via RPC pubblica
-- ---------------------------------------------------------------------

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.enforce_profile_update() from public, anon, authenticated;
revoke execute on function public.enforce_resident_payment_update() from public, anon, authenticated;
