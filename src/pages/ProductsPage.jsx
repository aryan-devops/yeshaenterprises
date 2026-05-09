import SEO from '../components/SEO'
import Products from '../components/Products'
import PageHero from '../components/PageHero'

export default function ProductsPage({ products, contact }) {
  return (
    <>
      <SEO 
        title="Products - Best Fish Farming Tools & HDPE Pond Liners"
        description="See our list of the best Biofloc fish farming products, HDPE pond liners, and air pumps. Get best prices and fast delivery across India."
      />
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
