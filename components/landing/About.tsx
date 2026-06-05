import { CheckCircle } from 'lucide-react'

const credentials = [
  'Iscritto all\'Anagrafe degli Amministratori di Condominio',
  'Aggiornamento professionale continuo',
  'Assicurazione professionale RC',
  'Software gestionale certificato',
]

export function About() {
  return (
    <section
      id="chi-siamo"
      className="py-24"
      style={{ backgroundColor: 'var(--navy)' }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p
              className="text-sm font-medium tracking-widest uppercase mb-4"
              style={{ color: 'var(--gold)', letterSpacing: '0.2em' }}
            >
              Chi siamo
            </p>
            <h2
              className="text-4xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Professionalita al servizio del vostro condominio
            </h2>
            <blockquote
              className="text-white/60 italic text-lg mb-8 pl-5 border-l-2"
              style={{ borderColor: 'var(--gold)' }}
            >
              "La mia missione e semplificare la vita dei condomini attraverso una gestione
              trasparente, digitale e sempre disponibile."
            </blockquote>
            <p className="text-white/60 mb-8 leading-relaxed">
              Luigi Rocca, fondatore e amministratore principale, opera nell'ambito della gestione
              condominiale da oltre 15 anni a Bologna e provincia. Il nostro studio garantisce
              professionalita certificata e un approccio moderno alla gestione del patrimonio
              immobiliare.
            </p>
            <ul className="space-y-3">
              {credentials.map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <CheckCircle size={18} className="mt-0.5 shrink-0" style={{ color: 'var(--gold)' }} />
                  <span className="text-white/70 text-sm">{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '50+', label: 'Condomini gestiti', sub: 'nella provincia di Bologna' },
              { value: '15+', label: 'Anni di esperienza', sub: 'nel settore condominiale' },
              { value: '24h', label: 'Reperibilita', sub: 'per emergenze' },
              { value: '100%', label: 'Digitale', sub: 'gestione e documentazione' },
            ].map(({ value, label, sub }) => (
              <div
                key={value}
                className="p-6 rounded-2xl"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
              >
                <p
                  className="text-3xl font-bold mb-1"
                  style={{ fontFamily: 'var(--font-playfair)', color: 'var(--gold)' }}
                >
                  {value}
                </p>
                <p className="text-white font-medium text-sm">{label}</p>
                <p className="text-white/40 text-xs mt-1">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
