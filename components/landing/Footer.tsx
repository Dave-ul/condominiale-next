import Link from 'next/link'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

const serviceLinks = [
  'Amministrazione',
  'Contabilita',
  'Assemblee',
  'Manutenzione',
  'Pratiche Burocratiche',
  'Supporto Legale',
]

const studioLinks = [
  { label: 'Chi Siamo', href: '#chi-siamo' },
  { label: 'Servizi', href: '#servizi' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Portale Clienti', href: '/portale' },
  { label: 'Contatti', href: '#contatti' },
]

export function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--ink)' }}>
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <p
              className="text-xl font-bold mb-3"
              style={{ fontFamily: 'var(--font-playfair)', color: 'var(--gold)' }}
            >
              Rocca Amministrazioni
            </p>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Studio professionale per l&apos;amministrazione condominiale a Bologna e provincia.
              Professionalita, trasparenza e innovazione digitale.
            </p>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              <Clock size={13} />
              <span>Lun–Ven 9:00–13:00 · 15:00–18:30</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-5"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              Servizi
            </p>
            <ul className="space-y-2.5">
              {serviceLinks.map((s) => (
                <li key={s}>
                  <a href="#servizi" className="text-sm footer-link">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio links */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-5"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              Studio
            </p>
            <ul className="space-y-2.5">
              {studioLinks.map(({ label, href }) => (
                <li key={label}>
                  {href.startsWith('#') ? (
                    <a href={href} className="text-sm footer-link">{label}</a>
                  ) : (
                    <Link href={href} className="text-sm footer-link">{label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-5"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              Contatti
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--gold)' }} />
                <span className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Via Don Giovanni Minzoni 1<br />
                  40067 Rastignano (BO)
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={14} style={{ color: 'var(--gold)' }} />
                <a href="tel:+393383742204" className="text-sm footer-link">
                  +39 338 374 2204
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={14} style={{ color: 'var(--gold)' }} />
                <a href="mailto:pluigi.rocca@yahoo.com" className="text-sm footer-link">
                  pluigi.rocca@yahoo.com
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}
      >
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            &copy; {new Date().getFullYear()} Rocca Amministrazioni di Luigi Rocca. Tutti i diritti riservati.
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            P.IVA · C.F. del titolare
          </p>
        </div>
      </div>
    </footer>
  )
}
