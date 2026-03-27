import SEO from '../components/SEO'
import HeroSlider from '../components/HeroSlider'
import StatsMarquee from '../components/StatsMarquee'
import Products from '../components/Products'
import About from '../components/About'
import VisionMission from '../components/VisionMission'
import Testimonials from '../components/Testimonials'
import useScrollReveal from '../hooks/useScrollReveal'

export default function HomePage({ slides, stats, products, contact, testimonials }) {
  const visibleSlides = slides.filter(s => s.is_visible || s.visible)
  const reveal = useScrollReveal()

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Yesha Enterprises",
    "image": "https://yeshaenterprises.in/fish-icon.svg",
    "@id": "https://yeshaenterprises.in",
    "url": "https://yeshaenterprises.in",
    "telephone": "+91 99772 28924, 9770403382",
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
      "https://instagram.com/yeshaenterprises01"
    ]
  };

  return (
    <>
      <SEO 
        title="Best HDPE Pond Liner in Chhattisgarh, Maharashtra & Odisha"
        description="Yesha Enterprises: Top-rated HDPE Pond Liners & Biofloc equipment in Raipur, Nagpur, & Bhubaneswar. India's biggest dealer of GEOMEMBRANE liners. Get a quote!"
        keywords="pond liner Chhattisgarh, pond liner Maharashtra, pond liner Odisha, Biofloc fish farming India, HDPE pond liner price, ring blower Raipur"
      />
      <script type="application/ld+json">
        {JSON.stringify({
          ...organizationSchema,
          "areaServed": [
            { "@type": "State", "name": "Chhattisgarh" },
            { "@type": "State", "name": "Maharashtra" },
            { "@type": "State", "name": "Odisha" }
          ]
        })}
      </script>
      
      <HeroSlider slides={visibleSlides} contact={contact} />
      
      <div className="reveal" ref={reveal}>
        <div className="container" style={{ padding: '40px 0', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', opacity: 0.7 }}>
            <span style={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em' }}>#1 IN CHHATTISGARH</span>
            <span style={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em' }}>TOP SUPPLIER MAHARASHTRA</span>
            <span style={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em' }}>PREMIER PARTNER ODISHA</span>
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
        <Testimonials reviews={testimonials} />
      </div>
    </>
  )
}
