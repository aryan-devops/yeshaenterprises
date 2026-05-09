import SEO from '../components/SEO'
import HeroSlider from '../components/HeroSlider'
import StatsMarquee from '../components/StatsMarquee'
import Products from '../components/Products'
import About from '../components/About'
import VisionMission from '../components/VisionMission'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import RecentBlogs from '../components/RecentBlogs'
import useScrollReveal from '../hooks/useScrollReveal'

export default function HomePage({ slides, stats, products, contact, testimonials, blogs }) {
  const visibleSlides = slides.filter(s => s.is_visible || s.visible)
  const reveal = useScrollReveal()

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Yesha Enterprises",
    "image": "https://yeshaenterprises.in/favicon.ico",
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
      "https://instagram.com/yeshaenterprises01",
      "https://www.tradeindia.com/yesha-enterprises-36400761/",
      "https://www.exportersindia.com/yeshaenterprises/",
      "https://www.indiamart.com/yesha-enterprises-raipur/profile.html"
    ]
  };

  return (
    <>
      <SEO 
        title="Best HDPE Pond Liner in India - Chhattisgarh, Maharashtra & Odisha"
        description="Yesha Enterprises is the top seller of HDPE Pond Liners and Biofloc tools in Raipur, Nagpur, and Bhubaneswar. Best prices and fast delivery for all your pond liner needs."
        keywords="hdpe pond liner, pond liner, hdpe liner, best pond liner, fish pond liners, small pond liner, blue pond liner, pond liners for sale near me, cheap pond liner, buy pond liner, lldpe pond liner, pond liner installation, 20 x 20 pond liner, flexible pond liner, pond liner manufacturers, pond liner nearby, pond liner installation near me, liner for pond on sale, fish pond liners near me, pond liner prices, water pond liner, bulk pond liner, pond liner 50 x 100, irrigation pond liner, wholesale pond liners, pond leak, discount pond liners, pond liner size, largest pond liner available, buy pond liner near me, stock pond liner, 20 by 20 pond liner, 100 by 100 pond liner, deep pond liner, pond liner for fish farming, hdpe pond liner manufacturer, hdpe liner pond, pond liner 15 x 20, pond liner manufacturers in india, high quality pond liner, pond liners direct, pond liner with drain, 50 by 50 pond liner, green pond liner, strong pond liner, best type of pond liner, hdpe pond, uv resistant pond liner, pond liner india, pond liner manufacturers in maharashtra, pond liner specifications, fish tank liner, best liner for ponds, hdpe fish pond liner, leak in pond liner, pond liner fitters near me, fish liner, best fish pond liner, quality pond liner, pond liner 4 x 4, best place to buy pond liner, durable pond liner, pond liner cover, pond liner supplier, good quality pond liner, pond sheeting, blue liner for pond, long pond liner, pond liner tank, 20 x 50 pond liner, 100 ft pond liner, 20 ft pond liner, pond liner in stock, pond liner design, water feature pond liner, fish pond membrane, pond liner green, fish farming pond design, biofloc tanks, 1000 sq ft pond, design of ponds"
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
