import LucideIcon from './LucideIcon'

export default function About() {
  const usps = [
    { 
      title: 'Infrastructure Experts', 
      desc: 'Deep technical expertise in Biofloc tank design and pond liner engineering.',
      icon: 'HardHat'
    },
    { 
      title: 'Quality Assurance', 
      desc: 'Every product undergoes rigorous testing for UV resistance and fish safety.',
      icon: 'ShieldCheck'
    },
    { 
      title: 'Supply Chain Sync', 
      desc: 'Optimized logistics network ensuring timely delivery across all Indian states.',
      icon: 'Truck'
    },
    { 
      title: 'Bulk Pricing', 
      desc: 'Manufacturer-direct wholesale rates for dealers and large-scale fish farms.',
      icon: 'TrendingDown'
    }
  ]

  return (
    <section id="about" style={{ padding: '120px 0', background: 'var(--surface)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80, alignItems: 'center' }}>
          {/* Left: Content */}
          <div className="animate-slide-up">
            <div style={{ 
              display: 'inline-flex', alignItems: 'center', gap: 8, 
              padding: '8px 16px', borderRadius: '100px', 
              background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)',
              fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em',
              marginBottom: 20
            }}>
              <LucideIcon name="History" size={16} />
              OUR STORY
            </div>
            
            <h2 style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', marginBottom: 24, lineHeight: 1.1 }}>
              Pioneering Sustainable <br />
              <span style={{ color: 'var(--primary)' }}>Aquaculture Systems</span>
            </h2>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', marginBottom: 32, lineHeight: 1.8 }}>
              Founded in 2022 in Raipur, Yesha Enterprises has rapidly become India's primary distributor for industrial-grade Biofloc infrastructure. We don't just sell products; we engineer the foundation for your aquatic success.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {[
                { val: '100+', label: 'Dealers Nationwide', icon: 'Globe' },
                { val: '15+', label: 'Pond Liner Specs', icon: 'Layers' },
                { val: '2Y+', label: 'Market Leadership', icon: 'Award' },
                { val: '5.0', label: 'Client Satisfaction', icon: 'Star' }
              ].map((stat, i) => (
                <div key={i} style={{ 
                  padding: 24, background: 'var(--bg)', borderRadius: 20, 
                  border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 
                }}>
                  <LucideIcon name={stat.icon} size={20} color="var(--primary)" />
                  <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stat.val}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Feature Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {usps.map((usp, i) => (
              <div 
                key={i} 
                className="premium-card" 
                style={{ 
                  padding: 32, 
                  marginTop: i % 2 !== 0 ? 40 : 0,
                  marginBottom: i % 2 === 0 ? 40 : 0
                }}
              >
                <div style={{ 
                  width: 56, height: 56, borderRadius: 16, 
                  background: 'rgba(var(--primary-rgb), 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20, color: 'var(--primary)'
                }}>
                  <LucideIcon name={usp.icon} size={28} />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: 12 }}>{usp.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {usp.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 1024px) {
          #about > .container > div { gridTemplateColumns: 1fr !important; gap: 60px !important; }
          #about > .container > div > div:last-child { marginTop: 0 !important; }
          .premium-card { marginTop: 0 !important; marginBottom: 0 !important; }
        }
      `}</style>
    </section>
  )
}
