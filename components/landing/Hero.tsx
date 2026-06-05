import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const stats = [
  { value: '50+', label: 'Condomini gestiti' },
  { value: '24h', label: 'Risposta garantita' },
  { value: '100%', label: 'Gestione digitale' },
]

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-end overflow-hidden"
      style={{ backgroundColor: 'var(--navy)' }}
    >
      {/* Building facade background pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(13,27,42,0.82) 0%, rgba(13,27,42,0.72) 50%, rgba(13,27,42,0.90) 100%),
            repeating-linear-gradient(
              0deg,
              transparent 0px, transparent 69px,
              rgba(201,169,110,0.07) 69px, rgba(201,169,110,0.07) 70px
            ),
            repeating-linear-gradient(
              90deg,
              transparent 0px, transparent 89px,
              rgba(201,169,110,0.05) 89px, rgba(201,169,110,0.05) 90px
            )
          `,
          backgroundSize: 'auto, auto, auto',
        }}
      />
      {/* Extra depth layer */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse at 20% 50%, rgba(201,169,110,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(13,40,70,0.6) 0%, transparent 50%)',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full pt-32 pb-20 flex flex-col items-center text-center">
        <p
          className="text-sm font-medium uppercase mb-5 tracking-widest"
          style={{ color: 'var(--gold)', letterSpacing: '0.25em' }}
        >
          Amministrazione Condominiale · Bologna
        </p>

        <h1
          className="text-white mb-6 leading-tight max-w-3xl"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
            fontWeight: 700,
          }}
        >
          La tua casa in mani{' '}
          <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>professionali</em>
        </h1>

        <p
          className="mb-10 max-w-xl mx-auto leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.125rem' }}
        >
          Gestione condominiale trasparente, digitale e sempre disponibile. Oltre 15 anni di
          esperienza a Bologna e provincia.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-20">
          <a href="#contatti">
            <Button size="lg" className="rounded-full px-8">
              Richiedi un preventivo
              <ArrowRight size={17} />
            </Button>
          </a>
          <Link href="/portale">
            <Button
              size="lg"
              variant="ghost"
              className="rounded-full px-8"
              style={{
                border: '1px solid rgba(255,255,255,0.35)',
                color: 'white',
              }}
            >
              Accedi al portale
            </Button>
          </Link>
        </div>

        {/* Stats strip */}
        <div
          className="w-full max-w-2xl rounded-2xl grid grid-cols-3"
          style={{
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {stats.map((s, i) => (
            <div
              key={s.value}
              className="py-5 text-center"
              style={{
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.1)' : undefined,
              }}
            >
              <p
                className="font-bold mb-0.5"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '1.875rem',
                  color: 'var(--gold)',
                }}
              >
                {s.value}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--cream)] to-transparent" />
    </section>
  )
}
