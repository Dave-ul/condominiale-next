-- Separazione dei dati per condominio (audit legale, rilievi R-1 e R-2).
--
-- Problema: lo schema non distingueva i condomini gestiti. `documents_select`
-- e `documenti_select` ammettevano qualunque utente autenticato, quindi un
-- residente di un edificio (o chiunque si fosse registrato dal form pubblico)
-- leggeva verbali, rendiconti e contratti di TUTTI gli edifici.
--
-- Dopo questa migration un residente vede solo i documenti del condominio a
-- cui l'amministratore lo ha assegnato (`profiles.condominio_id`). Chi non è
-- assegnato a nessun condominio (es. un estraneo registrato) non vede nulla.
--
-- Dati esistenti: i documenti già caricati hanno `condominio_id` null e
-- restano visibili SOLO all'amministratore finché non li assegna a un
-- condominio (fail-closed). Stesso discorso per i residenti già registrati:
-- vedono i propri pagamenti e le proprie richieste come prima, ma nessun
-- documento finché l'amministratore non imposta il loro condominio.
-- I file nello Storage NON vengono spostati: la policy li risolve tramite la
-- riga corrispondente in public.documents.

create table if not exists public.condomini (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null check (length(trim(nome)) > 0),
  indirizzo  text,
  created_at timestamptz not null default now()
);

alter table public.condomini enable row level security;

grant select, insert, update, delete on public.condomini to authenticated;

alter table public.profiles
  add column if not exists condominio_id uuid references public.condomini(id) on delete set null;

alter table public.documents
  add column if not exists condominio_id uuid references public.condomini(id) on delete restrict;

create index if not exists idx_profiles_condominio_id on public.profiles (condominio_id);
create index if not exists idx_documents_condominio_id on public.documents (condominio_id);

-- ---------------------------------------------------------------------
-- Helper: condominio dell'utente corrente. SECURITY DEFINER come
-- get_my_role(), per poterlo usare nelle policy senza ricorsione RLS.
-- ---------------------------------------------------------------------

create or replace function public.get_my_condominio_id()
returns uuid
language sql
stable security definer
set search_path to 'public'
as $function$
  select condominio_id from public.profiles where id = auth.uid()
$function$;

-- ---------------------------------------------------------------------
-- RLS — public.condomini
-- ---------------------------------------------------------------------

drop policy if exists "condomini_select" on public.condomini;
create policy "condomini_select" on public.condomini
  for select using (get_my_role() = 'admin' or id = get_my_condominio_id());

drop policy if exists "condomini_write_admin" on public.condomini;
create policy "condomini_write_admin" on public.condomini
  for all using (get_my_role() = 'admin') with check (get_my_role() = 'admin');

-- ---------------------------------------------------------------------
-- RLS — public.documents: solo il proprio condominio (o l'admin)
-- ---------------------------------------------------------------------

drop policy if exists "documents_select" on public.documents;
create policy "documents_select" on public.documents
  for select using (
    get_my_role() = 'admin'
    or (condominio_id is not null and condominio_id = get_my_condominio_id())
  );

drop policy if exists "documents_update_admin" on public.documents;
create policy "documents_update_admin" on public.documents
  for update using (get_my_role() = 'admin') with check (get_my_role() = 'admin');

-- ---------------------------------------------------------------------
-- RLS — storage `documenti`: il file è leggibile solo se lo è la riga
-- di public.documents che lo referenzia (policy sopra, valutata con i
-- permessi del chiamante).
-- ---------------------------------------------------------------------

drop policy if exists "documenti_select" on storage.objects;
create policy "documenti_select" on storage.objects
  for select using (
    bucket_id = 'documenti'
    and (
      get_my_role() = 'admin'
      or exists (select 1 from public.documents d where d.file_path = storage.objects.name)
    )
  );

-- ---------------------------------------------------------------------
-- profiles_insert: il client non può auto-assegnarsi un condominio
-- ---------------------------------------------------------------------

drop policy if exists "profiles_insert" on public.profiles;
create policy "profiles_insert" on public.profiles
  for insert with check (auth.uid() = id and role = 'resident' and condominio_id is null);

-- ---------------------------------------------------------------------
-- enforce_profile_update: oltre al ruolo, il residente non può cambiare
-- condominio, interno ed email del proprio profilo (altrimenti potrebbe
-- spostarsi in un altro edificio o spacciarsi per un altro interno,
-- rilievo R-11). Li imposta l'amministratore.
-- ---------------------------------------------------------------------

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
  -- Invariato rispetto alla baseline: il ruolo non cambia nemmeno via SQL
  -- diretto (vedi fixture in payments_requests_rls.test.sql).
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
  return new;
end;
$function$;

revoke execute on function public.enforce_profile_update() from public, anon, authenticated;
