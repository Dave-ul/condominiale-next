import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { About } from '@/components/landing/About'
import { Services } from '@/components/landing/Services'
import { PortalPreview } from '@/components/landing/PortalPreview'
import { FAQ } from '@/components/landing/FAQ'
import { Contact } from '@/components/landing/Contact'
import { Footer } from '@/components/landing/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <PortalPreview />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
