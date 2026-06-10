'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const contactInfo = [
  { Icon: MapPin, text: 'Via Don Giovanni Minzoni 1, 40067 Rastignano (BO)' },
  { Icon: Phone,  text: '+39 338 374 2204', href: 'tel:+393383742204' },
  { Icon: Mail,   text: 'pluigi.rocca@yahoo.com', href: 'mailto:pluigi.rocca@yahoo.com' },
  { Icon: Clock,  text: 'Lun-Ven 9:00-13:00, 15:00-18:30' },
]

export function Contact() {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [form, setForm] = useState({
    nome: '', cognome: '', email: '', telefono: '', oggetto: 'nuovo_incarico', messaggio: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('loading')
    try {
      const res = await fetch('https://formspree.io/f/xjkwqgpq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${form.nome} ${form.cognome}`,
          email: form.email,
          phone: form.telefono,
          subject: form.oggetto,
          message: form.messaggio,
        }),
      })
      setState(res.ok ? 'success' : 'error')
    } catch {
      setState('error')
    }
    setTimeout(() => setState('idle'), 5000)
  }

  const inputClass =
    'w-full px-4 py-2.5 border border-[var(--cream-dark)] bg-white text-sm focus:outline-none focus:border-[var(--navy)] transition-colors'

  return (
    <section id="contatti" className="py-24 sq-grid-dark" style={{ backgroundColor: 'var(--navy)' }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span style={{ width: 3, height: 22, backgroundColor: 'var(--gold)', display: 'block', flexShrink: 0 }} />
            <p className="text-xs font-medium uppercase" style={{ color: 'var(--gold)', letterSpacing: '0.25em' }}>
              Contattaci
            </p>
          </div>
          <h2
            className="text-4xl font-bold text-white"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Parliamo del tuo condominio
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left: contact info + map */}
          <div>
            <ul className="space-y-0 mb-8 border border-white/10 divide-y divide-white/10">
              {contactInfo.map(({ Icon, text, href }) => (
                <li key={text} className="flex items-center gap-4 px-5 py-4">
                  <div
                    className="w-9 h-9 flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'rgba(184,149,58,0.15)' }}
                  >
                    <Icon size={16} style={{ color: 'var(--gold)' }} />
                  </div>
                  {href ? (
                    <a href={href} className="text-white/65 hover:text-white transition-colors text-sm">
                      {text}
                    </a>
                  ) : (
                    <span className="text-white/65 text-sm">{text}</span>
                  )}
                </li>
              ))}
            </ul>

            <div
              className="overflow-hidden border border-white/10"
              style={{ height: 240 }}
            >
              <iframe
                title="Mappa studio"
                src="https://maps.google.com/maps?q=Via+Don+Giovanni+Minzoni+1+Rastignano+Bologna&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="240"
                style={{ border: 0, filter: 'grayscale(70%) invert(10%)' }}
                loading="lazy"
              />
            </div>
          </div>

          {/* Right: contact form */}
          <form
            onSubmit={handleSubmit}
            className="p-8 border border-white/10"
            style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
          >
            {state === 'success' && (
              <Alert type="success" message="Messaggio inviato! Ti risponderemo entro 24 ore." className="mb-5" />
            )}
            {state === 'error' && (
              <Alert type="error" message="Errore nell'invio. Riprova o chiamaci direttamente." className="mb-5" />
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-white/50 mb-1.5 block" style={{ letterSpacing: '0.12em' }}>
                  Nome *
                </label>
                <input
                  className={inputClass}
                  required
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-white/50 mb-1.5 block" style={{ letterSpacing: '0.12em' }}>
                  Cognome *
                </label>
                <input
                  className={inputClass}
                  required
                  value={form.cognome}
                  onChange={(e) => setForm({ ...form, cognome: e.target.value })}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-medium uppercase tracking-wider text-white/50 mb-1.5 block" style={{ letterSpacing: '0.12em' }}>
                Email *
              </label>
              <input
                type="email"
                className={inputClass}
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label className="text-xs font-medium uppercase tracking-wider text-white/50 mb-1.5 block" style={{ letterSpacing: '0.12em' }}>
                Telefono
              </label>
              <input
                type="tel"
                className={inputClass}
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label className="text-xs font-medium uppercase tracking-wider text-white/50 mb-1.5 block" style={{ letterSpacing: '0.12em' }}>
                Oggetto
              </label>
              <select
                className={inputClass}
                value={form.oggetto}
                onChange={(e) => setForm({ ...form, oggetto: e.target.value })}
              >
                <option value="nuovo_incarico">Nuovo incarico</option>
                <option value="cambio_amministratore">Cambio amministratore</option>
                <option value="consulenza">Consulenza</option>
                <option value="preventivo">Preventivo</option>
                <option value="altro">Altro</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="text-xs font-medium uppercase tracking-wider text-white/50 mb-1.5 block" style={{ letterSpacing: '0.12em' }}>
                Messaggio *
              </label>
              <textarea
                className={inputClass}
                rows={4}
                required
                value={form.messaggio}
                onChange={(e) => setForm({ ...form, messaggio: e.target.value })}
              />
            </div>

            <Button type="submit" loading={state === 'loading'} className="w-full">
              Invia messaggio
            </Button>
          </form>

        </div>
      </div>
    </section>
  )
}
