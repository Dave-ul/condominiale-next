<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Regole permanenti del progetto

- **Dati reali in produzione.** Il database di produzione contiene dati reali di condòmini: non leggerli, esportarli, loggarli né modificarli. Si lavora su codice, migrazioni e stack locale (`supabase start`).
- **Repository pubblico.** Mai committare segreti (chiave `service_role`, credenziali SMTP, token) né dati personali reali, nemmeno in fixture, mockup o screenshot: solo dati palesemente inventati. Le chiavi `anon`/publishable sono pubbliche per progetto.
- **Migrazioni.** Si scrivono come file in `supabase/migrations/`; l'applicazione alla produzione la fa solo il proprietario.
- **Nuove tabelle con dati personali.** RLS attiva, isolamento per `condominio_id` (un residente vede solo il proprio condominio e i propri dati) e un test pgTAP in `supabase/tests/database/`.
- **Nuovi servizi esterni.** Nessun servizio terzo (SDK, CDN, analytics, API) senza aggiornare informativa, registro dei trattamenti (`docs/bozze-legali/`) e CSP in `proxy.ts`.
