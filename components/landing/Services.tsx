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
    desc: 'Gestione completa della proprieta condominiale, convocazioni assembleari e verbalizzazione.',
  },
  {
    Icon: BookOpen,
    title: 'Contabilita',
    desc: 'Bilanci preventivi e consuntivi, gestione finanziaria con reportistica chiara e accessibile.',
  },
  {
    Icon: Users,
    title: 'Assemblee',
    desc: 'Organizzazione, convocazione e verbalizzazione professionale di assemblee ordinarie e straordinarie.',
  },
  {
    Icon: Wrench,
    title: 'Manutenzione',
    desc: "Coordinamento degli interventi di manutenzione ordinaria e straordinaria con ditte qualificate.",
  },
  {
    Icon: FileText,
    title: 'Pratiche Burocratiche',
    desc: 'Gestione di tutte le pratiche amministrative, catastali e normative richieste.',
  },
  {
    Icon: Scale,
    title: 'Supporto Legale',
    desc: 'Consulenza e assistenza per controversie condominiali, recupero crediti e mediazioni.',
  },
  {
    Icon: FolderOpen,
    title: 'Documentazione Digitale',
    desc: 'Archivio digitale sicuro, accessibile 24/7 con tutti i documenti del condominio.',
  },
  {
    Icon: Headphones,
    title: 'Assistenza Tecnica',
    desc: 'Supporto tecnico specializzato e reperibilita per emergenze condominiali.',
  },
]

export function Services() {
  return (
    <section id="servizi" className="py-24" style={{ backgroundColor: 'var(--cream)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p
            className="text-sm font-medium uppercase mb-3"
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
          <p className="max-w-xl mx-auto" style={{ color: 'rgba(26,20,16,0.55)', fontSize: '1rem' }}>
            Una soluzione completa e professionale per ogni aspetto della gestione condominiale.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="service-card p-6 rounded-2xl transition-all duration-300 cursor-default bg-white"
              style={{ border: '1px solid var(--cream-dark)' }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: 'var(--cream-dark)' }}
              >
                <Icon size={20} style={{ color: 'var(--gold)' }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--navy)', fontSize: '0.9rem' }}>
                {title}
              </h3>
              <p style={{ color: 'rgba(26,20,16,0.58)', fontSize: '0.82rem', lineHeight: 1.6 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
