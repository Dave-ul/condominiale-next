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
