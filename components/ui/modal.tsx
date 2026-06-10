'use client'
import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(12,26,40,0.7)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div
        className={cn(
          'bg-[var(--cream)] w-full max-w-lg max-h-[90vh] overflow-y-auto',
          'border-2 border-[var(--navy)]',
          className
        )}
        style={{ borderRadius: 0 }}
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-[var(--navy)]"
        >
          <div className="flex items-center gap-3">
            <span style={{ width: 3, height: 20, backgroundColor: 'var(--gold)', display: 'block', flexShrink: 0 }} />
            <h2
              className="text-lg font-semibold"
              style={{ fontFamily: 'var(--font-playfair)', color: 'var(--navy)' }}
            >
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[var(--cream-dark)] transition-colors"
            style={{ borderRadius: 0 }}
            aria-label="Chiudi"
          >
            <X size={20} style={{ color: 'var(--ink)' }} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
