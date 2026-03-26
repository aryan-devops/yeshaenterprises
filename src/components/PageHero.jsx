import LucideIcon from './LucideIcon'

export default function PageHero({ title, subtitle, description, bgImage, gradient, badge, icon }) {
  return (
    <section style={{ 
      position: 'relative', 
      minHeight: 450, 
      display: 'flex', 
      alignItems: 'center', 
      overflow: 'hidden',
      background: 'var(--bg)'
    }}>
      <style>{`
        .page-hero-bg {
          position: absolute; inset: 0;
          background-image: url(${bgImage});
          background-size: cover; background-position: center;
          background-attachment: fixed;
          filter: brightness(0.5) saturate(1.1);
          transform: scale(1.1);
          animation: slow-zoom 20s linear infinite alternate;
        }
        @keyframes slow-zoom { from { transform: scale(1.1); } to { transform: scale(1.2); } }
        
        .page-hero-overlay {
          position: absolute; inset: 0;
          background: ${gradient || 'linear-gradient(135deg, rgba(10,37,64,0.9), rgba(14,116,144,0.7))'};
        }
        
        .page-hero-content {
          position: relative; z-index: 10;
          padding: 100px 0;
          width: 100%;
        }
        
        .badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 16px; border-radius: 100px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          color: white; font-weight: 700; font-size: 0.75rem;
          letter-spacing: 0.1em; text-transform: uppercase;
          margin-bottom: 24px;
        }
        
        .page-title {
          font-family: var(--font-heading);
          font-size: clamp(2rem, 6vw, 4rem);
          color: white; font-weight: 800;
          margin-bottom: 16px; letter-spacing: -0.02em;
          line-height: 1.1;
        }
        
        .page-subtitle {
          font-size: 1.25rem; font-weight: 500;
          color: var(--primary); margin-bottom: 24px;
        }
        
        .page-desc {
          font-size: 1.1rem; color: rgba(255,255,255,0.7);
          max-width: 600px; line-height: 1.7;
        }
      `}</style>

      <div className="page-hero-bg" />
      <div className="page-hero-overlay" />
      
      {/* Mesh Gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 70% 20%, rgba(var(--primary-rgb), 0.2) 0%, transparent 40%)',
        zIndex: 5
      }} />

      <div className="container">
        <div className="page-hero-content animate-slide-up">
          <div className="badge">
            <LucideIcon name={icon} size={16} color="var(--primary)" />
            {badge}
          </div>
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
          <div style={{ width: 80, height: 4, background: 'var(--primary)', marginBottom: 32, borderRadius: 2 }} />
          <p className="page-desc">{description}</p>
        </div>
      </div>
      
      {/* Decorative Wave */}
      <div style={{
        position: 'absolute', bottom: -1, left: 0, right: 0,
        height: 60, background: 'var(--bg)',
        clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)',
        zIndex: 20
      }} />
    </section>
  )
}
