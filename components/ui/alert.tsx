'use client'
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'

type AlertType = 'success' | 'error' | 'warning' | 'info'

const styles: Record<AlertType, { bg: string; text: string; border: string; Icon: React.ElementType }> = {
  success: { bg: 'bg-emerald-50', border: 'border-l-4 border-emerald-500', text: 'text-emerald-800', Icon: CheckCircle },
  error:   { bg: 'bg-red-50',     border: 'border-l-4 border-red-500',     text: 'text-red-800',     Icon: XCircle },
  warning: { bg: 'bg-amber-50',   border: 'border-l-4 border-amber-500',   text: 'text-amber-800',   Icon: AlertCircle },
  info:    { bg: 'bg-sky-50',     border: 'border-l-4 border-sky-500',     text: 'text-sky-800',     Icon: Info },
}

export function Alert({
  type,
  message,
  className,
}: {
  type: AlertType
  message: string
  className?: string
}) {
  const { bg, border, text, Icon } = styles[type]
  return (
    <div
      style={{ borderRadius: 0 }}
      className={cn('flex items-start gap-3 p-3', bg, border, text, className)}
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
