'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'

// Allineare a Auth → Providers → Email → "Minimum password length" in Supabase.
const MIN_PASSWORD_LENGTH = 12

export function AccountClient({ email }: { email: string }) {
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const supabase = createClient()

  const inputClass = 'w-full px-4 py-2.5 border border-[var(--cream-dark)] bg-white text-sm focus:outline-none focus:border-[var(--navy)] transition-colors'

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setAlert(null)
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password })
    setSaving(false)
    if (error) {
      setAlert({ type: 'error', message: 'Impossibile aggiornare la password: ' + error.message })
    } else {
      setPassword('')
      setAlert({ type: 'success', message: 'Password aggiornata.' })
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--navy)' }}>
        Il mio account
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--ink)', opacity: 0.55 }}>{email}</p>

      {alert && <Alert type={alert.type} message={alert.message} className="mb-4" />}

      <section className="p-5 border bg-white" style={{ borderColor: 'var(--cream-dark)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--navy)' }}>Imposta o cambia password</h2>
        <form onSubmit={savePassword} className="space-y-4">
          <input
            type="password"
            autoComplete="new-password"
            className={inputClass}
            required
            minLength={MIN_PASSWORD_LENGTH}
            placeholder={`Almeno ${MIN_PASSWORD_LENGTH} caratteri`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" loading={saving}>Salva password</Button>
        </form>
      </section>
    </div>
  )
}
