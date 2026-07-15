import { readFileSync } from 'fs'
import { join } from 'path'

// La landing è statica e non cambia a runtime: la leggiamo una sola volta
// (al cold start del modulo) invece che ad ogni richiesta, e la serviamo
// con una cache esplicita.
const html = readFileSync(join(process.cwd(), 'public/index.html'), 'utf-8')

export async function GET() {
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
