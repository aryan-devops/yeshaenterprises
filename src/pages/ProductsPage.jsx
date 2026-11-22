import SEO from '../components/SEO'
import Products from '../components/Products'
import PageHero from '../components/PageHero'

export default function ProductsPage({ products, contact }) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.yeshaenterprises.in/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": "https://www.yeshaenterprises.in/products"
      }
    ]
  };

  return (
    <>
      <SEO 
        title="Biofloc Fish Farming Equipment & HDPE Pond Liners Catalog"
        description="Browse wholesale aquaculture equipment: HDPE Pond Liners (200-500 GSM), Ring Blowers (1-5 HP), Jet Aerators, Biofloc Tanks & Shade Nets in Raipur, Chhattisgarh with pan-India delivery."
        keywords="HDPE Pond Liner Supplier, Ring Blower for Biofloc Fish Farming, Biofloc Fish Tank Price, Jet Aerator in Raipur, Pond Liner in Raipur, Fish Farming Equipment India"
        url="https://www.yeshaenterprises.in/products"
      />
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      <PageHero
        title="Our Products"
        subtitle="Complete Fish Farming Setup"
        description="Best prices · Custom sizes · Delivery everywhere in India"
        bgImage="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80"
        gradient="linear-gradient(135deg, #0a4f7add 0%, #0e7490cc 50%, #22d3ee55 100%)"
        badge="PRODUCTS"
        icon="📦"
      />
      <Products products={products} contact={contact} />
    </>
  )
}
