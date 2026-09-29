'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft } from 'lucide-react'

// Niente registrazione pubblica: l'accesso al portale è riservato agli aventi
// diritto (art. 71-ter disp. att. c.c.), che l'amministratore invita dalla
// dashboard Supabase (Authentication → Invite user). L'invito e il recupero
// password portano a /portale/account, dove l'utente imposta la password.
export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'reset'>('login')
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [form, setForm] = useState({ email: '', password: '' })
  const router = useRouter()
  const supabase = createClient()

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAlert(null)
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })
    setLoading(false)
    if (error) {
      setAlert({ type: 'error', message: 'Email o password non corretti.' })
    } else {
      router.push('/portale')
      router.refresh()
    }
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAlert(null)
    await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: `${window.location.origin}/api/auth/callback?next=/portale/account`,
    })
    setLoading(false)
    // Stesso messaggio in ogni caso: non riveliamo se l'email è registrata.
    setAlert({
      type: 'success',
      message: 'Se l\'indirizzo è registrato riceverai un\'email con il link per impostare una nuova password.',
    })
  }

  const inputClass =
    'w-full px-4 py-2.5 border border-[var(--cream-dark)] bg-white text-sm focus:outline-none focus:border-[var(--navy)] transition-colors'

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ backgroundColor: 'var(--cream)' }}
    >
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm hover:text-[var(--navy)] transition-colors"
            style={{ color: 'var(--ink)', opacity: 0.6 }}
          >
            <ArrowLeft size={16} />
            Torna al sito
          </Link>
        </div>

        <div className="bg-white border-2 border-[var(--navy)] overflow-hidden">
          <div className="px-8 pt-8 pb-2">
            <p
              className="text-2xl font-bold mb-1"
              style={{ fontFamily: 'var(--font-playfair)', color: 'var(--navy)' }}
            >
              Portale Condominiale
            </p>
            <p className="text-sm" style={{ color: 'var(--ink)', opacity: 0.55 }}>
              Rocca Amministrazioni
            </p>
          </div>

          <div className="px-8 py-6">
            {alert && <Alert type={alert.type} message={alert.message} className="mb-4" />}

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-[var(--navy)] mb-1.5 block">Email</label>
                  <input type="email" className={inputClass} required value={form.email} onChange={set('email')} />
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--navy)] mb-1.5 block">Password</label>
                  <input type="password" className={inputClass} required value={form.password} onChange={set('password')} />
                </div>
                <Button type="submit" loading={loading} className="w-full mt-2">
                  Accedi
                </Button>
                <button
                  type="button"
                  onClick={() => { setMode('reset'); setAlert(null) }}
                  className="text-xs underline"
                  style={{ color: 'var(--ink)', opacity: 0.6 }}
                >
                  Password dimenticata?
                </button>
              </form>
            ) : (
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-[var(--navy)] mb-1.5 block">Email</label>
                  <input type="email" className={inputClass} required value={form.email} onChange={set('email')} />
                </div>
                <Button type="submit" loading={loading} className="w-full mt-2">
                  Invia link
                </Button>
                <button
                  type="button"
                  onClick={() => { setMode('login'); setAlert(null) }}
                  className="text-xs underline"
                  style={{ color: 'var(--ink)', opacity: 0.6 }}
                >
                  Torna all&apos;accesso
                </button>
              </form>
            )}

            <p className="text-xs mt-6" style={{ color: 'var(--ink)', opacity: 0.6 }}>
              L&apos;accesso è riservato ai condòmini e agli aventi diritto: le credenziali sono
              rilasciate dall&apos;amministratore su invito. Consulta l&apos;
              <Link href="/privacy" target="_blank" className="underline">informativa privacy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
