'use client'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function PortaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Portale error:', error)
  }, [error])

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <div
        className="flex flex-col items-start gap-4 p-8 bg-white border-2"
        style={{ borderColor: 'var(--navy)' }}
      >
        <div className="flex items-center gap-3">
          <AlertCircle size={22} className="text-red-500 shrink-0" />
          <h1
            className="text-xl font-bold"
            style={{ fontFamily: 'var(--font-playfair)', color: 'var(--navy)' }}
          >
            Si è verificato un errore
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--stone)' }}>
          Non è stato possibile caricare questa sezione. Riprova tra qualche istante.
        </p>
        <Button onClick={reset}>Riprova</Button>
      </div>
    </div>
  )
}
