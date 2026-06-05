import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileText, CreditCard, MessageSquare, Users, ArrowRight, Check } from 'lucide-react'

const features = [
  'Accesso 24/7 ai documenti condominiali',
  'Pagamento quote e caricamento ricevute',
  'Invio segnalazioni e richieste',
  'Ricezione comunicazioni e circolari',
  'Storico assemblee e verbali',
  'Trasparenza totale sulla contabilita',
]

const portalSections = [
  { Icon: FileText, label: 'Documenti', count: '12 file', color: '#1d4ed8' },
  { Icon: MessageSquare, label: 'Messaggi', count: '3 nuovi', color: '#059669' },
  { Icon: CreditCard, label: 'Pagamenti', count: '€ 180,00', color: '#b45309' },
  { Icon: Users, label: 'Assemblee', count: 'Prossima: lug', color: '#7c3aed' },
]

export function PortalPreview() {
  return (
    <section id="portale" className="py-24" style={{ backgroundColor: 'var(--cream-dark)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: text */}
          <div>
            <p
              className="text-sm font-medium uppercase mb-4"
              style={{ color: 'var(--gold)', letterSpacing: '0.2em' }}
            >
              Portale Condominiale
            </p>
            <h2
              className="text-4xl font-bold mb-6 leading-snug"
              style={{ fontFamily: 'var(--font-playfair)', color: 'var(--navy)' }}
            >
              Tutto il tuo condominio a portata di click
            </h2>
            <p className="mb-8 leading-relaxed text-sm" style={{ color: 'rgba(26,20,16,0.6)' }}>
              Il portale dedicato permette a ogni condomino di gestire in autonomia documenti,
              pagamenti e richieste direttamente dal proprio dispositivo, in qualsiasi momento.
            </p>

            <ul className="space-y-2.5 mb-8">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'rgba(201,169,110,0.2)' }}
                  >
                    <Check size={11} style={{ color: 'var(--gold)' }} strokeWidth={3} />
                  </span>
                  <span className="text-sm" style={{ color: 'rgba(26,20,16,0.7)' }}>{f}</span>
                </li>
              ))}
            </ul>

            <Link href="/portale">
              <Button size="lg">
                Accedi al portale
                <ArrowRight size={17} />
              </Button>
            </Link>
          </div>

          {/* Right: mock portal */}
          <div className="relative">
            <div
              className="rounded-2xl overflow-hidden shadow-2xl"
              style={{
                border: '1px solid rgba(201,169,110,0.3)',
                boxShadow: '0 24px 64px rgba(13,27,42,0.18)',
              }}
            >
              {/* Browser chrome */}
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ backgroundColor: 'var(--navy)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
                      <span key={c} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ fontFamily: 'var(--font-playfair)', color: 'var(--gold)' }}
                  >
                    Portale Condominiale
                  </span>
                </div>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  roccaamministrazioni.it/portale
                </span>
              </div>

              {/* Portal content */}
              <div className="p-5" style={{ backgroundColor: 'var(--cream)' }}>
                {/* User bar */}
                <div
                  className="flex items-center justify-between mb-4 px-4 py-2.5 rounded-xl"
                  style={{ backgroundColor: 'white', border: '1px solid var(--cream-dark)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: 'var(--navy)' }}
                    >
                      MR
                    </div>
                    <div>
                      <p className="text-xs font-medium" style={{ color: 'var(--navy)' }}>
                        Mario Rossi
                      </p>
                      <p className="text-xs" style={{ color: 'rgba(26,20,16,0.4)' }}>
                        Interno 3A
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#16a34a' }}
                  >
                    Online
                  </span>
                </div>

                {/* 4 section cards */}
                <div className="grid grid-cols-2 gap-3">
                  {portalSections.map(({ Icon, label, count, color }) => (
                    <div
                      key={label}
                      className="p-4 rounded-xl"
                      style={{ backgroundColor: 'white', border: '1px solid var(--cream-dark)' }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center mb-2.5"
                        style={{ backgroundColor: `${color}15` }}
                      >
                        <Icon size={16} style={{ color }} />
                      </div>
                      <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--navy)' }}>
                        {label}
                      </p>
                      <p className="text-xs" style={{ color: 'rgba(26,20,16,0.45)' }}>
                        {count}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative element */}
            <div
              className="absolute -top-5 -right-5 w-24 h-24 rounded-2xl opacity-40"
              style={{
                background: 'linear-gradient(135deg, var(--gold), transparent)',
                zIndex: -1,
              }}
            />
          </div>

        </div>
      </div>
    </section>
  )
}
