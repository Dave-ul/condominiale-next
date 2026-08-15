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
            Ultimo aggiornamento: agosto 2026
          </p>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Cookie tecnici (sempre attivi)</h2>
          <p className={p}>
            Il portale condominiale (<code>/portale</code>) utilizza cookie tecnici di sessione impostati da Supabase Auth
            (es. <code>sb-*-auth-token</code>) necessari per mantenere l'accesso effettuato. Questi cookie sono strettamente
            necessari al funzionamento del servizio richiesto dall'utente e, per normativa del Garante Privacy, non richiedono
            il consenso preventivo.
          </p>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Cookie di profilazione e analytics</h2>
          <p className={p}>
            Il sito non utilizza, allo stato attuale, cookie di profilazione, analytics o pubblicitari di terze parti.
            Questa pagina verrà aggiornata, con richiesta di consenso preventivo, qualora in futuro venissero introdotti
            strumenti di analisi del traffico o marketing.
          </p>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Contenuti di terze parti</h2>
          <p className={p}>
            La pagina dei contatti include una mappa incorporata (Google Maps): il caricamento dell'iframe può comportare
            connessioni al dominio Google, che non impostano cookie di profilazione senza un'interazione diretta dell'utente
            con la mappa.
          </p>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Come gestire i cookie</h2>
          <p className={p}>
            I cookie tecnici di sessione possono essere rimossi in qualsiasi momento dalle impostazioni del browser; questo
            comporterà la disconnessione dal portale. Per informazioni sul trattamento dei dati personali consulta
            l'<Link href="/privacy" className="underline">Informativa Privacy</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
