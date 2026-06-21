-- Fix Storage RLS: rimuove policy permissive legacy che annullavano
-- le policy corrette gia presenti (documenti_insert, ricevute_insert).
--
-- Contesto: le policy PERMISSIVE si combinano in OR. Le due policy
-- "Autenticati caricano *" consentivano a QUALSIASI utente autenticato
-- di caricare nel bucket condiviso `documenti` e di scrivere ricevute
-- nella cartella di un ALTRO residente, vanificando i controlli per ruolo
-- e per-cartella. La SELECT "Autenticati leggono ricevute" permetteva
-- inoltre a ogni residente di leggere le ricevute altrui.
--
-- Dopo questa migration restano attive SOLO le policy corrette:
--   INSERT documenti  -> ricevute_insert / documenti_insert (admin via get_my_role())
--   INSERT ricevute   -> solo nella cartella auth.uid()
--   SELECT ricevute   -> proprietario (ricevute_select_own) o admin (ricevute_select_admin)
--   SELECT documenti  -> tutti gli autenticati (condiviso, voluto)

-- INSERT troppo permissive (bloccante #3): rimosse
drop policy if exists "Autenticati caricano documenti" on storage.objects;
drop policy if exists "Autenticati caricano ricevute" on storage.objects;

-- SELECT che esponeva le ricevute di tutti agli autenticati: rimossa
drop policy if exists "Autenticati leggono ricevute" on storage.objects;
