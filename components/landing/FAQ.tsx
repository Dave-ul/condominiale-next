'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    a: "Garantiamo reperibilita 24 ore su 24 per emergenze condominiali. Puoi contattarci al numero dedicato o inviare una richiesta urgente dal portale.",
  },
  {
    q: "Come avviene la transizione da un'altra amministrazione?",
    a: 'Ci occupiamo di tutta la transizione, richiedendo documentazione al precedente amministratore e garantendo continuita nella gestione.',
  },
  {
    q: 'I documenti condominiali sono accessibili online?',
    a: 'Si, tramite il portale digitale tutti i condomini possono accedere a verbali, rendiconti, circolari e ogni altro documento in qualsiasi momento.',
  },
  {
    q: 'Come vengono gestiti i pagamenti delle quote condominiali?',
    a: 'Predisponiamo i MAV e gestiamo la contabilita. I condomini morosi vengono gestiti con procedure di recupero crediti nel rispetto della normativa.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24" style={{ backgroundColor: 'var(--cream)' }}>
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <p
            className="text-sm font-medium tracking-widest uppercase mb-3"
            style={{ color: 'var(--gold)', letterSpacing: '0.2em' }}
          >
            Domande frequenti
          </p>
          <h2
            className="text-4xl font-bold"
            style={{ fontFamily: 'var(--font-playfair)', color: 'var(--navy)' }}
          >
            FAQ
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((item, i) => (
            <div
              key={i}
              className="border rounded-xl overflow-hidden transition-all"
              style={{ borderColor: open === i ? 'var(--gold)' : 'var(--cream-dark)' }}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left gap-4"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="font-medium text-sm" style={{ color: 'var(--navy)' }}>
                  {item.q}
                </span>
                <ChevronDown
                  size={18}
                  className={cn(
                    'shrink-0 transition-transform duration-200',
                    open === i && 'rotate-180'
                  )}
                  style={{ color: 'var(--gold)' }}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-4">
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--ink)', opacity: 0.7 }}>
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
