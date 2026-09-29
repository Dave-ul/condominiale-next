'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'

type Enrollment = { factorId: string; qrCode: string; secret: string }

// Verifica in due passaggi con app di autenticazione (TOTP). Per
// l'amministratore è obbligatoria: senza sessione aal2 il database non gli
// concede i permessi di admin (migration 20260929124000_admin_richiede_mfa.sql).
export function MfaSettings({ isAdmin }: { isAdmin: boolean }) {
  const [factorId, setFactorId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.mfa.listFactors().then(({ data }) => {
      setFactorId(data?.totp[0]?.id ?? null)
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al primo render
  }, [])

  const startEnroll = async () => {
    setAlert(null)
    setBusy(true)
    // Un'attivazione lasciata a metà resta come fattore non verificato e
    // bloccherebbe la nuova: la rimuoviamo prima di ricominciare.
    const { data: factors } = await supabase.auth.mfa.listFactors()
    for (const f of factors?.all ?? []) {
      if (f.factor_type === 'totp' && f.status !== 'verified') {
        await supabase.auth.mfa.unenroll({ factorId: f.id })
      }
    }
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'Portale condominiale',
    })
    setBusy(false)
    if (error || !data) {
      setAlert({ type: 'error', message: 'Impossibile avviare l\'attivazione: ' + (error?.message ?? 'errore sconosciuto') })
      return
    }
    setEnrollment({ factorId: data.id, qrCode: data.totp.qr_code, secret: data.totp.secret })
  }

  const confirmEnroll = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!enrollment) return
    setAlert(null)
    setBusy(true)
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: enrollment.factorId, code: code.trim() })
    setBusy(false)
    if (error) {
      setAlert({ type: 'error', message: 'Codice non valido o scaduto: riprova con quello attuale.' })
      return
    }
    setEnrollment(null)
    setCode('')
    setFactorId(enrollment.factorId)
    setAlert({ type: 'success', message: 'Verifica in due passaggi attivata.' })
  }

  const disable = async () => {
    if (!factorId) return
    if (!window.confirm('Disattivare la verifica in due passaggi?')) return
    setAlert(null)
    setBusy(true)
    const { error } = await supabase.auth.mfa.unenroll({ factorId })
    setBusy(false)
    if (error) {
      setAlert({ type: 'error', message: 'Disattivazione non riuscita: ' + error.message })
      return
    }
    setFactorId(null)
    setAlert({ type: 'success', message: 'Verifica in due passaggi disattivata.' })
  }

  const inputClass = 'w-full px-4 py-2.5 border border-[var(--cream-dark)] bg-white text-sm focus:outline-none focus:border-[var(--navy)] transition-colors'

  return (
    <section className="p-5 border bg-white mt-6" style={{ borderColor: 'var(--cream-dark)' }}>
      <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--navy)' }}>Verifica in due passaggi</h2>
      <p className="text-sm mb-4" style={{ color: 'var(--ink)', opacity: 0.7 }}>
        Oltre alla password, all&apos;accesso ti verrà chiesto un codice generato da un&apos;app di autenticazione
        (ad esempio Google Authenticator, Microsoft Authenticator, Aegis o 2FAS).
        {isAdmin && <strong> Per l&apos;amministratore è obbligatoria: senza, le funzioni di amministrazione restano disabilitate.</strong>}
      </p>

      {alert && <Alert type={alert.type} message={alert.message} className="mb-4" />}

      {loading ? null : factorId ? (
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-sm font-medium text-green-700">Attiva</p>
          <Button variant="outline" size="sm" onClick={disable} loading={busy}>Disattiva</Button>
        </div>
      ) : enrollment ? (
        <form onSubmit={confirmEnroll} className="space-y-4">
          <p className="text-sm" style={{ color: 'var(--ink)' }}>
            1. Inquadra il codice QR con l&apos;app di autenticazione.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element -- data URI SVG generato da Supabase */}
          <img src={enrollment.qrCode} alt="Codice QR per l'app di autenticazione" width={180} height={180} className="border" />
          <p className="text-xs break-all" style={{ color: 'var(--ink)', opacity: 0.7 }}>
            Se non puoi inquadrarlo, inserisci a mano questa chiave: <code>{enrollment.secret}</code>
          </p>
          <label className="text-sm block" style={{ color: 'var(--ink)' }}>
            2. Scrivi il codice a 6 cifre mostrato dall&apos;app:
            <input
              className={`${inputClass} mt-1.5 max-w-[10rem] tracking-widest`}
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </label>
          <div className="flex gap-3">
            <Button type="submit" loading={busy}>Conferma</Button>
            <Button type="button" variant="outline" onClick={() => { setEnrollment(null); setCode('') }}>Annulla</Button>
          </div>
        </form>
      ) : (
        <Button onClick={startEnroll} loading={busy}>Attiva</Button>
      )}
    </section>
  )
}
