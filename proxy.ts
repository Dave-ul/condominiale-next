import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// ---------------------------------------------------------------------------
// CSP
//
// Due policy distinte, perché le due metà del sito hanno esigenze diverse:
//
//  - l'app Next (/auth, /portale/*) usa una CSP con nonce per-richiesta. Next
//    applica il nonce ai propri script (runtime, bundle di pagina, inline
//    generati) leggendolo dall'header di RICHIESTA `Content-Security-Policy`:
//    va quindi impostato sia sulla richiesta inoltrata alle RSC sia sulla
//    risposta, altrimenti il nonce non raggiunge il markup e 'strict-dynamic'
//    (che per specifica annulla 'self') blocca l'intero front-end.
//
//  - la landing pubblica `/` è un documento HTML statico servito verbatim da
//    app/route.ts, con il proprio <style> inline: un nonce per-richiesta non
//    la aiuterebbe (gli attributi-evento inline non sono nonce-abili) e anzi
//    sarebbe incompatibile con il suo Cache-Control, perché una copia in cache
//    conserverebbe un nonce ormai scaduto. Ha quindi una CSP statica dedicata.
// ---------------------------------------------------------------------------

const isDev = process.env.NODE_ENV === 'development'

function generateNonce(): string {
  // 16 byte -> 24 caratteri base64 (~128 bit di entropia).
  return Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('base64')
}

function buildAppCSP(nonce: string): string {
  return [
    `default-src 'self'`,
    // 'strict-dynamic' si fida di qualsiasi script caricato da uno script
    // noncato (così i bundle Next e Supabase funzionano senza allow-list).
    // In sviluppo React usa eval() per ricostruire gli stack server nel
    // browser, e l'overlay di errore inietta stili inline non noncati.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}`,
    `style-src 'self' ${isDev ? `'unsafe-inline'` : `'nonce-${nonce}'`}`,
    // Gli attributi style="..." sono usati molto da React; concederli non
    // può eseguire script ed è la mitigazione standard per questo pattern.
    `style-src-attr 'unsafe-inline'`,
    `img-src 'self' data: https://images.unsplash.com https://*.supabase.co`,
    `font-src 'self'`,
    `connect-src 'self' https://*.supabase.co wss://*.supabase.co`,
    `frame-ancestors 'self'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
  ].join('; ')
}

function buildLandingCSP(): string {
  return [
    `default-src 'self'`,
    // Niente nonce e niente 'strict-dynamic': tutto il JS della landing vive
    // in /landing.js, quindi 'self' basta e resta una policy stretta.
    `script-src 'self'`,
    // Il <style> inline di public/index.html resta inline per non introdurre
    // un foglio render-blocking: su una pagina statica senza input utente
    // renderizzato, 'unsafe-inline' sugli stili non può eseguire script.
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: https://images.unsplash.com`,
    `font-src 'self'`,
    // Form contatti (Formspree).
    `connect-src 'self' https://formspree.io`,
    // Mappa Google incorporata nella sezione contatti.
    `frame-src https://maps.google.com https://www.google.com`,
    `frame-ancestors 'self'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
  ].join('; ')
}

function applyCSP(res: NextResponse, csp: string): NextResponse {
  res.headers.set('Content-Security-Policy', csp)
  return res
}

export async function proxy(request: NextRequest) {
  // La landing è pubblica: rispondiamo prima di costruire il client Supabase,
  // così non paga un round-trip di rete per `auth.getUser()` ad ogni visita.
  if (request.nextUrl.pathname === '/') {
    return applyCSP(NextResponse.next(), buildLandingCSP())
  }

  const nonce = generateNonce()
  const csp = buildAppCSP(nonce)

  // Il nonce arriva a Next tramite l'header di richiesta Content-Security-Policy,
  // che Next parsa cercando il pattern 'nonce-{value}'. `x-nonce` resta
  // disponibile per leggerlo da una Server Component via headers().
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', csp)

  const freshResponse = (): NextResponse =>
    applyCSP(
      NextResponse.next({ request: { headers: requestHeaders } }),
      csp,
    )

  let supabaseResponse = freshResponse()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          // Ricreata con la richiesta modificata (che porta il nonce) così
          // anche la risposta con il cookie aggiornato porta la nostra CSP.
          supabaseResponse = freshResponse()
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/portale')) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    return applyCSP(NextResponse.redirect(url), csp)
  }

  if (user && request.nextUrl.pathname === '/auth') {
    const url = request.nextUrl.clone()
    url.pathname = '/portale'
    return applyCSP(NextResponse.redirect(url), csp)
  }

  return supabaseResponse
}

export const config = {
  // Oltre agli asset gestiti da Next, sono esclusi i file statici serviti da
  // public/ (fra cui /landing.js e /fonts/*.woff2): non hanno bisogno né di
  // CSP né del controllo di sessione, e farli passare di qui aggiungerebbe un
  // round-trip Supabase per ogni asset.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|txt|xml)$).*)',
  ],
}
