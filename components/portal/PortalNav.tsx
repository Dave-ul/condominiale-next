'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FileText, CreditCard, MessageSquare, LayoutDashboard, Users, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { Profile } from '@/lib/supabase/types'
import { getInitials } from '@/lib/utils'

const navItems = [
  { href: '/portale',           Icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/portale/documenti', Icon: FileText,         label: 'Documenti' },
  { href: '/portale/pagamenti', Icon: CreditCard,       label: 'Pagamenti' },
  { href: '/portale/richieste', Icon: MessageSquare,    label: 'Richieste' },
]

const adminItems = [
  { href: '/portale/admin', Icon: Users, label: 'Admin' },
]

export function PortalNav({ profile }: { profile: Profile }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const supabase = createClient()

  const isAdmin = profile.role === 'admin'
  const items = isAdmin ? [...navItems, ...adminItems] : navItems

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const NavLink = ({ href, Icon, label }: { href: string; Icon: React.ElementType; label: string }) => {
    const active = pathname === href
    return (
      <Link
        href={href}
        onClick={() => setMobileOpen(false)}
        className={cn(
          'flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-100',
          active ? '' : 'hover:bg-[var(--cream-mid)]'
        )}
        style={{
          borderLeft: active ? '3px solid var(--gold)' : '3px solid transparent',
          color: active ? 'var(--navy)' : 'rgba(28,21,16,0.55)',
          backgroundColor: active ? 'rgba(184,149,58,0.08)' : undefined,
        }}
      >
        <Icon size={17} style={active ? { color: 'var(--gold)' } : {}} />
        {label}
      </Link>
    )
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-60 min-h-screen border-r shrink-0"
        style={{ backgroundColor: 'var(--cream)', borderColor: 'var(--cream-dark)' }}
      >
        {/* Logo */}
        <div
          className="px-5 py-4 border-b flex items-center gap-3"
          style={{ borderColor: 'var(--cream-dark)' }}
        >
          <Link href="/" className="flex items-center gap-3">
            <span
              className="flex items-center justify-center text-xs font-bold shrink-0"
              style={{
                width: 26, height: 26,
                backgroundColor: 'var(--navy)',
                color: 'var(--gold)',
                fontFamily: 'var(--font-playfair)',
                fontSize: 13,
              }}
            >
              R
            </span>
            <div>
              <p className="text-xs font-semibold" style={{ color: 'var(--navy)', letterSpacing: '0.06em' }}>
                ROCCA
              </p>
              <p className="text-xs" style={{ color: 'var(--stone)', fontSize: 10, letterSpacing: '0.06em' }}>
                AMMINISTRAZIONI
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 py-4 space-y-0.5">
          {items.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        {/* User info + logout */}
        <div className="border-t pb-2" style={{ borderColor: 'var(--cream-dark)' }}>
          <div className="flex items-center gap-3 px-4 py-3">
            <div
              className="w-8 h-8 flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ backgroundColor: 'var(--navy)' }}
            >
              {getInitials(profile.full_name ?? profile.email ?? '?')}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--navy)' }}>
                {profile.full_name ?? profile.email}
              </p>
              <p className="text-xs truncate" style={{ color: 'var(--stone)', fontSize: 10 }}>
                {isAdmin ? 'Amministratore' : `Interno ${profile.unit ?? '-'}`}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm transition-colors hover:bg-red-50 hover:text-red-600"
            style={{ color: 'rgba(28,21,16,0.4)', borderRadius: 0 }}
          >
            <LogOut size={15} />
            Esci
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-40 border-b flex items-center justify-between px-4 h-14"
        style={{ backgroundColor: 'var(--cream)', borderColor: 'var(--cream-dark)' }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="flex items-center justify-center text-xs font-bold"
            style={{ width: 24, height: 24, backgroundColor: 'var(--navy)', color: 'var(--gold)', fontFamily: 'var(--font-playfair)', fontSize: 12 }}
          >
            R
          </span>
          <span className="text-xs font-semibold" style={{ color: 'var(--navy)', letterSpacing: '0.08em' }}>
            ROCCA
          </span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2" style={{ borderRadius: 0 }}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 pt-14"
          style={{ backgroundColor: 'var(--cream)' }}
        >
          <nav className="py-4 space-y-0.5">
            {items.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 mt-4"
              style={{ borderRadius: 0 }}
            >
              <LogOut size={15} />
              Esci
            </button>
          </nav>
        </div>
      )}
    </>
  )
}
