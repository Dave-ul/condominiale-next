import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, CreditCard, MessageSquare, ArrowRight, AlertCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default async function PortaleDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/auth')

  const isAdmin = profile.role === 'admin'

  const [{ data: docs }, { data: payments }, { data: requests }] = await Promise.all([
    supabase.from('documents').select('id', { count: 'exact' }).limit(1),
    isAdmin
      ? supabase.from('payments').select('*').in('status', ['pending', 'paid'])
      : supabase.from('payments').select('*').eq('resident_id', user.id).eq('status', 'pending'),
    isAdmin
      ? supabase.from('requests').select('id', { count: 'exact' }).eq('status', 'aperta')
      : supabase.from('requests').select('id', { count: 'exact' }).eq('resident_id', user.id).eq('status', 'aperta'),
  ])

  const pendingAmount = payments?.reduce((sum, p) => sum + Number(p.amount), 0) ?? 0
  const pendingCount  = payments?.length ?? 0
  const openRequests  = requests?.length ?? 0
  const docCount      = docs?.length ?? 0

  const cards = [
    {
      href: '/portale/documenti',
      Icon: FileText,
      label: 'Documenti',
      value: isAdmin ? 'Archivio' : `${docCount} disponibili`,
      sub: isAdmin ? 'Gestione documenti' : 'Accedi ai documenti',
      alert: false,
    },
    {
      href: '/portale/pagamenti',
      Icon: CreditCard,
      label: 'Pagamenti',
      value: isAdmin ? `${pendingCount} da verificare` : formatCurrency(pendingAmount),
      sub: isAdmin ? 'Richieste in attesa' : pendingCount > 0 ? `${pendingCount} pagamento/i in attesa` : 'Tutto in ordine',
      alert: !isAdmin && pendingCount > 0,
    },
    {
      href: '/portale/richieste',
      Icon: MessageSquare,
      label: 'Richieste',
      value: `${openRequests} aperte`,
      sub: isAdmin ? 'Richieste da gestire' : 'Le tue segnalazioni',
      alert: openRequests > 0,
    },
  ]

  return (
    <div className="p-6 lg:p-10 max-w-4xl">

      {/* Page header */}
      <div className="mb-10 pb-6 border-b" style={{ borderColor: 'var(--cream-dark)' }}>
        <div className="flex items-center gap-3 mb-2">
          <span style={{ width: 3, height: 22, backgroundColor: 'var(--gold)', display: 'block', flexShrink: 0 }} />
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-playfair)', color: 'var(--navy)' }}
          >
            {isAdmin
              ? 'Pannello Amministratore'
              : `Benvenuto${profile.full_name ? ', ' + profile.full_name.split(' ')[0] : ''}`}
          </h1>
        </div>
        <p
          className="text-xs uppercase tracking-widest ml-6"
          style={{ color: 'var(--stone)', letterSpacing: '0.18em' }}
        >
          {isAdmin ? 'Gestione condominio' : `Interno ${profile.unit ?? '-'}`}
        </p>
      </div>

      {/* Bento card grid — gap-px for hairline separators */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-px"
        style={{ backgroundColor: 'var(--cream-dark)' }}
      >
        {cards.map(({ href, Icon, label, value, sub, alert }) => (
          <Link
            key={href}
            href={href}
            className="group relative flex flex-col p-6 transition-colors duration-150"
            style={{ backgroundColor: 'white' }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--cream)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'white'
            }}
          >
            {/* Top gold accent bar */}
            <div style={{ height: 3, backgroundColor: 'var(--gold)', marginBottom: 20, opacity: 0.7 }} />

            {alert && (
              <span className="absolute top-5 right-5">
                <AlertCircle size={15} className="text-amber-500" />
              </span>
            )}

            {/* Square icon */}
            <div
              className="w-10 h-10 flex items-center justify-center mb-4"
              style={{ backgroundColor: 'var(--navy)' }}
            >
              <Icon size={20} style={{ color: 'var(--gold)' }} />
            </div>

            <p
              className="text-xs font-medium uppercase mb-2"
              style={{ color: 'var(--stone)', letterSpacing: '0.18em' }}
            >
              {label}
            </p>
            <p className="text-xl font-bold mb-1" style={{ color: 'var(--navy)', fontFamily: 'var(--font-playfair)' }}>
              {value}
            </p>
            <p className="text-xs" style={{ color: 'var(--stone)' }}>
              {sub}
            </p>

            <ArrowRight
              size={15}
              className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: 'var(--gold)' }}
            />
          </Link>
        ))}
      </div>

    </div>
  )
}
