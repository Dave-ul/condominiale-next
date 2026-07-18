import { z } from 'zod'

export const REQUEST_CATEGORIES = [
  'guasto',
  'manutenzione',
  'documento',
  'informazione',
  'altro',
] as const

export const RequestCreateClientSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Oggetto richiesto')
    .max(120, 'Oggetto troppo lungo (max 120 caratteri)'),
  description: z
    .string()
    .trim()
    .max(2000, 'Descrizione troppo lunga (max 2000 caratteri)')
    .default(''),
  category: z.enum(REQUEST_CATEGORIES),
})

export type RequestCreateClient = z.infer<typeof RequestCreateClientSchema>
