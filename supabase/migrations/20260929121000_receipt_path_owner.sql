-- Il residente, caricando la ricevuta, poteva salvare in payments.receipt_path
-- una stringa qualsiasi, anche il percorso della ricevuta di un altro
-- residente, che l'amministratore avrebbe poi aperto credendola sua
-- (audit legale R-11). Ora il percorso deve stare nella cartella del
-- residente stesso, come già impone la policy di storage `ricevute_insert`.

create or replace function public.enforce_resident_payment_update()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  if get_my_role() = 'admin' then
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
