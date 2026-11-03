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
const succ = document.getElementById('alert-success')
const err = document.getElementById('alert-error')
const ERRORE_GENERICO = err.textContent

function mostraEsito(el) {
  el.style.display = 'block'
  // Il pulsante può essere in fondo allo schermo: porta l'esito in vista.
  el.scrollIntoView({ block: 'nearest' })
}

function nascondiEsiti() {
  succ.style.display = 'none'
  err.style.display = 'none'
}

// Gli esiti restano visibili finché il visitatore non torna a scrivere: un
// timer li faceva sparire prima che fossero letti.
form.addEventListener('input', nascondiEsiti)

// Il messaggio d'errore dell'API (app/api/contatto) è già pensato per il
// visitatore; se manca o non è leggibile resta il testo generico.
async function messaggioErrore(res) {
  try {
    const body = await res.json()
    return typeof body.error === 'string' && body.error ? body.error : ERRORE_GENERICO
  } catch {
    return ERRORE_GENERICO
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const btn = document.getElementById('submit-btn')
  const data = Object.fromEntries(new FormData(form))

  nascondiEsiti()
  btn.disabled = true
  btn.textContent = 'Invio in corso...'

  try {
    // Endpoint dello stesso sito (app/api/contatto): invia la mail tramite la
    // posta Aruba del dominio, senza servizi terzi fuori dall'UE.
    const res = await fetch('/api/contatto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      form.reset()
      mostraEsito(succ)
    } else {
      err.textContent = await messaggioErrore(res)
      mostraEsito(err)
    }
  } catch {
    err.textContent = ERRORE_GENERICO
    mostraEsito(err)
  }

  btn.disabled = false
  btn.textContent = 'Invia messaggio'
})

// Mappa Google su richiesta esplicita (Linee guida cookie del Garante, 2021):
// nessuna connessione a Google finché l'utente non preme il pulsante.
document.getElementById('map-load')?.addEventListener('click', () => {
  const iframe = document.createElement('iframe')
  iframe.title = 'Mappa studio'
  iframe.src = 'https://maps.google.com/maps?q=Via+Don+Giovanni+Minzoni+1+Rastignano+Bologna&t=&z=15&ie=UTF8&iwloc=&output=embed'
  iframe.width = '100%'
  iframe.height = '220'
  iframe.style.border = '0'
  iframe.style.filter = 'grayscale(70%) invert(10%)'
  document.getElementById('map-wrap').replaceChildren(iframe)
})
