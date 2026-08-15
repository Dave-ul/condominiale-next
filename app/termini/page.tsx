import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termini di Servizio — Rocca Amministrazioni',
}

const h2 = 'text-lg font-bold mt-8 mb-3'
const p = 'text-sm leading-relaxed mb-3'

export default function TerminiPage() {
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
            Termini di Servizio
          </p>
          <p className="text-xs" style={{ color: 'var(--stone)' }}>
            Portale Condominiale — Rocca Amministrazioni — ultimo aggiornamento: agosto 2026
          </p>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Accesso al portale</h2>
          <p className={p}>
            L'accesso al portale condominiale (<code>/portale</code>) è riservato ai residenti e agli amministratori dei
            condomini gestiti da Rocca Amministrazioni. La registrazione richiede l'accettazione dell'
            <Link href="/privacy" className="underline">Informativa Privacy</Link>. Le credenziali di accesso sono personali
            e non devono essere condivise con terzi.
          </p>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Contenuti e funzionalità</h2>
          <p className={p}>
            Il portale consente di consultare documenti condominiali, lo storico dei pagamenti e di inviare richieste di
            assistenza o segnalazioni. I contenuti resi disponibili sono forniti a titolo informativo e non sostituiscono la
            documentazione ufficiale conservata dall'amministrazione.
          </p>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Responsabilità</h2>
          <p className={p}>
            Rocca Amministrazioni si impegna a mantenere il servizio disponibile e i dati aggiornati, ma non garantisce
            l'assenza di interruzioni tecniche. Eventuali errori nei documenti o nei dati pubblicati vanno segnalati
            tramite l'apposita sezione richieste del portale o ai contatti indicati nella pagina Contatti del sito.
          </p>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Modifiche</h2>
          <p className={p}>
            I presenti termini possono essere aggiornati; la versione in vigore è sempre quella pubblicata su questa pagina.
          </p>
        </div>
      </div>
    </div>
  )
}
