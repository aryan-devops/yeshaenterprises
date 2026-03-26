import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LucideIcon from '../components/LucideIcon'
import PageHero from '../components/PageHero'

export default function ProductDetailPage({ products, contact }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeImage, setActiveImage] = useState(0)

  const product = products.find(p => String(p.id) === id)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!product) {
    return (
      <div style={{ padding: '160px 0', textAlign: 'center' }}>
        <LucideIcon name="PackageX" size={64} color="var(--primary)" style={{ marginBottom: 24 }} />
        <h2>Product Not Found</h2>
        <button onClick={() => navigate('/products')} className="hero-btn" style={{ marginTop: 24 }}>
          Back to Catalog
        </button>
      </div>
    )
  }

  const gallery = [
    product.image_url,
    product.image_url_2,
    product.image_url_3
  ].filter(Boolean)

  if (gallery.length === 0) gallery.push(null)

  return (
    <>
      <PageHero
        title={product.name}
        subtitle={product.category?.toUpperCase() || 'PRODUCT DETAILS'}
        description={product.description}
        bgImage={product.image_url || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'}
        gradient="linear-gradient(135deg, rgba(2, 6, 23, 0.95), rgba(14, 116, 144, 0.85))"
        badge="Product Details"
        icon="PackageSearch"
      />
      <div style={{ background: 'var(--bg)', minHeight: '50vh', padding: '80px 0' }}>
        <div className="container">

        {/* Breadcrumbs */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 40, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
          <LucideIcon name="ChevronRight" size={14} />
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/products')}>Products</span>
          <LucideIcon name="ChevronRight" size={14} />
          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{product.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: 80, alignItems: 'start' }}>

          {/* Left: Gallery */}
          <div style={{ position: 'sticky', top: 120 }}>
            <div className="gallery-main" style={{
              borderRadius: 32,
              overflow: 'hidden',
              background: 'var(--surface)',
              aspectRatio: '1/1',
              border: '1px solid var(--border)',
              position: 'relative'
            }}>
              {gallery[activeImage] ? (
                <img
                  src={gallery[activeImage]}
                  alt={product.name}
                  className="zoom-image"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                />
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LucideIcon name="Package" size={80} color="var(--primary)" strokeWidth={1} />
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
                {gallery.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImage(i)}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 16,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: `2px solid ${activeImage === i ? 'var(--primary)' : 'var(--border)'}`,
                      opacity: activeImage === i ? 1 : 0.6
                    }}
                  >
                    {img ? (
                      <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <LucideIcon name="Image" size={24} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right */}
          <div>
            <div style={{
              display: 'inline-block', padding: '6px 14px', borderRadius: 100,
              background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)',
              fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', marginBottom: 20
            }}>
              {product.category.toUpperCase()}
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', fontWeight: 800, marginBottom: 16, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {product.name}
            </h1>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20, marginBottom: 32 }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {product.price_range}
              </div>
              <div style={{
                padding: '6px 12px', borderRadius: 8, background: product.stock_status === 'In Stock' ? 'var(--secondary)' : 'var(--primary)',
                color: 'white', fontSize: '0.7rem', fontWeight: 800
              }}>
                {product.stock_status?.toUpperCase()}
              </div>
            </div>

            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40 }}>
              {product.description}
            </p>

            {/* Specifications Card */}
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 32, padding: '24px', marginBottom: 40,
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12, fontWeight: 700 }}>
                <LucideIcon name="ShieldCheck" size={20} color="var(--primary)" />
                Technical Specifications
              </h4>
              <div className="specs-grid">
                {[
                  { label: 'Standard Spec', value: product.specs, icon: 'Settings' },
                  { label: 'Material Grade', value: product.material_grade || 'Industrial-Grade', icon: 'Layers' },
                  { label: 'Distribution', value: product.distribution || 'Pan India', icon: 'Truck' },
                  { label: 'Technical Support', value: product.support || '24/7 Support', icon: 'Headset' }
                ].map((spec, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <LucideIcon name={spec.icon} size={14} color="var(--text-muted)" />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{spec.label}</span>
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Button FIXED */}
            <div style={{ display: 'flex' }}>
              <a
                href={`https://wa.me/+91${contact.whatsapp?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`I am interested in ${product.name}. Please provide more details.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-btn btn-primary"
                style={{ flex: 1 }}
              >
                <LucideIcon name="MessageCircle" size={22} />
                <span>Send Inquiry on WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .gallery-main:hover .zoom-image {
          transform: scale(1.1);
        }

        .hero-btn:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 20px 40px rgba(var(--primary-rgb), 0.4);
        }

        @media (max-width: 1024px) {
          .container > div {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
      </div>
    </>
  )
}