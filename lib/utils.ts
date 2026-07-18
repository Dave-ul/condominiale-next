import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount)
}

export function formatDate(date: string): string {
  // Date-only ISO strings ("2024-01-15") are parsed as UTC midnight, which can
  // render as the previous day in positive timezones (e.g. Italy). Pin them to
  // local midnight so the displayed day matches the stored date.
  const d = date.includes('T') ? new Date(date) : new Date(`${date}T00:00:00`)
  return new Intl.DateTimeFormat('it-IT').format(d)
}

export function getInitials(name: string): string {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?'
  )
}

/**
 * Open a URL in a new browser tab with rel=noopener,noreferrer to defend
 * against tabnabbing. Idempotent and uses a programmatic anchor so the
 * parent window cannot be reached from the popup (window.opener).
 */
export function openInNewTab(url: string): void {
  if (typeof document === 'undefined') return
  const a = document.createElement('a')
  a.href = url
  a.target = '_blank'
  a.rel = 'noopener noreferrer'
  document.body.appendChild(a)
  a.click()
  a.remove()
}
