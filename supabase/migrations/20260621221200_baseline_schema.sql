-- Baseline schema per condominiale-next.
--
-- Contesto: lo schema applicativo (tabelle, RLS, funzioni, trigger, bucket
-- storage) è stato creato fuori banda rispetto alle migration versionate:
-- solo `fix_storage_rls` e `perf_indexes` erano tracciate, ma la baseline
-- vera e propria non lo era mai stata. Questa migration la ricostruisce a
-- partire dallo stato verificato del progetto Supabase live, in modo
-- interamente idempotente (safe sia da applicare al progetto esistente,
-- dove è perlopiù un no-op, sia per bootstrappare un ambiente locale/CI
-- da zero).

-- ---------------------------------------------------------------------
-- Tabelle
-- ---------------------------------------------------------------------

create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  email      text,
  unit       text,
  phone      text,
  role       text not null default 'resident' check (role in ('resident', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text default 'altro',
  file_path   text not null,
  uploaded_by uuid references public.profiles(id),
  created_at  timestamptz not null default now()
);

create table if not exists public.payments (
  id                   uuid primary key default gen_random_uuid(),
  resident_id          uuid not null references public.profiles(id),
  description          text not null,
  amount               numeric not null,
  due_date             date,
  status               text not null default 'pending' check (status in ('pending', 'paid', 'verified')),
  receipt_path         text,
  created_at           timestamptz not null default now(),
  stripe_payment_link  text
);

create table if not exists public.requests (
  id          uuid primary key default gen_random_uuid(),
  resident_id uuid not null references public.profiles(id),
  title       text not null,
  description text,
  category    text default 'altro',
  status      text not null default 'aperta' check (status in ('aperta', 'in_corso', 'chiusa')),
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.documents enable row level security;
alter table public.payments enable row level security;
alter table public.requests enable row level security;

-- ---------------------------------------------------------------------
-- Funzioni
-- ---------------------------------------------------------------------

create or replace function public.get_my_role()
returns text
language sql
stable security definer
set search_path to 'public'
as $function$
  select role from public.profiles where id = auth.uid()
$function$;

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
end;
$function$;

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
  if new.role is distinct from old.role then
    raise exception 'Non puoi modificare il tuo ruolo';
  end if;
  return new;
end;
$function$;

create or replace function public.enforce_resident_payment_update()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$ BEGIN IF get_my_role() = 'admin' THEN RETURN new; END IF; IF new.resident_id IS DISTINCT FROM old.resident_id OR new.description IS DISTINCT FROM old.description OR new.amount IS DISTINCT FROM old.amount OR new.due_date IS DISTINCT FROM old.due_date OR new.stripe_payment_link IS DISTINCT FROM old.stripe_payment_link OR new.created_at IS DISTINCT FROM old.created_at THEN RAISE EXCEPTION 'I residenti possono modificare solo lo stato e la ricevuta del pagamento'; END IF; RETURN new; END; $function$;

-- ---------------------------------------------------------------------
-- Trigger
-- ---------------------------------------------------------------------

drop trigger if exists trg_enforce_profile_update on public.profiles;
create trigger trg_enforce_profile_update
  before update on public.profiles
  for each row execute function public.enforce_profile_update();

drop trigger if exists trg_enforce_resident_payment_update on public.payments;
create trigger trg_enforce_resident_payment_update
  before update on public.payments
  for each row execute function public.enforce_resident_payment_update();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- RLS policy — public.profiles
-- ---------------------------------------------------------------------

drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select using (auth.role() = 'authenticated');

drop policy if exists "profiles_insert" on public.profiles;
create policy "profiles_insert" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles
  for update using (auth.uid() = id or get_my_role() = 'admin');

-- ---------------------------------------------------------------------
-- RLS policy — public.documents
-- ---------------------------------------------------------------------

drop policy if exists "documents_select" on public.documents;
create policy "documents_select" on public.documents
  for select using (auth.role() = 'authenticated');

drop policy if exists "documents_insert" on public.documents;
create policy "documents_insert" on public.documents
  for insert with check (get_my_role() = 'admin');

drop policy if exists "documents_delete" on public.documents;
create policy "documents_delete" on public.documents
  for delete using (get_my_role() = 'admin');

-- ---------------------------------------------------------------------
-- RLS policy — public.payments
-- ---------------------------------------------------------------------

drop policy if exists "payments_select_own" on public.payments;
create policy "payments_select_own" on public.payments
  for select using (resident_id = auth.uid());

drop policy if exists "payments_select_admin" on public.payments;
create policy "payments_select_admin" on public.payments
  for select using (get_my_role() = 'admin');

drop policy if exists "payments_insert_admin" on public.payments;
create policy "payments_insert_admin" on public.payments
  for insert with check (get_my_role() = 'admin');

drop policy if exists "payments_update_admin" on public.payments;
create policy "payments_update_admin" on public.payments
  for update using (get_my_role() = 'admin');

drop policy if exists "payments_update_resident" on public.payments;
create policy "payments_update_resident" on public.payments
  for update
  using (resident_id = auth.uid() and status = any (array['pending', 'overdue']))
  with check (resident_id = auth.uid() and status = 'paid');

-- ---------------------------------------------------------------------
-- RLS policy — public.requests
-- ---------------------------------------------------------------------

drop policy if exists "requests_select_own" on public.requests;
create policy "requests_select_own" on public.requests
  for select using (resident_id = auth.uid());

drop policy if exists "requests_select_admin" on public.requests;
create policy "requests_select_admin" on public.requests
  for select using (get_my_role() = 'admin');

drop policy if exists "requests_insert" on public.requests;
create policy "requests_insert" on public.requests
  for insert with check (auth.role() = 'authenticated' and resident_id = auth.uid());

drop policy if exists "requests_update_admin" on public.requests;
create policy "requests_update_admin" on public.requests
  for update using (get_my_role() = 'admin');

-- ---------------------------------------------------------------------
-- Storage: bucket privati per documenti condivisi e ricevute di pagamento
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('documenti', 'documenti', false), ('ricevute', 'ricevute', false)
on conflict (id) do nothing;

drop policy if exists "documenti_insert" on storage.objects;
create policy "documenti_insert" on storage.objects
  for insert with check (bucket_id = 'documenti' and get_my_role() = 'admin');

drop policy if exists "documenti_select" on storage.objects;
create policy "documenti_select" on storage.objects
  for select using (bucket_id = 'documenti' and auth.role() = 'authenticated');

drop policy if exists "ricevute_insert" on storage.objects;
create policy "ricevute_insert" on storage.objects
  for insert with check (bucket_id = 'ricevute' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "ricevute_select_own" on storage.objects;
create policy "ricevute_select_own" on storage.objects
  for select using (bucket_id = 'ricevute' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "ricevute_select_admin" on storage.objects;
create policy "ricevute_select_admin" on storage.objects
  for select using (bucket_id = 'ricevute' and get_my_role() = 'admin');
