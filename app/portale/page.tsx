import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, CreditCard, MessageSquare, AlertCircle, ArrowRight } from 'lucide-react'
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
  const pendingCount = payments?.length ?? 0
  const openRequests = requests?.length ?? 0
  const docCount = docs?.length ?? 0

  const cards = [
    {
      href: '/portale/documenti',
      Icon: FileText,
      label: 'Documenti',
      value: isAdmin ? 'Archivio' : `${docCount} disponibili`,
      sub: isAdmin ? 'Gestione documenti' : 'Accedi ai documenti',
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
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-1"
          style={{ fontFamily: 'var(--font-playfair)', color: 'var(--navy)' }}
        >
          {isAdmin ? 'Pannello Amministratore' : `Benvenuto${profile.full_name ? ', ' + profile.full_name.split(' ')[0] : ''}`}
        </h1>
        <p className="text-sm" style={{ color: 'var(--ink)', opacity: 0.55 }}>
          {isAdmin ? 'Gestione condominio' : `Interno ${profile.unit ?? '-'}`}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {cards.map(({ href, Icon, label, value, sub, alert }) => (
          <Link
            key={href}
            href={href}
            className="group p-6 rounded-2xl border hover:shadow-md transition-all duration-200 relative overflow-hidden"
            style={{ backgroundColor: 'white', borderColor: 'var(--cream-dark)' }}
          >
            {alert && (
              <span className="absolute top-4 right-4">
                <AlertCircle size={16} className="text-amber-500" />
              </span>
            )}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(201,169,110,0.12)' }}
            >
              <Icon size={22} style={{ color: 'var(--gold)' }} />
            </div>
            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--ink)', opacity: 0.45 }}>
              {label}
            </p>
            <p className="text-xl font-bold mb-0.5" style={{ color: 'var(--navy)' }}>
              {value}
            </p>
            <p className="text-xs" style={{ color: 'var(--ink)', opacity: 0.55 }}>
              {sub}
            </p>
            <ArrowRight
              size={16}
              className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: 'var(--gold)' }}
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
