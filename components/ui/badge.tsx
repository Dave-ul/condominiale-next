import { cn } from '@/lib/utils'

type Color = 'gold' | 'green' | 'blue' | 'red' | 'gray' | 'orange'

const colors: Record<Color, string> = {
  gold:   'bg-amber-50 text-amber-800 border-amber-300',
  green:  'bg-emerald-50 text-emerald-800 border-emerald-300',
  blue:   'bg-sky-50 text-sky-800 border-sky-300',
  red:    'bg-red-50 text-red-800 border-red-300',
  gray:   'bg-gray-50 text-gray-700 border-gray-300',
  orange: 'bg-orange-50 text-orange-800 border-orange-300',
}

export function Badge({
  children,
  color = 'gray',
  className,
}: {
  children: React.ReactNode
  color?: Color
  className?: string
}) {
  return (
    <span
      style={{ borderRadius: 0 }}
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium border tracking-wide',
        colors[color],
        className
      )}
    >
      {children}
    </span>
  )
}

// Non esiste uno stato "overdue" persistito: nessun job schedulato lo
// imposta, quindi lo calcoliamo qui a partire da `due_date` per evitare
// di introdurre un cron solo per aggiornare un'etichetta.
export function paymentStatusBadge(status: string, dueDate?: string | null) {
  const isOverdue = status === 'pending' && !!dueDate && new Date(dueDate) < new Date(new Date().toDateString())

  const map: Record<string, { label: string; color: Color }> = {
    pending:  { label: 'In attesa', color: 'gold' },
    paid:     { label: 'Pagato', color: 'blue' },
    verified: { label: 'Verificato', color: 'green' },
  }
  if (isOverdue) return <Badge color="red">Scaduto</Badge>
  const { label, color } = map[status] ?? { label: status, color: 'gray' }
  return <Badge color={color}>{label}</Badge>
}

export function requestStatusBadge(status: string) {
  const map: Record<string, { label: string; color: Color }> = {
    aperta:   { label: 'Aperta', color: 'gold' },
    in_corso: { label: 'In corso', color: 'blue' },
    chiusa:   { label: 'Chiusa', color: 'green' },
  }
  const { label, color } = map[status] ?? { label: status, color: 'gray' }
  return <Badge color={color}>{label}</Badge>
}
