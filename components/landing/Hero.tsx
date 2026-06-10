import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const statTiles = [
  { value: '50+',  label: 'Condomini\ngestiti' },
  { value: '15+',  label: 'Anni di\nesperienza' },
  { value: '24h',  label: 'Reperibilità\ngarantita' },
  { value: '100%', label: 'Gestione\ndigitale' },
]

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col sq-grid-dark"
      style={{ backgroundColor: 'var(--navy)' }}
    >
      <div className="relative z-10 flex-1 flex items-center max-w-6xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 w-full py-24 pt-28">

          {/* Left: editorial text */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-8">
              <span
                style={{ display: 'block', width: 3, height: 22, backgroundColor: 'var(--gold)', flexShrink: 0 }}
              />
              <p
                className="text-xs font-medium uppercase"
                style={{ color: 'var(--gold)', letterSpacing: '0.25em' }}
              >
                Amministrazione Condominiale · Bologna
              </p>
            </div>

            <h1
              className="text-white mb-6"
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(2.8rem, 6vw, 5rem)',
                lineHeight: 1.06,
              }}
            >
              Gestiamo il tuo<br />
              condominio{' '}
              <span style={{ color: 'var(--gold)' }}>con<br />professionalità</span>
            </h1>

            <p className="text-white/55 text-lg mb-10 max-w-xl leading-relaxed">
              Studio professionale a Bologna con oltre 15 anni di esperienza.
              Amministrazione trasparente, digitale e sempre disponibile.
            </p>

            <div className="flex flex-wrap gap-3">
              <a href="#contatti">
                <Button size="lg">
                  Richiedi un preventivo
                  <ArrowRight size={16} />
                </Button>
              </a>
              <Link href="/portale">
                <Button
                  size="lg"
                  variant="ghost"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Accedi al portale
                </Button>
              </Link>
            </div>

            {/* Mobile stats row */}
            <div className="grid grid-cols-4 gap-px mt-14 lg:hidden" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              {statTiles.map(({ value, label }) => (
                <div
                  key={value}
                  className="flex flex-col justify-center p-4"
                  style={{ backgroundColor: 'var(--navy)' }}
                >
                  <p
                    className="text-2xl font-bold"
                    style={{ fontFamily: 'var(--font-playfair)', color: 'var(--gold)' }}
                  >
                    {value}
                  </p>
                  <p className="text-white/40 text-xs mt-1" style={{ whiteSpace: 'pre-line' }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: 2×2 square stat grid — desktop only */}
          <div
            className="hidden lg:grid grid-cols-2 self-center"
            style={{ border: '1px solid rgba(255,255,255,0.12)' }}
          >
            {statTiles.map(({ value, label }, i) => (
              <div
                key={value}
                className="flex flex-col justify-center px-8 py-7"
                style={{
                  width: 172,
                  height: 148,
                  backgroundColor: 'var(--navy)',
                  borderRight:  i % 2 === 0 ? '1px solid rgba(255,255,255,0.12)' : 'none',
                  borderBottom: i < 2       ? '1px solid rgba(255,255,255,0.12)' : 'none',
                }}
              >
                <p
                  className="text-4xl font-bold leading-none mb-2"
                  style={{ fontFamily: 'var(--font-playfair)', color: 'var(--gold)' }}
                >
                  {value}
                </p>
                <p className="text-white/45 text-xs leading-snug" style={{ whiteSpace: 'pre-line' }}>
                  {label}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Fade to cream */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{ background: 'linear-gradient(to top, var(--cream), transparent)' }}
      />
    </section>
  )
}
