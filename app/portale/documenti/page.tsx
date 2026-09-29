import { createClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/supabase/session'
import { redirect } from 'next/navigation'
import { DocumentsClient } from './DocumentsClient'

export default async function DocumentiPage() {
  const { user, profile } = await getSession()
  if (!user || !profile) redirect('/auth')

  const isAdmin = profile.role === 'admin'
  const supabase = await createClient()
  const [{ data: documents }, { data: condomini }] = await Promise.all([
    supabase.from('documents').select('*').order('created_at', { ascending: false }),
    isAdmin ? supabase.from('condomini').select('*').order('nome') : Promise.resolve({ data: null }),
  ])

  return <DocumentsClient documents={documents ?? []} isAdmin={isAdmin} condomini={condomini ?? []} />
}
