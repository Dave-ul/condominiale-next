import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy — Rocca Amministrazioni',
}

const h2 = 'text-lg font-bold mt-8 mb-3'
const p = 'text-sm leading-relaxed mb-3'

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen px-4 py-16" style={{ backgroundColor: 'var(--cream)' }}>
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm mb-8 hover:text-[var(--navy)] transition-colors"
          style={{ color: 'var(--ink)', opacity: 0.6 }}
        >
          <ArrowLeft size={16} />
          Torna al sito
        </Link>

        <div className="bg-white border-2 border-[var(--navy)] px-8 py-10" style={{ color: 'var(--ink)' }}>
          <p className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--navy)' }}>
            Cookie Policy
          </p>
          <p className="text-xs" style={{ color: 'var(--stone)' }}>
            Ultimo aggiornamento: novembre 2026
          </p>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Cookie del sito</h2>
          <p className={p}>
            Il sito non imposta cookie propri: non ci sono aree riservate né accessi con credenziali, e le pagine si
            consultano senza salvare nulla sul tuo dispositivo.
          </p>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Cookie di profilazione e analytics</h2>
          <p className={p}>
            Il sito non utilizza, allo stato attuale, cookie di profilazione, analytics o pubblicitari di terze parti.
            Questa pagina verrà aggiornata, con richiesta di consenso preventivo, qualora in futuro venissero introdotti
            strumenti di analisi del traffico o marketing.
          </p>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Contenuti di terze parti</h2>
          <p className={p}>
            La sezione contatti del sito può mostrare una mappa di Google Maps. La mappa non viene caricata automaticamente:
            compare solo se premi &quot;Mostra la mappa&quot;. Da quel momento Google riceve il tuo indirizzo IP e può impostare
            propri cookie, secondo l&apos;informativa di Google (policies.google.com/privacy). In alternativa puoi aprire
            l&apos;indirizzo direttamente su Google Maps con l&apos;apposito link.
          </p>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Come gestire i cookie</h2>
          <p className={p}>
            Gli eventuali cookie impostati da Google dopo che hai aperto la mappa si possono cancellare in qualsiasi momento
            dalle impostazioni del browser. Per informazioni sul trattamento dei dati personali consulta
            l&apos;<Link href="/privacy" className="underline">Informativa Privacy</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
