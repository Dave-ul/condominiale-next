import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

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
