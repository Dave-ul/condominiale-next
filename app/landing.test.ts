import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import nextConfig from '@/next.config'

const html = readFileSync(join(process.cwd(), 'public/index.html'), 'utf-8')

describe('landing statica (sito vetrina)', () => {
  it('non rimanda più al portale', () => {
    expect(html).not.toContain('/auth')
    expect(html).not.toContain('#portale')
    expect(html.toLowerCase()).not.toContain('portale')
  })

  it('non linka più i termini del portale', () => {
    expect(html).not.toContain('/termini')
  })

  it('linka informativa privacy e cookie policy', () => {
    expect(html).toContain('href="/privacy"')
    expect(html).toContain('href="/cookie-policy"')
  })
})

describe('redirect delle vecchie pagine del portale', () => {
  it('manda alla home in modo permanente', async () => {
    const redirects = await nextConfig.redirects?.()
    const sources = (redirects ?? []).map((r) => r.source).sort()

    expect(sources).toEqual(['/api/auth/:path*', '/auth', '/portale/:path*', '/termini'])
    for (const r of redirects ?? []) {
      expect(r.destination).toBe('/')
      expect(r.permanent).toBe(true)
    }
  })
})
