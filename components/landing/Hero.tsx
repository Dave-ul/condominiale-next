import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle } from 'lucide-react'

const stats = [
  { value: '50+', label: 'Condomini gestiti' },
  { value: '24h', label: 'Risposta garantita' },
  { value: '100%', label: 'Gestione digitale' },
]

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, #1a2d42 60%, #0a1520 100%)',
      }}
    >
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(201,169,110,0.3) 80px, rgba(201,169,110,0.3) 81px)',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-20">
        <p
          className="text-[var(--gold)] text-sm font-medium tracking-widest uppercase mb-6"
          style={{ letterSpacing: '0.2em' }}
        >
          Amministrazione Condominiale
        </p>

        <h1
          className="text-white mb-6 leading-tight"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          }}
        >
          Gestiamo il tuo condominio{' '}
          <span style={{ color: 'var(--gold)' }}>con professionalita</span>
        </h1>

        <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          Studio professionale a Bologna con oltre 15 anni di esperienza. Amministrazione
          trasparente, digitale e sempre disponibile.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-16">
          <a href="#contatti">
            <Button size="lg">
              Richiedi un preventivo
              <ArrowRight size={18} />
            </Button>
          </a>
          <Link href="/portale">
            <Button size="lg" variant="ghost" className="border-white/30 text-white hover:bg-white/10">
              Accedi al portale
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
          {stats.map((s) => (
            <div key={s.value} className="text-center">
              <p
                className="text-3xl font-bold"
                style={{ fontFamily: 'var(--font-playfair)', color: 'var(--gold)' }}
              >
                {s.value}
              </p>
              <p className="text-white/50 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--cream)] to-transparent" />
    </section>
  )
}
