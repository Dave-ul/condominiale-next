import { createClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/supabase/session'
import { redirect } from 'next/navigation'
import { RequestsClient } from './RequestsClient'

export default async function RichiestePage() {
  const { user, profile } = await getSession()
  if (!user || !profile) redirect('/auth')

  const supabase = await createClient()
  const isAdmin = profile.role === 'admin'

  const query = supabase
    .from('requests')
    .select(`*, profiles!requests_resident_id_fkey(full_name, unit, email)`)
    .order('created_at', { ascending: false })

  const { data: requests } = isAdmin
    ? await query
    : await query.eq('resident_id', user.id)

  return (
    <RequestsClient
      requests={requests ?? []}
      isAdmin={isAdmin}
      currentUserId={user.id}
    />
  )
}
