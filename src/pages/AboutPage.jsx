import SEO from '../components/SEO'
import Testimonials from '../components/Testimonials'
import VisionMission from '../components/VisionMission'
import About from '../components/About'
import PageHero from '../components/PageHero'
import LucideIcon from '../components/LucideIcon'
import useScrollReveal from '../hooks/useScrollReveal'
import brochurePdf from '../assets/yesha-enterprises.pdf'

export default function AboutPage({ contact, testimonials }) {
  const reveal = useScrollReveal()

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What products does Yesha Enterprises supply?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yesha Enterprises is a leading distributor of HDPE Pond Liners, Ring Blowers, Circular Fish Tanks, and complete Biofloc Fish Farming infrastructure across India."
        }
      },
      {
        "@type": "Question",
        "name": "Does Yesha Enterprises provide PAN India delivery?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we provide PAN India delivery for all our fish farming products, including heavy equipment like ring blowers and bulk HDPE liners."
        }
      },
      {
        "@type": "Question",
        "name": "Where is Yesha Enterprises located?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our central hub is located at Office No. 71 Govind Sarang Parisar, New Rajendra Nagar, Raipur, Chhattisgarh, 492001."
        }
      }
    ]
  };

  return (
    <>
      <SEO 
        title="About Us - Pioneers in Biofloc Fish Farming"
        description="Learn about Yesha Enterprises, India's leading distributor of HDPE Pond Liners and Biofloc equipment. Our mission is to empower farmers with industrial-grade infrastructure."
      />
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
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
              <a href="/contact" className="hero-btn btn-primary">
                Get in Touch
                <LucideIcon name="ArrowRight" size={20} strokeWidth={2.5} />
              </a>

              <a href={`https://wa.me/${contact?.whatsapp}`} 
                 className="hero-btn"
                 style={{ background: 'var(--surface-hover)', border: '2px solid var(--border)', color: 'var(--text-primary)' }}
                 onMouseEnter={e => { e.currentTarget.style.borderColor = '#25D366'; e.currentTarget.style.color = '#25D366'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(37, 211, 102, 0.15)'; }}
                 onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <LucideIcon name="MessageCircle" size={20} strokeWidth={2.5} />
                WhatsApp Now
              </a>

              <a href={brochurePdf} download="Yesha_Enterprises_Brochure.pdf" className="hero-btn btn-outline">
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
