import { cache } from 'react'
import { createClient } from './server'
import type { Profile } from './types'

const PROFILE_COLUMNS = 'id, full_name, email, unit, phone, role, created_at'

/**
 * Resolves the authenticated user and their profile for the current request.
 *
 * Wrapped in `React.cache` so that the layout and the page (and any other
 * server component in the same render) share a single round-trip to Supabase
 * instead of each re-running `getUser()` + the profile query.
 *
 * On first login the profile row does not exist yet, so it is created here
 * from the auth metadata. Centralising the insert means the freshly created
 * profile is part of the cached result and is visible to every consumer.
 */
export const getSession = cache(
  async (): Promise<{ user: { id: string; email?: string } | null; profile: Profile | null }> => {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return { user: null, profile: null }

    const { data: existing } = await supabase
      .from('profiles')
      .select(PROFILE_COLUMNS)
      .eq('id', user.id)
      .maybeSingle()

    if (existing) return { user, profile: existing as Profile }

    const { data: created, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name ?? null,
        unit: user.user_metadata?.unit ?? null,
        phone: user.user_metadata?.phone ?? null,
        role: 'resident',
      })
      .select(PROFILE_COLUMNS)
      .single()

    if (error) {
      console.error('Profile creation failed:', error.message)
    }

    return { user, profile: (created as Profile) ?? null }
  }
)
