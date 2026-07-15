-- Indici di supporto alle query più frequenti dell'app (filtri per
-- residente/stato, ordinamenti per data). Applicata in precedenza
-- direttamente sul progetto ma mai committata: la si riporta qui,
-- identica allo stato reale del database, per allineare repo e DB.

create index if not exists idx_profiles_role on public.profiles (role);

create index if not exists idx_documents_created_at on public.documents (created_at desc);

create index if not exists idx_payments_resident_id on public.payments (resident_id);
create index if not exists idx_payments_status on public.payments (status);
create index if not exists idx_payments_due_date on public.payments (due_date desc);

create index if not exists idx_requests_resident_id on public.requests (resident_id);
create index if not exists idx_requests_status on public.requests (status);
create index if not exists idx_requests_created_at on public.requests (created_at desc);
