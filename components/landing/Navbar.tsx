'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navLinks = [
  { href: '#chi-siamo', label: 'Chi Siamo' },
  { href: '#servizi', label: 'Servizi' },
  { href: '#portale', label: 'Portale' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contatti', label: 'Contatti' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'var(--navy)' : 'transparent',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.3)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="text-xl font-bold"
            style={{ fontFamily: 'var(--font-playfair)', color: 'var(--gold)' }}
          >
            Rocca
          </span>
          <span className="text-sm text-white/70 hidden sm:block">Amministrazioni</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-white/80 hover:text-[var(--gold)] transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a
            href="tel:+393383742204"
            className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
          >
            <Phone size={14} />
            338 374 2204
          </a>
          <Link href="/portale">
            <Button size="sm">Accedi al Portale</Button>
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-white"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden" style={{ backgroundColor: 'var(--navy)' }}>
          <nav className="flex flex-col px-6 py-4 gap-4">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-white/80 py-1"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <Link href="/portale" onClick={() => setOpen(false)}>
              <Button className="w-full mt-2">Accedi al Portale</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
