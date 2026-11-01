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
            Portale Condominiale — Rocca Amministrazioni — ultimo aggiornamento: novembre 2026
          </p>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Accesso al portale</h2>
          <p className={p}>
            L&apos;accesso al portale condominiale (<code>/portale</code>) è riservato agli aventi diritto dei condomini
            che hanno deliberato il sito ai sensi dell&apos;art. 71-ter disp. att. c.c. Non è possibile registrarsi
            liberamente: l&apos;amministratore invia un invito personale dopo aver verificato il titolo. Le credenziali e il
            fattore di verifica in due passaggi sono personali e non vanno condivisi. Come sono trattati i dati è spiegato
            nell&apos;<Link href="/privacy" className="underline">Informativa Privacy</Link>.
          </p>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Contenuti e funzionalità</h2>
          <p className={p}>
            Il portale consente di consultare documenti condominiali, lo storico dei pagamenti e di inviare richieste di
            assistenza o segnalazioni. I contenuti resi disponibili sono forniti a titolo informativo e non sostituiscono la
            documentazione ufficiale conservata dall&apos;amministrazione.
          </p>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Responsabilità</h2>
          <p className={p}>
            Rocca Amministrazioni si impegna a mantenere il servizio disponibile e i dati aggiornati, ma non garantisce
            l&apos;assenza di interruzioni tecniche. Eventuali errori nei documenti o nei dati pubblicati vanno segnalati
            tramite l&apos;apposita sezione richieste del portale o ai contatti indicati nella pagina Contatti del sito.
            Restano salve le responsabilità che la legge non consente di escludere.
          </p>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Fine dell&apos;accesso</h2>
          <p className={p}>
            L&apos;accesso termina quando cessa il diritto sull&apos;unità immobiliare o l&apos;incarico
            dell&apos;amministratore. Dalla pagina Account puoi scaricare i tuoi dati e cancellare l&apos;account in
            qualsiasi momento.
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
