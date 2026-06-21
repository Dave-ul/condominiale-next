import { createClient } from '@/lib/supabase/server'
import { safeRelativePath } from '@/lib/safe-redirect'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  // Restrict the post-login redirect to same-origin relative paths so a
  // crafted `next` param ("//evil.com", "https://…") cannot redirect users
  // off-site after authentication.
  const next = safeRelativePath(searchParams.get('next'))

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=callback`)
}
