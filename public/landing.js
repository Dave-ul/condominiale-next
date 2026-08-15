// JS della landing pubblica (public/index.html).
//
// Vive in un file esterno, e non in uno <script> inline, per poter essere
// servito sotto una CSP stretta (`script-src 'self'`, senza 'unsafe-inline').
// Per lo stesso motivo qui non ci sono handler inline nel markup: tutto è
// agganciato con addEventListener, perché gli attributi onclick/onsubmit non
// sono coperti da un nonce e verrebbero comunque bloccati.
//
// Incluso con `defer`, quindi il DOM è già pronto quando questo file gira.

// Navbar scroll
const navbar = document.getElementById('navbar')
window.addEventListener(
  'scroll',
  () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20)
  },
  { passive: true },
)

// Hamburger
const hamburger = document.getElementById('hamburger')
const mobileMenu = document.getElementById('mobile-menu')
const iconMenu = document.getElementById('icon-menu')
const iconClose = document.getElementById('icon-close')

hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open')
  iconMenu.style.display = open ? 'none' : 'block'
  iconClose.style.display = open ? 'block' : 'none'
})

document.querySelectorAll('.mobile-link').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open')
    iconMenu.style.display = 'block'
    iconClose.style.display = 'none'
  })
})

// FAQ accordion
document.querySelectorAll('.faq-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item')
    const isOpen = item.classList.contains('open')
    document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('open'))
    if (!isOpen) item.classList.add('open')
  })
})

// Form contatti
const form = document.getElementById('contact-form')

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const btn = document.getElementById('submit-btn')
  const succ = document.getElementById('alert-success')
  const err = document.getElementById('alert-error')
  const data = Object.fromEntries(new FormData(form))

  btn.disabled = true
  btn.textContent = 'Invio in corso...'

  try {
    const res = await fetch('https://formspree.io/f/xjkwqgpq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `${data.nome} ${data.cognome}`,
        email: data.email,
        phone: data.telefono,
        subject: data.oggetto,
        message: data.messaggio,
      }),
    })
    if (res.ok) {
      succ.style.display = 'block'
      form.reset()
    } else {
      err.style.display = 'block'
    }
  } catch {
    err.style.display = 'block'
  }

  btn.disabled = false
  btn.textContent = 'Invia messaggio'
  setTimeout(() => {
    succ.style.display = 'none'
    err.style.display = 'none'
  }, 5000)
})
