import { useState } from 'react'
import { Link } from 'react-router-dom'
import LucideIcon from './LucideIcon'
import useScrollReveal from '../hooks/useScrollReveal'

export default function Products({ products, contact, previewMode = false }) {
  const reveal = useScrollReveal()
  const [activeTab, setActiveTab] = useState('All')
  const categories = ['All', 'Pond Liners', 'Blowers', 'Tanks', 'Generators', 'Shade Nets']

  const filtered = activeTab === 'All'
    ? products
    : products.filter(p => p.category === activeTab)

  const displayProducts = previewMode ? filtered.slice(0, 3) : filtered

  return (
    <section id="products" style={{ padding: 'clamp(60px, 10vh, 100px) 0', background: 'var(--bg)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 60 }} className="animate-slide-up">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: '100px',
            background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)',
            fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em',
            marginBottom: 16
          }}>
            <LucideIcon name="Package" size={16} />
            OUR SOLUTIONS
          </div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: 20 }}>Complete Biofloc Infrastructure</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto', fontSize: '1.1rem' }}>
            Wholesale prices, engineering-grade quality, and Pan-India delivery on all industrial aquaculture products.
          </p>
        </div>

        {/* Filter Tabs */}
        {!previewMode && (
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 60, flexWrap: 'wrap',
            padding: 8, background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)',
            width: 'fit-content', margin: '0 auto 60px'
          }}>
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setActiveTab(c)}
                style={{
                  padding: '10px 24px', borderRadius: 14,
                  fontSize: '0.9rem', fontWeight: 600,
                  transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                  background: activeTab === c ? 'var(--primary)' : 'transparent',
                  color: activeTab === c ? 'white' : 'var(--text-secondary)',
                  boxShadow: activeTab === c ? '0 8px 16px rgba(var(--primary-rgb), 0.2)' : 'none'
                }}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {/* Product Grid */}
        <div
          className="reveal-stagger"
          ref={reveal}
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'clamp(16px, 4vw, 32px)'
          }}
        >
          {displayProducts.map((p, i) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="product-card horizontal-card animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Product Image / Placeholder */}
              <div className="card-img-container">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{
                    width: 80, height: 80, borderRadius: 25,
                    background: 'var(--surface)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    boxShadow: 'var(--shadow)', transform: 'rotate(-5deg)'
                  }}>
                    <LucideIcon name={p.icon || 'Package'} size={40} color="var(--primary)" strokeWidth={1.5} />
                  </div>
                )}

                {/* Stock Badge */}
                <div style={{
                  position: 'absolute', top: 20, right: 20,
                  padding: '6px 14px', borderRadius: 100,
                  background: (p.stock_status || p.stockStatus) === 'In Stock' ? 'var(--secondary)' : 'var(--primary)',
                  color: 'white', fontWeight: 800, fontSize: '0.7rem',
                  letterSpacing: '0.05em', boxShadow: 'var(--shadow)'
                }}>
                  {(p.stock_status || p.stockStatus || 'In Stock').toUpperCase()}
                </div>
              </div>

              {/* Product Info */}
              <div className="card-content">
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.1em' }}>
                  {p.category?.toUpperCase() || 'GENERAL'}
                </div>
                <h3>{p.name}</h3>
                <p className="card-description">
                  {p.description}
                </p>

                <div className="card-specs" style={{
                  background: 'var(--surface-hover)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', gap: 10,
                  marginTop: 'auto'
                }}>
                  <LucideIcon name="Layers" size={16} color="var(--text-muted)" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{p.specs}</span>
                </div>

                <div className="card-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{p.price_range || p.priceRange}</div>
                  <div
                    className="hero-btn"
                    style={{
                      background: 'var(--primary)', color: 'white', margin: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      boxShadow: '0 8px 16px rgba(var(--primary-rgb), 0.2)'
                    }}
                  >
                    <LucideIcon name="MessageCircle" size={16} />
                    <span>Inquire</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All CTA for Preview Mode */}
        {previewMode && (
          <div style={{ textAlign: 'center', marginTop: 60 }}>
            <a
              href="/products"
              className="hero-btn"
              style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--primary)', padding: '16px 32px' }}
            >
              Explore Full Catalog
              <LucideIcon name="ArrowRight" size={20} />
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
