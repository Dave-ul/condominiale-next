import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="py-12 border-t" style={{ backgroundColor: 'var(--ink)', borderColor: 'rgba(255,255,255,0.08)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <p
              className="text-xl font-bold mb-3"
              style={{ fontFamily: 'var(--font-playfair)', color: 'var(--gold)' }}
            >
              Rocca Amministrazioni
            </p>
            <p className="text-white/50 text-sm leading-relaxed">
              Studio professionale per l'amministrazione condominiale a Bologna e provincia.
            </p>
          </div>

          <div>
            <p className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Servizi</p>
            <ul className="space-y-2">
              {['Amministrazione', 'Contabilita', 'Assemblee', 'Manutenzione', 'Pratiche Burocratiche'].map(
                (s) => (
                  <li key={s}>
                    <a href="#servizi" className="text-white/50 hover:text-white/80 text-sm transition-colors">
                      {s}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <p className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Contatti</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-0.5 shrink-0" style={{ color: 'var(--gold)' }} />
                <span className="text-white/50 text-sm">
                  Via Don Giovanni Minzoni 1<br />40067 Rastignano (BO)
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} style={{ color: 'var(--gold)' }} />
                <a href="tel:+393383742204" className="text-white/50 hover:text-white/80 text-sm transition-colors">
                  +39 338 374 2204
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} style={{ color: 'var(--gold)' }} />
                <a href="mailto:pluigi.rocca@yahoo.com" className="text-white/50 hover:text-white/80 text-sm transition-colors">
                  pluigi.rocca@yahoo.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} Rocca Amministrazioni. Tutti i diritti riservati.
          </p>
          <Link href="/portale" className="text-white/30 hover:text-white/60 text-xs transition-colors">
            Portale condominiale
          </Link>
        </div>
      </div>
    </footer>
  )
}
