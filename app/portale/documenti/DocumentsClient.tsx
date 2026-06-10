'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { FileText, Download, Upload, Plus, FileArchive, FileSpreadsheet } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Document } from '@/lib/supabase/types'

const categoryColors: Record<string, string> = {
  verbale: 'blue',
  rendiconto: 'green',
  contratto: 'gold',
  circolare: 'orange',
  altro: 'gray',
}

const categoryIcons: Record<string, React.ElementType> = {
  verbale: FileText,
  rendiconto: FileSpreadsheet,
  contratto: FileArchive,
  circolare: FileText,
  altro: FileText,
}

export function DocumentsClient({ documents: initial, isAdmin }: { documents: Document[]; isAdmin: boolean }) {
  const [documents, setDocuments] = useState(initial)
  const [filter, setFilter] = useState('tutti')
  const [modalOpen, setModalOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [form, setForm] = useState({ name: '', category: 'verbale', file: null as File | null })
  const supabase = createClient()

  const categories = ['tutti', 'verbale', 'rendiconto', 'contratto', 'circolare', 'altro']
  const filtered = filter === 'tutti' ? documents : documents.filter((d) => d.category === filter)

  const handleDownload = async (doc: Document) => {
    const { data } = await supabase.storage.from('documenti').createSignedUrl(doc.file_path, 60)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.file) return
    setUploading(true)
    setAlert(null)

    const ext = form.file.name.split('.').pop()
    const path = `${Date.now()}.${ext}`

    const { error: uploadErr } = await supabase.storage
      .from('documenti')
      .upload(path, form.file)

    if (uploadErr) {
      setAlert({ type: 'error', message: 'Errore nel caricamento del file.' })
      setUploading(false)
      return
    }

    const { data: doc, error: dbErr } = await supabase
      .from('documents')
      .insert({ name: form.name, category: form.category, file_path: path })
      .select()
      .single()

    setUploading(false)
    if (dbErr || !doc) {
      setAlert({ type: 'error', message: 'Errore nel salvataggio del documento.' })
    } else {
      setDocuments([doc, ...documents])
      setModalOpen(false)
      setForm({ name: '', category: 'verbale', file: null })
    }
  }

  const inputClass = 'w-full px-4 py-2.5 border border-[var(--cream-dark)] bg-white text-sm focus:outline-none focus:border-[var(--navy)] transition-colors'

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--navy)' }}>
            Documenti
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--ink)', opacity: 0.55 }}>
            {documents.length} documento/i disponibili
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setModalOpen(true)} size="sm">
            <Plus size={16} /> Carica documento
          </Button>
        )}
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className="px-3 py-1.5 text-xs font-medium transition-all capitalize"
            style={{
              backgroundColor: filter === c ? 'var(--navy)' : 'white',
              color: filter === c ? 'white' : 'var(--ink)',
              border: `1px solid ${filter === c ? 'var(--navy)' : 'var(--cream-dark)'}`,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <FileText size={40} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm" style={{ color: 'var(--ink)', opacity: 0.5 }}>Nessun documento disponibile</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => {
            const Icon = categoryIcons[doc.category ?? 'altro'] ?? FileText
            return (
              <div
                key={doc.id}
                className="p-5 border bg-white hover:shadow-md transition-all duration-200 group"
                style={{ borderColor: 'var(--cream-dark)' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: 'var(--navy)' }}>
                    <Icon size={20} style={{ color: 'var(--gold)' }} />
                  </div>
                  <Badge color={(categoryColors[doc.category ?? 'altro'] as never) ?? 'gray'}>
                    {doc.category ?? 'altro'}
                  </Badge>
                </div>
                <p className="font-medium text-sm mb-1 line-clamp-2" style={{ color: 'var(--navy)' }}>
                  {doc.name}
                </p>
                <p className="text-xs mb-4" style={{ color: 'var(--ink)', opacity: 0.45 }}>
                  {formatDate(doc.created_at)}
                </p>
                <button
                  onClick={() => handleDownload(doc)}
                  className="flex items-center gap-2 text-xs font-medium transition-colors hover:text-[var(--gold)]"
                  style={{ color: 'var(--navy)' }}
                >
                  <Download size={14} /> Scarica
                </button>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Carica documento">
        {alert && <Alert type={alert.type} message={alert.message} className="mb-4" />}
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[var(--navy)] mb-1.5 block">Nome documento *</label>
            <input className={inputClass} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--navy)] mb-1.5 block">Categoria</label>
            <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {['verbale', 'rendiconto', 'contratto', 'circolare', 'altro'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--navy)] mb-1.5 block">File *</label>
            <div
              className="border-2 border-dashed p-6 text-center cursor-pointer hover:border-[var(--gold)] transition-colors"
              style={{ borderColor: form.file ? 'var(--gold)' : 'var(--cream-dark)' }}
              onClick={() => document.getElementById('doc-file')?.click()}
            >
              <Upload size={24} className="mx-auto mb-2" style={{ color: 'var(--gold)' }} />
              <p className="text-xs" style={{ color: 'var(--ink)', opacity: 0.6 }}>
                {form.file ? form.file.name : 'Clicca per selezionare un file'}
              </p>
            </div>
            <input
              id="doc-file"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              onChange={(e) => setForm({ ...form, file: e.target.files?.[0] ?? null })}
            />
          </div>
          <Button type="submit" loading={uploading} className="w-full">
            Carica documento
          </Button>
        </form>
      </Modal>
    </div>
  )
}
