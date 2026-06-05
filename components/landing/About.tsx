import { CheckCircle, Award, Shield, BookOpen } from 'lucide-react'

const credentials = [
  "Iscritto all'Anagrafe degli Amministratori di Condominio",
  'Aggiornamento professionale continuo (art. 71-bis disp. att. c.c.)',
  'Assicurazione professionale RC',
  'Software gestionale certificato',
]

const badges = [
  { Icon: Award, label: 'Certificato ANACI' },
  { Icon: Shield, label: 'RC Professionale' },
  { Icon: BookOpen, label: '15+ anni exp.' },
]

export function About() {
  return (
    <section id="chi-siamo" className="py-24 overflow-hidden" style={{ backgroundColor: 'var(--navy)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: text */}
          <div>
            <p
              className="text-sm font-medium uppercase mb-4"
              style={{ color: 'var(--gold)', letterSpacing: '0.2em' }}
            >
              Chi siamo
            </p>
            <h2
              className="text-4xl font-bold text-white mb-6 leading-snug"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Professionalita al servizio del vostro condominio
            </h2>

            <blockquote
              className="italic text-lg mb-6 pl-5"
              style={{
                color: 'rgba(255,255,255,0.65)',
                borderLeft: '3px solid var(--gold)',
              }}
            >
              "La mia missione e semplificare la vita dei condomini attraverso una gestione
              trasparente, digitale e sempre disponibile."
            </blockquote>

            <p className="mb-8 leading-relaxed text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Luigi Rocca, fondatore e amministratore principale, opera nell&apos;ambito della
              gestione condominiale da oltre 15 anni a Bologna e provincia. Il nostro studio
              garantisce professionalita certificata e un approccio moderno alla gestione del
              patrimonio immobiliare condominiale.
            </p>

            <ul className="space-y-3 mb-8">
              {credentials.map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 shrink-0"
                    style={{ color: 'var(--gold)' }}
                  />
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    {c}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              {badges.map(({ Icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: 'rgba(201,169,110,0.12)',
                    border: '1px solid rgba(201,169,110,0.25)',
                    color: 'var(--gold)',
                  }}
                >
                  <Icon size={13} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Right: building illustration */}
          <div className="relative">
            {/* Main image area */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ aspectRatio: '4/5', maxHeight: 480 }}
            >
              {/* Building facade pattern */}
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    linear-gradient(160deg, #1a2d42 0%, #0a1f35 100%)
                  `,
                }}
              />
              {/* Window grid */}
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(0deg, transparent, transparent 34px, rgba(201,169,110,0.12) 34px, rgba(201,169,110,0.12) 35px),
                    repeating-linear-gradient(90deg, transparent, transparent 44px, rgba(201,169,110,0.10) 44px, rgba(201,169,110,0.10) 45px)
                  `,
                }}
              />
              {/* Windows */}
              <div className="absolute inset-0 grid grid-cols-4 gap-3 p-8 opacity-40">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-sm"
                    style={{
                      aspectRatio: '2/3',
                      backgroundColor: i % 3 === 0 ? 'rgba(201,169,110,0.3)' : 'rgba(201,169,110,0.08)',
                      border: '1px solid rgba(201,169,110,0.15)',
                    }}
                  />
                ))}
              </div>
              {/* Overlay gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(13,27,42,0.8) 0%, transparent 60%)',
                }}
              />
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  Luigi Rocca
                </p>
                <p className="text-sm" style={{ color: 'var(--gold)' }}>
                  Amministratore Condominiale
                </p>
              </div>
            </div>

            {/* Decorative offset card */}
            <div
              className="absolute -bottom-6 -left-6 p-5 rounded-2xl shadow-2xl"
              style={{
                backgroundColor: 'var(--gold)',
                width: 160,
              }}
            >
              <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--navy)' }}>
                50+
              </p>
              <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--navy)' }}>
                Condomini gestiti
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
