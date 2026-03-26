import Testimonials from '../components/Testimonials'
import VisionMission from '../components/VisionMission'
import About from '../components/About'
import PageHero from '../components/PageHero'
import LucideIcon from '../components/LucideIcon'
import useScrollReveal from '../hooks/useScrollReveal'
import brochurePdf from '../assets/yesha-enterprises.pdf'

export default function AboutPage({ contact, testimonials }) {
  const reveal = useScrollReveal()

  return (
    <>
      <PageHero
        title="Pioneering Sustainable Fisheries"
        subtitle="Innovation • Quality • Integrity"
        description="Leveraging years of engineering expertise to bring industrial-grade Biofloc infrastructure to farmers across India."
        bgImage="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        gradient="linear-gradient(135deg, rgba(2, 6, 23, 0.92), rgba(14, 165, 233, 0.72))"
        badge="Who We Are"
        icon="Info"
      />

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
          <div className="premium-card" style={{ padding: 60, textAlign: 'center', borderRadius: 40 }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: 24, fontWeight: 800 }}>Ready to Start Your Project?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: 40, maxWidth: 800, margin: '0 auto 40px' }}>
              Whether you're setting up a new Biofloc farm or upgrading your infrastructure, we have the engineering expertise to help you succeed.
            </p>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/contact" 
                 style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--primary)', color: 'white', padding: '16px 36px', borderRadius: 100, fontWeight: 700, fontSize: '1.05rem', textDecoration: 'none', transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)', boxShadow: '0 8px 16px rgba(var(--primary-rgb), 0.25)' }}
                 onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(var(--primary-rgb), 0.35)'; }}
                 onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(var(--primary-rgb), 0.25)'; }}>
                Get in Touch
                <LucideIcon name="ArrowRight" size={20} strokeWidth={2.5} />
              </a>

              <a href={`https://wa.me/${contact?.whatsapp}`} 
                 style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--surface-hover)', border: '2px solid var(--border)', color: 'var(--text-primary)', padding: '16px 36px', borderRadius: 100, fontWeight: 700, fontSize: '1.05rem', textDecoration: 'none', transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)' }}
                 onMouseEnter={e => { e.currentTarget.style.borderColor = '#25D366'; e.currentTarget.style.color = '#25D366'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(37, 211, 102, 0.15)'; }}
                 onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <LucideIcon name="MessageCircle" size={20} strokeWidth={2.5} />
                WhatsApp Now
              </a>

              <a href={brochurePdf} download="Yesha_Enterprises_Brochure.pdf" 
                 style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', border: '2px solid var(--primary)', color: 'var(--primary)', padding: '16px 36px', borderRadius: 100, fontWeight: 700, fontSize: '1.05rem', textDecoration: 'none', transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)' }}
                 onMouseEnter={e => { e.currentTarget.style.background = 'rgba(var(--primary-rgb), 0.05)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                 onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <LucideIcon name="FileText" size={20} strokeWidth={2.5} />
                Download Brochure
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
