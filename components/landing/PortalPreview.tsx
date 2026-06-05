import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileText, CreditCard, MessageSquare, Users, ArrowRight } from 'lucide-react'

const features = [
  { Icon: FileText, label: 'Documenti', desc: 'Verbali, rendiconti, circolari' },
  { Icon: CreditCard, label: 'Pagamenti', desc: 'Bollette, ricevute, storico' },
  { Icon: MessageSquare, label: 'Richieste', desc: 'Segnalazioni e assistenza' },
  { Icon: Users, label: 'Assemblee', desc: 'Convocazioni e verbali' },
]

export function PortalPreview() {
  return (
    <section
      id="portale"
      className="py-24"
      style={{ backgroundColor: 'var(--cream-dark)' }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p
              className="text-sm font-medium tracking-widest uppercase mb-4"
              style={{ color: 'var(--gold)', letterSpacing: '0.2em' }}
            >
              Portale Condominiale
            </p>
            <h2
              className="text-4xl font-bold mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-playfair)', color: 'var(--navy)' }}
            >
              Tutto il tuo condominio a portata di click
            </h2>
            <p className="text-[var(--ink)]/60 mb-8 leading-relaxed">
              Il portale condominiale dedicato permette ai residenti di accedere a documenti,
              pagamenti e richieste direttamente dal browser, in qualsiasi momento.
            </p>
            <Link href="/portale">
              <Button size="lg">
                Accedi al portale
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>

          <div
            className="rounded-2xl overflow-hidden shadow-2xl border"
            style={{ borderColor: 'var(--gold)', borderWidth: '1px' }}
          >
            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{ backgroundColor: 'var(--navy)' }}
            >
              <span
                className="text-sm font-medium"
                style={{ fontFamily: 'var(--font-playfair)', color: 'var(--gold)' }}
              >
                Portale Condominiale
              </span>
              <div className="flex gap-1.5">
                {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
                  <span key={c} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            <div className="p-6" style={{ backgroundColor: 'var(--cream)' }}>
              <p className="text-xs text-[var(--ink)]/50 mb-4 font-medium uppercase tracking-wider">
                Sezioni disponibili
              </p>
              <div className="grid grid-cols-2 gap-3">
                {features.map(({ Icon, label, desc }) => (
                  <div
                    key={label}
                    className="p-4 rounded-xl border border-[var(--cream-dark)] bg-white/60"
                  >
                    <Icon size={20} className="mb-2" style={{ color: 'var(--gold)' }} />
                    <p className="font-semibold text-sm" style={{ color: 'var(--navy)' }}>
                      {label}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--ink)', opacity: 0.55 }}>
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
