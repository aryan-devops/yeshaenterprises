import Products from '../components/Products'
import PageHero from '../components/PageHero'

export default function ProductsPage({ products, contact }) {
  return (
    <>
      <PageHero
        title="Our Products"
        subtitle="Complete Biofloc Farming Solutions"
        description="Wholesale prices · Custom sizes · PAN India delivery on all products"
        bgImage="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80"
        gradient="linear-gradient(135deg, #0a4f7add 0%, #0e7490cc 50%, #22d3ee55 100%)"
        badge="PRODUCTS"
        icon="📦"
      />
      <Products products={products} contact={contact} />
    </>
  )
}
