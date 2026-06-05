import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { RequestsClient } from './RequestsClient'

export default async function RichiestePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/auth')

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
