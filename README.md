# Rocca Amministrazioni — sito vetrina

Sito pubblico dello studio di amministrazione condominiale: presentazione,
servizi, FAQ e modulo di contatto, più le pagine Informativa Privacy e
Cookie Policy. Non ci sono aree riservate né accessi con credenziali: il
portale condominiale che c'era prima è stato dismesso il 1/11/2026 (vedi
`docs/audit-legale.md` § 7).

Stack: [Next.js](https://nextjs.org) (App Router) e Tailwind CSS per le
pagine legali; la home è un file HTML statico. Il deploy è su Vercel
tramite l'integrazione Vercel↔GitHub.

> **Nota per chi sviluppa con AI**: questa versione di Next.js ha
> convenzioni diverse da quelle "storiche" (es. il middleware si chiama
> `proxy.ts`, non `middleware.ts`). Leggere `AGENTS.md` prima di modificare
> il routing.

## Setup locale

Requisiti: Node.js 24 (la stessa versione della CI).

```bash
npm install
npm run dev
```

Non servono variabili d'ambiente.

## Struttura

| Percorso | Contenuto |
|---|---|
| `public/index.html` | La home: HTML statico con lo `<style>` inline. |
| `public/landing.js` | Tutto il JS della home (menu, FAQ, mappa su richiesta, modulo di contatto). |
| `app/route.ts` | Serve `public/index.html` su `/` con una `Cache-Control` di un'ora. |
| `app/privacy/`, `app/cookie-policy/` | Pagine legali in Next. |
| `proxy.ts` | Content-Security-Policy (vedi sotto). |
| `next.config.ts` | Header di sicurezza e redirect permanenti dei vecchi indirizzi del portale (`/auth`, `/portale/*`, `/api/auth/*`, `/termini`) verso `/`. |

## Content-Security-Policy

`proxy.ts` applica **due policy distinte**. Vale la pena leggere questa
sezione prima di aggiungere script, stili o domini esterni: una CSP
sbagliata non rompe la build né i test, si vede solo nel browser.

**Pagine Next (`/privacy`, `/cookie-policy`)**: CSP con nonce
per-richiesta. Next applica il nonce ai propri script leggendolo
dall'header di **richiesta** `Content-Security-Policy`, che va quindi
impostato sia sulla richiesta inoltrata alle RSC sia sulla risposta.

- `script-src` contiene `'strict-dynamic'`, che per specifica **annulla
  `'self'`**: senza nonce non esiste alcun fallback e la pagina resta senza
  JS;
- il nonce esiste solo durante il rendering per-richiesta, quindi
  `app/layout.tsx` dichiara `export const dynamic = 'force-dynamic'`;
- in sviluppo servono `'unsafe-eval'` e `style-src 'unsafe-inline'`
  (overlay di errore di React): sono concessi solo se
  `NODE_ENV === 'development'`.

**Home (`/`)**: CSP statica senza nonce. La pagina è servita verbatim con
una cache di un'ora, e una copia in cache conserverebbe un nonce scaduto.
Quindi:

- tutto il JS sta in `public/landing.js`, coperto da `script-src 'self'`.
  **Non reintrodurre `<script>` inline né attributi `onclick`/`onsubmit`**;
- il `<style>` inline è concesso da `style-src 'unsafe-inline'`, limitato
  a questa rotta;
- ogni dominio esterno va aggiunto esplicitamente: oggi Formspree in
  `connect-src` e Google Maps in `frame-src`.

I font (`public/fonts/*.woff2`) sono self-hosted e condivisi: la home li
dichiara via `@font-face`, le pagine Next li caricano con `next/font/local`.

## CI

`.github/workflows/deploy.yml` (workflow **CI**), su ogni PR e push a
`main`: lint, typecheck e test unitari (`vitest`). I test controllano che
la home non rimandi più al portale, i redirect dei vecchi indirizzi e le
due CSP.

## Aperti

Vedi `docs/audit-legale.md` § 7: P.IVA, REA e PEC nel footer, sostituzione
di Formspree, piano Vercel.
