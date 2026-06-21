import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--ink)' }}>
      {/* Gold top accent line */}
      <div style={{ height: 3, backgroundColor: 'var(--gold)' }} />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span
                className="flex items-center justify-center text-xs font-bold"
                style={{
                  width: 28, height: 28,
                  backgroundColor: 'var(--gold)',
                  color: 'var(--navy)',
                  fontFamily: 'var(--font-playfair)',
                  fontSize: 14,
                  flexShrink: 0,
                }}
              >
                R
              </span>
              <span
                className="text-sm font-semibold text-white/80"
                style={{ letterSpacing: '0.08em' }}
              >
                ROCCA AMMINISTRAZIONI
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Studio professionale per l’amministrazione condominiale a Bologna e provincia.
            </p>
          </div>

          {/* Services */}
          <div>
            <p
              className="text-white/50 text-xs font-medium uppercase mb-4"
              style={{ letterSpacing: '0.2em' }}
            >
              Servizi
            </p>
            <ul className="space-y-2">
              {['Amministrazione', 'Contabilità', 'Assemblee', 'Manutenzione', 'Pratiche Burocratiche'].map((s) => (
                <li key={s}>
                  <a href="#servizi" className="text-white/40 hover:text-white/70 text-sm transition-colors">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <p
              className="text-white/50 text-xs font-medium uppercase mb-4"
              style={{ letterSpacing: '0.2em' }}
            >
              Contatti
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--gold)' }} />
                <span className="text-white/40 text-sm">
                  Via Don Giovanni Minzoni 1<br />40067 Rastignano (BO)
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={14} style={{ color: 'var(--gold)' }} />
                <a href="tel:+393383742204" className="text-white/40 hover:text-white/70 text-sm transition-colors">
                  +39 338 374 2204
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} style={{ color: 'var(--gold)' }} />
                <a href="mailto:pluigi.rocca@yahoo.com" className="text-white/40 hover:text-white/70 text-sm transition-colors">
                  pluigi.rocca@yahoo.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <p className="text-white/25 text-xs">
            &copy; {new Date().getFullYear()} Rocca Amministrazioni. Tutti i diritti riservati.
          </p>
          <Link href="/portale" className="text-white/25 hover:text-white/50 text-xs transition-colors">
            Portale condominiale →
          </Link>
        </div>
      </div>
    </footer>
  )
}
