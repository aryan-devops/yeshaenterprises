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

  const displayProducts = previewMode ? filtered.slice(0, 6) : filtered

  return (
    <section id="products" className="products-section">
      <div className="container">
        {/* Section Header */}
        <div className="products-header animate-slide-up">
          <div className="section-pill">
            <LucideIcon name="Package" size={14} />
            OUR SOLUTIONS
          </div>
          <h2 className="products-title">Complete Biofloc Infrastructure</h2>
          <p className="products-subtitle">
            Wholesale prices, engineering-grade quality, and Pan-India delivery.
          </p>
        </div>

        {/* Filter Tabs */}
        {!previewMode && (
          <div className="filter-tabs">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setActiveTab(c)}
                className={`filter-tab ${activeTab === c ? 'active' : ''}`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {/* Product Grid — NEW DESIGN */}
        <div className="products-grid reveal-stagger" ref={reveal}>
          {displayProducts.map((p, i) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="pcard animate-slide-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Image */}
              <div className="pcard-img">
                {p.image_url
                  ? <img src={p.image_url} alt={p.name} />
                  : <div className="pcard-icon-wrap">
                      <LucideIcon name={p.icon || 'Package'} size={36} color="var(--primary)" strokeWidth={1.5} />
                    </div>
                }
                <span className="pcard-badge">{(p.stock_status || p.stockStatus || 'In Stock').toUpperCase()}</span>
              </div>

              {/* Info */}
              <div className="pcard-body">
                <span className="pcard-category">{p.category?.toUpperCase() || 'GENERAL'}</span>
                <h3 className="pcard-name">{p.name}</h3>
                <p className="pcard-desc">{p.description}</p>

                <div className="pcard-specs">
                  <LucideIcon name="Layers" size={14} color="var(--text-muted)" />
                  <span>{p.specs}</span>
                </div>

                <div className="pcard-footer">
                  <span className="pcard-price">{p.price_range || p.priceRange}</span>
                  <span className="pcard-cta">
                    <LucideIcon name="ArrowRight" size={16} />
                    View
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All CTA */}
        {previewMode && (
          <div className="products-cta">
            <a href="/products" className="hero-btn" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--primary)', padding: '14px 28px' }}>
              Explore Full Catalog
              <LucideIcon name="ArrowRight" size={18} />
            </a>
          </div>
        )}
      </div>

      <style>{`
        /* ====== PRODUCTS SECTION ====== */
        .products-section {
          padding: clamp(48px, 8vh, 100px) 0;
          background: var(--bg);
        }
        .products-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .section-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 100px;
          background: rgba(var(--primary-rgb), 0.1);
          color: var(--primary);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          margin-bottom: 14px;
        }
        .products-title {
          font-size: clamp(1.6rem, 5vw, 2.4rem);
          font-weight: 800;
          margin-bottom: 12px;
          font-family: var(--font-heading);
        }
        .products-subtitle {
          color: var(--text-secondary);
          font-size: clamp(0.9rem, 2.5vw, 1.05rem);
          max-width: 520px;
          margin: 0 auto;
        }

        /* Filter */
        .filter-tabs {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 40px;
          flex-wrap: wrap;
          padding: 6px;
          background: var(--surface);
          border-radius: 16px;
          border: 1px solid var(--border);
          width: fit-content;
          margin: 0 auto 40px;
        }
        .filter-tab {
          padding: 8px 18px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all 0.25s ease;
        }
        .filter-tab.active {
          background: var(--primary);
          color: white;
          box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3);
        }

        /* Product Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: clamp(14px, 3vw, 28px);
        }

        /* ====== NEW PRODUCT CARD (pcard) ====== */
        .pcard {
          display: flex;
          flex-direction: column;
          border-radius: 20px;
          overflow: hidden;
          background: var(--surface);
          border: 1px solid var(--border);
          text-decoration: none;
          color: inherit;
          transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
        }
        .pcard:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 32px rgba(var(--primary-rgb), 0.12);
          border-color: var(--primary);
        }
        .pcard-img {
          position: relative;
          height: 190px;
          background: var(--surface-hover);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pcard-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .pcard:hover .pcard-img img { transform: scale(1.06); }
        .pcard-icon-wrap {
          width: 72px;
          height: 72px;
          border-radius: 20px;
          background: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow);
        }
        .pcard-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 4px 10px;
          border-radius: 100px;
          background: var(--secondary);
          color: white;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .pcard-body {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }
        .pcard-category {
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--primary);
          letter-spacing: 0.12em;
        }
        .pcard-name {
          font-size: 1.05rem;
          font-weight: 700;
          line-height: 1.3;
          color: var(--text-primary);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .pcard-desc {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }
        .pcard-specs {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 10px;
          background: var(--surface-hover);
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          border: 1px solid var(--border);
          margin-top: 4px;
        }
        .pcard-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid var(--border);
        }
        .pcard-price {
          font-size: 0.9rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .pcard-cta {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary);
          padding: 6px 12px;
          border-radius: 8px;
          background: rgba(var(--primary-rgb), 0.1);
          transition: background 0.2s;
        }
        .pcard:hover .pcard-cta {
          background: var(--primary);
          color: white;
        }

        /* ====== MOBILE OVERRIDES ====== */
        @media (max-width: 520px) {
          .products-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
          .pcard-img {
            height: 120px;
          }
          .pcard-body {
            padding: 12px;
            gap: 4px;
          }
          .pcard-name {
            font-size: 0.88rem;
            -webkit-line-clamp: 2;
          }
          .pcard-desc { display: none; }
          .pcard-specs { display: none; }
          .pcard-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }
          .pcard-cta { width: 100%; justify-content: center; }
        }

        .products-cta {
          text-align: center;
          margin-top: 48px;
        }
      `}</style>
    </section>
  )
}
