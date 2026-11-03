import { beforeEach, describe, expect, it, vi } from 'vitest'

const send = vi.fn()
vi.mock('@/lib/mailer', () => ({ sendContattoEmail: (...args: unknown[]) => send(...args) }))

const { POST } = await import('@/app/api/contatto/route')

const valido = {
  nome: 'Mario',
  cognome: 'Rossi',
  email: 'mario.rossi@example.com',
  telefono: '',
  oggetto: 'preventivo',
  messaggio: 'Vorrei un preventivo.',
  sito_web: '',
}

let ip = 0
function richiesta(body: unknown, headers: Record<string, string> = {}): Request {
  ip += 1
  return new Request('https://www.roccaamministrazioni.it/api/contatto', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://www.roccaamministrazioni.it',
      host: 'www.roccaamministrazioni.it',
      'x-forwarded-for': `10.0.0.${ip}`,
      ...headers,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

describe('POST /api/contatto', () => {
  beforeEach(() => {
    send.mockReset()
    send.mockResolvedValue(undefined)
  })

  it('invia la mail per una richiesta valida', async () => {
    const res = await POST(richiesta(valido))

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    expect(send).toHaveBeenCalledOnce()
    expect(send.mock.calls[0][0].subject).toContain('Preventivo')
  })

  it('rifiuta dati non validi senza inviare', async () => {
    const res = await POST(richiesta({ ...valido, email: 'x' }))

    expect(res.status).toBe(400)
    expect(send).not.toHaveBeenCalled()
  })

  it('rifiuta JSON malformato', async () => {
    const res = await POST(richiesta('{non json'))
    expect(res.status).toBe(400)
  })

  it('rifiuta richieste da un altra origine', async () => {
    const res = await POST(richiesta(valido, { origin: 'https://evil.example' }))

    expect(res.status).toBe(403)
    expect(send).not.toHaveBeenCalled()
  })

  it('finge successo con il campo trappola compilato, senza inviare', async () => {
    const res = await POST(richiesta({ ...valido, sito_web: 'x' }))

    expect(res.status).toBe(200)
    expect(send).not.toHaveBeenCalled()
  })

  it('limita le richieste ripetute dallo stesso IP', async () => {
    const stessoIp = { 'x-forwarded-for': '192.0.2.1' }
    const stati: number[] = []
    for (let i = 0; i < 6; i++) stati.push((await POST(richiesta(valido, stessoIp))).status)

    expect(stati.slice(0, 5)).toEqual([200, 200, 200, 200, 200])
    expect(stati[5]).toBe(429)
  })

  it('risponde 502 se l invio SMTP fallisce', async () => {
    send.mockRejectedValueOnce(new Error('SMTP down'))
    const errore = vi.spyOn(console, 'error').mockImplementation(() => {})

    const res = await POST(richiesta(valido))

    expect(res.status).toBe(502)
    expect(errore).toHaveBeenCalled()
    expect(JSON.stringify(errore.mock.calls)).not.toContain('mario.rossi@example.com')
    errore.mockRestore()
  })
})
