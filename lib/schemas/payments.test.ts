import { describe, expect, it } from 'vitest'
import { PaymentCreateClientSchema } from './payments'

const valid = {
  resident_id: '550e8400-e29b-41d4-a716-446655440000',
  description: 'Quota condominiale Q1',
  amount: '120.50',
  due_date: '2026-08-01',
  stripe_payment_link: '',
}

describe('PaymentCreateClientSchema', () => {
  it('accepts a valid input', () => {
    const r = PaymentCreateClientSchema.safeParse(valid)
    expect(r.success).toBe(true)
  })

  it('coerces amount from string', () => {
    const r = PaymentCreateClientSchema.safeParse(valid)
    expect(r.success && r.data.amount).toBe(120.5)
  })

  it('rejects empty description', () => {
    const r = PaymentCreateClientSchema.safeParse({ ...valid, description: '   ' })
    expect(r.success).toBe(false)
  })

  it('rejects negative amount', () => {
    const r = PaymentCreateClientSchema.safeParse({ ...valid, amount: '-5' })
    expect(r.success).toBe(false)
  })

  it('rejects NaN amount', () => {
    const r = PaymentCreateClientSchema.safeParse({ ...valid, amount: 'abc' })
    expect(r.success).toBe(false)
  })

  it('rejects zero amount', () => {
    const r = PaymentCreateClientSchema.safeParse({ ...valid, amount: '0' })
    expect(r.success).toBe(false)
  })

  it('rejects bad date format', () => {
    const r = PaymentCreateClientSchema.safeParse({ ...valid, due_date: '01/08/2026' })
    expect(r.success).toBe(false)
  })

  it('accepts a stripe checkout link', () => {
    const r = PaymentCreateClientSchema.safeParse({
      ...valid,
      stripe_payment_link: 'https://checkout.stripe.com/c/pay/cs_test_123',
    })
    expect(r.success).toBe(true)
  })

  it('accepts a stripe "buy" link', () => {
    const r = PaymentCreateClientSchema.safeParse({
      ...valid,
      stripe_payment_link: 'https://buy.stripe.com/test_abc',
    })
    expect(r.success).toBe(true)
  })

  it('rejects non-stripe URL as stripe link', () => {
    const r = PaymentCreateClientSchema.safeParse({
      ...valid,
      stripe_payment_link: 'https://example.com/x',
    })
    expect(r.success).toBe(false)
  })

  it('normalizes empty stripe link to null', () => {
    const r = PaymentCreateClientSchema.parse(valid)
    expect(r.stripe_payment_link).toBeNull()
  })
})
