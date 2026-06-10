'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft } from 'lucide-react'

type Tab = 'login' | 'register'

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>('login')
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    unit: '',
    phone: '',
  })

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAlert(null)
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.full_name,
          unit: form.unit,
          phone: form.phone,
        },
      },
    })
    setLoading(false)
    if (error) {
      setAlert({ type: 'error', message: error.message })
    } else {
      setAlert({
        type: 'success',
        message: 'Registrazione completata. Controlla la tua email per confermare.',
      })
    }
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

          <div className="flex border-b border-[var(--cream-dark)] mx-8 mt-6">
            {(['login', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setAlert(null) }}
                className="px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px"
                style={{
                  color: tab === t ? 'var(--navy)' : 'var(--ink)',
                  borderColor: tab === t ? 'var(--gold)' : 'transparent',
                  opacity: tab === t ? 1 : 0.5,
                }}
              >
                {t === 'login' ? 'Accedi' : 'Registrati'}
              </button>
            ))}
          </div>

          <div className="px-8 py-6">
            {alert && <Alert type={alert.type} message={alert.message} className="mb-4" />}

            {tab === 'login' ? (
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
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-[var(--navy)] mb-1.5 block">Nome completo *</label>
                  <input className={inputClass} required value={form.full_name} onChange={set('full_name')} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-[var(--navy)] mb-1.5 block">Interno / Scala</label>
                    <input className={inputClass} placeholder="es. 3A" value={form.unit} onChange={set('unit')} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[var(--navy)] mb-1.5 block">Telefono</label>
                    <input type="tel" className={inputClass} value={form.phone} onChange={set('phone')} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--navy)] mb-1.5 block">Email *</label>
                  <input type="email" className={inputClass} required value={form.email} onChange={set('email')} />
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--navy)] mb-1.5 block">Password *</label>
                  <input type="password" className={inputClass} required minLength={6} value={form.password} onChange={set('password')} />
                </div>
                <Button type="submit" loading={loading} className="w-full mt-2">
                  Crea account
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
