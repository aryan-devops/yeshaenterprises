import Testimonials from '../components/Testimonials'
import VisionMission from '../components/VisionMission'
import About from '../components/About'
import useScrollReveal from '../hooks/useScrollReveal'

export default function AboutPage({ contact, testimonials }) {
  const reveal = useScrollReveal()

  return (
    <div style={{ paddingTop: 'var(--navbar-height)' }}>
      <div className="reveal" ref={reveal}>
        <About />
      </div>

      <div className="reveal" ref={reveal}>
        <VisionMission />
      </div>

      <div className="reveal" ref={reveal}>
        <Testimonials reviews={testimonials} />
      </div>

      <section style={{ padding: '100px 0', background: 'var(--bg)' }}>
        <div className="container">
          <div className="premium-card" style={{ padding: 60, textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: 24 }}>Ready to Start Your Project?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: 40, maxWidth: 800, margin: '0 auto 40px' }}>
              Whether you're setting up a new Biofloc farm or upgrading your infrastructure, we have the engineering expertise to help you succeed.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <a href="/contact" className="hero-btn" style={{ margin: 0 }}>Get in Touch</a>
              <a href={`https://wa.me/${contact.whatsapp}`} className="hero-btn" style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', margin: 0 }}>
                WhatsApp Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
