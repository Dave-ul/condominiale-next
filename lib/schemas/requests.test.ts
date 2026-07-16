import { describe, expect, it } from 'vitest'
import { RequestCreateClientSchema } from './requests'

describe('RequestCreateClientSchema', () => {
  it('accepts a valid input', () => {
    const r = RequestCreateClientSchema.safeParse({
      title: 'Allagamento cantina',
      description: '',
      category: 'guasto',
    })
    expect(r.success).toBe(true)
  })

  it('rejects empty title', () => {
    const r = RequestCreateClientSchema.safeParse({ title: '   ', category: 'guasto' })
    expect(r.success).toBe(false)
  })

  it('rejects too-long title', () => {
    const r = RequestCreateClientSchema.safeParse({
      title: 'x'.repeat(200),
      category: 'guasto',
    })
    expect(r.success).toBe(false)
  })

  it('rejects unknown category', () => {
    const r = RequestCreateClientSchema.safeParse({ title: 'x', category: 'spam' })
    expect(r.success).toBe(false)
  })

  it('trims the title', () => {
    const r = RequestCreateClientSchema.parse({
      title: '  Perdita acqua  ',
      description: '',
      category: 'guasto',
    })
    expect(r.title).toBe('Perdita acqua')
  })

  it('defaults description to empty string', () => {
    const r = RequestCreateClientSchema.parse({
      title: 'x',
      category: 'guasto',
    })
    expect(r.description).toBe('')
  })
})
