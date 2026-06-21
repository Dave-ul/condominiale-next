/**
 * Returns `path` only if it is a safe same-origin relative path, otherwise
 * `fallback`. Protects redirect flows (e.g. the auth callback) from
 * open-redirect attacks via protocol-relative ("//evil.com") or absolute URLs.
 */
export function safeRelativePath(path: string | null | undefined, fallback = '/portale'): string {
  if (!path) return fallback
  return path.startsWith('/') && !path.startsWith('//') ? path : fallback
}
