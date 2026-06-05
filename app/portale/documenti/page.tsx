import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DocumentsClient } from './DocumentsClient'

export default async function DocumentiPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/auth')

  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false })

  return <DocumentsClient documents={documents ?? []} isAdmin={profile.role === 'admin'} />
}
