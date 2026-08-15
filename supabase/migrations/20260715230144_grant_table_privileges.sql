-- Concede a anon/authenticated i privilegi di base sulle tabelle
-- applicative. Sul progetto hosted questi grant sono già presenti (li
-- imposta la piattaforma alla creazione del progetto), ma un ambiente
-- locale/CI bootstrappato da zero con `supabase start`/`db reset` non li
-- ha: senza GRANT, Postgres nega l'accesso con "permission denied" ancora
-- prima di valutare le policy RLS (i due livelli sono indipendenti).
-- Idempotente: GRANT non fallisce se il privilegio è già presente.

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on public.profiles to anon, authenticated;
grant select, insert, update, delete on public.documents to anon, authenticated;
grant select, insert, update, delete on public.payments to anon, authenticated;
grant select, insert, update, delete on public.requests to anon, authenticated;
