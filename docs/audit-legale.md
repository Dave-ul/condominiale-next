# Audit di conformità legale e sicurezza — `condominiale-next`

Data: 29 settembre 2026 · Commit analizzato: `efc30e8` (main) · Perimetro: codice, migrazioni, workflow, cronologia git (tutti i branch), metadati di progetto Supabase/Vercel.
**Non sono stati letti dati di produzione.** Non è stata eseguita alcuna query sul database e non è stata applicata alcuna migrazione.

> Questo documento è un'analisi tecnica e non costituisce parere legale. Le voci segnate DOCUMENTO o AMMINISTRATORE vanno validate con un legale o un DPO.

---

## 0. Problemi URGENTI (dati reali o segreti esposti)

**Nessun problema urgente trovato.** Dettaglio delle verifiche:

| Verifica | Esito |
|---|---|
| Segreti nella cronologia (`git log --all -p`, 54 commit, branch `main` + 3 remoti `claude/*`) | Presenti solo la JWT `anon` (payload `"role":"anon"`, ref `edwqwlirkuizkeumshbg`) nella storia di `.github/workflows/keep-alive.yml` e la chiave `sb_publishable_…` nello stesso file (rimosso il 27/10/2026). Entrambe sono **pubbliche per progetto** (finiscono comunque nel bundle client) e la sicurezza si basa sulle RLS. Nessuna `service_role`, `sb_secret_`, chiave privata o token GitHub/AWS. |
| Codici fiscali, IBAN (regex su tutta la cronologia) | Nessuna corrispondenza. |
| Nomi, email, importi | Il mockup `public/portale/index.html` (rimosso in `4abbf3d`, ancora nella cronologia) contiene nominativi con interno, email `@email.it`, quote e stati di pagamento. **Il proprietario ha confermato che sono dati inventati.** Nessuna azione sulla cronologia. |
| Contatti del titolare | Email personale e cellulare del titolare sono pubblicati di proposito in `app/privacy/page.tsx:36` e prima in `components/landing/Contact.tsx`. Non è un'esposizione, ma è meglio usare una casella professionale o una PEC (vedi R-19). |
| File in `public/` | Solo SVG di default, due font woff2, `index.html` (landing) e `landing.js`. Nessun PDF, CSV o immagine con dati personali. |
| LICENSE | Presente, **MIT** (commit `877c389`). Licenze delle dipendenze: tutte permissive (MIT/ISC/Apache-2.0: next, react, @supabase/*, zod, lucide-react, clsx, tailwind-merge). |

Nota operativa: il progetto Supabase risulta **INACTIVE** (in pausa), quindi il portale oggi non è raggiungibile. Vedi R-17.

---

## 1. Mappa dei dati personali

| Tabella / oggetto | Campi | Categoria | Chi legge (RLS attuali) | Esce verso |
|---|---|---|---|---|
| `auth.users` | email, hash password (bcrypt), `raw_user_meta_data` (full_name, unit, phone, `consent_accepted_at`), IP e user agent nei log di Auth | anagrafica, contatti, credenziali | solo `service_role` e dashboard Supabase | Supabase (AWS eu-central-1); SMTP di Auth (da verificare, R-6) |
| `public.profiles` | full_name, email, unit, phone, role | anagrafica, contatti, dato catastale sommario (interno) | il proprietario oppure l'admin (`20260715120000_…sql:37`) | Supabase; funzioni Vercel (SSR, R-3) |
| `public.payments` | resident_id, description, amount, due_date, status, receipt_path, stripe_payment_link | quote e morosità | il proprio residente oppure l'admin (`baseline:176-195`) | Supabase; Vercel; Stripe se il residente usa il link (R-5) |
| `public.requests` | resident_id, title, description, category, status | contenuti delle richieste di manutenzione (testo libero, può contenere di tutto, anche dati sanitari) | il proprio residente oppure l'admin (`baseline:202-213`) | Supabase; Vercel |
| `public.documents` + bucket `documenti` | metadati e file (verbali, rendiconti, contratti, circolari) | documenti caricati: possono contenere nominativi, morosità e dati di terzi | **qualunque utente autenticato** (`baseline:160-161`, `:230-231`) → R-1, R-2 | Supabase Storage |
| bucket `ricevute` | ricevute di pagamento `<uid>/<uuid>.<ext>` | dati bancari o di pagamento del residente | il proprietario (cartella = uid) oppure l'admin (`baseline:238-244`) | Supabase Storage |
| Modulo contatti della landing | nome, cognome, email, telefono, oggetto, messaggio | contatti e contenuto | — | **Formspree (USA)** (`public/landing.js:65`) |
| Landing `/` | IP, user agent | dati di navigazione | — | **Google (iframe Maps)** `public/index.html:1215`; **Unsplash** (immagini) |
| Log e hosting | IP, URL, header | dati di navigazione | — | Vercel (funzioni in `iad1` USA per default, R-3); Supabase |

Servizi AI e analytics: **nessuno** nel codice. Font: self-hosted (`app/layout.tsx`), nessuna chiamata a Google Fonts.

**Isolamento sulle quote (richiesta specifica): conforme.** Un residente vede solo i propri pagamenti (`payments_select_own`) e solo le proprie ricevute (policy di storage sulla cartella uid), come verificano i test pgTAP in `supabase/tests/database/payments_requests_rls.test.sql`. La lista residenti è accessibile solo all'admin (`20260715120000_…sql:37`). **Il problema è sui documenti (R-1, R-2), non sulle quote.**

---

## 2. Tabella dei rilievi

Legenda tipo: **CODICE** · **CONFIG SUPABASE** · **DOCUMENTO** (serve un professionista) · **DECISIONE MIA** · **AMMINISTRATORE** (delibera, contratto art. 28).

| # | Problema | Norma e link | File / riga | Gravità | Tipo |
|---|---|---|---|---|---|
| R-1 | **Registrazione aperta a chiunque.** Chiunque su Internet si registra da `/auth` (signUp con `unit` autodichiarato) e diventa `resident`. Poiché `documents_select` e `documenti_select` ammettono ogni `authenticated`, un estraneo legge e scarica verbali, rendiconti e contratti. | Vademecum Garante "Il condominio e la privacy": solo chi ne ha diritto può consultare i documenti, con "autenticazione tramite password individuale" ([PDF](https://www.garanteprivacy.it/documents/10160/2416443/Vademecum+-+Il+condominio+e+la+privacy+-+versione+pagina+singola.pdf)); art. 71-ter disp. att. c.c., "aventi diritto" ([Normattiva](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:regio.decreto:1942-03-30;318~art71ter)); GDPR artt. 5.1.f, 25, 32 ([EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679/oj)) | `app/auth/page.tsx:52` (signUp), `:145-189` (tab "Registrati"); `supabase/migrations/20260621221200_baseline_schema.sql:160-161`, `:230-231` | **alta** | CODICE + CONFIG SUPABASE (disattivare "Allow new users to sign up", usare solo inviti o approvazione admin) |
| R-2 | **Nessuna separazione tra condomini.** Lo schema non ha `condominio_id`: con più condomini gestiti, i residenti di un edificio vedono i documenti degli altri e l'admin è unico e globale. I documenti di un condominio vanno resi disponibili solo alla sua compagine. | GDPR artt. 5.1.b-c (limitazione della finalità e minimizzazione), 25 (privacy by design); bozza Garante 2025, § 7 "Il Condominio digitale" e nota 60 (livelli di autorizzazione "in base alla propria posizione nel Condominio") ([PDF bozza](https://www.garanteprivacy.it/documents/10160/0/All.1+-+Documento+di+indirizzo+relativo+al+Trattamento+dei+dati+personali+nell%E2%80%99ambito+del+condominio+-+Consultazione.pdf/a7ebbf6d-8e5a-b439-4f84-ac23f8f8a678?version=2.1)) | tutte le tabelle in `baseline_schema.sql:16-54`; tutte le policy | **alta** | CODICE (migrazione: tabella `condomini`, `condominio_id` su profili/documenti/pagamenti/richieste, RLS per edificio, cartelle di storage per edificio) |
| R-3 | **Vercel Hobby senza DPA e funzioni in USA.** Il DPA Vercel "applies to … Customers who are on Enterprise and Pro plans": sul piano Hobby non c'è un contratto art. 28. In assenza di `vercel.json` le funzioni (che fanno SSR con dati dei residenti) girano per default in `iad1` (Washington). A questo si aggiunge l'uso commerciale su piano Hobby. | GDPR art. 28 (contratto con il responsabile), artt. 44-46 (trasferimenti); [Vercel DPA](https://vercel.com/legal/dpa); [Vercel, regione di default delle funzioni](https://vercel.com/docs/functions/configuring-functions/region) | assente `vercel.json`; progetto Vercel `condominiale-next` | **alta** | DECISIONE MIA (passare a Pro e accettare il DPA, oppure un hosting UE con DPA) + CODICE (`vercel.json` con `"regions": ["fra1"]`) |
| R-4 | **Manca la base "civilistica" del portale.** Il sito condominiale va istituito dall'assemblea (maggioranza art. 1136 c. 2 c.c.), che stabilisce anche quali documenti pubblicare. La bozza Garante qualifica il Condominio come titolare quando l'assemblea nomina il gestore del sito, e l'amministratore come responsabile ex art. 28 per le attività di mandato assembleare. Servono quindi: delibera per ogni condominio, atto art. 28 Condominio → amministratore, e sub-responsabili (Supabase, Vercel, eventuale gestore tecnico) autorizzati. | Art. 71-ter disp. att. c.c. ([Normattiva](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:regio.decreto:1942-03-30;318~art71ter)); art. 1136 c.c. ([Normattiva](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:regio.decreto:1942-03-16;262~art1136)); Vademecum ("solo i documenti adottati dall'apposita delibera assembleare"); bozza Garante 2025, § "titolarità", esempi "nomina, da parte dell'assemblea, del gestore del sito internet condominiale"; GDPR art. 28.2 e 28.4 (sub-responsabili); [EDPB Linee guida 07/2020](https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-072020-concepts-controller-and-processor-gdpr_en) | — (fuori dal codice) | **alta** | AMMINISTRATORE (delibera per ogni condominio + atto art. 28) |
| R-5 | **Informativa non allineata.** (a) Indica come unico titolare l'amministratore persona fisica: per i trattamenti del portale il titolare è il singolo Condominio (R-4), mentre l'amministratore è titolare solo per i trattamenti attribuiti dalla legge (registri, anagrafe) e per la landing. (b) La base 6.1.b "esecuzione di un contratto" non copre inquilini e altri titolari di diritti. Per anagrafe e rendiconti la base è l'obbligo di legge (6.1.c, art. 1130 c.c.). (c) Mancano Stripe (link di pagamento), Google (Maps), Unsplash, il provider SMTP di Auth e i trasferimenti extra-UE di Supabase e Vercel. (d) Conservazione generica. (e) La checkbox "Accetto l'informativa" (obbligatoria) mescola presa visione e consenso: il consenso non è la base del trattamento e non va chiesto come condizione. (f) Manca il riferimento all'art. 77 per il reclamo ed eventualmente al DPO. | GDPR artt. 6, 13, 14 ([EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679/oj)); art. 1130 c.c. ([Normattiva](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:regio.decreto:1942-03-16;262~art1130)); bozza Garante 2025, § "informativa" | `app/privacy/page.tsx:33-37` (titolare), `:49-52` (basi giuridiche), `:56-63` (destinatari); `app/auth/page.tsx:170-184` (checkbox) | **alta** | DOCUMENTO (nuova informativa per condominio) + CODICE (la checkbox diventa "Ho letto l'informativa", oppure un semplice link) |
| R-6 | **SMTP di Auth non chiarito.** Il servizio email integrato di Supabase è "not meant for production" e invia solo agli indirizzi del team. Se i residenti ricevono la mail di conferma c'è un **SMTP custom**, cioè un altro responsabile non dichiarato. Se non la ricevono, la conferma email è **disattivata** e chiunque può registrarsi con un indirizzo altrui (aggrava R-1). | [Supabase docs, Custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp); GDPR artt. 28, 32 | dashboard Supabase → Auth → SMTP / Email provider (non nel repo: manca `supabase/config.toml`) | **alta** | CONFIG SUPABASE (verifica in dashboard; poi SMTP UE con DPA, conferma email attiva) |
| R-7 | **Diritti dell'interessato non supportati.** Nessuna funzione di export (art. 15 e 20) né di cancellazione. Le FK `payments.resident_id`, `requests.resident_id` e `documents.uploaded_by` non hanno `on delete`: eliminare un utente da Auth fallisce, perché `profiles` è in cascade ma le tabelle figlie bloccano. | GDPR artt. 15-22 ([EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679/oj)) | `baseline_schema.sql:31`, `:37`, `:49` | media | CODICE (RPC `export_my_data()`; strategia di cancellazione o pseudonimizzazione compatibile con R-8) |
| R-8 | **Nessuna politica di conservazione.** Ricevute, richieste e account di ex condòmini restano senza limite. Le scritture contabili e i giustificativi vanno conservati per 10 anni (bozza Garante, § "Conservazione dei dati": "conservati per dieci anni"), ma il resto (richieste chiuse, account cessati, documenti di mandati conclusi) no. | GDPR art. 5.1.e; art. 1130 c.c. n. 8 (conservazione della documentazione) | — | media | DECISIONE MIA + CODICE (colonna `archived_at`, job pg_cron, procedura di fine mandato ex art. 1129 c. 8 c.c.) |
| R-9 | **Google Maps caricato senza consenso.** L'iframe `maps.google.com` si carica (lazy) appena visibile, prima di qualsiasi scelta dell'utente, e comunica a Google l'IP e gli eventuali cookie del dominio google.com. La cookie policy afferma che non imposta cookie di profilazione senza interazione: l'affermazione non è verificata. | Garante, Linee guida cookie e altri strumenti di tracciamento, provv. n. 231 del 10/6/2021 ([docweb 9677876](https://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/9677876)) | `public/index.html:1215-1222`; `app/cookie-policy/page.tsx` (paragrafo "Contenuti di terze parti") | media | CODICE (click-to-load con avviso, oppure immagine statica con link a Maps) |
| R-10 | **Modulo contatti su Formspree (USA) senza informativa al punto di raccolta.** La base giuridica dichiarata è il consenso, ma il caso è una misura precontrattuale (6.1.b). | GDPR artt. 6.1.b, 13, 44-46 | `public/landing.js:65`; `public/index.html:1226-1262`; `app/privacy/page.tsx:51` | media | CODICE (nota informativa sotto il form) + DOCUMENTO (base giuridica, verifica DPA/DPF Formspree) + DECISIONE MIA (sostituire con un endpoint proprio in UE?) |
| R-11 | **Il residente può modificare liberamente il proprio profilo.** `profiles_update` gli consente di cambiare `unit`, `email` e `full_name` (il trigger blocca solo `role`): può spacciarsi per un altro interno. Inoltre può impostare `receipt_path` a una stringa arbitraria, anche un path di un altro utente, che l'admin poi aprirebbe. | GDPR art. 5.1.d (esattezza), art. 32 | `baseline_schema.sql:152-153` (policy), `:96-111` (trigger profilo), `:113-114` e `:192-195` (pagamenti) | media | CODICE (trigger: residente non può cambiare `unit`/`email`; `receipt_path` deve iniziare con `auth.uid()/`) |
| R-12 | **Autenticazione debole per l'admin.** Password minima di 6 caratteri, nessun MFA sull'account amministratore che vede tutti i dati. La **conservazione** delle password è invece conforme: Supabase Auth usa bcrypt ([Supabase](https://supabase.com/docs/guides/auth/password-security)), funzione elencata nelle linee guida ACN-Garante (§ 3.3). Non c'è autenticazione custom. | Linee guida ACN-Garante sulla conservazione delle password, provv. 7/12/2023 ([docweb 9962283](https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9962283), [PDF ACN](https://www.acn.gov.it/portale/documents/20119/85999/ACN_LineeGuida_Password.pdf/c1724360-8295-0847-1638-f4a9f21f2e86?t=1781863650694)); GDPR art. 32 | `app/auth/page.tsx:167` | media | CONFIG SUPABASE (lunghezza minima ≥ 12, leaked password protection, MFA TOTP) + CODICE (obbligo `aal2` per `role = admin` nelle policy) |
| R-13 | **Registro dei trattamenti e procedura data breach assenti** (nel repo non c'è nulla, e non risultano da altre fonti). | GDPR artt. 30, 33, 34 | — | media | DOCUMENTO |
| R-14 | **Accountability del consenso in `raw_user_meta_data`.** `consent_accepted_at` è modificabile dall'utente stesso (`auth.updateUser`), quindi non ha valore probatorio. Se R-5(e) elimina il consenso, il campo diventa inutile. | GDPR art. 5.2 | `app/auth/page.tsx:63` | bassa | CODICE (rimuovere, oppure spostare in una tabella non modificabile dal client) |
| R-15 | **Immagini da `images.unsplash.com`**: host terzo che riceve l'IP dei visitatori della landing (e degli utenti dell'app, per via della CSP). | GDPR art. 5.1.c; Linee guida cookie (contenuti di terze parti) | `public/index.html` (5 URL); `proxy.ts:42`, `:62` | bassa | CODICE (self-hosting in `public/`) |
| R-16 | **Header di sicurezza: già buoni.** CSP con nonce, HSTS preload, nosniff, Referrer-Policy e Permissions-Policy ci sono. Manca solo `Cross-Origin-Opener-Policy: same-origin`; `X-Frame-Options: SAMEORIGIN` è sufficiente. Gli URL firmati di Storage durano 60 secondi, e va bene così. La `service_role` non è mai usata lato client. | GDPR art. 32 | `next.config.ts:9-15`; `proxy.ts`; `DocumentsClient.tsx:42`; `PaymentsClient.tsx:190` | bassa | CODICE (aggiunta COOP, facoltativa) |
| R-17 | **Disponibilità.** Il progetto Supabase è in pausa (INACTIVE) anche con il keep-alive attivo (poi rimosso): sul piano free i dati sono a rischio (pausa prolungata) e non c'è un backup documentato. | GDPR art. 32.1.b-c (disponibilità, ripristino) | piano Supabase free (keep-alive rimosso, v. § Keep-alive rimosso) | bassa | DECISIONE MIA (piano a pagamento con backup, oppure export periodico cifrato) |
| R-18 | **Log.** L'unico `console.error` lato server (`lib/supabase/session.ts:49`) registra solo il messaggio di errore Postgres, che può includere valori della riga in caso di violazione di un vincolo. Gli `error.tsx` loggano nel browser. Nessun dato personale sistematico: accettabile. | GDPR art. 5.1.c | `lib/supabase/session.ts:49` | bassa | CODICE (loggare `error.code` invece di `message`, facoltativo) |
| R-19 | **Contatti del titolare**: cellulare ed email personali pubblicati. Non è una violazione (sono dati del titolare, pubblicati di sua scelta), ma meglio una casella o PEC professionale, anche per l'esercizio dei diritti. | GDPR art. 13.1.a | `app/privacy/page.tsx:36`, `:75` | bassa | DECISIONE MIA |

### Punti verificati e conformi (nessuna azione)
- **Morosità:** nel portale nessun residente vede quote o debiti altrui (vedi sopra). La conoscenza delle morosità altrui da parte dei condòmini avviene "per il tramite dell'amministratore" (rendiconto o richiesta), mai per affissione a terzi (Vademecum Garante; Cass. ord. n. 29323/2022, vedi Incertezze). La comunicazione ai creditori ex art. 63 c. 1 disp. att. c.c. ([Normattiva](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:regio.decreto:1942-03-30;318~art63)) avviene fuori dal portale e non va implementata come funzione self-service.
- **Supabase:** regione `eu-central-1` (Francoforte), confermata dai metadati di progetto. Il DPA si richiede o consulta dal [portale legale Supabase](https://supabase.com/legal/customer-resources/data-processing-addendum). I sub-responsabili ([lista 1/6/2026](https://supabase.com/legal/subprocessor-list/June-1-2026.pdf)) sono quasi tutti società USA (AWS, Cloudflare, Google, Fly.io, Vercel, OpenAI, Sentry…), quindi i trasferimenti sono coperti dal DPA/SCC e dal TIA di Supabase. **Da fare:** verificare che il DPA sia stato effettivamente accettato per l'organizzazione (DECISIONE MIA).
- **Cookie di sessione Supabase** (`sb-*-auth-token`): tecnici, strettamente necessari, non richiedono consenso (Linee guida cookie 2021, § cookie tecnici). Nessun analytics o tracker nel codice.
- **Password:** nessuna gestione custom; bcrypt tramite Supabase (vedi R-12).

---

### Esito della configurazione Auth (29/9/2026, `supabase config push`)
Impostazioni versionate in `supabase/config.toml`, applicate e verificate con `supabase config diff` (0 differenze sulle proprietà dichiarate):
- **R-1:** registrazione pubblica disattivata (`enable_signup = false`, anche per il provider email).
- **R-12:** password minima 12 caratteri. MFA TOTP era già abilitata sul progetto, ma manca ancora la pagina del portale per attivarla sull'account admin.
- **Link:** `site_url` e redirect ora puntano a `roccaamministrazioni.it`; i template di invito e recupero portano a `/api/auth/confirm`.
- **R-6 (risolto):** prima la conferma email era già attiva, ma le email partivano dall'SMTP integrato di Supabase, che scrive solo ai membri del team. Ora l'SMTP di produzione è la casella dedicata `portale@roccaamministrazioni.it` su Aruba (`smtps.aruba.it:465`, dati in Italia), dichiarata come sub-responsabile nelle bozze. La DKIM del dominio era già pubblicata (selettore `a1`).
- **R-20 (Twilio, chiuso):** il diff riportava `auth.sms.twilio.enabled = true`. Dalla dashboard risulta però che il provider Phone è **disattivato** e i campi delle credenziali Twilio sono vuoti: Twilio è solo il fornitore SMS preselezionato e nessun dato gli viene inviato.
- **Incidente, risolto lo stesso giorno:** il primo push includeva `[auth.email] enable_signup = false`. Nella CLI questa chiave spegne l'intero provider Email, login compreso, e per alcuni minuti nessuno poteva accedere con email e password. Corretto con `enable_signup = true` (le registrazioni restano chiuse da `[auth] enable_signup = false`) e verificato in dashboard: Email "Enabled", registrazioni disattivate, conferma email attiva.
- **DPA Supabase:** secondo la pagina Organization → Legal Documents, il DPA "is incorporated into our Terms of Service": vale automaticamente per ogni organizzazione e non va firmato. Dalla stessa pagina si scarica il TIA.
- **MFA:** TOTP risulta "Enabled" in dashboard. Pagina di attivazione nel portale e obbligo per l'admin sono stati aggiunti nel codice (R-12).
- **Integrazioni (29/9/2026):**
  - **GitHub:** "Deploy to production" è stato **disattivato**. Con quell'opzione accesa, il merge su `main` avrebbe applicato da solo le migrazioni in produzione, mentre la cronologia remota non corrisponde ai nomi dei file nel repo (`20260715224326_baseline_schema` ecc. in produzione contro `20260621221200_…` ecc. nel repo). È la stessa deriva che ad agosto faceva fallire il job `migrate`. Prima di riattivarlo va allineata la cronologia con `supabase migration repair`.
  - **Vercel:** la connessione Supabase → Vercel è stata **eliminata**. Aveva copiato nell'ambiente production di Vercel 14 variabili non usate dall'app, tra cui `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_SECRET_KEY`, `SUPABASE_JWT_SECRET` e `POSTGRES_PASSWORD`. Verificato via API: restano solo le 6 `NEXT_PUBLIC_SUPABASE_*` impostate a mano.

## 3. Incertezze

1. **Documento di indirizzo del Garante sul condominio (provv. n. 209 del 10/4/2025).** La [deliberazione (docweb 10128634)](https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/10128634) avvia una **consultazione pubblica** di 30 giorni ([newsletter 8/5/2025](https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/10129281)). Nella [pagina argomento "Condominio"](https://www.garanteprivacy.it/home/ricerca/-/search/argomento/Condominio) del Garante, consultata il 29/9/2026, **non risulta un'adozione definitiva**. Il provvedimento del 28/5/2026 emerso dalla ricerca (docweb 10259916) riguarda altro (geolocalizzazione). Di conseguenza le qualificazioni citate in R-4 e R-5 (Condominio titolare per il sito, amministratore responsabile ex art. 28 per i compiti di mandato assembleare, titolare per quelli di legge) sono quelle **della bozza**, non ancora vincolanti, e non è possibile indicare "differenze rispetto alla bozza". Il sito condominiale compare nella bozza **come esempio** di trattamento a titolarità del Condominio. Per il "gestore del portale" come **sub-responsabile** la bozza non usa questo termine: è una deduzione dall'art. 28.4 GDPR.
2. **Vademecum "Il condominio e la privacy":** è anteriore al GDPR, come dichiara in apertura ("realizzato prima dell'applicazione del Regolamento UE 679/2016"). Le indicazioni sul sito (accesso individuale, solo documenti deliberati) restano però coerenti con l'art. 71-ter e con la bozza 2025.
3. **Cass. ord. n. 29323 del 7/10/2022:** trovata solo su fonti secondarie ([Studio Dell'Unto](https://www.studiodellunto.eu/tutela-della-privacy-e-morosita-condominiale-corte-di-cassazione-sezione-i-civile-ordinanza-7-ottobre-2022-n-29323/)), non sul testo ufficiale di Italgiure. Secondo queste fonti, l'affissione dei nominativi dei morosi in spazi accessibili a terzi è illecita, ma resta il diritto di ogni condòmino di conoscere le morosità tramite l'amministratore. Da verificare sul testo integrale.
4. **Testo degli articoli su Normattiva:** gli URN citati risolvono correttamente sull'atto (R.D. 262/1942 e R.D. 318/1942). Il testo degli artt. 71-ter e 63 c. 1 disp. att. e 1129 c. 2 c.c. è stato letto nelle citazioni letterali della bozza Garante, non estratto direttamente da Normattiva (la pagina richiede JavaScript).
5. **Google Maps e cookie (R-9):** non ho verificato in DevTools quali cookie imposti l'iframe embed. Il rilievo si basa sul contatto con un terzo prima del consenso; va confermato con un test in navigazione anonima.
6. **Formspree (R-10):** DPA e certificazione Data Privacy Framework non verificati.
7. **European Accessibility Act** (dir. UE 2019/882, recepita con d.lgs. 82/2022): probabilmente non applicabile (il portale non è un servizio al consumatore tra quelli elencati, e può valere l'esenzione per le microimprese che forniscono servizi). Non verificato sulle fonti primarie: da validare. Restano comunque buone pratiche WCAG.
8. **AI Act:** non pertinente. Nel codice non c'è alcun sistema di intelligenza artificiale.
9. **Piano Vercel:** "Hobby" dichiarato dal proprietario, non letto dall'API. Il DPA Vercel esclude esplicitamente i piani diversi da Pro ed Enterprise.

---

## 4. Proposta di ordine di intervento (Fase 4, dopo approvazione)

1. R-1 + R-6: chiusura della registrazione e verifica SMTP (CONFIG) e, nel codice, rimozione del tab "Registrati" con flusso a invito.
2. R-2: migrazione multi-condominio con RLS per edificio e test pgTAP di isolamento.
3. R-3: `vercel.json` con `regions: ["fra1"]` e decisione sul piano.
4. R-11, R-7, R-8: trigger, FK, export, retention.
5. R-9, R-10, R-15, R-14, R-16: landing e dettagli.
6. Bozze in `docs/bozze-legali/`: informativa, voce del registro, schema art. 28 (R-4, R-5, R-13), marcate "BOZZA — da validare con un legale/DPO".
7. Scelta della LICENSE: la MIT è già presente, da confermare o cambiare. Regole permanenti per `AGENTS.md`.

---

## 5. Controllo di sicurezza del 27/10/2026

Perimetro: `main@124ee43`. Sono stati riletti migrazioni e RLS, proxy, route di auth, client, workflow, dipendenze, impostazioni GitHub e header di produzione. Non sono stati letti dati di produzione.

| # | Gravità | Rilievo | Esito |
|---|---|---|---|
| S-1 | alta | `next@16.2.7` con 20 advisory (5 critiche: RCE in Image Optimization e in `use cache`, bypass del proxy, SSRF) | `next` 16.4.3, zod 4, vitest 5, CI su Node 24: `npm audit` a 0 |
| S-2 | media | La verifica in due passaggi dei residenti era imposta solo dal proxy: con la password, un JWT aal1 leggeva i dati via REST/Storage | policy RESTRICTIVE `mfa_richiesta` + `mfa_ok()`; `delete_my_account` richiede aal2 (migration `20261027120000`) |
| S-3 | media | Trigger a lista nera: il residente poteva riscrivere `payments.intestatario` | trigger a lista bianca su `payments` e `profiles` |
| S-4 | media | Segreti Actions non usati (`SUPABASE_DB_URL`, `VERCEL_TOKEN`, …) e branch `claude/*` con workflow che li usano | **da fare dal proprietario** |
| S-5 | media | `main` non protetto, Dependabot spento | **da fare dal proprietario** |
| S-6 | bassa | Limiti di lunghezza e categorie solo nel client | CHECK `not valid` su `requests` e `documents` |
| S-7 | bassa | Link Stripe validato solo nel client | CHECK `payments_stripe_link_valido` |
| S-8 | bassa | Profilo di ripiego creato da `user_metadata` modificabile | `session.ts` non copia più interno e telefono |
| S-9 | bassa | Header `x-powered-by`, azioni GitHub fissate per tag | `poweredByHeader: false`, azioni fissate per SHA |

Dopo aver applicato la migration in produzione, il proprietario valida i vincoli `not valid` con `alter table … validate constraint …` (elenco in testa alla migration). Se la validazione fallisce, ci sono righe vecchie fuori regola da correggere prima.

### Keep-alive rimosso (27/10/2026)
Lo storico delle esecuzioni mostra che il workflow non impediva la pausa del progetto free: dopo ogni riattivazione (27/8, 29/9) il progetto tornava in pausa entro 7-9 giorni, anche con i ping riusciti, e i ping successivi fallivano con `curl` exit 6 (host non risolto, progetto in pausa). Il portale è rimasto senza database dal 7/9 al 28/9 e dall'8/10 al 26/10. Il workflow è stato quindi rimosso. La disponibilità resta aperta (rilievo R-17): la soluzione indicata è il piano a pagamento con backup.

---

## 6. Verifica del 1/11/2026 sulle fonti ufficiali

Perimetro: `main@70df785` più questo branch. Le norme sono state lette dal testo vigente su Normattiva (MCP `it-eli-mcp`) e su EUR-Lex (MCP `eur-lex`), e le citazioni sono state controllate con `it_verify_citations`. Non sono stati letti dati di produzione.

> Informazione generale, non consulenza legale. Le voci DOCUMENTO e AMMINISTRATORE vanno validate con un legale o un DPO.

### 6.1 Incertezze del § 3 chiuse

| # | Esito | Fonte |
|---|---|---|
| 1 | **Documento del Garante sul condominio**: al 1/11/2026 risulta ancora la sola bozza in consultazione (deliberazione n. 209 del 10/4/2025); non si trova un'adozione definitiva. Le qualificazioni di R-4 e R-5 restano quelle della bozza. | [docweb 10128634](https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/10128634), [pagina "Condominio"](https://www.garanteprivacy.it/home/ricerca/-/search/argomento/Condominio) |
| 3 | **Cass. 29323/2022 esiste**: Cass. civ. sez. I, ord. n. 29323, decisa il 27/9/2022 e depositata il 7/10/2022, materia "trattamento dati personali". Il testo integrale su SentenzeWeb è ancora "in fase di oscuramento", quindi il contenuto resta da confermare sul testo ufficiale. | [SentenzeWeb snciv2022129323O](https://www.italgiure.giustizia.it/sncass/#id=snciv2022129323O) |
| 4 | **Art. 71-ter disp. att. c.c., letto su Normattiva**: "Su richiesta dell'assemblea, che delibera con la maggioranza di cui al secondo comma dell'articolo 1136 del codice, l'amministratore è tenuto ad attivare un sito internet del condominio che consenta agli aventi diritto di consultare ed estrarre copia in formato digitale dei documenti previsti dalla delibera assembleare. Le spese […] sono poste a carico dei condomini." Art. 63, primo comma, letto su Normattiva: l'amministratore "è tenuto a comunicare ai creditori non ancora soddisfatti che lo interpellino i dati dei condomini morosi". | `urn:nir:stato:regio.decreto:1942-03-30;318` ([Normattiva](https://www.normattiva.it/eli/id/1942/04/17/042U0318/CONSOLIDATED)) |
| 6 | **Formspree**: la privacy policy dice che i dati sono trattati "in the United States". Non cita il Data Privacy Framework, né un DPA, né le clausole contrattuali tipo, e non è stato trovato un DPA pubblico. Il trasferimento verso gli USA resta quindi **senza una garanzia documentata** (artt. 44-46 GDPR). La deroga dell'art. 49 non copre un modulo usato in modo sistematico. | [Formspree privacy policy](https://formspree.io/legal/privacy-policy) |
| 7 | **European Accessibility Act: non applicabile.** L'art. 2.2 della dir. 2019/882 elenca servizi chiusi (comunicazione elettronica, media audiovisivi, trasporti, servizi bancari, e-book, commercio elettronico) e il portale non rientra tra questi. In ogni caso l'art. 4.5 esenta le microimprese che forniscono servizi. Restano utili le buone pratiche WCAG. | CELEX [32019L0882](https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:32019L0882), artt. 2 e 4 |
| 9 | **Vercel**: il piano è ancora Hobby (confermato dal proprietario). Le fair use guidelines limitano Hobby all'uso "non-commercial, personal" e il DPA vale solo per Pro ed Enterprise. | [Vercel fair use](https://vercel.com/docs/limits/fair-use-guidelines), [Vercel DPA](https://vercel.com/legal/dpa) |

### 6.2 Nuovi rilievi

| # | Problema | Norma | File | Gravità | Tipo |
|---|---|---|---|---|---|
| R-21 | **P.IVA assente dal sito.** Il numero di partita IVA "deve essere indicato […] nella home-page dell'eventuale sito web". L'art. 7 D.Lgs. 70/2003 chiede inoltre, in modo "diretto e permanente", nome, sede, email, numero REA o del registro delle imprese (se iscritto) e P.IVA. | art. 35, c. 1, DPR 633/1972 (`urn:nir:stato:decreto.presidente.repubblica:1972-10-26;633`); art. 7 D.Lgs. 70/2003 (`urn:nir:stato:decreto.legislativo:2003-04-09;70`) | `public/index.html` (footer) | media | CODICE (fatto, con segnaposto) + DATO DA FORNIRE |
| R-22 | **L'informativa pubblicata non era stata aggiornata dopo R-5.** Indicava come unico titolare l'amministratore, la base 6.1.b per tutti i trattamenti, e non nominava Aruba, Stripe e l'art. 77. | GDPR artt. 6, 13, 14, 77 | `app/privacy/page.tsx` | alta | CODICE (fatto) |
| R-23 | **Termini non allineati**: parlavano di "registrazione" con "accettazione" dell'informativa, mentre l'accesso è solo su invito. | GDPR art. 5.1.a (trasparenza) | `app/termini/page.tsx` | bassa | CODICE (fatto) |
| R-24 | **Atto art. 28 incompleto.** Mancavano: le istruzioni sui trasferimenti verso Paesi terzi (28.3.a), l'avviso al titolare se un'istruzione è illecita (28.3, secondo comma), la responsabilità piena per i sub-responsabili (28.4) e la cancellazione delle copie (28.3.g). L'amministratore inoltre risultava firmare per entrambe le parti. | GDPR art. 28 (CELEX 32016R0679, letto su EUR-Lex) | `docs/bozze-legali/contratto-art28-portale.md` | media | DOCUMENTO (bozza corretta) |

### 6.3 Cosa resta prima di poter dire "conforme"

Il codice e i testi di questo branch sono pronti. **Da soli non bastano**: servono questi atti, in quest'ordine.

1. **Vercel → Pro** (oppure un hosting UE con DPA). Senza questo passaggio mancano sia il contratto art. 28 con l'hoster sia il rispetto dei termini Vercel (R-3). L'informativa nuova descrive Vercel come sub-responsabile, e questo è vero solo con il DPA in vigore.
2. **P.IVA, REA (se c'è) e PEC** dello studio, al posto dei segnaposto in `public/index.html` e `app/privacy/page.tsx` (R-21).
3. **Delibera ex art. 71-ter per ogni condominio**, con l'elenco dei documenti, il riparto delle spese e la nomina art. 28: bozza in `docs/bozze-legali/delibera-sito-condominiale.md` (R-4). Fino alla delibera, il portale per quel condominio non ha la sua base civilistica.
4. **Informativa per condominio** (`informativa-portale.md`, compilata) da consegnare con l'invito; **registro dei trattamenti** compilato (R-13).
5. **Formspree**: sostituirlo con un modulo che non esca dall'UE (ad esempio una tabella Supabase con insert anonimo e RLS, oppure un semplice `mailto:`), oppure ottenere e firmare un DPA con clausole contrattuali tipo (vedi § 6.1, punto 6).
6. **Disponibilità e backup** (R-17): il piano Supabase free va in pausa e non ha backup documentati.
7. Validazione finale di un legale o di un DPO.

---

## 7. Portale dismesso (1/11/2026)

L'amministratore ha deciso di usare il sito solo come vetrina. Il proprietario conferma che nel database Supabase non c'erano dati di condòmini reali.

### 7.1 Cosa è stato tolto dal codice

- Pagine `/auth`, `/portale/*`, `/termini` e route `/api/auth/*`; ora sono redirect permanenti verso `/` (`next.config.ts`).
- Client Supabase, sessione e controllo MFA in `proxy.ts`; la CSP delle pagine Next non autorizza più `*.supabase.co`.
- Cartella `supabase/` (configurazione Auth, migrazioni, test pgTAP, template email) e job CI `db-tests`.
- Dipendenze `@supabase/ssr`, `@supabase/supabase-js`, `supabase`, `zod`, `clsx`, `tailwind-merge`.
- Home: link e bottoni "Accedi al portale", sezione `#portale`, FAQ sul portale.
- Informativa: tolta la parte B (portale); restano sito pubblico e modulo di contatto, art. 13 GDPR. Cookie policy: il sito non imposta cookie propri.
- Bozze in `docs/bozze-legali/` (art. 28, delibera ex art. 71-ter, informativa per condominio, registro): tutte riferite al portale, cancellate. Restano nella cronologia git.

### 7.2 Rilievi chiusi con la dismissione

Non si applicano più: R-4 (delibera ex art. 71-ter), R-5 (titolarità condominio/amministratore), R-13 per la parte portale, R-17 (disponibilità del DB), R-22 parte B, R-23 (termini), R-24 (atto art. 28), oltre ai rilievi su RLS, multi-tenancy, MFA e conservazione dei dati del portale.

### 7.3 Rilievi ancora aperti per la vetrina

1. **P.IVA, REA (se c'è) e PEC** al posto dei segnaposto nel footer di `public/index.html` e in `app/privacy/page.tsx` (R-21).
2. ~~**Formspree**~~: **risolto il 1/11/2026** (§ 7.5).
3. **Vercel Hobby**: le fair use guidelines lo limitano all'uso non commerciale, e il sito di uno studio professionale è uso commerciale; il DPA vale solo da Pro (R-3). In alternativa, un hosting statico UE con DPA.

### 7.4 Fuori dal codice (a cura del proprietario)

- Cancellare il progetto Supabase dalla dashboard (irreversibile).
- Togliere da Vercel le variabili `NEXT_PUBLIC_SUPABASE_*` e l'integrazione Supabase del team.
- Eliminare la casella SMTP `portale@roccaamministrazioni.it` o cambiarne la password.
- Togliere `quality/db-tests` dai check obbligatori della protezione di `main`.

### 7.5 Formspree sostituito (1/11/2026)

Il modulo di contatto (richieste di preventivo) resta, su richiesta dell'amministratore. Non passa più da Formspree (USA, nessuna garanzia per il trasferimento): invia a `/api/contatto`, una funzione del sito nella regione Vercel di Francoforte. Questa spedisce la mail con nodemailer tramite `smtps.aruba.it`, cioè la posta Aruba del dominio con server in Italia, alla casella dello studio.

- Misure: controllo dell'`Origin`, limite di 5 richieste ogni 10 minuti per IP (in memoria, per istanza), campo trappola contro lo spam, validazione con lunghezze massime, `Reply-To` senza a capo, nessun dato del visitatore nei log.
- CSP della home: `connect-src 'self'`, Formspree tolto.
- Informativa e nota sotto il modulo: Formspree sostituito da Aruba S.p.A.; aggiunta Yahoo EMEA Limited (Irlanda) come fornitore della casella che riceve le richieste.
- Credenziali SMTP solo nelle variabili d'ambiente di Vercel (`SMTP_USER`, `SMTP_PASS`).
- Da valutare: far arrivare le richieste a una casella `@roccaamministrazioni.it` invece che a Yahoo, così tutta la catena resta su Aruba.
