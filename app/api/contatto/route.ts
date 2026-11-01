import { buildContattoEmail, createRateLimiter, parseContatto } from '@/lib/contatto'
import { sendContattoEmail } from '@/lib/mailer'

// nodemailer apre una connessione TCP: serve il runtime Node, non Edge.
export const runtime = 'nodejs'

const MAX_BODY_BYTES = 16_000
const allow = createRateLimiter({ max: 5, windowMs: 10 * 60 * 1000 })

function json(body: Record<string, unknown>, status: number): Response {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
}

// Il modulo sta sulla home dello stesso dominio: una richiesta con un Origin
// diverso non viene dal sito.
function stessaOrigine(request: Request): boolean {
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')
  if (!origin || !host) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

function ipDi(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'sconosciuto'
}

export async function POST(request: Request): Promise<Response> {
  if (!stessaOrigine(request)) return json({ ok: false, error: 'Origine non ammessa.' }, 403)
  if (!allow(ipDi(request))) {
    return json({ ok: false, error: 'Troppe richieste. Riprova tra qualche minuto.' }, 429)
  }

  const raw = await request.text()
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: 'Richiesta troppo grande.' }, 413)

  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return json({ ok: false, error: 'Richiesta non valida.' }, 400)
  }

  const parsed = parseContatto(body)
  if (!parsed.ok) {
    // Allo spam rispondiamo come a un invio riuscito, per non insegnargli nulla.
    if ('spam' in parsed) return json({ ok: true }, 200)
    return json({ ok: false, error: parsed.error }, 400)
  }

  try {
    await sendContattoEmail(buildContattoEmail(parsed.data))
  } catch (err) {
    // Solo il messaggio d'errore: niente dati del visitatore nei log.
    console.error('[contatto] invio SMTP fallito:', err instanceof Error ? err.message : 'errore sconosciuto')
    return json({ ok: false, error: 'Invio non riuscito. Riprova o chiamaci.' }, 502)
  }

  return json({ ok: true }, 200)
}
