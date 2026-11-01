// Validazione e composizione della richiesta di contatto del sito.
// Funzioni pure: la route /api/contatto le usa e i test le esercitano
// senza rete né SMTP.

export const OGGETTI = {
  nuovo_incarico: 'Nuovo incarico',
  cambio_amministratore: 'Cambio amministratore',
  consulenza: 'Consulenza',
  preventivo: 'Preventivo',
  altro: 'Altro',
} as const

export type Oggetto = keyof typeof OGGETTI

export interface Contatto {
  nome: string
  cognome: string
  email: string
  telefono: string
  oggetto: Oggetto
  messaggio: string
}

export type ParseResult =
  | { ok: true; data: Contatto }
  | { ok: false; spam: true }
  | { ok: false; error: string }

const MAX_NOME = 100
const MAX_EMAIL = 254
const MAX_TELEFONO = 30
const MAX_MESSAGGIO = 5000

// Volutamente semplice: niente spazi né a capo (che aprirebbero la strada a
// header injection nel Reply-To), una @ e un punto nel dominio.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TELEFONO_RE = /^[0-9+()./\s-]*$/

function testo(value: unknown): string | null {
  return typeof value === 'string' ? value.trim() : null
}

function errore(error: string): ParseResult {
  return { ok: false, error }
}

export function parseContatto(input: unknown): ParseResult {
  if (typeof input !== 'object' || input === null) return errore('Richiesta non valida.')
  const raw = input as Record<string, unknown>

  // Campo trappola nascosto: un visitatore reale non lo vede e non lo compila.
  const trappola = raw.sito_web
  if (typeof trappola === 'string' && trappola.trim() !== '') return { ok: false, spam: true }

  const nome = testo(raw.nome)
  const cognome = testo(raw.cognome)
  const email = testo(raw.email)
  const telefono = testo(raw.telefono ?? '')
  const oggetto = testo(raw.oggetto ?? 'altro')
  const messaggio = testo(raw.messaggio)

  if (!nome || nome.length > MAX_NOME) return errore('Nome mancante o troppo lungo.')
  if (!cognome || cognome.length > MAX_NOME) return errore('Cognome mancante o troppo lungo.')
  if (!email || email.length > MAX_EMAIL || !EMAIL_RE.test(email)) return errore('Email non valida.')
  if (telefono === null || telefono.length > MAX_TELEFONO || !TELEFONO_RE.test(telefono)) {
    return errore('Telefono non valido.')
  }
  if (!oggetto || !Object.hasOwn(OGGETTI, oggetto)) return errore('Oggetto non valido.')
  if (!messaggio || messaggio.length > MAX_MESSAGGIO) return errore('Messaggio mancante o troppo lungo.')

  return {
    ok: true,
    data: { nome, cognome, email, telefono, oggetto: oggetto as Oggetto, messaggio },
  }
}

export interface ContattoEmail {
  subject: string
  replyTo: string
  text: string
}

function unaRiga(value: string): string {
  return value.replace(/[\r\n]+/g, ' ')
}

export function buildContattoEmail(c: Contatto): ContattoEmail {
  const chi = unaRiga(`${c.nome} ${c.cognome}`)
  return {
    subject: `[Sito] ${OGGETTI[c.oggetto]} - ${chi}`,
    replyTo: c.email,
    text: [
      'Nuova richiesta dal modulo di contatto del sito.',
      '',
      `Nome: ${chi}`,
      `Email: ${c.email}`,
      `Telefono: ${c.telefono || 'non indicato'}`,
      `Oggetto: ${OGGETTI[c.oggetto]}`,
      '',
      'Messaggio:',
      c.messaggio,
      '',
      'Per rispondere usa "Rispondi": la risposta va all\'indirizzo del mittente.',
    ].join('\n'),
  }
}

interface RateLimiterOptions {
  max: number
  windowMs: number
  now?: () => number
}

// Limite per IP in memoria. Su Vercel ogni istanza ha la sua memoria, quindi
// è un freno contro gli invii a raffica, non un limite garantito.
export function createRateLimiter({ max, windowMs, now = Date.now }: RateLimiterOptions) {
  const hits = new Map<string, number[]>()

  return function allow(key: string): boolean {
    const t = now()
    const recenti = (hits.get(key) ?? []).filter((h) => t - h < windowMs)
    if (recenti.length >= max) {
      hits.set(key, recenti)
      return false
    }
    hits.set(key, [...recenti, t])
    if (hits.size > 10_000) hits.clear()
    return true
  }
}
