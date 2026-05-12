import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LucideIcon from '../components/LucideIcon'
import PageHero from '../components/PageHero'
import SEO from '../components/SEO'

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

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": [
      product.image_url,
      product.image_url_2,
      product.image_url_3
    ].filter(Boolean),
    "description": product.description,
    "sku": `YESHA-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": "Yesha Enterprises"
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "INR",
      "price": product.price_range?.split('-')[0]?.replace(/[^0-9]/g, '') || "0",
      "availability": product.stock_status === 'In Stock' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Yesha Enterprises"
      }
    }
  };

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
        "name": "Products",
        "item": "https://yeshaenterprises.in/products"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": window.location.href
      }
    ]
  };

  return (
    <>
      <SEO 
        title={product.name}
        description={product.description?.substring(0, 160)}
        keywords={`${product.name}, ${product.category}, Biofloc ${product.name}, ${product.name} price Raipur`}
        image={product.image_url}
      />
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
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

          <div className="product-layout">

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
                <div style={{ display: 'flex', gap: 16, marginTop: 24, overflowX: 'auto', paddingBottom: 8 }}>
                  {gallery.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setActiveImage(i)}
                      style={{
                        flexShrink: 0,
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
            <div style={{ minWidth: 0, overflowWrap: 'break-word', wordWrap: 'break-word' }}>
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
                  {(product.specifications && product.specifications.length > 0 ? product.specifications : [
                    { label: 'Standard Specs', value: product.specs, icon: 'Settings' },
                    { label: 'Quality', value: product.material_grade || 'Top Quality', icon: 'Layers' },
                    { label: 'Delivery', value: product.distribution || 'All over India', icon: 'Truck' },
                    { label: 'Help', value: product.support || '24/7 Support', icon: 'Headset' }
                  ]).map((spec, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <LucideIcon name={spec.icon || 'Settings'} size={14} color="var(--text-muted)" />
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
                  href={`https://wa.me/${contact.whatsapp?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`I am interested in ${product.name}. Please provide more details.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-btn btn-primary"
                  style={{ flex: 1 }}
                >
                  <LucideIcon name="MessageCircle" size={22} />
                  <span>Send Inquiry on WhatsApp</span>
                </a>
              </div>

              {/* Quick Share Section */}
              <div style={{ marginTop: 24, padding: '20px', borderRadius: 20, background: 'var(--surface-hover)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Share with others</div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out ${product.name} at Yesha Enterprises: ${window.location.href}`)}`, '_blank')}
                    style={{ flex: '1 1 auto', minWidth: '100px', padding: '10px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: '0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <LucideIcon name="MessageSquare" size={16} color="#25D366" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>WhatsApp</span>
                  </button>
                  <button 
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                    style={{ flex: '1 1 auto', minWidth: '100px', padding: '10px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: '0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <LucideIcon name="Facebook" size={16} color="#1877F2" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Facebook</span>
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }}
                    style={{ flex: '1 1 auto', minWidth: '100px', padding: '10px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: '0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <LucideIcon name="Copy" size={16} color="var(--text-muted)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Copy Link</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* You May Also Like Section */}
          <div style={{ marginTop: 120 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
              <div>
                <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>You May Also Like</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Explore more premium tools and equipment for your farm.</p>
              </div>
              <button 
                onClick={() => navigate('/products')} 
                style={{ background: 'none', border: '1px solid var(--border)', padding: '12px 24px', borderRadius: 100, fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center', gap: 8 }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                View Catalog <LucideIcon name="ArrowRight" size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 30 }}>
              {products
                .filter(p => String(p.id) !== id) // Exclude current product
                .sort(() => Math.random() - 0.5) // Randomize
                .slice(0, 3) // Take 3
                .map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => {
                      navigate(`/product/${item.id}`)
                      window.scrollTo(0, 0)
                    }}
                    className="premium-card" 
                    style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%' }}
                  >
                    <div style={{ height: 200, background: 'var(--surface-hover)', overflow: 'hidden', position: 'relative' }}>
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <LucideIcon name="Package" size={40} color="var(--primary)" />
                        </div>
                      )}
                      <div style={{ position: 'absolute', top: 12, right: 12, background: 'var(--primary)', color: 'white', padding: '4px 10px', borderRadius: 6, fontSize: '0.65rem', fontWeight: 800 }}>
                        {item.category?.toUpperCase()}
                      </div>
                    </div>
                    <div style={{ padding: 24, flexGrow: 1 }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 10, color: 'var(--text-primary)' }}>{item.name}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20, lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.description}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{item.price_range}</span>
                        <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', fontWeight: 700 }}>
                          Details <LucideIcon name="ChevronRight" size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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

        .product-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
          gap: 80px;
          align-items: start;
        }

        .specs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        @media (max-width: 600px) {
          .specs-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }

        @media (max-width: 1024px) {
          .product-layout {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
      </div>
    </>
  )
}