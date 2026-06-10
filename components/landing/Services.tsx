import {
  Building2, BookOpen, Users, Wrench,
  FileText, Scale, FolderOpen, Headphones,
} from 'lucide-react'

const services = [
  { Icon: Building2,  title: 'Amministrazione',      desc: 'Gestione completa della proprietà condominiale con massima trasparenza.' },
  { Icon: BookOpen,   title: 'Contabilità',           desc: 'Bilanci, rendiconti e gestione finanziaria con report chiari e accessibili.' },
  { Icon: Users,      title: 'Assemblee',             desc: 'Organizzazione e verbalizzazione di assemblee ordinarie e straordinarie.' },
  { Icon: Wrench,     title: 'Manutenzione',          desc: 'Coordinamento interventi, ditte affidabili e monitoraggio lavori.' },
  { Icon: FileText,   title: 'Pratiche Burocratiche', desc: 'Gestione di tutte le pratiche amministrative e normative.' },
  { Icon: Scale,      title: 'Supporto Legale',       desc: 'Consulenza per controversie condominiali e recupero crediti.' },
  { Icon: FolderOpen, title: 'Documentazione',        desc: 'Archivio digitale accessibile 24/7 con tutti i documenti condominiali.' },
  { Icon: Headphones, title: 'Assistenza Tecnica',    desc: 'Supporto tecnico specializzato per ogni esigenza del condominio.' },
]

export function Services() {
  return (
    <section id="servizi" className="py-24" style={{ backgroundColor: 'var(--cream)' }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Section header */}
        <div className="flex items-end justify-between mb-12 pb-6 border-b border-[var(--cream-dark)]">
          <div>
            <p
              className="text-xs font-medium uppercase mb-3"
              style={{ color: 'var(--gold)', letterSpacing: '0.25em' }}
            >
              Cosa offriamo
            </p>
            <h2
              className="text-4xl font-bold"
              style={{ fontFamily: 'var(--font-playfair)', color: 'var(--navy)' }}
            >
              I nostri servizi
            </h2>
          </div>
          <p className="text-sm hidden sm:block max-w-xs text-right" style={{ color: 'var(--stone)' }}>
            Una soluzione completa per la gestione del vostro condominio.
          </p>
        </div>

        {/* Gap-px grid — cards separated by hairline borders */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px"
          style={{ backgroundColor: 'var(--cream-dark)' }}
        >
          {services.map(({ Icon, title, desc }, i) => (
            <div
              key={title}
              className="group p-6 relative transition-colors duration-150"
              style={{ backgroundColor: 'var(--cream)' }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.backgroundColor = '#fff'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--cream)'
              }}
            >
              {/* Swiss number */}
              <span
                className="absolute top-4 right-5 text-xs font-mono"
                style={{ color: 'var(--ink)', opacity: 0.18 }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Square icon box */}
              <div
                className="w-10 h-10 flex items-center justify-center mb-4"
                style={{ backgroundColor: 'var(--navy)' }}
              >
                <Icon size={18} style={{ color: 'var(--gold)' }} />
              </div>

              {/* Gold line accent */}
              <div style={{ width: 24, height: 2, backgroundColor: 'var(--gold)', marginBottom: 12 }} />

              <h3
                className="font-semibold mb-2 text-sm"
                style={{ color: 'var(--navy)' }}
              >
                {title}
              </h3>
              <p
                className="text-xs leading-relaxed"
                style={{ color: 'var(--stone)' }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
