import React from 'react'
import { useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'
import PageHero from '../components/PageHero'
import Products from '../components/Products'
import LucideIcon from '../components/LucideIcon'

export default function LocationPage({ state, city, products, contact }) {
  const navigate = useNavigate()
  
  const stateData = {
    'Chhattisgarh': {
      title: 'Best HDPE Pond Liner in Chhattisgarh',
      subtitle: 'Raipur\'s #1 Fish Farming Infrastructure Provider',
      description: 'Yesha Enterprises is the leading distributor of HDPE Pond Liners and Biofloc equipment in Raipur, Bilaspur, and throughout Chhattisgarh. industrial-grade quality with local expertise.',
      bgImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=80'
    },
    'Maharashtra': {
      title: 'Top HDPE Pond Liner Suppliers in Maharashtra',
      subtitle: 'Premium Biofloc Solutions for Maharashtra Farmers',
      description: 'Supplying high-density pond liners, ring blowers, and fish tanks to Nagpur, Pune, Mumbai, and all major districts in Maharashtra. Scalable aquaculture infrastructure.',
      bgImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80'
    },
    'Odisha': {
      title: 'Reliable Pond Liner & Biofloc Equipment in Odisha',
      subtitle: 'Empowering Odisha\'s Aquaculture Growth',
      description: 'Bhubaneswar\'s trusted source for Biofloc tanks and HDPE liners. We support Odisha\'s mission for sustainable fisheries with modern engineering and PAN India logistics.',
      bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80'
    }
  }[state] || {}

  const stateSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Yesha Enterprises - ${state}`,
    "description": stateData.description,
    "areaServed": {
      "@type": "State",
      "name": state
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": city || "Raipur",
      "addressRegion": state,
      "addressCountry": "IN"
    },
    "url": window.location.href
  }

  return (
    <>
      <SEO 
        title={stateData.title}
        description={stateData.description}
        keywords={`pond liner ${state}, biofloc tank ${state}, fish farming equipment ${state}, HDPE dealer ${state}`}
      />
      <script type="application/ld+json">
        {JSON.stringify(stateSchema)}
      </script>

      <PageHero
        title={stateData.title}
        subtitle={stateData.subtitle}
        description={stateData.description}
        bgImage={stateData.bgImage}
        gradient="linear-gradient(135deg, rgba(2, 6, 23, 0.95), rgba(14, 116, 144, 0.85))"
        badge={state.toUpperCase()}
        icon="MapPin"
      />

      <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div className="container">
          <div className="premium-card" style={{ padding: 40, marginBottom: 60, borderRadius: 32 }}>
            <h2 style={{ fontSize: '2rem', marginBottom: 20 }}>Why Choose Yesha Enterprises in {state}?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 30 }}>
              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: 12 }}>Regional Distribution</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>We have a robust logistics network ensuring 3-5 day delivery to any district in {state}.</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: 12 }}>Engineering Support</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Our team provides technical guidance on pond layout and aeration specifically for {state}\'s climatic conditions.</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: 12 }}>Wholesale Pricing</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Get direct-from-Raipur warehouse pricing, bypassing local middlemen and saving up to 20% on setup costs.</p>
              </div>
            </div>
          </div>
        </div>
        <Products products={products} contact={contact} previewMode={true} />
      </section>

      <section style={{ padding: '60px 0', textAlign: 'center', background: 'var(--surface)' }}>
        <div className="container">
          <h2 style={{ marginBottom: 30 }}>Ready to Scale Your Farm in {state}?</h2>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/contact')} className="hero-btn btn-primary">
              Contact Regional HQ
              <LucideIcon name="ArrowRight" size={20} />
            </button>
            <a href={`https://wa.me/${contact.whatsapp}`} className="hero-btn" style={{ border: '2px solid var(--border)' }}>
              <LucideIcon name="MessageCircle" size={20} />
              WhatsApp {state} Support
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
