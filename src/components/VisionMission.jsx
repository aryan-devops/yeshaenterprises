import LucideIcon from './LucideIcon'

export default function VisionMission() {
  const points = [
      title: 'Our Vision',
      desc: 'To become the global benchmark for excellence in sustainable aquaculture infrastructure, empowering every farmer with industrial-grade tools for success.',
      icon: 'Eye',
      gradient: 'linear-gradient(135deg, #0f172a, #1e293b)',
      accent: 'var(--primary)',
      textColor: 'white',
      descColor: 'rgba(255,255,255,0.85)'
    },
    {
      title: 'Our Mission',
      desc: 'To engineer and distribute high-performance Biofloc systems that are accessible, durable, and optimized for maximum aquatic yield across India.',
      icon: 'Target',
      gradient: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
      accent: 'white',
      textColor: 'white',
      descColor: 'rgba(255,255,255,0.85)'
    }
  ]

  return (
    <section className="vm-section">
      <div className="container">
        <div className="vm-grid">
          {points.map((p, i) => (
            <div key={i} className="vm-card animate-slide-up" style={{ background: p.gradient, animationDelay: `${i * 0.2}s` }}>
              {/* Icon + Title Row */}
              <div className="vm-header">
                <div className="vm-icon" style={{ background: i === 0 ? 'rgba(var(--primary-rgb), 0.15)' : 'rgba(255,255,255,0.2)', color: p.accent }}>
                  <LucideIcon name={p.icon} size={22} />
                </div>
                <h2 className="vm-title" style={{ color: p.textColor }}>{p.title}</h2>
              </div>
              <p className="vm-desc" style={{ color: p.descColor }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .vm-section {
          padding: clamp(40px, 6vh, 80px) 0;
          background: var(--surface);
        }
        .vm-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .vm-card {
          border-radius: 24px;
          padding: clamp(20px, 4vw, 36px);
          border: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .vm-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .vm-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .vm-title {
          font-size: clamp(1.1rem, 3.5vw, 1.6rem);
          font-weight: 800;
          margin: 0;
          font-family: var(--font-heading);
          line-height: 1.2;
        }
        .vm-desc {
          font-size: clamp(0.8rem, 2.5vw, 0.95rem);
          line-height: 1.65;
          margin: 0;
        }
        @media (max-width: 520px) {
          .vm-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .vm-card {
            padding: 18px;
            gap: 10px;
          }
        }
      `}</style>
    </section>
  )
}
