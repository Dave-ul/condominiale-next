import { z } from 'zod'

// Accepted Stripe payment-link hosts. Anything else is rejected to prevent
// a (compromised) admin from directing residents to a phishing page.
const STRIPE_LINK_REGEX = /^https:\/\/(checkout\.stripe\.com|buy\.stripe\.com)\//i

const optionalStripeLink = z
  .string()
  .trim()
  .refine(
    (v) => v === '' || (URL.canParse(v) && STRIPE_LINK_REGEX.test(v)),
    'Deve essere un link Stripe (checkout.stripe.com o buy.stripe.com)',
  )
  .transform((v) => (v === '' ? null : v))
  .nullable()
  .optional()

export const PaymentCreateClientSchema = z.object({
  resident_id: z.string().uuid('Seleziona un residente valido'),
  description: z
    .string()
    .trim()
    .min(1, 'Descrizione richiesta')
    .max(200, 'Descrizione troppo lunga (max 200 caratteri)'),
  amount: z.coerce
    .number({ invalid_type_error: 'Importo non valido' })
    .finite('Importo non valido')
    .positive("L'importo deve essere maggiore di zero")
    .max(1_000_000, 'Importo troppo alto'),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/u, 'Data non valida (formato YYYY-MM-DD)'),
  stripe_payment_link: optionalStripeLink,
})

export type PaymentCreateClient = z.infer<typeof PaymentCreateClientSchema>
