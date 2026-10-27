-- Controllo di sicurezza del 27/10/2026 (docs/audit-legale.md, rilievi S-2,
-- S-3, S-6, S-7).
--
-- 1) S-2. La verifica in due passaggi dei residenti era imposta solo dal
--    proxy Next: chi conosceva la password di un residente con TOTP attivo
--    otteneva comunque un JWT aal1 e leggeva pagamenti, ricevute, richieste e
--    documenti direttamente dalle API REST/Storage. Ora una policy RESTRICTIVE
--    (in AND con le altre) richiede aal2 a chi ha un fattore verificato.
--    È lo schema indicato dalla documentazione Supabase per l'MFA.
-- 2) S-3. I trigger sugli update dei residenti elencavano le colonne VIETATE:
--    payments.intestatario, aggiunta dopo, restava modificabile dal
--    residente. Ora elencano le colonne CONSENTITE, così una colonna futura
--    è protetta senza toccare il trigger.
-- 3) S-6, S-7. Limiti di lunghezza e valori ammessi anche nel database, non
--    solo negli schemi zod del client (aggirabili chiamando l'API REST).
--    I vincoli sono NOT VALID: valgono per le righe nuove e modificate, e
--    non controllano quelle già presenti. Il proprietario li valida in
--    produzione dopo aver verificato che non ci siano righe fuori regola:
--      alter table public.requests validate constraint requests_title_len;
--      (e così per gli altri vincoli sotto)

-- ---------------------------------------------------------------------
-- 1) MFA dei residenti imposta dal database
-- ---------------------------------------------------------------------

-- true se l'utente corrente non ha attivato la verifica in due passaggi,
-- oppure se la sessione l'ha superata (aal2). SECURITY DEFINER perché
-- authenticated non può leggere auth.mfa_factors.
create or replace function public.mfa_ok()
returns boolean
language sql
stable security definer
set search_path to 'public'
as $function$
  select coalesce(auth.jwt() ->> 'aal', '') = 'aal2'
    or not exists (
      select 1 from auth.mfa_factors f
      where f.user_id = auth.uid() and f.status = 'verified'
    )
$function$;

revoke execute on function public.mfa_ok() from public, anon;
grant execute on function public.mfa_ok() to authenticated;

drop policy if exists "mfa_richiesta" on public.profiles;
create policy "mfa_richiesta" on public.profiles
  as restrictive for all to authenticated using (mfa_ok()) with check (mfa_ok());

drop policy if exists "mfa_richiesta" on public.payments;
create policy "mfa_richiesta" on public.payments
  as restrictive for all to authenticated using (mfa_ok()) with check (mfa_ok());

drop policy if exists "mfa_richiesta" on public.requests;
create policy "mfa_richiesta" on public.requests
  as restrictive for all to authenticated using (mfa_ok()) with check (mfa_ok());

drop policy if exists "mfa_richiesta" on public.documents;
create policy "mfa_richiesta" on public.documents
  as restrictive for all to authenticated using (mfa_ok()) with check (mfa_ok());

drop policy if exists "mfa_richiesta" on public.condomini;
create policy "mfa_richiesta" on public.condomini
  as restrictive for all to authenticated using (mfa_ok()) with check (mfa_ok());

drop policy if exists "mfa_richiesta" on storage.objects;
create policy "mfa_richiesta" on storage.objects
  as restrictive for all to authenticated using (mfa_ok()) with check (mfa_ok());

-- Anche la cancellazione self-service dell'account richiede aal2 a chi ha la
-- verifica attiva: con la sola password non si cancella un account protetto.
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  if auth.uid() is null then
    raise exception 'Non autenticato';
  end if;
  if not mfa_ok() then
    raise exception 'Serve la verifica in due passaggi';
  end if;
  -- Le ricevute restano (documentazione contabile); si stacca solo il
  -- proprietario, perché su alcune versioni di Storage storage.objects.owner
  -- ha una FK verso auth.users che bloccherebbe la cancellazione.
  update storage.objects set owner = null where owner = auth.uid();
  delete from auth.users where id = auth.uid();
end;
$function$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- ---------------------------------------------------------------------
-- 2) Trigger a lista bianca
-- ---------------------------------------------------------------------

-- Il residente può cambiare solo status e receipt_path del proprio
-- pagamento (la policy payments_update_resident limita già lo status).
create or replace function public.enforce_resident_payment_update()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  -- pg_trigger_depth() > 1: cascata ON DELETE SET NULL da delete_my_account
  -- (vedi 20260929122000_diritti_interessato.sql).
  if get_my_role() = 'admin' or pg_trigger_depth() > 1 then
    return new;
  end if;
  if (to_jsonb(new) - 'status' - 'receipt_path')
     is distinct from (to_jsonb(old) - 'status' - 'receipt_path') then
    raise exception 'I residenti possono modificare solo lo stato e la ricevuta del pagamento';
  end if;
  if new.receipt_path is not null
     and new.receipt_path not like auth.uid()::text || '/%' then
    raise exception 'La ricevuta deve trovarsi nella propria cartella';
  end if;
  return new;
end;
$function$;

revoke execute on function public.enforce_resident_payment_update() from public, anon, authenticated;

-- Il residente può cambiare solo nome e telefono del proprio profilo.
create or replace function public.enforce_profile_update()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  if get_my_role() = 'admin' then
    return new;
  end if;
  -- Il ruolo non cambia nemmeno via SQL diretto (vedi fixture in
  -- payments_requests_rls.test.sql).
  if new.role is distinct from old.role then
    raise exception 'Non puoi modificare il tuo ruolo';
  end if;
  -- auth.uid() null = SQL editor / service_role: può assegnare condominio
  -- e interno (es. prima configurazione o import).
  if auth.uid() is null then
    return new;
  end if;
  if new.condominio_id is distinct from old.condominio_id
     or new.unit is distinct from old.unit
     or new.email is distinct from old.email then
    raise exception 'Condominio, interno ed email sono gestiti dall''amministratore';
  end if;
  if (to_jsonb(new) - 'full_name' - 'phone')
     is distinct from (to_jsonb(old) - 'full_name' - 'phone') then
    raise exception 'Puoi modificare solo nome e telefono';
  end if;
  return new;
end;
$function$;

revoke execute on function public.enforce_profile_update() from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- 3) Vincoli lato database (stessi limiti di lib/schemas/*.ts)
-- ---------------------------------------------------------------------

alter table public.requests drop constraint if exists requests_title_len;
alter table public.requests add constraint requests_title_len
  check (length(trim(title)) between 1 and 120) not valid;

alter table public.requests drop constraint if exists requests_description_len;
alter table public.requests add constraint requests_description_len
  check (description is null or length(description) <= 2000) not valid;

alter table public.requests drop constraint if exists requests_category_valida;
alter table public.requests add constraint requests_category_valida
  check (category in ('guasto', 'manutenzione', 'documento', 'informazione', 'altro')) not valid;

alter table public.documents drop constraint if exists documents_name_len;
alter table public.documents add constraint documents_name_len
  check (length(trim(name)) between 1 and 200) not valid;

alter table public.documents drop constraint if exists documents_category_valida;
alter table public.documents add constraint documents_category_valida
  check (category in ('verbale', 'rendiconto', 'contratto', 'circolare', 'altro')) not valid;

alter table public.payments drop constraint if exists payments_stripe_link_valido;
alter table public.payments add constraint payments_stripe_link_valido
  check (stripe_payment_link is null
         or stripe_payment_link ~* '^https://(checkout|buy)\.stripe\.com/') not valid;
