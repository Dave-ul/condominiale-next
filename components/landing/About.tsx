import { CheckCircle } from 'lucide-react'

const credentials = [
  "Iscritto all'Anagrafe degli Amministratori di Condominio",
  'Aggiornamento professionale continuo',
  'Assicurazione professionale RC',
  'Software gestionale certificato',
]

const stats = [
  { value: '50+',  label: 'Condomini gestiti',   sub: 'nella provincia di Bologna' },
  { value: '15+',  label: 'Anni di esperienza',  sub: 'nel settore condominiale' },
  { value: '24h',  label: 'Reperibilità',         sub: 'per emergenze' },
  { value: '100%', label: 'Digitale',             sub: 'gestione e documentazione' },
]

export function About() {
  return (
    <section
      id="chi-siamo"
      className="py-24 sq-grid-dark"
      style={{ backgroundColor: 'var(--navy)' }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: text */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span style={{ width: 3, height: 22, backgroundColor: 'var(--gold)', display: 'block', flexShrink: 0 }} />
              <p
                className="text-xs font-medium uppercase"
                style={{ color: 'var(--gold)', letterSpacing: '0.25em' }}
              >
                Chi siamo
              </p>
            </div>

            <h2
              className="text-4xl font-bold text-white mb-8 leading-tight"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Professionalità al servizio<br />del vostro condominio
            </h2>

            <blockquote
              className="text-white/60 italic text-lg mb-8 pl-5"
              style={{ borderLeft: '3px solid var(--gold)' }}
            >
              "La mia missione è semplificare la vita dei condomini attraverso una gestione
              trasparente, digitale e sempre disponibile."
            </blockquote>

            <p className="text-white/55 mb-10 leading-relaxed">
              Luigi Rocca, fondatore e amministratore principale, opera nell'ambito della gestione
              condominiale da oltre 15 anni a Bologna e provincia. Il nostro studio garantisce
              professionalità certificata e un approccio moderno alla gestione del patrimonio
              immobiliare.
            </p>

            <ul className="space-y-3">
              {credentials.map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <CheckCircle size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--gold)' }} />
                  <span className="text-white/65 text-sm">{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: 2×2 square stat grid */}
          <div
            className="grid grid-cols-2 gap-px"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
          >
            {stats.map(({ value, label, sub }) => (
              <div
                key={value}
                className="p-8"
                style={{ backgroundColor: 'var(--navy)' }}
              >
                <p
                  className="text-4xl font-bold mb-2"
                  style={{ fontFamily: 'var(--font-playfair)', color: 'var(--gold)' }}
                >
                  {value}
                </p>
                <div style={{ width: 20, height: 2, backgroundColor: 'var(--gold)', marginBottom: 8, opacity: 0.5 }} />
                <p className="text-white font-medium text-sm">{label}</p>
                <p className="text-white/35 text-xs mt-1">{sub}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
