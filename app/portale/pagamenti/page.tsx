import { createClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/supabase/session'
import { redirect } from 'next/navigation'
import { PaymentsClient } from './PaymentsClient'

export default async function PagamentiPage() {
  const { user, profile } = await getSession()
  if (!user || !profile) redirect('/auth')

  const isAdmin = profile.role === 'admin'
  const supabase = await createClient()

  const query = supabase
    .from('payments')
    .select(`*, profiles!payments_resident_id_fkey(full_name, unit, email)`)
    .order('due_date', { ascending: false })

  const [{ data: payments }, { data: residents }] = await Promise.all([
    isAdmin ? query : query.eq('resident_id', user.id),
    isAdmin
      ? supabase.from('profiles').select('id, full_name, unit').eq('role', 'resident').order('full_name')
      : Promise.resolve({ data: null }),
  ])

  return (
    <PaymentsClient
      payments={payments ?? []}
      isAdmin={isAdmin}
      currentUserId={user.id}
      residents={residents ?? []}
    />
  )
}
