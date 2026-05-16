import { useParams, Link } from 'react-router-dom'
import LucideIcon from '../components/LucideIcon'
import SEO from '../components/SEO'

export default function PartnerDetailPage({ brands = [] }) {
  const { slug } = useParams()
  const brand = brands.find(b => b.slug === slug)

  if (!brand) {
    return (
      <div className="container" style={{ padding: '100px 24px', textAlign: 'center' }}>
        <h2>Partner Not Found</h2>
        <Link to="/" className="hero-btn btn-primary" style={{ marginTop: 24 }}>Back to Home</Link>
      </div>
    )
  }

  return (
    <div className="partner-detail-page">
      <SEO 
        title={`${brand.name} - Authorized Partner | Yesha Enterprises`}
        description={`Yesha Enterprises is a proud ${brand.type} of ${brand.name}. View our authorized dealer certificate and partnership details.`}
      />

      {/* Hero Section */}
      <section className="partner-hero">
        <div className="container">
          <Link to="/" className="back-link">
            <LucideIcon name="ArrowLeft" size={16} />
            Back to Home
          </Link>
          <div className="partner-hero-content">
            <div className="partner-logo-large">
              {brand.image_url ? (
                <img src={brand.image_url} alt={brand.name} />
              ) : (
                <LucideIcon name="Award" size={60} color="var(--primary)" />
              )}
            </div>
            <div className="partner-info-text">
              <span className="badge">{brand.type}</span>
              <h1 className="partner-name">{brand.name}</h1>
              <p className="partner-intro">
                Official partnership between Yesha Enterprises and {brand.name}. 
                Ensuring quality and trust for all your aquaculture needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certificate Section */}
      <section className="certificate-section">
        <div className="container">
          <div className="certificate-header">
            <h2 className="section-title">Authorization Certificate</h2>
            <p className="section-desc">
              We are officially certified by {brand.name} to distribute and support their products in India.
            </p>
          </div>

          <div className="certificate-container">
            {brand.certificate_url ? (
              <div className="certificate-frame">
                <img src={brand.certificate_url} alt={`${brand.name} Certificate`} className="certificate-img" />
                <div className="certificate-overlay">
                  <a href={brand.certificate_url} target="_blank" rel="noopener noreferrer" className="zoom-btn">
                    <LucideIcon name="Maximize2" size={24} />
                    View Full Certificate
                  </a>
                </div>
              </div>
            ) : (
              <div className="no-certificate">
                <div className="placeholder-icon">
                  <LucideIcon name="FileWarning" size={48} color="var(--text-muted)" />
                </div>
                <h3>Certificate Pending</h3>
                <p>The authorization certificate for {brand.name} will be uploaded soon.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <style>{`
        .partner-detail-page {
          background: var(--bg);
          min-height: 100vh;
        }
        .partner-hero {
          padding: 120px 0 60px;
          background: linear-gradient(180deg, rgba(var(--primary-rgb), 0.05) 0%, transparent 100%);
          border-bottom: 1px solid var(--border);
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 32px;
          transition: color 0.3s;
        }
        .back-link:hover { color: var(--primary); }
        .partner-hero-content {
          display: flex;
          align-items: center;
          gap: 40px;
        }
        .partner-logo-large {
          width: 140px;
          height: 140px;
          background: var(--surface);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border);
          flex-shrink: 0;
          overflow: hidden;
        }
        .partner-logo-large img {
          width: 80%;
          height: 80%;
          object-fit: contain;
        }
        .partner-info-text .badge {
          display: inline-block;
          background: rgba(var(--primary-rgb), 0.1);
          color: var(--primary);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .partner-name {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 800;
          margin-bottom: 12px;
          color: var(--text-primary);
        }
        .partner-intro {
          font-size: 1.1rem;
          color: var(--text-secondary);
          max-width: 600px;
          line-height: 1.6;
        }

        .certificate-section {
          padding: 80px 0;
        }
        .certificate-header {
          text-align: center;
          margin-bottom: 50px;
        }
        .certificate-header .section-title {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 16px;
        }
        .certificate-header .section-desc {
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
        }

        .certificate-container {
          max-width: 800px;
          margin: 0 auto;
        }
        .certificate-frame {
          background: white;
          padding: 24px;
          border-radius: 20px;
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--border);
          position: relative;
          overflow: hidden;
        }
        .certificate-img {
          width: 100%;
          height: auto;
          border-radius: 8px;
          display: block;
        }
        .certificate-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
          backdrop-filter: blur(4px);
        }
        .certificate-frame:hover .certificate-overlay {
          opacity: 1;
        }
        .zoom-btn {
          background: white;
          color: var(--text-primary);
          padding: 14px 24px;
          border-radius: 100px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: var(--shadow-lg);
          transition: transform 0.3s;
        }
        .zoom-btn:hover { transform: scale(1.05); }

        .no-certificate {
          text-align: center;
          padding: 60px 40px;
          background: var(--surface);
          border: 2px dashed var(--border);
          border-radius: 24px;
        }
        .placeholder-icon {
          margin-bottom: 20px;
        }
        .no-certificate h3 { margin-bottom: 8px; }
        .no-certificate p { color: var(--text-secondary); }

        @media (max-width: 768px) {
          .partner-hero-content {
            flex-direction: column;
            text-align: center;
            gap: 24px;
          }
          .partner-intro { margin: 0 auto; }
        }
      `}</style>
    </div>
  )
}
