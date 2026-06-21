'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { paymentStatusBadge } from '@/components/ui/badge'
import { CreditCard, Upload, CheckCircle, Plus, ExternalLink } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Payment } from '@/lib/supabase/types'

type PaymentWithProfile = Payment & {
  profiles?: { full_name: string | null; unit: string | null; email: string | null } | null
}

export function PaymentsClient({
  payments: initial,
  isAdmin,
  currentUserId,
}: {
  payments: PaymentWithProfile[]
  isAdmin: boolean
  currentUserId: string
}) {
  const [payments, setPayments] = useState(initial)
  const [receiptModal, setReceiptModal] = useState<string | null>(null)
  const [newModal, setNewModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [newForm, setNewForm] = useState({ resident_id: '', description: '', amount: '', due_date: '', stripe_link: '' })
  const supabase = createClient()

  const inputClass = 'w-full px-4 py-2.5 border border-[var(--cream-dark)] bg-white text-sm focus:outline-none focus:border-[var(--navy)] transition-colors'

  const uploadReceipt = async () => {
    if (!receiptFile || !receiptModal) return
    setUploading(true)
    setAlert(null)
    // Date.now() runs in an event handler (not during render), where a unique
    // upload key is exactly what we want; the purity rule misfires here.
    // eslint-disable-next-line react-hooks/purity
    const path = `${currentUserId}/${Date.now()}-${receiptFile.name}`
    const { error: uploadErr } = await supabase.storage.from('ricevute').upload(path, receiptFile)
    if (uploadErr) {
      setAlert({ type: 'error', message: 'Errore nel caricamento.' })
      setUploading(false)
      return
    }
    const { error: dbErr } = await supabase
      .from('payments')
      .update({ status: 'paid', receipt_path: path })
      .eq('id', receiptModal)
    setUploading(false)
    if (dbErr) {
      setAlert({ type: 'error', message: 'Errore nell\'aggiornamento.' })
    } else {
      setPayments(payments.map((p) => p.id === receiptModal ? { ...p, status: 'paid', receipt_path: path } : p))
      setReceiptModal(null)
      setReceiptFile(null)
    }
  }

  const verifyPayment = async (id: string) => {
    const { error } = await supabase.from('payments').update({ status: 'verified' }).eq('id', id)
    if (!error) {
      setPayments(payments.map((p) => p.id === id ? { ...p, status: 'verified' } : p))
    }
  }

  const createPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setAlert(null)
    const { data, error } = await supabase
      .from('payments')
      .insert({
        resident_id: newForm.resident_id,
        description: newForm.description,
        amount: parseFloat(newForm.amount),
        due_date: newForm.due_date,
        stripe_payment_link: newForm.stripe_link || null,
      })
      .select(`*, profiles!payments_resident_id_fkey(full_name, unit, email)`)
      .single()
    if (error || !data) {
      setAlert({ type: 'error', message: 'Errore nella creazione.' })
    } else {
      setPayments([data as PaymentWithProfile, ...payments])
      setNewModal(false)
      setNewForm({ resident_id: '', description: '', amount: '', due_date: '', stripe_link: '' })
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--navy)' }}>
            Pagamenti
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--ink)', opacity: 0.55 }}>
            {payments.length} voce/i
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setNewModal(true)} size="sm">
            <Plus size={16} /> Nuovo pagamento
          </Button>
        )}
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-16">
          <CreditCard size={40} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm" style={{ color: 'var(--ink)', opacity: 0.5 }}>Nessun pagamento</p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((p) => (
            <div
              key={p.id}
              className="p-5 border bg-white"
              style={{ borderColor: 'var(--cream-dark)' }}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  {isAdmin && p.profiles && (
                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--gold)' }}>
                      {p.profiles.full_name ?? p.profiles.email} {p.profiles.unit ? `- Int. ${p.profiles.unit}` : ''}
                    </p>
                  )}
                  <p className="font-medium" style={{ color: 'var(--navy)' }}>{p.description}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--ink)', opacity: 0.5 }}>
                    Scadenza: {formatDate(p.due_date)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-lg mb-1" style={{ color: 'var(--navy)' }}>
                    {formatCurrency(p.amount)}
                  </p>
                  {paymentStatusBadge(p.status)}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {p.stripe_payment_link && p.status === 'pending' && !isAdmin && (
                  <a href={p.stripe_payment_link} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="primary">
                      <ExternalLink size={14} /> Paga online
                    </Button>
                  </a>
                )}
                {!isAdmin && p.status === 'pending' && (
                  <Button size="sm" variant="outline" onClick={() => setReceiptModal(p.id)}>
                    <Upload size={14} /> Carica ricevuta
                  </Button>
                )}
                {isAdmin && p.status === 'paid' && (
                  <Button size="sm" variant="outline" onClick={() => verifyPayment(p.id)}>
                    <CheckCircle size={14} /> Verifica
                  </Button>
                )}
                {p.receipt_path && isAdmin && (
                  <button
                    className="text-xs underline"
                    style={{ color: 'var(--gold)' }}
                    onClick={async () => {
                      const { data } = await supabase.storage.from('ricevute').createSignedUrl(p.receipt_path!, 60)
                      if (data?.signedUrl) window.open(data.signedUrl, '_blank')
                    }}
                  >
                    Vedi ricevuta
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!receiptModal} onClose={() => { setReceiptModal(null); setReceiptFile(null); setAlert(null) }} title="Carica ricevuta">
        {alert && <Alert type={alert.type} message={alert.message} className="mb-4" />}
        <div
          className="border-2 border-dashed p-8 text-center cursor-pointer hover:border-[var(--gold)] transition-colors mb-4"
          style={{ borderColor: receiptFile ? 'var(--gold)' : 'var(--cream-dark)' }}
          onClick={() => document.getElementById('receipt-file')?.click()}
        >
          <Upload size={28} className="mx-auto mb-2" style={{ color: 'var(--gold)' }} />
          <p className="text-sm" style={{ color: 'var(--ink)', opacity: 0.6 }}>
            {receiptFile ? receiptFile.name : 'Clicca per selezionare la ricevuta (PDF)'}
          </p>
        </div>
        <input id="receipt-file" type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
          onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)} />
        <Button loading={uploading} className="w-full" onClick={uploadReceipt} disabled={!receiptFile}>
          Carica ricevuta
        </Button>
      </Modal>

      <Modal open={newModal} onClose={() => setNewModal(false)} title="Nuovo pagamento">
        {alert && <Alert type={alert.type} message={alert.message} className="mb-4" />}
        <form onSubmit={createPayment} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[var(--navy)] mb-1.5 block">ID Residente *</label>
            <input className={inputClass} placeholder="UUID del residente" required value={newForm.resident_id} onChange={(e) => setNewForm({ ...newForm, resident_id: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--navy)] mb-1.5 block">Descrizione *</label>
            <input className={inputClass} required value={newForm.description} onChange={(e) => setNewForm({ ...newForm, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[var(--navy)] mb-1.5 block">Importo (EUR) *</label>
              <input type="number" step="0.01" className={inputClass} required value={newForm.amount} onChange={(e) => setNewForm({ ...newForm, amount: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--navy)] mb-1.5 block">Scadenza *</label>
              <input type="date" className={inputClass} required value={newForm.due_date} onChange={(e) => setNewForm({ ...newForm, due_date: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--navy)] mb-1.5 block">Link Stripe (opz.)</label>
            <input type="url" className={inputClass} value={newForm.stripe_link} onChange={(e) => setNewForm({ ...newForm, stripe_link: e.target.value })} />
          </div>
          <Button type="submit" className="w-full">Crea pagamento</Button>
        </form>
      </Modal>
    </div>
  )
}
