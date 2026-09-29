-- Diritti dell'interessato, artt. 15-20 GDPR (audit legale R-7).
--
-- Prima, cancellare un utente falliva: profiles è in cascade su auth.users,
-- ma payments/requests/documents lo referenziavano senza ON DELETE.
--
-- Scelte:
--  - richieste di manutenzione: cancellate con l'account (nessun obbligo di
--    conservazione, possono contenere dati personali liberi);
--  - pagamenti: CONSERVATI, perché documentazione contabile del condominio
--    (art. 1130 n. 8 c.c., conservazione decennale; art. 17.3.b GDPR). Si
--    perde il legame con il profilo ma resta l'intestatario testuale (nome e
--    interno), fissato al momento della creazione del pagamento;
--  - documenti: resta il documento, si perde solo chi l'ha caricato;
--  - file ricevute nello Storage: conservati per lo stesso motivo contabile.

alter table public.payments add column if not exists intestatario text;

update public.payments p
set intestatario = concat_ws(' - Int. ', pr.full_name, nullif(pr.unit, ''))
from public.profiles pr
where pr.id = p.resident_id and p.intestatario is null;

create or replace function public.set_payment_intestatario()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  select concat_ws(' - Int. ', full_name, nullif(unit, ''))
    into new.intestatario
    from public.profiles where id = new.resident_id;
  return new;
end;
$function$;

revoke execute on function public.set_payment_intestatario() from public, anon, authenticated;

drop trigger if exists trg_set_payment_intestatario on public.payments;
create trigger trg_set_payment_intestatario
  before insert on public.payments
  for each row execute function public.set_payment_intestatario();

alter table public.payments alter column resident_id drop not null;
alter table public.payments drop constraint if exists payments_resident_id_fkey;
alter table public.payments add constraint payments_resident_id_fkey
  foreign key (resident_id) references public.profiles(id) on delete set null;

alter table public.requests drop constraint if exists requests_resident_id_fkey;
alter table public.requests add constraint requests_resident_id_fkey
  foreign key (resident_id) references public.profiles(id) on delete cascade;

alter table public.documents drop constraint if exists documents_uploaded_by_fkey;
alter table public.documents add constraint documents_uploaded_by_fkey
  foreign key (uploaded_by) references public.profiles(id) on delete set null;

-- La cascata ON DELETE SET NULL aggiorna payments.resident_id dall'interno
-- di un trigger di integrità referenziale: senza questa eccezione il
-- trigger sui pagamenti la scambierebbe per una modifica del residente e
-- bloccherebbe la cancellazione dell'account.
create or replace function public.enforce_resident_payment_update()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  if get_my_role() = 'admin' or pg_trigger_depth() > 1 then
    return new;
  end if;
  if new.resident_id is distinct from old.resident_id
     or new.description is distinct from old.description
     or new.amount is distinct from old.amount
     or new.due_date is distinct from old.due_date
     or new.stripe_payment_link is distinct from old.stripe_payment_link
     or new.created_at is distinct from old.created_at then
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

-- Cancellazione self-service dell'account (art. 17). SECURITY DEFINER perché
-- il client non ha accesso ad auth.users; cancella solo l'utente chiamante.
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
  -- Le ricevute restano (documentazione contabile); si stacca solo il
  -- proprietario, perché su alcune versioni di Storage storage.objects.owner
  -- ha una FK verso auth.users che bloccherebbe la cancellazione.
  update storage.objects set owner = null where owner = auth.uid();
  delete from auth.users where id = auth.uid();
end;
$function$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
