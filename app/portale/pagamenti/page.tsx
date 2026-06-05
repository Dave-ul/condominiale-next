import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PaymentsClient } from './PaymentsClient'

export default async function PagamentiPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/auth')

  const isAdmin = profile.role === 'admin'

  const query = supabase
    .from('payments')
    .select(`*, profiles!payments_resident_id_fkey(full_name, unit, email)`)
    .order('due_date', { ascending: false })

  const { data: payments } = isAdmin
    ? await query
    : await query.eq('resident_id', user.id)

  return (
    <PaymentsClient
      payments={payments ?? []}
      isAdmin={isAdmin}
      currentUserId={user.id}
    />
  )
}
