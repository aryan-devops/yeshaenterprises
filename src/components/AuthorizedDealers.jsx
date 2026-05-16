import LucideIcon from './LucideIcon'

export default function AuthorizedDealers({ brands = [] }) {
  // Use passed brands or empty array
  const displayBrands = brands && brands.length > 0 ? brands : [
    { name: 'Arun Aquaculture', type: 'Premium Partner', icon: 'Award' },
    { name: 'ADRIS Enviro Solution', type: 'Authorized Dealer', icon: 'ShieldCheck' },
    { name: 'COMSYN', type: 'Certified Distributor', icon: 'BadgeCheck' }
  ];

  return (
    <section className="dealers-section">
      <div className="container">
        <div className="dealers-header">
          <div className="badge-wrapper">
            <span className="badge" style={{ background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)' }}>
              <LucideIcon name="Shield" size={14} />
              AUTHORIZED DEALERS
            </span>
          </div>
          <h2 className="section-title">Official Partners</h2>
          <p className="section-desc">
            We are proud authorized dealers for the most trusted brands in the aquaculture and pond liner industry.
          </p>
        </div>

        <div className="dealers-grid">
          {displayBrands.map((brand, i) => (
            <div key={i} className="dealer-card animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="dealer-icon">
                {brand.image_url ? (
                  <img src={brand.image_url} alt={brand.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} />
                ) : (
                  <LucideIcon name={brand.icon || 'Award'} size={28} />
                )}
              </div>
              <div className="dealer-info">
                <h3 className="brand-name">{brand.name}</h3>
                <span className="brand-type">{brand.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .dealers-section {
          padding: clamp(40px, 8vh, 80px) 0;
          background: var(--surface);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .dealers-header {
          text-align: center;
          margin-bottom: clamp(30px, 5vh, 50px);
          max-width: 600px;
          margin-inline: auto;
        }
        .badge-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 16px;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .dealers-header .section-title {
          font-size: clamp(2rem, 5vw, 2.75rem);
          font-weight: 800;
          margin: 0 0 16px 0;
          font-family: var(--font-heading);
          letter-spacing: -0.02em;
        }
        .dealers-header .section-desc {
          color: var(--text-secondary);
          font-size: clamp(1rem, 2vw, 1.1rem);
          line-height: 1.6;
          margin: 0;
        }
        .dealers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }
        .dealer-card {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .dealer-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--primary);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .dealer-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          border-color: rgba(var(--primary-rgb), 0.2);
        }
        .dealer-card:hover::before {
          opacity: 1;
        }
        .dealer-icon {
          width: 56px;
          height: 56px;
          background: rgba(var(--primary-rgb), 0.05);
          color: var(--primary);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }
        .dealer-card:hover .dealer-icon {
          background: var(--primary);
          color: white;
        }
        .dealer-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .brand-name {
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0;
          color: var(--text);
        }
        .brand-type {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .dealers-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
          .dealer-card {
            flex-direction: column;
            text-align: center;
            padding: 20px;
          }
          .dealer-card::before {
            width: 100%;
            height: 4px;
            left: 0;
            top: 0;
          }
        }
        @media (max-width: 480px) {
          .dealers-grid {
            grid-template-columns: 1fr;
          }
          .dealer-card {
            flex-direction: row;
            text-align: left;
            padding: 16px;
          }
          .dealer-card::before {
            width: 4px;
            height: 100%;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </section>
  )
}
