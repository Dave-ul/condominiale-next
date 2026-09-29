'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { MfaSettings } from './MfaSettings'

// Allineare a Auth → Providers → Email → "Minimum password length" in Supabase.
const MIN_PASSWORD_LENGTH = 12

export function AccountClient({ userId, email, isAdmin }: { userId: string; email: string; isAdmin: boolean }) {
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Art. 15 e 20 GDPR: copia dei propri dati in formato leggibile da macchina.
  // Filtrate per utente anche se le RLS già lo fanno: per l'admin le RLS
  // restituirebbero i dati di tutti.
  const exportData = async () => {
    setAlert(null)
    setBusy(true)
    const [profile, payments, requests] = await Promise.all([
      supabase.from('profiles').select('full_name, email, unit, phone, role, created_at, condomini(nome, indirizzo)').eq('id', userId).maybeSingle(),
      supabase.from('payments').select('description, amount, due_date, status, receipt_path, created_at').eq('resident_id', userId),
      supabase.from('requests').select('title, description, category, status, created_at').eq('resident_id', userId),
    ])
    setBusy(false)
    const failed = [profile, payments, requests].find((r) => r.error)
    if (failed) {
      setAlert({ type: 'error', message: 'Esportazione non riuscita, riprova.' })
      return
    }
    const blob = new Blob(
      [JSON.stringify({
        esportato_il: new Date().toISOString(),
        profilo: profile.data,
        pagamenti: payments.data,
        richieste: requests.data,
      }, null, 2)],
      { type: 'application/json' },
    )
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'i-miei-dati.json'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  // Art. 17 GDPR. I pagamenti restano come documentazione contabile del
  // condominio (vedi migration 20260929122000_diritti_interessato.sql).
  const deleteAccount = async () => {
    const conferma = window.prompt('Per confermare la cancellazione definitiva dell\'account scrivi CANCELLA')
    if (conferma !== 'CANCELLA') return
    setAlert(null)
    setBusy(true)
    const { error } = await supabase.rpc('delete_my_account')
    if (error) {
      setBusy(false)
      setAlert({ type: 'error', message: 'Cancellazione non riuscita: contatta l\'amministratore.' })
      return
    }
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

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

      <MfaSettings isAdmin={isAdmin} />

      <section className="p-5 border bg-white mt-6" style={{ borderColor: 'var(--cream-dark)' }}>
        <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--navy)' }}>I miei dati</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--ink)', opacity: 0.7 }}>
          Scarica una copia dei dati che ti riguardano: profilo, pagamenti e richieste.
        </p>
        <Button variant="outline" onClick={exportData} loading={busy}>Scarica i miei dati (JSON)</Button>
      </section>

      <section className="p-5 border bg-white mt-6" style={{ borderColor: 'var(--cream-dark)' }}>
        <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--navy)' }}>Cancella account</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--ink)', opacity: 0.7 }}>
          Elimina l&apos;accesso al portale, il profilo e le richieste inviate. I pagamenti e le ricevute
          restano presso l&apos;amministrazione perché documentazione contabile che la legge impone di conservare.
        </p>
        <Button variant="danger" onClick={deleteAccount} loading={busy}>Cancella il mio account</Button>
      </section>
    </div>
  )
}
