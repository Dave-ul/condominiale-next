import { describe, expect, it } from 'vitest'
import { DocumentMetadataSchema, validateDocumentFile } from './documents'

describe('DocumentMetadataSchema', () => {
  it('accepts a valid input', () => {
    const r = DocumentMetadataSchema.safeParse({ name: 'Verbale 1', category: 'verbale' })
    expect(r.success).toBe(true)
  })

  it('rejects empty name', () => {
    const r = DocumentMetadataSchema.safeParse({ name: '   ', category: 'verbale' })
    expect(r.success).toBe(false)
  })

  it('rejects unknown category', () => {
    const r = DocumentMetadataSchema.safeParse({ name: 'X', category: 'sconosciuto' })
    expect(r.success).toBe(false)
  })
})

describe('validateDocumentFile', () => {
  it('rejects an empty file', () => {
    const r = validateDocumentFile({ size: 0, type: 'application/pdf', name: 'x.pdf' })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.message).toMatch(/vuoto/i)
  })

  it('rejects a too-large file', () => {
    const r = validateDocumentFile({
      size: 11 * 1024 * 1024,
      type: 'application/pdf',
      name: 'x.pdf',
    })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.message).toMatch(/grande/i)
  })

  it('accepts a valid PDF (mime match)', () => {
    const r = validateDocumentFile({
      size: 1024,
      type: 'application/pdf',
      name: 'verbale.pdf',
    })
    expect(r.ok).toBe(true)
  })

  it('accepts a valid DOCX (mime match)', () => {
    const r = validateDocumentFile({
      size: 4096,
      type:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      name: 'contratto.docx',
    })
    expect(r.ok).toBe(true)
  })

  it('falls back to extension when mime is empty', () => {
    const r = validateDocumentFile({ size: 1024, type: '', name: 'foto.JPG' })
    expect(r.ok).toBe(true)
  })

  it('rejects unsupported type and extension', () => {
    const r = validateDocumentFile({ size: 1024, type: 'application/zip', name: 'archive.zip' })
    expect(r.ok).toBe(false)
  })
})
