import LucideIcon from './LucideIcon'

export default function VisionMission() {
  const points = [
    {
      title: 'Our Vision',
      desc: 'To become the global benchmark for excellence in sustainable aquaculture infrastructure, empowering every farmer with industrial-grade tools for success.',
      icon: 'Eye',
      gradient: 'linear-gradient(135deg, #0f172a, #1e293b)',
      accent: 'var(--primary)'
    },
    {
      title: 'Our Mission',
      desc: 'To engineer and distribute high-performance Biofloc systems that are accessible, durable, and optimized for maximum aquatic yield across India.',
      icon: 'Target',
      gradient: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
      accent: 'white'
    }
  ]

  return (
    <section style={{ padding: '0 0 120px', background: 'var(--surface)' }}>
      <div className="container" style={{ paddingBottom: '40px' }}>
        <div className="vision-mission-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {points.map((p, i) => (
            <div 
              key={i} 
              className="premium-card animate-slide-up"
              style={{ 
                background: p.gradient, 
                padding: 'min(60px, 8vw) min(48px, 6vw)', 
                color: i === 0 ? 'var(--text-primary)' : 'white',
                border: 'none',
                minHeight: 'clamp(280px, 40vh, 320px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                animationDelay: `${i * 0.2}s`
              }}
            >
              <div style={{ 
                width: 'clamp(48px, 12vw, 64px)', height: 'clamp(48px, 12vw, 64px)', borderRadius: 'clamp(12px, 3vw, 20px)', 
                background: i === 0 ? 'rgba(var(--primary-rgb), 0.1)' : 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 'min(32px, 6vw)', color: p.accent
              }}>
                <LucideIcon name={p.icon} size={32} />
              </div>
              <h2 style={{ 
                fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', marginBottom: 20, color: i === 0 ? 'inherit' : 'white', 
                fontFamily: 'var(--font-heading)', fontWeight: 800,
                lineHeight: 1.2
              }}>
                {p.title}
              </h2>
              <p style={{ 
                fontSize: 'clamp(0.95rem, 3vw, 1.15rem)', lineHeight: 1.7, 
                color: i === 0 ? 'var(--text-secondary)' : 'rgba(255,255,255,0.85)',
                maxWidth: 400
              }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .container > div { gridTemplateColumns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
