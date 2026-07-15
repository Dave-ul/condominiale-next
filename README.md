# Rocca Amministrazioni — Portale Condominiale

Applicazione web di gestione condominiale: documenti condivisi (verbali,
rendiconti, contratti), quote/pagamenti con ricevute, e richieste di
manutenzione, con un ruolo residente e un ruolo amministratore.

Stack: [Next.js](https://nextjs.org) (App Router), [Supabase](https://supabase.com)
(Postgres + Auth + Storage), Tailwind CSS. Il deploy gira su Vercel via
GitHub Actions.

> **Nota per chi sviluppa con AI**: questa versione di Next.js ha
> convenzioni diverse da quelle "storiche" (es. il middleware si chiama
> `proxy.ts`, non `middleware.ts`). Leggere `AGENTS.md` prima di modificare
> routing/auth.

## Setup locale

### 1. Requisiti

- Node.js 20+
- [Supabase CLI](https://supabase.com/docs/guides/cli) (`npx supabase --version`)
- Docker, per lo stack Supabase locale (`supabase start`)

### 2. Variabili d'ambiente

Creare `.env.local` nella root con:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Per lo sviluppo locale, `supabase start` stampa questi valori (chiave
`anon`, mai la `service_role`: quella non deve mai comparire in codice o
env lato client). Per un progetto Supabase remoto, si trovano in
*Project Settings → API*.

### 3. Database

```bash
supabase start        # avvia Postgres/Auth/Storage locali via Docker
supabase db reset      # applica tutte le migration in supabase/migrations
```

Le migration sono l'unica fonte di verità dello schema: non modificare
tabelle/policy/funzioni dalla dashboard di un progetto condiviso senza poi
riportare la modifica in una nuova migration versionata qui nel repo (vedi
`supabase/migrations/`, in particolare `20260621221200_baseline_schema.sql`
per lo schema completo).

### 4. App

```bash
npm install
npm run dev
```

## Schema e ruoli

Quattro tabelle in `public`, tutte con Row Level Security abilitata:

| Tabella     | Contenuto                                             |
|-------------|--------------------------------------------------------|
| `profiles`  | Anagrafica utente (nome, email, telefono, interno, ruolo) — 1:1 con `auth.users` |
| `documents` | Documenti condivisi (verbali, rendiconti, contratti…), file in Storage bucket `documenti` |
| `payments`  | Quote/pagamenti per residente, ricevuta in Storage bucket `ricevute` |
| `requests`  | Richieste di manutenzione/segnalazioni dei residenti |

Ruoli (`profiles.role`): `resident` (default alla registrazione) e
`admin`. Un residente vede solo i propri dati; un admin vede tutto. Le
regole di autorizzazione sono applicate a livello di RLS (non solo lato
UI): vedi le policy in `supabase/migrations/20260621221200_baseline_schema.sql`
e i relativi fix in `20260715120000_security_and_data_fixes.sql`.

### Promuovere il primo amministratore

Non esiste un flusso self-service per diventare admin (per design: sarebbe
un rischio di sicurezza). Un trigger (`trg_enforce_profile_update`) impedisce
qualunque cambio di `role` che non arrivi già da un admin — **questo vale
anche per una `UPDATE` lanciata a mano dalla dashboard/SQL editor**, quindi
per il primissimo admin va disabilitato temporaneamente:

```sql
alter table public.profiles disable trigger trg_enforce_profile_update;
update public.profiles set role = 'admin' where id = '<uuid dell''utente>';
alter table public.profiles enable trigger trg_enforce_profile_update;
```

Gli admin successivi possono essere promossi da un admin già esistente
tramite l'applicazione stessa (RLS + trigger lo consentono senza bisogno di
disabilitare nulla).

## CI/CD

`.github/workflows/deploy.yml` (workflow **CI**):

1. **quality** — lint, typecheck, test unitari.
2. **db-tests** — avvia uno stack Supabase locale via Docker ed esegue i
   test pgTAP in `supabase/tests/database/` (isolamento RLS tra residenti,
   escalation di ruolo, visibilità admin).
3. **migrate** (solo su push a `main`) — applica le migration al progetto
   Supabase collegato con `supabase db push`. Richiede il secret repo
   **`SUPABASE_DB_URL`** (connection string Postgres del progetto, da
   *Project Settings → Database*).

Il deploy dell'app su Vercel è gestito dall'integrazione nativa
Vercel↔GitHub (non da questo workflow): ogni push crea/aggiorna un
deployment automaticamente. Questo workflow serve solo da gate di
qualità/schema, indipendente dal deploy.

## Limiti noti

- Attivare manualmente in dashboard *Auth → Policies → Password* la
  protezione "leaked password" (HaveIBeenPwned): non è configurabile via
  migration SQL.
- Lo schema attuale modella un solo condominio (nessun `condominio_id`);
  estendere a più edifici richiede rivedere tutte le policy RLS.
