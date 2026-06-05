'use client'
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'

type AlertType = 'success' | 'error' | 'warning' | 'info'

const styles: Record<AlertType, { bg: string; text: string; Icon: React.ElementType }> = {
  success: { bg: 'bg-green-50 border-green-200', text: 'text-green-800', Icon: CheckCircle },
  error: { bg: 'bg-red-50 border-red-200', text: 'text-red-800', Icon: XCircle },
  warning: { bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-800', Icon: AlertCircle },
  info: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800', Icon: Info },
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
  const { bg, text, Icon } = styles[type]
  return (
    <div className={cn('flex items-start gap-3 p-3 rounded-lg border', bg, text, className)}>
      <Icon size={18} className="mt-0.5 shrink-0" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
