import { z } from 'zod'

// Mime types accepted by the storage bucket (see migration
// 20260715120000_security_and_data_fixes.sql).
export const ACCEPTED_DOC_MIMES = new Set<string>([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
])

// Fallback when the browser reports an empty mime type (common for some OS
// drag&drop flows): validate by extension instead.
export const ACCEPTED_DOC_EXT = /\.(pdf|docx?|xlsx?|jpe?g|png)$/i
export const MAX_FILE_BYTES = 10 * 1024 * 1024

export const DocumentMetadataSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nome documento richiesto')
    .max(200, 'Nome troppo lungo (max 200 caratteri)'),
  category: z.enum(['verbale', 'rendiconto', 'contratto', 'circolare', 'altro']),
})

interface FileLike {
  size: number
  type: string
  name?: string
}

/**
 * Validate a file before upload. Mirrors the bucket's MIME/size limits
 * declared at the DB level so the user gets a friendly error before the
 * upload round-trip.
 */
export function validateDocumentFile(
  file: FileLike,
): { ok: true } | { ok: false; message: string } {
  if (file.size <= 0) return { ok: false, message: 'File vuoto' }
  if (file.size > MAX_FILE_BYTES) {
    return { ok: false, message: `File troppo grande (max ${MAX_FILE_BYTES / 1024 / 1024} MB)` }
  }
  const mimeOk = ACCEPTED_DOC_MIMES.has(file.type)
  const extOk = file.name !== undefined && ACCEPTED_DOC_EXT.test(file.name)
  if (!mimeOk && !extOk) {
    return { ok: false, message: 'Tipo non supportato (PDF, DOC, XLS, JPG, PNG)' }
  }
  return { ok: true }
}
