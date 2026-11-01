import { describe, expect, it } from 'vitest'
import { buildAppCSP, buildLandingCSP } from '@/proxy'

describe('CSP delle pagine Next', () => {
  const csp = buildAppCSP('bm9uY2U=')

  it('usa il nonce della richiesta', () => {
    expect(csp).toContain(`'nonce-bm9uY2U='`)
    expect(csp).toContain(`'strict-dynamic'`)
  })

  it('non permette più connessioni a Supabase', () => {
    expect(csp).not.toContain('supabase.co')
    expect(csp).toContain(`connect-src 'self'`)
  })
})

describe('CSP della landing', () => {
  const csp = buildLandingCSP()

  it('permette solo il modulo Formspree e la mappa Google', () => {
    expect(csp).toContain(`connect-src 'self' https://formspree.io`)
    expect(csp).toContain('frame-src https://maps.google.com https://www.google.com')
    expect(csp).toContain(`script-src 'self'`)
  })
})
