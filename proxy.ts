import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// ---------------------------------------------------------------------------
// CSP nonce helpers
//
// 'unsafe-inline' was previously allowed for both script-src and style-src in
// next.config.ts. We now mint a per-request nonce in this proxy and replace
// the static CSP with a strict one. Next.js auto-injects the nonce on
// inline <script>/<style> tags emitted by the App Router (incl. Tailwind v4)
// when it finds the matching CSP header on the incoming request.
// ---------------------------------------------------------------------------

function generateNonce(): string {
  // 16 bytes -> 22 chars of base64 (~128 bits of entropy).
  return Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('base64')
}

function buildCSP(nonce: string): string {
  return [
    `default-src 'self'`,
    // 'strict-dynamic' trusts any script loaded by a nonced bootstrap script
    // (so Next.js bundles/Supabase still work without an explicit allow-list).
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'nonce-${nonce}'`,
    // Inline style="..." attributes are used heavily by React; relaxing them
    // here cannot execute scripts and is the standard mitigation for this
    // pattern (Tailwind-class generation does not need style-src 'unsafe-inline').
    `style-src-attr 'unsafe-inline'`,
    `img-src 'self' data: https://images.unsplash.com https://*.supabase.co`,
    `font-src 'self'`,
    `connect-src 'self' https://*.supabase.co wss://*.supabase.co`,
    // Maps iframe on the public landing.
    `frame-src 'self' https://maps.google.com https://www.google.com`,
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
  const nonce = generateNonce()
  const csp = buildCSP(nonce)

  // Forward the nonce to RSCs via a request header so Next.js can apply it
  // to its emitted inline scripts/styles.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

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
          // Re-create with the modified request (carries the nonce) so the
          // refreshed auth cookie response also carries our CSP header.
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
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
