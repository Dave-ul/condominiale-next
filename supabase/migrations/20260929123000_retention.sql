-- Limitazione della conservazione, art. 5.1.e GDPR (audit legale R-8).
--
-- PROPOSTA: i termini sono una scelta del titolare e vanno confermati con
-- l'amministratore/DPO prima di applicare la migration.
--   - richieste di manutenzione chiuse: 24 mesi dalla creazione;
--   - pagamenti verificati: 10 anni dalla scadenza (art. 1130 n. 8 c.c.,
--     conservazione della documentazione contabile).
-- I file delle ricevute nello Storage non si cancellano da SQL (lascerebbe
-- oggetti orfani nel backend di storage): vanno rimossi dalla dashboard o via
-- API usando l'elenco restituito da `retention_expired_receipts()`.

create or replace function public.purge_expired_data()
returns table (richieste_cancellate int, pagamenti_cancellati int)
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  r int;
  p int;
begin
  delete from public.requests
  where status = 'chiusa' and created_at < now() - interval '24 months';
  get diagnostics r = row_count;

  delete from public.payments
  where status = 'verified' and due_date < current_date - interval '10 years';
  get diagnostics p = row_count;

  return query select r, p;
end;
$function$;

create or replace function public.retention_expired_receipts()
returns table (receipt_path text)
language sql
stable security definer
set search_path to 'public'
as $function$
  select o.name
  from storage.objects o
  where o.bucket_id = 'ricevute'
    and not exists (select 1 from public.payments p where p.receipt_path = o.name)
    and o.created_at < now() - interval '10 years'
$function$;

revoke execute on function public.purge_expired_data() from public, anon, authenticated;
revoke execute on function public.retention_expired_receipts() from public, anon, authenticated;

-- Esecuzione mensile se pg_cron è abilitato (Database → Extensions).
do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.schedule('purge-expired-data', '0 3 1 * *', 'select public.purge_expired_data()');
  end if;
end
$$;
