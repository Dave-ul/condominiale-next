import { describe, it, expect } from 'vitest'
import { safeRelativePath } from './safe-redirect'

describe('safeRelativePath', () => {
  it('keeps a normal relative path', () => {
    expect(safeRelativePath('/portale/pagamenti')).toBe('/portale/pagamenti')
  })

  it('falls back when missing', () => {
    expect(safeRelativePath(null)).toBe('/portale')
    expect(safeRelativePath(undefined)).toBe('/portale')
    expect(safeRelativePath('')).toBe('/portale')
  })

  it('rejects protocol-relative URLs (open redirect)', () => {
    expect(safeRelativePath('//evil.com')).toBe('/portale')
  })

  it('rejects backslash and whitespace variants browsers read as //', () => {
    expect(safeRelativePath('/\\evil.com')).toBe('/portale')
    expect(safeRelativePath('/\t/evil.com')).toBe('/portale')
  })

  it('keeps query string and hash', () => {
    expect(safeRelativePath('/portale/account?x=1#top')).toBe('/portale/account?x=1#top')
  })

  it('rejects absolute URLs', () => {
    expect(safeRelativePath('https://evil.com')).toBe('/portale')
    expect(safeRelativePath('http://evil.com')).toBe('/portale')
  })

  it('rejects paths that do not start with a single slash', () => {
    expect(safeRelativePath('portale')).toBe('/portale')
    expect(safeRelativePath('javascript:alert(1)')).toBe('/portale')
  })

  it('honours a custom fallback', () => {
    expect(safeRelativePath('//evil.com', '/')).toBe('/')
  })
})
