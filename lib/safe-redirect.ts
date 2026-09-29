/**
 * Returns `path` only if it is a safe same-origin relative path, otherwise
 * `fallback`. Protects redirect flows (e.g. the auth callback) from
 * open-redirect attacks via protocol-relative ("//evil.com") or absolute URLs.
 *
 * Parsing with URL (instead of checking prefixes) follows the browser's own
 * rules, so tricks like "/\evil.com" or "/\t/evil.com" — which browsers
 * normalise to "//evil.com" — are rejected too.
 */
export function safeRelativePath(path: string | null | undefined, fallback = '/portale'): string {
  if (!path || !path.startsWith('/')) return fallback
  const base = 'http://same-origin.invalid'
  const url = new URL(path, base)
  return url.origin === base ? url.pathname + url.search + url.hash : fallback
}
