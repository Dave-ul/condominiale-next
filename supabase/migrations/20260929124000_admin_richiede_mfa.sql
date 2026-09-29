-- I permessi di amministratore richiedono la verifica in due passaggi
-- (audit legale R-12, GDPR art. 32).
--
-- L'admin vede i dati di tutti i condòmini: con la sola password, una
-- credenziale rubata basterebbe a leggerli tutti. Da ora get_my_role(), su cui
-- si basano tutte le policy e i trigger, restituisce 'admin' solo se la
-- sessione ha superato la verifica TOTP (claim JWT aal = 'aal2'); altrimenti
-- l'admin è trattato come un residente.
--
-- Non è un blocco: con la sola password l'admin entra comunque nel portale,
-- attiva la verifica da /portale/account e al login successivo (o subito dopo
-- l'attivazione, che porta la sessione ad aal2) riottiene i permessi.

create or replace function public.get_my_role()
returns text
language sql
stable security definer
set search_path to 'public'
as $function$
  select case
    when role = 'admin' and coalesce(auth.jwt() ->> 'aal', '') <> 'aal2' then 'resident'
    else role
  end
  from public.profiles
  where id = auth.uid()
$function$;
