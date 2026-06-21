import { describe, it, expect } from 'vitest'
import { cn, formatCurrency, formatDate, getInitials } from './utils'

describe('cn', () => {
  it('merges class names and dedupes conflicting Tailwind utilities', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
    expect(cn('text-sm', false && 'hidden', 'font-bold')).toBe('text-sm font-bold')
  })
})

describe('formatCurrency', () => {
  it('formats amounts as EUR with an Italian decimal comma', () => {
    // Avoid asserting on the thousands separator: some Node builds ship
    // reduced ICU data and omit it. The euro sign and decimal comma are stable.
    const out = formatCurrency(99.9)
    expect(out).toContain('€')
    expect(out).toContain('99,90')
  })
})

describe('formatDate', () => {
  it('renders a date-only ISO string on the correct day regardless of timezone', () => {
    expect(formatDate('2024-01-15')) // would be 14/01 if parsed as UTC midnight
      .toBe('15/01/2024')
  })

  it('handles full ISO timestamps', () => {
    expect(formatDate('2024-12-31T10:00:00')).toBe('31/12/2024')
  })
})

describe('getInitials', () => {
  it('takes the first two initials uppercased', () => {
    expect(getInitials('Mario Rossi')).toBe('MR')
    expect(getInitials('luigi rocca')).toBe('LR')
  })

  it('collapses extra whitespace without producing junk', () => {
    expect(getInitials('  Mario   Rossi  ')).toBe('MR')
  })

  it('returns a placeholder for empty input instead of "UNDEFINED"', () => {
    expect(getInitials('')).toBe('?')
    expect(getInitials('   ')).toBe('?')
  })

  it('limits to two characters for long names', () => {
    expect(getInitials('Anna Maria Bianchi')).toBe('AM')
  })
})
