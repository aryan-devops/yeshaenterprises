import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import HeroSlider from '../components/HeroSlider'
import StatsMarquee from '../components/StatsMarquee'
import Products from '../components/Products'
import About from '../components/About'
import VisionMission from '../components/VisionMission'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import RecentBlogs from '../components/RecentBlogs'
import AuthorizedDealers from '../components/AuthorizedDealers'
import LucideIcon from '../components/LucideIcon'
import useScrollReveal from '../hooks/useScrollReveal'

export default function HomePage({ slides, stats, products, contact, testimonials, blogs, brands }) {
  const visibleSlides = slides.filter(s => s.is_visible || s.visible)
  const reveal = useScrollReveal()

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Yesha Enterprises",
    "image": "https://www.yeshaenterprises.in/main-logo.svg",
    "@id": "https://www.yeshaenterprises.in/#organization",
    "url": "https://www.yeshaenterprises.in",
    "telephone": "+91 99772 28924",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Office No. 71 Govind Sarang Parisar, New Rajendra Nagar",
      "addressLocality": "Raipur",
      "addressRegion": "Chhattisgarh",
      "postalCode": "492001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 21.2514,
      "longitude": 81.6296
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "19:00"
    },
    "sameAs": [
      "https://facebook.com/yeshaenterprises01",
      "https://instagram.com/yeshaenterprises01",
      "https://www.tradeindia.com/yesha-enterprises-36400761/",
      "https://www.exportersindia.com/yeshaenterprises/",
      "https://www.indiamart.com/yesha-enterprises-raipur/profile.html"
    ],
    "areaServed": [
      { "@type": "City", "name": "Raipur" },
      { "@type": "State", "name": "Chhattisgarh" },
      { "@type": "State", "name": "Maharashtra" },
      { "@type": "State", "name": "Odisha" },
      { "@type": "State", "name": "Madhya Pradesh" },
      { "@type": "Country", "name": "India" }
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Yesha Enterprises",
    "url": "https://www.yeshaenterprises.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.yeshaenterprises.in/products?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <SEO 
        title="Yesha Enterprises | Fish Farming Equipment Supplier"
        description="Explore HDPE pond liners, ring blowers, aerators, biofloc tanks and fish farming equipment from Yesha Enterprises, Raipur. Enquire today."
        keywords="Fish Farming Equipment Supplier in India, HDPE Pond Liner Raipur, Ring Blower for Biofloc Fish Farming, Biofloc Tank Supplier, Jet Aerator in Raipur, Aquaculture Equipment Chhattisgarh"
        url="https://www.yeshaenterprises.in/"
      />
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      
      <HeroSlider slides={visibleSlides} contact={contact} />
      
      <div className="reveal" ref={reveal}>
        <div className="container" style={{ padding: '40px 0', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', opacity: 0.7 }}>
            <span style={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em' }}>#1 IN CHHATTISGARH</span>
            <span style={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em' }}>TOP QUALITY SUPPLIER</span>
            <span style={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em' }}>TRUSTED PARTNER</span>
          </div>
        </div>
        <StatsMarquee stats={stats} />
      </div>

      <div className="reveal" ref={reveal}>
        <Products products={products} contact={contact} previewMode={true} />
      </div>

      <div className="reveal" ref={reveal}>
        <About />
      </div>

      {/* Fish Farming Equipment Applications */}
      <section className="reveal" ref={reveal} style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto 50px' }}>
            <div className="section-pill" style={{ margin: '0 auto 12px' }}>
              <LucideIcon name="Layers" size={14} />
              APPLICATIONS & SOLUTIONS
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.6rem)', fontWeight: 800, marginBottom: 16 }}>
              Fish Farming Equipment Applications
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7 }}>
              Tailored aquaculture solutions engineered for commercial fish hatcheries, modern biofloc setups, and agricultural water reservoirs across India.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <div className="premium-card" style={{ padding: 32, borderRadius: 24, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(var(--primary-rgb), 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <LucideIcon name="Activity" size={24} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 12 }}>Biofloc Fish Farming Systems</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 20, flexGrow: 1 }}>
                Continuous oxygenation and clean water containment using heavy-duty round tarpaulin tanks, regenerative ring blowers, and high-efficiency AirOxy aeration tubes.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/product/biofloc-fish-tanks" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  Biofloc Tanks <LucideIcon name="ArrowRight" size={14} />
                </Link>
                <Link to="/product/ring-blowers-all-types" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  Ring Blowers <LucideIcon name="ArrowRight" size={14} />
                </Link>
              </div>
            </div>

            <div className="premium-card" style={{ padding: 32, borderRadius: 24, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(var(--primary-rgb), 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <LucideIcon name="Shield" size={24} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 12 }}>Commercial Pond Water Retention</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 20, flexGrow: 1 }}>
                Eliminate 95% of water seepage in earthen aquaculture ponds and irrigation reservoirs with virgin UV-treated 300 to 500-micron HDPE geomembrane pond liners.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/product/pond-liner-500-micron" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  500 Micron Liner <LucideIcon name="ArrowRight" size={14} />
                </Link>
                <Link to="/product/hdpe-pondliner-300-micron" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  300 Micron Liner <LucideIcon name="ArrowRight" size={14} />
                </Link>
              </div>
            </div>

            <div className="premium-card" style={{ padding: 32, borderRadius: 24, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(var(--primary-rgb), 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <LucideIcon name="Waves" size={24} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 12 }}>Surface & Jet Water Aeration</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 20, flexGrow: 1 }}>
                Prevent fish mortality and boost stocking density with high-output jet aerators and paddle wheel aerators designed for deep circulation in freshwater ponds and shrimp cultures.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/product/jet-aerator" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  Jet Aerator <LucideIcon name="ArrowRight" size={14} />
                </Link>
                <Link to="/product/paddle-wheel-aerator" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  Paddle Wheel <LucideIcon name="ArrowRight" size={14} />
                </Link>
              </div>
            </div>

            <div className="premium-card" style={{ padding: 32, borderRadius: 24, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(var(--primary-rgb), 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <LucideIcon name="Zap" size={24} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 12 }}>Farm Power & Climate Protection</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 20, flexGrow: 1 }}>
                Uninterrupted power backup for air blowers with heavy-duty 5 KVA generators and temperature regulation with high-density UV-resistant pond shade nets.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/product/generators-5-kv" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  5 KVA Generators <LucideIcon name="ArrowRight" size={14} />
                </Link>
                <Link to="/product/shade-nets" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  Shade Nets <LucideIcon name="ArrowRight" size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Areas We Serve */}
      <section className="reveal" ref={reveal} style={{ padding: '80px 0', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto 50px' }}>
            <div className="section-pill" style={{ margin: '0 auto 12px' }}>
              <LucideIcon name="MapPin" size={14} />
              DISTRIBUTION NETWORK
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.6rem)', fontWeight: 800, marginBottom: 16 }}>
              Areas We Serve
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7 }}>
              Operating from our central warehouse in Raipur, Yesha Enterprises delivers industrial-grade fish farming infrastructure across Chhattisgarh and key regional markets.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            <Link to="/location/raipur" className="premium-card" style={{ padding: 24, borderRadius: 20, textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.15rem', marginBottom: 8 }}>Raipur (HQ)</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>Central distribution hub. Local pickup, custom cutting, and immediate dispatch.</p>
            </Link>
            <Link to="/location/chhattisgarh" className="premium-card" style={{ padding: 24, borderRadius: 20, textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.15rem', marginBottom: 8 }}>Chhattisgarh</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>Serving Bilaspur, Durg, Bhilai, Korba, Rajnandgaon, and Jagdalpur.</p>
            </Link>
            <Link to="/location/odisha" className="premium-card" style={{ padding: 24, borderRadius: 20, textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.15rem', marginBottom: 8 }}>Odisha</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>Coastal shrimp and freshwater pond equipment for Bhubaneswar & Cuttack.</p>
            </Link>
            <Link to="/location/maharashtra" className="premium-card" style={{ padding: 24, borderRadius: 20, textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.15rem', marginBottom: 8 }}>Maharashtra</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>Supplying Nagpur, Vidarbha, Pune, and Mumbai with fast 3-day freight.</p>
            </Link>
            <Link to="/location/madhya-pradesh" className="premium-card" style={{ padding: 24, borderRadius: 20, textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.15rem', marginBottom: 8 }}>Madhya Pradesh</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>Aquaculture gear and pond liners for Indore, Bhopal, and Jabalpur.</p>
            </Link>
          </div>
        </div>
      </section>

      <div className="reveal" ref={reveal}>
        <VisionMission />
      </div>

      <div className="reveal" ref={reveal}>
        <AuthorizedDealers brands={brands} />
      </div>

      <div className="reveal" ref={reveal}>
        <RecentBlogs blogs={blogs} />
      </div>

      <div className="reveal" ref={reveal}>
        <Testimonials reviews={testimonials} />
      </div>

      <div className="reveal" ref={reveal}>
        <FAQ />
      </div>

      {/* Contact Yesha Enterprises */}
      <section className="reveal" ref={reveal} style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div className="container">
          <div className="premium-card" style={{ padding: '50px 40px', borderRadius: 32, background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.05), rgba(var(--primary-rgb), 0.02))', border: '1px solid rgba(var(--primary-rgb), 0.15)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, alignItems: 'center' }}>
              <div>
                <div className="section-pill" style={{ marginBottom: 12 }}>
                  <LucideIcon name="PhoneCall" size={14} />
                  GET IN TOUCH
                </div>
                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, marginBottom: 16 }}>
                  Contact Yesha Enterprises
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8, marginBottom: 24 }}>
                  Looking for custom HDPE pond liner cutting, bulk dealer pricing, or technical sizing for ring blowers and biofloc tanks? Our engineering team is ready to assist.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-primary)', fontWeight: 600 }}>
                    <LucideIcon name="MapPin" size={18} color="var(--primary)" />
                    <span>Office No. 71 Govind Sarang Parisar, New Rajendra Nagar, Raipur, Chhattisgarh — 492001</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-primary)', fontWeight: 600 }}>
                    <LucideIcon name="Phone" size={18} color="var(--primary)" />
                    <span>+91 99772 28924, +91 97704 03382</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-primary)', fontWeight: 600 }}>
                    <LucideIcon name="Mail" size={18} color="var(--primary)" />
                    <span>yeshaenterprises01@gmail.com</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center' }}>
                <a 
                  href={`https://wa.me/${contact.whatsapp?.replace(/[^0-9]/g, '') || '919977228924'}?text=${encodeURIComponent('Hello Yesha Enterprises, I would like to enquire about fish farming equipment and pond liners.')}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hero-btn btn-primary" 
                  style={{ justifyContent: 'center', width: '100%', padding: '18px 24px' }}
                >
                  <LucideIcon name="MessageCircle" size={22} />
                  <span>Enquire on WhatsApp</span>
                </a>
                <Link 
                  to="/contact" 
                  className="hero-btn btn-secondary" 
                  style={{ justifyContent: 'center', width: '100%', padding: '18px 24px', border: '1px solid var(--border)' }}
                >
                  <LucideIcon name="Send" size={20} />
                  <span>Submit Online Inquiry</span>
                </Link>
                <Link 
                  to="/products" 
                  style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}
                >
                  Explore Complete Product Catalog →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
