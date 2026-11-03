import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Informativa Privacy — Rocca Amministrazioni',
}

const h2 = 'text-lg font-bold mt-8 mb-3'
const p = 'text-sm leading-relaxed mb-3'
const ul = 'text-sm leading-relaxed mb-3 pl-5 list-disc space-y-1'

// Dati dello studio. I segnaposto tra parentesi quadre vanno sostituiti prima
// della pubblicazione (art. 35 DPR 633/1972 e art. 7 D.Lgs. 70/2003).
const STUDIO = {
  nome: 'Pier Luigi Rocca — Rocca Amministrazioni',
  sede: 'Via Don Giovanni Minzoni 1, 40067 Rastignano (BO)',
  piva: '[P.IVA]',
  email: 'pluigi.rocca@yahoo.com',
  pec: '[PEC]',
  tel: '+39 338 374 2204',
}

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
            Ai sensi dell&apos;art. 13 del Regolamento (UE) 2016/679 (GDPR) — ultimo aggiornamento: novembre 2026
          </p>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Chi siamo e come contattarci</h2>
          <p className={p}>
            {STUDIO.nome}, {STUDIO.sede}, P.IVA {STUDIO.piva}.
            Email <a href={`mailto:${STUDIO.email}`} className="underline">{STUDIO.email}</a>, PEC {STUDIO.pec},
            tel. <a href={`tel:${STUDIO.tel.replace(/\s/g, '')}`} className="underline">{STUDIO.tel}</a>.
            Non è stato designato un responsabile della protezione dei dati (DPO).
          </p>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Titolare</h2>
          <p className={p}>Il titolare del trattamento è lo studio indicato sopra.</p>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Dati, finalità e base giuridica</h2>
          <ul className={ul}>
            <li>
              <strong>Modulo di contatto</strong> (nome, cognome, email, telefono, oggetto, messaggio): usati solo per
              rispondere alla tua richiesta, anche in vista di un eventuale incarico. Base giuridica: misure
              precontrattuali adottate su tua richiesta (art. 6.1.b GDPR). Senza questi dati non possiamo risponderti.
            </li>
            <li>
              <strong>Dati di navigazione</strong> (indirizzo IP, browser, pagine richieste) registrati dai sistemi di
              hosting per far funzionare e proteggere il sito. Base giuridica: legittimo interesse alla sicurezza del
              sito (art. 6.1.f GDPR).
            </li>
            <li>
              <strong>Mappa</strong>: la mappa di Google si carica solo se premi &quot;Mostra la mappa&quot;. Da quel
              momento Google riceve il tuo indirizzo IP come titolare autonomo. Vedi la{' '}
              <Link href="/cookie-policy" className="underline">Cookie Policy</Link>.
            </li>
          </ul>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Fornitori</h2>
          <ul className={ul}>
            <li>
              <strong>Aruba S.p.A.</strong> (Italia): servizio di posta del dominio, con cui il modulo di contatto ci
              invia la tua richiesta via email. Server in Italia.
            </li>
            <li>
              <strong>Yahoo EMEA Limited</strong> (Irlanda): fornitore della casella email dello studio, dove la
              richiesta viene ricevuta e conservata.
            </li>
            <li>
              <strong>Netlify, Inc.</strong> (Stati Uniti): hosting del sito. Le funzioni del sito, compreso l&apos;invio
              del modulo di contatto, girano negli Stati Uniti; la rete di distribuzione dei contenuti è globale. Il
              trasferimento si basa sull&apos;adesione di Netlify al Data Privacy Framework UE-USA (decisione di
              adeguatezza della Commissione europea del 10 luglio 2023, art. 45 GDPR), con le clausole contrattuali
              tipo della Commissione come garanzia di riserva.
            </li>
          </ul>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Conservazione</h2>
          <p className={p}>
            I messaggi del modulo di contatto sono conservati per il tempo necessario a rispondere e, se ne nasce un
            incarico, per la durata di quest&apos;ultimo. I dati di navigazione sono conservati secondo i tempi tecnici
            del fornitore di hosting.
          </p>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>I tuoi diritti</h2>
          <p className={p}>
            Puoi chiedere l&apos;accesso ai tuoi dati, la rettifica, la cancellazione, la limitazione e la portabilità,
            e puoi opporti al trattamento basato sul legittimo interesse (artt. 15-22 GDPR), scrivendo ai contatti
            indicati sopra.
          </p>
          <p className={p}>
            Puoi proporre reclamo al Garante per la protezione dei dati personali (
            <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="underline">
              www.garanteprivacy.it
            </a>
            ), ai sensi dell&apos;art. 77 GDPR.
          </p>
          <p className={p}>Non sono effettuate decisioni automatizzate né profilazione.</p>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Cookie</h2>
          <p className={p}>
            Per i cookie e i contenuti di terze parti consulta la{' '}
            <Link href="/cookie-policy" className="underline">Cookie Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
