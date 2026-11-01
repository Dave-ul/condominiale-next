<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Regole permanenti del progetto

- **Solo vetrina.** Il sito non ha aree riservate, account né database: il portale condominiale è stato dismesso il 1/11/2026. Non reintrodurre login o raccolta di dati oltre al modulo di contatto senza una decisione esplicita del proprietario.
- **Repository pubblico.** Mai committare segreti (token, credenziali) né dati personali reali, nemmeno in fixture, mockup o screenshot: solo dati palesemente inventati.
- **Nuovi servizi esterni.** Nessun servizio terzo (SDK, CDN, analytics, API, embed) senza aggiornare l'informativa (`app/privacy/page.tsx`), la cookie policy se imposta cookie, e la CSP in `proxy.ts`.
