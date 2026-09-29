import { redirect } from 'next/navigation'
import { getSession } from '@/lib/supabase/session'
import { AccountClient } from './AccountClient'

export default async function AccountPage() {
  const { user, profile } = await getSession()
  if (!user || !profile) redirect('/auth')

  return <AccountClient userId={user.id} email={user.email ?? ''} />
}
