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
import useScrollReveal from '../hooks/useScrollReveal'

export default function HomePage({ slides, stats, products, contact, testimonials, blogs, brands }) {
  const visibleSlides = slides.filter(s => s.is_visible || s.visible)
  const reveal = useScrollReveal()

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Yesha Enterprises",
    "image": "https://yeshaenterprises.in/main-logo.svg",
    "@id": "https://yeshaenterprises.in/#organization",
    "url": "https://yeshaenterprises.in",
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
    "url": "https://yeshaenterprises.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://yeshaenterprises.in/products?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <SEO 
        title="Biofloc Fish Farming Equipment & HDPE Pond Liner Supplier in India"
        description="Yesha Enterprises is India's leading wholesale distributor of HDPE Pond Liners, Ring Blowers, Jet Aerators, and Biofloc Fish Tanks in Raipur, Chhattisgarh with PAN India delivery."
        keywords="Biofloc Fish Farming Equipment Supplier in India, Aquaculture Equipment Supplier, HDPE Pond Liner Supplier, Ring Blower Supplier, Fish Farming Equipment in Raipur, Aquaculture Products Chhattisgarh"
        url="https://yeshaenterprises.in"
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
    </>
  )
}
