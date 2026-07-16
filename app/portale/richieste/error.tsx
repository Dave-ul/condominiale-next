'use client'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function RichiesteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Richieste section error:', error)
  }, [error])

  return (
    <div className="p-6 lg:p-8">
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
            Errore nella sezione Richieste
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--stone)' }}>
          Non è stato possibile caricare le richieste. Riprova tra qualche istante.
        </p>
        <Button onClick={reset}>Riprova</Button>
      </div>
    </div>
  )
}
