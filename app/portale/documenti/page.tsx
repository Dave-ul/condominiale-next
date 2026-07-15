import { createClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/supabase/session'
import { redirect } from 'next/navigation'
import { DocumentsClient } from './DocumentsClient'

export default async function DocumentiPage() {
  const { user, profile } = await getSession()
  if (!user || !profile) redirect('/auth')

  const supabase = await createClient()
  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false })

  return <DocumentsClient documents={documents ?? []} isAdmin={profile.role === 'admin'} />
}
