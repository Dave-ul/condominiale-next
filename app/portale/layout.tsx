import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PortalNav } from '@/components/portal/PortalNav'

export default async function PortaleLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    const { data: newProfile } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name ?? null,
        unit: user.user_metadata?.unit ?? null,
        phone: user.user_metadata?.phone ?? null,
        role: 'resident',
      })
      .select()
      .single()

    if (!newProfile) redirect('/auth')

    return (
      <div className="flex min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>
        <PortalNav profile={newProfile} />
        <main className="flex-1 lg:pt-0 pt-14 overflow-auto">{children}</main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>
      <PortalNav profile={profile} />
      <main className="flex-1 lg:pt-0 pt-14 overflow-auto">{children}</main>
    </div>
  )
}
