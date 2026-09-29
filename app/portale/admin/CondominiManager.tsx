'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { getInitials } from '@/lib/utils'
import type { Condominio, Profile } from '@/lib/supabase/types'

type Resident = Pick<Profile, 'id' | 'full_name' | 'email' | 'unit' | 'phone' | 'condominio_id'>

// Gestione dei condomini e assegnazione dei residenti: un residente vede i
// documenti solo del condominio a cui è assegnato qui (RLS documents_select).
export function CondominiManager({
  condomini: initialCondomini,
  residents: initialResidents,
}: {
  condomini: Condominio[]
  residents: Resident[]
}) {
  const [condomini, setCondomini] = useState(initialCondomini)
  const [residents, setResidents] = useState(initialResidents)
  const [nuovo, setNuovo] = useState({ nome: '', indirizzo: '' })
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const supabase = createClient()

  const inputClass = 'w-full px-3 py-2 border border-[var(--cream-dark)] bg-white text-sm focus:outline-none focus:border-[var(--navy)] transition-colors'

  const creaCondominio = async (e: React.FormEvent) => {
    e.preventDefault()
    setAlert(null)
    const nome = nuovo.nome.trim()
    if (!nome) return
    const { data, error } = await supabase
      .from('condomini')
      .insert({ nome, indirizzo: nuovo.indirizzo.trim() || null })
      .select()
      .single()
    if (error || !data) {
      setAlert({ type: 'error', message: 'Errore nella creazione del condominio.' })
    } else {
      setCondomini((prev) => [...prev, data].sort((a, b) => a.nome.localeCompare(b.nome)))
      setNuovo({ nome: '', indirizzo: '' })
    }
  }

  const aggiornaResidente = async (id: string, patch: { condominio_id?: string | null; unit?: string | null }) => {
    setAlert(null)
    const { error } = await supabase.from('profiles').update(patch).eq('id', id)
    if (error) {
      setAlert({ type: 'error', message: 'Errore nell\'aggiornamento del residente.' })
    } else {
      setResidents((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
    }
  }

  const nonAssegnati = residents.filter((r) => !r.condominio_id).length

  return (
    <div className="space-y-8">
      {alert && <Alert type={alert.type} message={alert.message} />}

      <section>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--navy)' }}>
          Condomini ({condomini.length})
        </h2>
        <ul className="space-y-1 mb-4 text-sm" style={{ color: 'var(--ink)' }}>
          {condomini.map((c) => (
            <li key={c.id}>
              <strong>{c.nome}</strong>{c.indirizzo ? ` — ${c.indirizzo}` : ''}
            </li>
          ))}
        </ul>
        <form onSubmit={creaCondominio} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input className={inputClass} placeholder="Nome condominio *" required value={nuovo.nome}
            onChange={(e) => setNuovo({ ...nuovo, nome: e.target.value })} />
          <input className={inputClass} placeholder="Indirizzo" value={nuovo.indirizzo}
            onChange={(e) => setNuovo({ ...nuovo, indirizzo: e.target.value })} />
          <Button type="submit" size="sm">Aggiungi condominio</Button>
        </form>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--navy)' }}>
          Residenti ({residents.length})
        </h2>
        {nonAssegnati > 0 && (
          <p className="text-xs mb-3 text-amber-700">
            {nonAssegnati} residente/i senza condominio: non vedono alcun documento finché non vengono assegnati.
          </p>
        )}
        <div className="space-y-2">
          {residents.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center gap-3 p-3 border bg-white" style={{ borderColor: 'var(--cream-dark)' }}>
              <div className="w-9 h-9 flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: 'var(--navy)' }}>
                {getInitials(r.full_name ?? r.email ?? '?')}
              </div>
              <div className="flex-1 min-w-[10rem]">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--navy)' }}>{r.full_name ?? r.email}</p>
                <p className="text-xs truncate" style={{ color: 'var(--ink)', opacity: 0.5 }}>
                  {r.email}{r.phone ? ` · ${r.phone}` : ''}
                </p>
              </div>
              <select
                aria-label="Condominio"
                className={`${inputClass} max-w-[14rem]`}
                value={r.condominio_id ?? ''}
                onChange={(e) => aggiornaResidente(r.id, { condominio_id: e.target.value || null })}
              >
                <option value="">— nessun condominio —</option>
                {condomini.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
              <input
                aria-label="Interno"
                className={`${inputClass} max-w-[6rem]`}
                placeholder="Interno"
                defaultValue={r.unit ?? ''}
                onBlur={(e) => {
                  const unit = e.target.value.trim() || null
                  if (unit !== (r.unit || null)) aggiornaResidente(r.id, { unit })
                }}
              />
            </div>
          ))}
          {residents.length === 0 && (
            <p className="text-sm text-center py-8" style={{ color: 'var(--ink)', opacity: 0.4 }}>Nessun residente registrato</p>
          )}
        </div>
      </section>
    </div>
  )
}
