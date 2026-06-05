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
  { href: '/portale', Icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/portale/documenti', Icon: FileText, label: 'Documenti' },
  { href: '/portale/pagamenti', Icon: CreditCard, label: 'Pagamenti' },
  { href: '/portale/richieste', Icon: MessageSquare, label: 'Richieste' },
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
          'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
          active
            ? 'text-[var(--navy)]'
            : 'hover:bg-[var(--cream-dark)]'
        )}
        style={
          active
            ? { backgroundColor: 'rgba(201,169,110,0.15)', color: 'var(--navy)' }
            : { color: 'rgba(26,20,16,0.6)' }
        }
      >
        <Icon size={18} style={active ? { color: 'var(--gold)' } : {}} />
        {label}
      </Link>
    )
  }

  return (
    <>
      <aside
        className="hidden lg:flex flex-col w-64 min-h-screen border-r shrink-0"
        style={{ backgroundColor: 'var(--cream)', borderColor: 'var(--cream-dark)' }}
      >
        <div className="px-5 py-5 border-b" style={{ borderColor: 'var(--cream-dark)' }}>
          <Link href="/">
            <p className="font-bold text-lg" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--gold)' }}>
              Rocca
            </p>
            <p className="text-xs" style={{ color: 'var(--ink)', opacity: 0.5 }}>
              Amministrazioni
            </p>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {items.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        <div className="px-3 py-4 border-t" style={{ borderColor: 'var(--cream-dark)' }}>
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ backgroundColor: 'var(--navy)' }}
            >
              {getInitials(profile.full_name ?? profile.email ?? '?')}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--navy)' }}>
                {profile.full_name ?? profile.email}
              </p>
              <p className="text-xs truncate" style={{ color: 'var(--ink)', opacity: 0.5 }}>
                {isAdmin ? 'Amministratore' : `Interno ${profile.unit ?? '-'}`}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm transition-colors hover:bg-red-50 hover:text-red-600"
            style={{ color: 'rgba(26,20,16,0.5)' }}
          >
            <LogOut size={16} />
            Esci
          </button>
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 border-b flex items-center justify-between px-4 h-14" style={{ backgroundColor: 'var(--cream)', borderColor: 'var(--cream-dark)' }}>
        <p className="font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--gold)' }}>
          Rocca
        </p>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 pt-14" style={{ backgroundColor: 'var(--cream)' }}>
          <nav className="px-3 py-4 space-y-1">
            {items.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm text-red-500 mt-4"
            >
              <LogOut size={16} />
              Esci
            </button>
          </nav>
        </div>
      )}
    </>
  )
}
