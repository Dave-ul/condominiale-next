import {
  Building2,
  BookOpen,
  Users,
  Wrench,
  FileText,
  Scale,
  FolderOpen,
  Headphones,
} from 'lucide-react'

const services = [
  {
    Icon: Building2,
    title: 'Amministrazione',
    desc: 'Gestione completa della proprieta condominiale con massima trasparenza.',
  },
  {
    Icon: BookOpen,
    title: 'Contabilita',
    desc: 'Bilanci, rendiconti e gestione finanziaria con report chiari e accessibili.',
  },
  {
    Icon: Users,
    title: 'Assemblee',
    desc: 'Organizzazione e verbalizzazione di assemblee ordinarie e straordinarie.',
  },
  {
    Icon: Wrench,
    title: 'Manutenzione',
    desc: 'Coordinamento interventi, ditte affidabili e monitoraggio lavori.',
  },
  {
    Icon: FileText,
    title: 'Pratiche Burocratiche',
    desc: 'Gestione di tutte le pratiche amministrative e normative.',
  },
  {
    Icon: Scale,
    title: 'Supporto Legale',
    desc: 'Consulenza per controversie condominiali e recupero crediti.',
  },
  {
    Icon: FolderOpen,
    title: 'Documentazione Digitale',
    desc: 'Archivio digitale accessibile 24/7 con tutti i documenti condominiali.',
  },
  {
    Icon: Headphones,
    title: 'Assistenza Tecnica',
    desc: 'Supporto tecnico specializzato per ogni esigenza del condominio.',
  },
]

export function Services() {
  return (
    <section id="servizi" className="py-24" style={{ backgroundColor: 'var(--cream)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p
            className="text-sm font-medium tracking-widest uppercase mb-3"
            style={{ color: 'var(--gold)', letterSpacing: '0.2em' }}
          >
            Cosa offriamo
          </p>
          <h2
            className="text-4xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-playfair)', color: 'var(--navy)' }}
          >
            I nostri servizi
          </h2>
          <p className="text-[var(--ink)]/60 max-w-xl mx-auto">
            Una soluzione completa per la gestione del vostro condominio.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="group p-6 rounded-2xl border border-[var(--cream-dark)] hover:border-[var(--gold)] hover:shadow-lg transition-all duration-300 bg-white/60"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors"
                style={{ backgroundColor: 'var(--cream-dark)' }}
              >
                <Icon size={22} style={{ color: 'var(--gold)' }} />
              </div>
              <h3
                className="font-semibold mb-2 text-base"
                style={{ color: 'var(--navy)' }}
              >
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ink)', opacity: 0.65 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
