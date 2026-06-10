'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navLinks = [
  { href: '#chi-siamo', label: 'Chi Siamo' },
  { href: '#servizi',   label: 'Servizi' },
  { href: '#portale',   label: 'Portale' },
  { href: '#faq',       label: 'FAQ' },
  { href: '#contatti',  label: 'Contatti' },
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
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <span
            className="flex items-center justify-center text-xs font-bold"
            style={{
              width: 28,
              height: 28,
              backgroundColor: 'var(--gold)',
              color: 'var(--navy)',
              fontFamily: 'var(--font-playfair)',
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            R
          </span>
          <span
            className="text-sm font-semibold tracking-wide text-white/90 hidden sm:block"
            style={{ letterSpacing: '0.08em' }}
          >
            ROCCA AMMINISTRAZIONI
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs font-medium uppercase tracking-widest text-white/70 hover:text-[var(--gold)] transition-colors"
              style={{ letterSpacing: '0.15em' }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
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
        <div
          className="md:hidden border-t"
          style={{ backgroundColor: 'var(--navy)', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <nav className="flex flex-col px-6 py-5 gap-5">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-xs font-medium uppercase tracking-widest text-white/70 hover:text-[var(--gold)] transition-colors"
                style={{ letterSpacing: '0.15em' }}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <Link href="/portale" onClick={() => setOpen(false)}>
              <Button className="w-full mt-1">Accedi al Portale</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
