import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Informativa Privacy — Rocca Amministrazioni',
}

const h2 = 'text-lg font-bold mt-8 mb-3'
const h3 = 'text-base font-bold mt-6 mb-2'
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
            Ai sensi degli artt. 13 e 14 del Regolamento (UE) 2016/679 (GDPR) — ultimo aggiornamento: novembre 2026
          </p>

          <p className={`${p} mt-6`}>
            Questa informativa ha due parti: la parte A riguarda il sito pubblico e il modulo di contatto; la parte B
            riguarda il portale condominiale riservato (<code>/portale</code>).
          </p>

          <h2 className={h2} style={{ color: 'var(--navy)' }}>Chi siamo e come contattarci</h2>
          <p className={p}>
            {STUDIO.nome}, {STUDIO.sede}, P.IVA {STUDIO.piva}.
            Email <a href={`mailto:${STUDIO.email}`} className="underline">{STUDIO.email}</a>, PEC {STUDIO.pec},
            tel. <a href={`tel:${STUDIO.tel.replace(/\s/g, '')}`} className="underline">{STUDIO.tel}</a>.
            Non è stato designato un responsabile della protezione dei dati (DPO).
          </p>

          {/* ---------------- PARTE A ---------------- */}
          <h2 className={h2} style={{ color: 'var(--navy)' }}>A. Sito pubblico e modulo di contatto</h2>

          <h3 className={h3}>Titolare</h3>
          <p className={p}>Il titolare del trattamento è lo studio indicato sopra.</p>

          <h3 className={h3}>Dati, finalità e base giuridica</h3>
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

          <h3 className={h3}>Fornitori</h3>
          <ul className={ul}>
            <li>
              <strong>Formspree, Inc.</strong> (Stati Uniti): riceve i messaggi del modulo di contatto e li tratta negli
              Stati Uniti.
            </li>
            <li>
              <strong>Vercel Inc.</strong> (Stati Uniti): hosting del sito; le funzioni dell&apos;applicazione girano
              nella regione UE di Francoforte, la rete di distribuzione dei contenuti è globale.
            </li>
          </ul>

          <h3 className={h3}>Conservazione</h3>
          <p className={p}>
            I messaggi del modulo di contatto sono conservati per il tempo necessario a rispondere e, se ne nasce un
            incarico, per la durata di quest&apos;ultimo. I dati di navigazione sono conservati secondo i tempi tecnici
            del fornitore di hosting.
          </p>

          {/* ---------------- PARTE B ---------------- */}
          <h2 className={h2} style={{ color: 'var(--navy)' }}>B. Portale condominiale</h2>

          <h3 className={h3}>Titolare e responsabile</h3>
          <p className={p}>
            Il portale è il sito internet del condominio previsto dall&apos;art. 71-ter delle disposizioni di attuazione
            del codice civile, attivato su delibera dell&apos;assemblea. Per i dati trattati nel portale il{' '}
            <strong>titolare è il Condominio di cui fai parte</strong>, in persona dell&apos;amministratore pro tempore.
            Lo studio indicato sopra gestisce il portale come <strong>responsabile del trattamento</strong> (art. 28
            GDPR), in base all&apos;atto di nomina approvato dal Condominio.
          </p>
          <p className={p}>
            Per i trattamenti che la legge affida direttamente all&apos;amministratore (anagrafe condominiale e altri
            registri dell&apos;art. 1130 c.c., conservazione della documentazione) il titolare è l&apos;amministratore.
            Denominazione e codice fiscale del tuo Condominio sono indicati nell&apos;informativa consegnata con
            l&apos;invito al portale.
          </p>

          <h3 className={h3}>Dati trattati</h3>
          <ul className={ul}>
            <li>Nome e cognome, email, telefono.</li>
            <li>Condominio e unità immobiliare (interno).</li>
            <li>Quote, scadenze, stato dei pagamenti e ricevute che carichi.</li>
            <li>
              Richieste e segnalazioni che invii. Il testo è libero:{' '}
              <strong>non inserire dati sulla salute o altri dati particolari</strong>.
            </li>
            <li>Documenti condominiali pubblicati per delibera (verbali, rendiconti, regolamento e simili).</li>
            <li>
              Dati di accesso: credenziali (la password è conservata solo in forma cifrata con hash), fattore di verifica
              in due passaggi, log di autenticazione, indirizzo IP.
            </li>
          </ul>
          <p className={p}>
            Nome, interno e quote possono essere inseriti dall&apos;amministratore a partire dall&apos;anagrafe
            condominiale e dalla contabilità del Condominio (art. 14 GDPR).
          </p>

          <h3 className={h3}>Finalità e base giuridica</h3>
          <ul className={ul}>
            <li>
              Consultazione ed estrazione dei documenti previsti dalla delibera: obbligo di legge (art. 6.1.c GDPR; art.
              71-ter disp. att. c.c.).
            </li>
            <li>
              Gestione di quote, pagamenti e ricevute; tenuta dell&apos;anagrafe condominiale: obbligo di legge (art.
              6.1.c GDPR; artt. 1129, 1130 e 1130-bis c.c.).
            </li>
            <li>
              Richieste e segnalazioni di manutenzione: esecuzione del rapporto condominiale (art. 6.1.b GDPR); per chi
              non è condòmino, ad esempio un inquilino, legittimo interesse del Condominio alla manutenzione delle parti
              comuni (art. 6.1.f GDPR).
            </li>
            <li>
              Sicurezza del portale (accesso, verifica in due passaggi, log): obbligo di sicurezza (art. 32 GDPR) e
              legittimo interesse (art. 6.1.f GDPR).
            </li>
          </ul>
          <p className={p}>
            L&apos;email è necessaria per ricevere l&apos;invito e accedere. Usare il portale è facoltativo: i documenti
            restano consultabili presso l&apos;amministratore. Il trattamento non si basa sul consenso.
          </p>

          <h3 className={h3}>Chi vede i dati</h3>
          <ul className={ul}>
            <li>
              Ogni utente vede solo i <strong>propri</strong> pagamenti, ricevute e richieste, e i documenti del{' '}
              <strong>proprio</strong> condominio.
            </li>
            <li>L&apos;amministratore vede i dati dei condomini che amministra.</li>
            <li>
              Le morosità altrui non sono visibili nel portale. Gli altri condòmini possono conoscerle solo tramite
              l&apos;amministratore (rendiconto, richiesta, assemblea); i creditori del condominio le ricevono su
              richiesta, ai sensi dell&apos;art. 63 disp. att. c.c.
            </li>
          </ul>

          <h3 className={h3}>Fornitori (sub-responsabili)</h3>
          <ul className={ul}>
            <li>
              <strong>Supabase Inc.</strong>: database, autenticazione e archivio dei file, nella regione UE di
              Francoforte (eu-central-1). Alcuni suoi sub-fornitori hanno sede negli Stati Uniti; i trasferimenti sono
              coperti dalle clausole contrattuali tipo previste dal contratto di trattamento di Supabase (art. 46 GDPR).
            </li>
            <li>
              <strong>Vercel Inc.</strong>: hosting dell&apos;applicazione, con funzioni nella regione UE di Francoforte
              (fra1).
            </li>
            <li>
              <strong>Aruba S.p.A.</strong>: invio delle email del portale (inviti, recupero password), con server in
              Italia.
            </li>
            <li>
              <strong>Stripe</strong>: se l&apos;amministratore ti invia un link di pagamento e scegli di usarlo, il
              pagamento avviene sul sito di Stripe, che tratta i dati di pagamento come titolare autonomo secondo la
              propria informativa. Il portale non riceve i dati della carta.
            </li>
          </ul>

          <h3 className={h3}>Conservazione</h3>
          <ul className={ul}>
            <li>
              Account e profilo: fino alla cessazione del tuo diritto sull&apos;unità (vendita, fine della locazione) o
              alla cancellazione dell&apos;account.
            </li>
            <li>
              Pagamenti e ricevute: 10 anni dalla scadenza, come documentazione contabile del Condominio, anche dopo la
              cancellazione dell&apos;account.
            </li>
            <li>Richieste di manutenzione chiuse: 24 mesi dall&apos;invio.</li>
            <li>Documenti condominiali: per il periodo stabilito dalla delibera e dagli obblighi di conservazione.</li>
            <li>Log tecnici: secondo i tempi dei fornitori.</li>
          </ul>

          {/* ---------------- COMUNE ---------------- */}
          <h2 className={h2} style={{ color: 'var(--navy)' }}>I tuoi diritti</h2>
          <p className={p}>
            Puoi chiedere l&apos;accesso ai tuoi dati, la rettifica, la cancellazione, la limitazione e la portabilità,
            e puoi opporti al trattamento basato sul legittimo interesse (artt. 15-22 GDPR), scrivendo ai contatti
            indicati sopra. Nel portale, dalla pagina <strong>Account</strong>, puoi scaricare una copia dei tuoi dati e
            cancellare il tuo account; i dati contabili restano conservati per obbligo di legge (art. 17.3.b GDPR).
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
            Per i cookie usati dal sito e dal portale consulta la{' '}
            <Link href="/cookie-policy" className="underline">Cookie Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
