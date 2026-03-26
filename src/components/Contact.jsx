import LucideIcon from './LucideIcon'
import useScrollReveal from '../hooks/useScrollReveal'

export default function Contact({ contact }) {
  const reveal = useScrollReveal()
  const info = [
    { 
      label: 'Phone Support', 
      val: contact.phone, 
      icon: 'PhoneCall',
      link: `tel:${contact.phone.replace(/\s+/g, '')}`
    },
    { 
      label: 'Email Inquiries', 
      val: contact.email, 
      icon: 'Mail',
      link: `mailto:${contact.email}`
    },
    { 
      label: 'Our Headquarters', 
      val: contact.address, 
      icon: 'MapPin',
      link: `https://maps.google.com/?q=${encodeURIComponent(contact.address)}`
    },
    { 
      label: 'Follow Us', 
      val: '@yeshaenterprises01', 
      icon: 'Instagram',
      link: contact.instagram
    }
  ]

  return (
    <section id="contact" style={{ padding: '120px 0', background: 'var(--bg)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 60, alignItems: 'start' }} className="contact-grid">
          {/* Left: Info Grid */}
          <div className="reveal" ref={reveal}>
            <div style={{ 
              display: 'inline-flex', alignItems: 'center', gap: 8, 
              padding: '8px 16px', borderRadius: '100px', 
              background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)',
              fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em',
              marginBottom: 24
            }}>
              <LucideIcon name="MessageSquare" size={16} />
              GET IN TOUCH
            </div>
            
            <h2 style={{ fontSize: '3rem', marginBottom: 24, lineHeight: 1.1 }}>
              Ready to Scale your <br />
              <span style={{ color: 'var(--primary)' }}>Aquaculture Operation?</span>
            </h2>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', marginBottom: 48, lineHeight: 1.8 }}>
              Partner with India's leading Biofloc infrastructure provider. Whether you're a dealer or a farm operator, we provide the engineering excellence you need.
            </p>

            <div style={{ display: 'grid', gap: 20 }}>
              {info.map((item, i) => (
                <a 
                  key={i} href={item.link} target="_blank" rel="noopener noreferrer"
                  className="premium-card"
                  style={{ 
                    padding: '20px 28px', display: 'flex', alignItems: 'center', 
                    gap: 20, transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                    background: 'var(--surface)'
                  }}
                >
                  <div style={{ 
                    width: 44, height: 44, borderRadius: 12, 
                    background: 'rgba(var(--primary-rgb), 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--primary)', flexShrink: 0
                  }}>
                    <LucideIcon name={item.icon} size={20} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', lineHeight: 1.2, marginBottom: 4 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                      {item.val}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <div style={{ marginTop: 32, padding: '24px', borderRadius: 20, background: 'rgba(var(--primary-rgb), 0.05)', display: 'flex', gap: 16, border: '1px solid rgba(var(--primary-rgb), 0.1)' }}>
              <LucideIcon name="Clock" size={24} color="var(--primary)" />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Standard Response Time</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Our Raipur warehouse team handles inquiries typically within 2-4 business hours.</div>
              </div>
            </div>
          </div>

          {/* Right: Lead Generation Card & Map */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }} className="reveal" ref={reveal}>
            <div className="premium-card" style={{ padding: '48px 40px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div style={{ marginBottom: 32, textAlign: 'center' }}>
                <div style={{ 
                  width: 64, height: 64, borderRadius: 20, background: 'var(--primary)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  margin: '0 auto 20px', color: 'white',
                  boxShadow: '0 10px 20px rgba(var(--primary-rgb), 0.2)'
                }}>
                  <LucideIcon name="Send" size={28} />
                </div>
                <h3 style={{ fontSize: '1.75rem', marginBottom: 12 }}>Direct Inquiry</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Get bulk pricing and expert consultation instantly.</p>
              </div>

              <div style={{ display: 'grid', gap: 14 }}>
                <a 
                  href={`https://wa.me/${contact.whatsapp}?text=Hi, I'd like a quote for Biofloc products.`}
                  target="_blank" rel="noopener noreferrer"
                  className="hero-btn btn-primary"
                  style={{ margin: 0, width: '100%' }}
                >
                  <LucideIcon name="MessageCircle" size={20} />
                  <span>WhatsApp Us</span>
                </a>
                
                <a 
                  href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                  className="hero-btn btn-secondary"
                  style={{ margin: 0, width: '100%' }}
                >
                  <LucideIcon name="Phone" size={20} />
                  <span>Call Us Now</span>
                </a>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="premium-card" style={{ overflow: 'hidden', height: 450, background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div style={{ padding: '16px 24px', background: 'var(--surface-hover)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <LucideIcon name="Map" size={18} color="var(--primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Visit Our Raipur Hub</span>
              </div>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.1956199031592!2d81.65844307553759!3d21.22409008104041!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28dd6e8c3cee49%3A0x2c641f30cb1b9360!2sYesha%20Enterprises%20-%20Biofloc%20Fish%20Farming%20%7C%20Ring%20Blower%20%7C%20Root%20Blower%20%7C%20Pond%20Liner!5e0!3m2!1sen!2sin!4v1774453948050!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 1024px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  )
}
