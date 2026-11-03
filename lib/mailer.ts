import { createTransport } from 'nodemailer'
import type { ContattoEmail } from '@/lib/contatto'

// Invio tramite la posta Aruba del dominio (server in Italia). Le credenziali
// stanno solo nelle variabili d'ambiente dell'hosting (Netlify), mai nel repository.
const DESTINATARIO = 'pluigi.rocca@yahoo.com'
const SMTP_HOST = 'smtps.aruba.it'
const SMTP_PORT = 465
const TIMEOUT_MS = 10_000

export async function sendContattoEmail(mail: ContattoEmail): Promise<void> {
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!user || !pass) throw new Error('SMTP_USER o SMTP_PASS non configurate')

  const transport = createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    auth: { user, pass },
    connectionTimeout: TIMEOUT_MS,
    greetingTimeout: TIMEOUT_MS,
    socketTimeout: TIMEOUT_MS,
  })

  await transport.sendMail({
    // Aruba accetta solo il mittente autenticato: chi scrive va in Reply-To.
    from: { name: 'Sito Rocca Amministrazioni', address: user },
    to: DESTINATARIO,
    replyTo: mail.replyTo,
    subject: mail.subject,
    text: mail.text,
  })
}
