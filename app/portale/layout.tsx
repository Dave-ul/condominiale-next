import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/supabase/session'
import { createClient } from '@/lib/supabase/server'
import { PortalNav } from '@/components/portal/PortalNav'

export default async function PortaleLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await getSession()

  if (!user || !profile) redirect('/auth')

  // Senza sessione aal2 il database tratta l'admin come un residente
  // (get_my_role): lo avvisiamo invece di mostrargli pannelli vuoti.
  let adminWithoutMfa = false
  if (profile.role === 'admin') {
    const supabase = await createClient()
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    adminWithoutMfa = aal?.currentLevel !== 'aal2'
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>
      <PortalNav profile={profile} />
      <main className="flex-1 lg:pt-0 pt-14 overflow-auto">
        {adminWithoutMfa && (
          <div className="m-6 mb-0 p-4 border border-amber-300 bg-amber-50 text-sm text-amber-900">
            Le funzioni di amministrazione sono disabilitate finché non attivi la verifica in due passaggi.{' '}
            <Link href="/portale/account" className="underline font-medium">Attivala dalla pagina Account</Link>.
          </div>
        )}
        {children}
      </main>
    </div>
  )
}
