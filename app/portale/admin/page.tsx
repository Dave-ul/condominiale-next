import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatCurrency, getInitials } from '@/lib/utils'
import { Users, CreditCard, MessageSquare, TrendingUp } from 'lucide-react'
import type { Profile, Payment } from '@/lib/supabase/types'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: rawProfile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const profile = rawProfile as Profile | null
  if (!profile || profile.role !== 'admin') redirect('/portale')

  const [{ data: rawResidents }, { data: rawPayments }, { data: openRequests }] = await Promise.all([
    supabase.from('profiles').select('*').eq('role', 'resident').order('full_name'),
    supabase.from('payments').select('*').order('created_at', { ascending: false }),
    supabase.from('requests').select('id', { count: 'exact' }).eq('status', 'aperta'),
  ])
  const residents = rawResidents as Profile[] | null
  const payments = rawPayments as Payment[] | null

  const totalExpected = payments?.reduce((s, p) => s + Number(p.amount), 0) ?? 0
  const totalPaid = payments?.filter((p) => ['paid', 'verified'].includes(p.status)).reduce((s, p) => s + Number(p.amount), 0) ?? 0
  const pendingCount = payments?.filter((p) => p.status === 'pending').length ?? 0
  const paidCount = payments?.filter((p) => p.status === 'paid').length ?? 0
  const verifiedCount = payments?.filter((p) => p.status === 'verified').length ?? 0

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--navy)' }}>
          Pannello Amministratore
        </h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { Icon: Users, label: 'Residenti', value: residents?.length ?? 0, color: 'var(--navy)' },
          { Icon: TrendingUp, label: 'Incassi totali', value: formatCurrency(totalPaid), color: '#16a34a' },
          { Icon: CreditCard, label: 'Da incassare', value: formatCurrency(totalExpected - totalPaid), color: '#b45309' },
          { Icon: MessageSquare, label: 'Richieste aperte', value: openRequests?.length ?? 0, color: '#dc2626' },
        ].map(({ Icon, label, value, color }) => (
          <div
            key={label}
            className="p-5 border bg-white"
            style={{ borderColor: 'var(--cream-dark)' }}
          >
            <Icon size={20} className="mb-3" style={{ color }} />
            <p className="text-xl font-bold mb-0.5" style={{ color: 'var(--navy)' }}>{value}</p>
            <p className="text-xs" style={{ color: 'var(--ink)', opacity: 0.5 }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--navy)' }}>
            Residenti ({residents?.length ?? 0})
          </h2>
          <div className="space-y-2">
            {residents?.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-4 p-4 border bg-white"
                style={{ borderColor: 'var(--cream-dark)' }}
              >
                <div
                  className="w-9 h-9 flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ backgroundColor: 'var(--navy)' }}
                >
                  {getInitials(r.full_name ?? r.email ?? '?')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--navy)' }}>
                    {r.full_name ?? r.email}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--ink)', opacity: 0.5 }}>
                    {r.unit ? `Interno ${r.unit}` : 'Interno non specificato'}
                    {r.phone ? ` · ${r.phone}` : ''}
                  </p>
                </div>
                <span className="text-xs font-mono truncate max-w-[120px]" style={{ color: 'var(--ink)', opacity: 0.35 }}>
                  {r.email}
                </span>
              </div>
            ))}
            {(!residents || residents.length === 0) && (
              <p className="text-sm text-center py-8" style={{ color: 'var(--ink)', opacity: 0.4 }}>
                Nessun residente registrato
              </p>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--navy)' }}>
            Riepilogo pagamenti
          </h2>
          <div
            className="p-5 rounded-2xl border bg-white space-y-4"
            style={{ borderColor: 'var(--cream-dark)' }}
          >
            {[
              { label: 'In attesa', count: pendingCount, color: '#b45309' },
              { label: 'Pagati (da verificare)', count: paidCount, color: '#1d4ed8' },
              { label: 'Verificati', count: verifiedCount, color: '#16a34a' },
            ].map(({ label, count, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5" style={{ backgroundColor: color }} />
                  <span className="text-sm" style={{ color: 'var(--ink)' }}>{label}</span>
                </div>
                <span className="font-bold text-sm" style={{ color: 'var(--navy)' }}>{count}</span>
              </div>
            ))}
            <div className="pt-4 border-t" style={{ borderColor: 'var(--cream-dark)' }}>
              <div className="flex justify-between">
                <span className="text-sm font-medium" style={{ color: 'var(--navy)' }}>Totale incassato</span>
                <span className="font-bold" style={{ color: '#16a34a' }}>{formatCurrency(totalPaid)}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-sm" style={{ color: 'var(--ink)', opacity: 0.6 }}>Totale atteso</span>
                <span className="font-medium" style={{ color: 'var(--navy)' }}>{formatCurrency(totalExpected)}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
