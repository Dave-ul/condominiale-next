'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { requestStatusBadge } from '@/components/ui/badge'
import { MessageSquare, Plus } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Request } from '@/lib/supabase/types'

type RequestWithProfile = Request & {
  profiles?: { full_name: string | null; unit: string | null; email: string | null } | null
}

const categories = ['guasto', 'manutenzione', 'documento', 'informazione', 'altro']
const statuses: Array<Request['status']> = ['aperta', 'in_corso', 'chiusa']

const statusLabels: Record<string, string> = {
  aperta: 'Aperta',
  in_corso: 'In corso',
  chiusa: 'Chiusa',
}

export function RequestsClient({
  requests: initial,
  isAdmin,
  currentUserId,
}: {
  requests: RequestWithProfile[]
  isAdmin: boolean
  currentUserId: string
}) {
  const [requests, setRequests] = useState(initial)
  const [modalOpen, setModalOpen] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('tutti')
  const [form, setForm] = useState({ title: '', description: '', category: 'guasto' })
  const supabase = createClient()

  const inputClass = 'w-full px-4 py-2.5 rounded-lg border border-[var(--cream-dark)] bg-white text-sm focus:outline-none focus:border-[var(--gold)] transition-colors'

  const filtered = filterStatus === 'tutti' ? requests : requests.filter((r) => r.status === filterStatus)

  const createRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setAlert(null)
    const { data, error } = await supabase
      .from('requests')
      .insert({
        resident_id: currentUserId,
        title: form.title,
        description: form.description,
        category: form.category,
      })
      .select(`*, profiles!requests_resident_id_fkey(full_name, unit, email)`)
      .single()
    setSubmitting(false)
    if (error || !data) {
      setAlert({ type: 'error', message: 'Errore nell\'invio della richiesta.' })
    } else {
      setRequests([data as RequestWithProfile, ...requests])
      setModalOpen(false)
      setForm({ title: '', description: '', category: 'guasto' })
    }
  }

  const updateStatus = async (id: string, status: Request['status']) => {
    const { error } = await supabase.from('requests').update({ status }).eq('id', id)
    if (!error) {
      setRequests(requests.map((r) => (r.id === id ? { ...r, status } : r)))
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--navy)' }}>
            Richieste
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--ink)', opacity: 0.55 }}>
            {requests.length} richiesta/e totali
          </p>
        </div>
        {!isAdmin && (
          <Button onClick={() => setModalOpen(true)} size="sm">
            <Plus size={16} /> Nuova richiesta
          </Button>
        )}
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {['tutti', ...statuses].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize"
            style={{
              backgroundColor: filterStatus === s ? 'var(--navy)' : 'white',
              color: filterStatus === s ? 'white' : 'var(--ink)',
              border: `1px solid ${filterStatus === s ? 'var(--navy)' : 'var(--cream-dark)'}`,
            }}
          >
            {s === 'tutti' ? 'Tutte' : statusLabels[s]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquare size={40} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm" style={{ color: 'var(--ink)', opacity: 0.5 }}>Nessuna richiesta</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="p-5 rounded-2xl border bg-white"
              style={{ borderColor: 'var(--cream-dark)' }}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                <div className="flex-1 min-w-0">
                  {isAdmin && r.profiles && (
                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--gold)' }}>
                      {r.profiles.full_name ?? r.profiles.email}
                      {r.profiles.unit ? ` - Int. ${r.profiles.unit}` : ''}
                    </p>
                  )}
                  <p className="font-medium" style={{ color: 'var(--navy)' }}>{r.title}</p>
                  {r.description && (
                    <p className="text-sm mt-1 line-clamp-2" style={{ color: 'var(--ink)', opacity: 0.65 }}>
                      {r.description}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0 space-y-1">
                  {requestStatusBadge(r.status)}
                  {r.category && (
                    <p className="text-xs capitalize" style={{ color: 'var(--ink)', opacity: 0.45 }}>
                      {r.category}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: 'var(--cream-dark)' }}>
                <p className="text-xs" style={{ color: 'var(--ink)', opacity: 0.4 }}>
                  {formatDate(r.created_at)}
                </p>
                {isAdmin && (
                  <select
                    className="text-xs px-3 py-1.5 rounded-lg border focus:outline-none"
                    style={{ borderColor: 'var(--cream-dark)', color: 'var(--navy)' }}
                    value={r.status}
                    onChange={(e) => updateStatus(r.id, e.target.value as Request['status'])}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{statusLabels[s]}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setAlert(null) }} title="Nuova richiesta">
        {alert && <Alert type={alert.type} message={alert.message} className="mb-4" />}
        <form onSubmit={createRequest} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[var(--navy)] mb-1.5 block">Oggetto *</label>
            <input className={inputClass} required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--navy)] mb-1.5 block">Categoria</label>
            <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--navy)] mb-1.5 block">Descrizione</label>
            <textarea
              className={inputClass}
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <Button type="submit" loading={submitting} className="w-full">
            Invia richiesta
          </Button>
        </form>
      </Modal>
    </div>
  )
}
