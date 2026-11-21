import SEO from '../components/SEO'
import Contact from '../components/Contact'
import PageHero from '../components/PageHero'

export default function ContactPage({ contact }) {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Yesha Enterprises",
    "url": "https://yeshaenterprises.in/contact",
    "mainEntity": {
      "@type": "LocalBusiness",
      "name": "Yesha Enterprises",
      "telephone": "+91 99772 28924",
      "email": "yeshaenterprises01@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Office No. 71 Govind Sarang Parisar, New Rajendra Nagar",
        "addressLocality": "Raipur",
        "addressRegion": "Chhattisgarh",
        "postalCode": "492001",
        "addressCountry": "IN"
      }
    }
  };

  return (
    <>
      <SEO 
        title="Contact Yesha Enterprises — Raipur Central Office & Inquiries"
        description="Contact Yesha Enterprises in Raipur, Chhattisgarh for wholesale pricing, custom HDPE pond liner sizing, and dealer partnerships. Phone: +91 99772 28924."
        keywords="Contact Yesha Enterprises, Pond Liner Raipur Phone, Fish Farming Equipment Supplier Raipur Contact"
        url="https://yeshaenterprises.in/contact"
      />
      <script type="application/ld+json">
        {JSON.stringify(contactSchema)}
      </script>
      <PageHero
        title="Get In Touch"
        subtitle="Contact Yesha Enterprises"
        description="Bulk orders · Dealer inquiries · Product information — We're here to help"
        bgImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
        gradient="linear-gradient(135deg, #0a2540dd 0%, #0a4f7acc 50%, #22d3ee44 100%)"
        badge="CONTACT"
        icon="📞"
      />
      <Contact contact={contact} />
    </>
  )
}
