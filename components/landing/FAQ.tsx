'use client'
import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    q: 'Quanto costa il servizio di amministrazione?',
    a: 'Il costo dipende dalla dimensione del condominio e dai servizi richiesti. Contattaci per un preventivo personalizzato e senza impegno.',
  },
  {
    q: 'Come posso accedere al portale condominiale?',
    a: "Riceverai un'email di invito con le credenziali di accesso. Potrai entrare dal menu in alto o direttamente su questo sito.",
  },
  {
    q: 'Come vengono gestite le emergenze notturne?',
    a: "Garantiamo reperibilità 24 ore su 24 per emergenze condominiali. Puoi contattarci al numero dedicato o inviare una richiesta urgente dal portale.",
  },
  {
    q: "Come avviene la transizione da un'altra amministrazione?",
    a: 'Ci occupiamo di tutta la transizione, richiedendo documentazione al precedente amministratore e garantendo continuità nella gestione.',
  },
  {
    q: 'I documenti condominiali sono accessibili online?',
    a: 'Sì, tramite il portale digitale tutti i condomini possono accedere a verbali, rendiconti, circolari e ogni altro documento in qualsiasi momento.',
  },
  {
    q: 'Come vengono gestiti i pagamenti delle quote condominiali?',
    a: 'Predisponiamo i MAV e gestiamo la contabilità. I condomini morosi vengono gestiti con procedure di recupero crediti nel rispetto della normativa.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24" style={{ backgroundColor: 'var(--cream)' }}>
      <div className="max-w-3xl mx-auto px-6">

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span style={{ width: 3, height: 22, backgroundColor: 'var(--gold)', display: 'block', flexShrink: 0 }} />
            <p
              className="text-xs font-medium uppercase"
              style={{ color: 'var(--gold)', letterSpacing: '0.25em' }}
            >
              Domande frequenti
            </p>
          </div>
          <h2
            className="text-4xl font-bold"
            style={{ fontFamily: 'var(--font-playfair)', color: 'var(--navy)' }}
          >
            FAQ
          </h2>
        </div>

        {/* Accordion — gap-px style */}
        <div className="flex flex-col gap-px" style={{ backgroundColor: 'var(--cream-dark)' }}>
          {faqs.map((item, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--cream)',
                borderLeft: open === i ? '3px solid var(--gold)' : '3px solid transparent',
                transition: 'border-color 0.15s',
              }}
            >
              <button
                className="w-full flex items-start justify-between px-6 py-4 text-left gap-4"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <div className="flex items-start gap-4">
                  <span
                    className="text-xs font-mono mt-0.5 shrink-0"
                    style={{ color: 'var(--gold)', opacity: 0.7 }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-medium text-sm" style={{ color: 'var(--navy)' }}>
                    {item.q}
                  </span>
                </div>
                <span className="shrink-0 mt-0.5" style={{ color: 'var(--gold)' }}>
                  {open === i ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-4 pl-14">
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--stone)' }}>
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
