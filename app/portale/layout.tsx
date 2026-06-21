import { redirect } from 'next/navigation'
import { getSession } from '@/lib/supabase/session'
import { PortalNav } from '@/components/portal/PortalNav'

export default async function PortaleLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await getSession()

  if (!user || !profile) redirect('/auth')

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>
      <PortalNav profile={profile} />
      <main className="flex-1 lg:pt-0 pt-14 overflow-auto">{children}</main>
    </div>
  )
}
