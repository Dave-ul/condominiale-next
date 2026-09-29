import type { EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { safeRelativePath } from '@/lib/safe-redirect'
import { NextResponse } from 'next/server'

// Destinazione dei link email di Supabase Auth (invito, recupero password)
// nel formato token_hash, da impostare nei template email della dashboard:
//   {{ .SiteURL }}/api/auth/confirm?token_hash={{ .TokenHash }}&type=invite&next=/portale/account
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = safeRelativePath(searchParams.get('next'))

  if (tokenHash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=link`)
}
