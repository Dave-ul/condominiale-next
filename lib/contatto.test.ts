import { describe, expect, it } from 'vitest'
import { buildContattoEmail, createRateLimiter, parseContatto } from '@/lib/contatto'

const valido = {
  nome: 'Mario',
  cognome: 'Rossi',
  email: 'mario.rossi@example.com',
  telefono: '+39 333 000 0000',
  oggetto: 'preventivo',
  messaggio: 'Vorrei un preventivo per un condominio di 12 unità.',
  sito_web: '',
}

describe('parseContatto', () => {
  it('accetta una richiesta valida e toglie gli spazi in eccesso', () => {
    const r = parseContatto({ ...valido, nome: '  Mario ' })
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.data.nome).toBe('Mario')
  })

  it('accetta il telefono vuoto', () => {
    expect(parseContatto({ ...valido, telefono: '' }).ok).toBe(true)
  })

  it.each([
    ['nome mancante', { nome: '' }],
    ['cognome mancante', { cognome: '   ' }],
    ['email non valida', { email: 'non-una-email' }],
    ['email con a capo (header injection)', { email: 'a@b.it\r\nBcc: x@y.it' }],
    ['oggetto fuori elenco', { oggetto: 'spam' }],
    ['messaggio mancante', { messaggio: '' }],
    ['messaggio troppo lungo', { messaggio: 'x'.repeat(5001) }],
    ['nome troppo lungo', { nome: 'x'.repeat(101) }],
    ['telefono con lettere', { telefono: 'chiamami' }],
    ['campo non stringa', { nome: 42 }],
  ])('rifiuta: %s', (_, override) => {
    expect(parseContatto({ ...valido, ...override }).ok).toBe(false)
  })

  it('rifiuta input che non è un oggetto', () => {
    expect(parseContatto(null).ok).toBe(false)
    expect(parseContatto('ciao').ok).toBe(false)
  })

  it('segnala come spam il campo trappola compilato', () => {
    const r = parseContatto({ ...valido, sito_web: 'http://spam.example' })
    expect(r).toEqual({ ok: false, spam: true })
  })
})

describe('buildContattoEmail', () => {
  it('compone oggetto e testo senza dati fuori dal modulo', () => {
    const r = parseContatto(valido)
    if (!r.ok) throw new Error('fixture non valida')
    const mail = buildContattoEmail(r.data)

    expect(mail.subject).toBe('[Sito] Preventivo - Mario Rossi')
    expect(mail.replyTo).toBe('mario.rossi@example.com')
    expect(mail.text).toContain('Telefono: +39 333 000 0000')
    expect(mail.text).toContain(valido.messaggio)
  })

  it('scrive "non indicato" se manca il telefono', () => {
    const r = parseContatto({ ...valido, telefono: '' })
    if (!r.ok) throw new Error('fixture non valida')
    expect(buildContattoEmail(r.data).text).toContain('Telefono: non indicato')
  })

  it('non porta a capo nell oggetto anche con nomi strani', () => {
    const r = parseContatto({ ...valido, nome: 'Ma\nrio' })
    if (!r.ok) throw new Error('fixture non valida')
    expect(buildContattoEmail(r.data).subject).not.toMatch(/[\r\n]/)
  })
})

describe('createRateLimiter', () => {
  it('blocca oltre il limite e riapre dopo la finestra', () => {
    let now = 0
    const allow = createRateLimiter({ max: 2, windowMs: 1000, now: () => now })

    expect(allow('1.2.3.4')).toBe(true)
    expect(allow('1.2.3.4')).toBe(true)
    expect(allow('1.2.3.4')).toBe(false)
    expect(allow('5.6.7.8')).toBe(true)

    now = 1001
    expect(allow('1.2.3.4')).toBe(true)
  })
})
