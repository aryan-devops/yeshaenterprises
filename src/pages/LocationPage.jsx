import React from 'react'
import { useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'
import PageHero from '../components/PageHero'
import Products from '../components/Products'
import LucideIcon from '../components/LucideIcon'

export default function LocationPage({ state, city, products, contact }) {
  const navigate = useNavigate()
  
  const locationKey = state || city || 'Chhattisgarh'

  const stateData = {
    'Raipur': {
      title: 'HDPE Pond Liner & Fish Farming Equipment in Raipur',
      subtitle: 'Yesha Enterprises — Raipur Central Wholesale Distribution Hub',
      description: 'Leading supplier and dealer of HDPE Pond Liners, Ring Blowers, Biofloc Tanks, and Jet Aerators in Raipur, Chhattisgarh. Factory prices, custom pond liner cutting, and immediate local pickup or dispatch.',
      keywords: 'Pond Liner in Raipur, HDPE Pond Liner in Raipur, Pond Liner Price in Raipur, Ring Blower in Raipur, Jet Aerator in Raipur, Biofloc Tank in Raipur, Fish Farming Equipment in Raipur',
      bgImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=80',
      badge: 'RAIPUR HQ',
      localIntro: 'Operating directly from New Rajendra Nagar, Raipur, Yesha Enterprises serves commercial fish farms, hatcheries, and biofloc growers across Raipur, Birgaon, Naya Raipur, Durg, and Bhilai with guaranteed quality and same-day order processing.'
    },
    'Chhattisgarh': {
      title: 'Best HDPE Pond Liner & Aquaculture Equipment in Chhattisgarh',
      subtitle: 'Chhattisgarh\'s #1 Fish Farming Infrastructure Provider',
      description: 'Yesha Enterprises is the premier wholesale distributor of HDPE Pond Liners, Ring Blowers, Aeration Systems, and Biofloc equipment across Raipur, Bilaspur, Durg, Bhilai, Korba, and Jagdalpur.',
      keywords: 'HDPE Pond Liner Supplier in Chhattisgarh, Aquaculture Equipment in Chhattisgarh, Biofloc Equipment Supplier in Chhattisgarh, Fish Farming Products in Chhattisgarh, Pond Liner Supplier in Chhattisgarh',
      bgImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=80',
      badge: 'CHHATTISGARH STATE',
      localIntro: 'We are Chhattisgarh\'s foremost aquaculture supply partner, providing complete infrastructure solutions from farm ponds in Bilaspur and Korba to intensive biofloc installations across Durg and Rajnandgaon.'
    },
    'Maharashtra': {
      title: 'Top HDPE Pond Liner & Ring Blower Suppliers in Maharashtra',
      subtitle: 'Premium Biofloc Solutions for Maharashtra Farmers',
      description: 'Supplying industrial-grade HDPE pond liners, ring blowers, aerators, and fish tanks to Nagpur, Pune, Mumbai, Nashik, and all major districts in Maharashtra with fast 3-day freight delivery.',
      keywords: 'HDPE Pond Liner Supplier in Maharashtra, Ring Blower Supplier in Maharashtra, Fish Farming Equipment in Maharashtra, Biofloc Tank Maharashtra, Aquaculture Aerator Maharashtra',
      bgImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
      badge: 'MAHARASHTRA',
      localIntro: 'Supporting progressive shrimp and freshwater fish farmers in Vidarbha, Western Maharashtra, and Konkan with UV-stabilized geomembrane liners, regenerative air pumps, and high-density circular culture tanks.'
    },
    'Odisha': {
      title: 'Reliable Pond Liner & Biofloc Equipment Supplier in Odisha',
      subtitle: 'Empowering Odisha\'s Aquaculture & Coastal Shrimp Growth',
      description: 'Bhubaneswar, Cuttack, and coastal Odisha\'s trusted distributor for Biofloc tanks, HDPE liners, roots blowers, and aerators. Empowering sustainable fisheries with factory pricing and reliable transport.',
      keywords: 'Pond Liner Supplier in Odisha, Fish Farming Equipment in Odisha, Biofloc Equipment in Odisha, Aquaculture Equipment Bhubaneswar, HDPE Pond Liner Odisha',
      bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80',
      badge: 'ODISHA',
      localIntro: 'Partnering with coastal shrimp culturists and freshwater fish farmers across Odisha, delivering puncture-resistant 500-micron liners, biofloc tanks, and deep aeration systems directly to your site.'
    },
    'Madhya Pradesh': {
      title: 'Pond Liner & Fish Farming Equipment Supplier in Madhya Pradesh',
      subtitle: 'Serving Indore, Bhopal, Jabalpur & All MP Districts',
      description: 'High-durability HDPE pond liners, ring blowers, and complete aquaculture setups for fish farmers across Madhya Pradesh with dependable logistics direct from our Raipur central hub.',
      keywords: 'Pond Liner Supplier in Madhya Pradesh, Biofloc Equipment in Madhya Pradesh, Fish Farming Equipment in Madhya Pradesh, HDPE Pond Liner MP, Aquaculture Aerator Indore Bhopal',
      bgImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
      badge: 'MADHYA PRADESH',
      localIntro: 'Enabling sustainable commercial fisheries and irrigation pond projects across Jabalpur, Rewa, Balaghat, Indore, and Bhopal with certified heavy-duty liners and power-efficient aeration equipment.'
    }
  }[locationKey] || {
    title: `Best HDPE Pond Liner in ${locationKey}`,
    subtitle: `Wholesale Aquaculture Equipment in ${locationKey}`,
    description: `Leading supplier of HDPE Pond Liners, Ring Blowers, and Biofloc equipment in ${locationKey}.`,
    keywords: `Pond Liner ${locationKey}, Biofloc Equipment ${locationKey}`,
    bgImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=80',
    badge: locationKey.toUpperCase(),
    localIntro: `Serving farmers and commercial enterprises across ${locationKey} with premium aquaculture and pond infrastructure.`
  }

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : `/location/${locationKey.toLowerCase().replace(/\s+/g, '-')}`

  const locationSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Yesha Enterprises - ${locationKey}`,
    "description": stateData.description,
    "telephone": "+91 99772 28924",
    "url": `https://yeshaenterprises.in${currentPath}`,
    "areaServed": {
      "@type": locationKey === 'Raipur' ? "City" : "State",
      "name": locationKey
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Office No. 71 Govind Sarang Parisar, New Rajendra Nagar",
      "addressLocality": "Raipur",
      "addressRegion": "Chhattisgarh",
      "postalCode": "492001",
      "addressCountry": "IN"
    },
    "priceRange": "$$"
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://yeshaenterprises.in/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Locations",
        "item": "https://yeshaenterprises.in/products"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": locationKey,
        "item": `https://yeshaenterprises.in${currentPath}`
      }
    ]
  }

  return (
    <>
      <SEO 
        title={stateData.title}
        description={stateData.description}
        keywords={stateData.keywords}
        url={currentPath}
      />
      <script type="application/ld+json">
        {JSON.stringify(locationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>

      <PageHero
        title={stateData.title}
        subtitle={stateData.subtitle}
        description={stateData.description}
        bgImage={stateData.bgImage}
        gradient="linear-gradient(135deg, rgba(2, 6, 23, 0.95), rgba(14, 116, 144, 0.85))"
        badge={stateData.badge}
        icon="MapPin"
      />

      <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div className="container">
          <div className="premium-card" style={{ padding: 40, marginBottom: 60, borderRadius: 32 }}>
            <h2 style={{ fontSize: '2rem', marginBottom: 16 }}>Why Choose Yesha Enterprises in {locationKey}?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 32 }}>
              {stateData.localIntro}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 30 }}>
              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: 12 }}>Direct Factory Pricing</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Get transparent wholesale rates on HDPE pond liners, blowers, and tanks, saving up to 20% by cutting out unneeded intermediaries.</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: 12 }}>Custom Fabrications & Sizing</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>From small 500-liter biofloc tanks to multi-acre commercial farm pond liners (500 to 1000 microns), cut and welded to your exact specifications.</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: 12 }}>Pan-Regional Delivery & Support</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Rapid dispatch from our central Raipur warehouse with end-to-end transport coverage and phone/WhatsApp technical assistance.</p>
              </div>
            </div>
          </div>
        </div>
        <Products products={products} contact={contact} previewMode={true} />
      </section>

      <section style={{ padding: '60px 0', textAlign: 'center', background: 'var(--surface)' }}>
        <div className="container">
          <h2 style={{ marginBottom: 16 }}>Ready to Scale Your Aquaculture Farm in {locationKey}?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 30, fontSize: '1.05rem' }}>
            Speak with our technical specialists for pond volume calculations, blower sizing, and a direct quotation.
          </p>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/contact')} className="hero-btn btn-primary">
              Contact Regional HQ
              <LucideIcon name="ArrowRight" size={20} />
            </button>
            <a href={`https://wa.me/${contact.whatsapp?.replace(/[^0-9]/g, '') || '919977228924'}`} className="hero-btn" style={{ border: '2px solid var(--border)' }}>
              <LucideIcon name="MessageCircle" size={20} />
              WhatsApp {locationKey} Support
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
