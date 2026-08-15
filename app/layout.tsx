import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

// Gli stessi due file variabili che public/index.html precarica per la
// landing: un solo set di font per tutto il sito, e una build che non
// dipende dalla rete verso Google. I `weight` dichiarano il range reale
// dell'asse wght di ciascun file.
const playfair = localFont({
  src: '../public/fonts/playfair-latin.woff2',
  weight: '400 900',
  style: 'normal',
  variable: '--font-playfair',
  display: 'swap',
})

const inter = localFont({
  src: '../public/fonts/inter-latin.woff2',
  weight: '100 900',
  style: 'normal',
  variable: '--font-inter',
  display: 'swap',
})

// La CSP con nonce di proxy.ts richiede rendering dinamico: Next inietta il
// nonce durante il server-side rendering, leggendolo dagli header della
// richiesta, mentre una pagina prerenderizzata a build time non ha nessuna
// richiesta da cui leggerlo e finirebbe servita con script privi di nonce —
// che 'strict-dynamic' bloccherebbe. Senza questa riga /auth (la pagina di
// login, un client component senza API dinamiche) è statica e resta inerte.
// La landing pubblica non è coinvolta: la serve app/route.ts, fuori da questo
// layout, con una CSP senza nonce e la propria Cache-Control.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Rocca Amministrazioni - Gestione Condominiale Bologna',
  description:
    'Amministrazione condominiale professionale a Bologna e provincia. Gestione digitale, assemblee, contabilita e assistenza 24h.',
  keywords: 'amministratore condominio Bologna, gestione condominiale, assemblee condominio',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${playfair.variable} ${inter.variable} h-full`}>
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
      >
        {children}
      </body>
    </html>
  )
}
