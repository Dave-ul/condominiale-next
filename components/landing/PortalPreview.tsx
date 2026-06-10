import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileText, CreditCard, MessageSquare, Users, ArrowRight } from 'lucide-react'

const features = [
  { Icon: FileText,      label: 'Documenti',  desc: 'Verbali, rendiconti, circolari' },
  { Icon: CreditCard,    label: 'Pagamenti',  desc: 'Bollette, ricevute, storico' },
  { Icon: MessageSquare, label: 'Richieste',  desc: 'Segnalazioni e assistenza' },
  { Icon: Users,         label: 'Assemblee',  desc: 'Convocazioni e verbali' },
]

export function PortalPreview() {
  return (
    <section id="portale" className="py-24" style={{ backgroundColor: 'var(--cream-mid)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: text */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span style={{ width: 3, height: 22, backgroundColor: 'var(--gold)', display: 'block', flexShrink: 0 }} />
              <p
                className="text-xs font-medium uppercase"
                style={{ color: 'var(--gold)', letterSpacing: '0.25em' }}
              >
                Portale Condominiale
              </p>
            </div>
            <h2
              className="text-4xl font-bold mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-playfair)', color: 'var(--navy)' }}
            >
              Tutto il tuo condominio<br />a portata di click
            </h2>
            <p className="mb-8 leading-relaxed" style={{ color: 'var(--stone)' }}>
              Il portale condominiale dedicato permette ai residenti di accedere a documenti,
              pagamenti e richieste direttamente dal browser, in qualsiasi momento.
            </p>
            <Link href="/portale">
              <Button size="lg">
                Accedi al portale
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>

          {/* Right: portal mockup — square card grid */}
          <div
            style={{
              border: '2px solid var(--navy)',
              backgroundColor: 'var(--cream)',
            }}
          >
            {/* Mockup header bar */}
            <div
              className="px-5 py-3 flex items-center justify-between border-b"
              style={{ backgroundColor: 'var(--navy)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="flex items-center justify-center text-xs font-bold"
                  style={{ width: 20, height: 20, backgroundColor: 'var(--gold)', color: 'var(--navy)', fontFamily: 'var(--font-playfair)', fontSize: 11 }}
                >
                  R
                </span>
                <span
                  className="text-xs font-medium"
                  style={{ color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em' }}
                >
                  PORTALE CONDOMINIALE
                </span>
              </div>
              <div className="flex gap-px">
                {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
                  <span key={c} className="w-3 h-3" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>

            {/* 2×2 feature grid */}
            <div
              className="grid grid-cols-2 gap-px p-px"
              style={{ backgroundColor: 'var(--cream-dark)' }}
            >
              {features.map(({ Icon, label, desc }) => (
                <div
                  key={label}
                  className="p-5"
                  style={{ backgroundColor: 'var(--cream)' }}
                >
                  <div
                    className="w-8 h-8 flex items-center justify-center mb-3"
                    style={{ backgroundColor: 'var(--navy)' }}
                  >
                    <Icon size={15} style={{ color: 'var(--gold)' }} />
                  </div>
                  <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--navy)' }}>
                    {label}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--stone)' }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
