import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Informativa Privacy — Rocca Amministrazioni',
}

const h2 = 'text-lg font-bold mt-8 mb-3'
const p = 'text-sm leading-relaxed mb-3'

export default function PrivacyPage() {
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
            Informativa Privacy
          </p>
          <p className="text-xs" style={{ color: 'var(--stone)' }}>
            Ai sensi degli artt. 13-14 del Regolamento UE 2016/679 (GDPR) — ultimo aggiornamento: agosto 2026
          </p>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Titolare del trattamento</h2>
          <p className={p}>
            Pier Luigi Rocca — Rocca Amministrazioni, Via Don Giovanni Minzoni 1, 40067 Rastignano (BO).
            Contatti: <a href="mailto:pluigi.rocca@yahoo.com" className="underline">pluigi.rocca@yahoo.com</a>, tel. <a href="tel:+393383742204" className="underline">+39 338 374 2204</a>.
          </p>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Dati trattati</h2>
          <p className={p}>
            Nell&apos;ambito del servizio di amministrazione condominiale e del portale online trattiamo: dati anagrafici e di contatto
            (nome, email, telefono, unità/interno di residenza), dati relativi a pagamenti e ricevute condominiali, documenti
            condominiali (verbali, rendiconti, circolari) e le richieste/segnalazioni inviate tramite il portale. Chi utilizza il
            modulo di contatto sul sito fornisce inoltre nome, email, telefono e il contenuto del messaggio.
          </p>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Finalità e base giuridica</h2>
          <p className={p}>
            I dati dei residenti sono trattati per l&apos;esecuzione del mandato di amministrazione condominiale (art. 6.1.b GDPR —
            esecuzione di un contratto/incarico). I dati raccolti tramite il modulo di contatto sono trattati sulla base del
            consenso dell&apos;interessato (art. 6.1.a GDPR) per rispondere alla richiesta ricevuta.
          </p>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Destinatari e responsabili del trattamento</h2>
          <p className={p}>
            I dati sono trattati con l&apos;ausilio di fornitori terzi che agiscono come responsabili del trattamento:
          </p>
          <ul className="text-sm leading-relaxed mb-3 pl-5 list-disc space-y-1">
            <li><strong>Supabase</strong> — hosting del database e autenticazione, infrastruttura nella regione UE (eu-central-1, Francoforte).</li>
            <li><strong>Vercel</strong> — hosting dell&apos;applicazione web.</li>
            <li><strong>Formspree</strong> — gestione del modulo di contatto del sito; il servizio ha sede negli Stati Uniti, il trasferimento dei dati è regolato dalle garanzie previste dal fornitore per i trasferimenti extra-UE.</li>
          </ul>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Conservazione</h2>
          <p className={p}>
            I dati dei residenti sono conservati per la durata del mandato di amministrazione e per il periodo successivo
            richiesto dagli obblighi di legge (es. conservazione documentale fiscale/contabile). I dati raccolti tramite il
            modulo di contatto sono conservati per il tempo necessario a evadere la richiesta.
          </p>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Diritti dell&apos;interessato</h2>
          <p className={p}>
            È possibile richiedere in qualsiasi momento l&apos;accesso, la rettifica, la cancellazione o la limitazione del
            trattamento dei propri dati, nonché la portabilità degli stessi, scrivendo a{' '}
            <a href="mailto:pluigi.rocca@yahoo.com" className="underline">pluigi.rocca@yahoo.com</a>. È inoltre possibile proporre
            reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it).
          </p>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Cookie</h2>
          <p className={p}>
            Per informazioni sui cookie utilizzati dal sito e dal portale consulta la{' '}
            <Link href="/cookie-policy" className="underline">Cookie Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
