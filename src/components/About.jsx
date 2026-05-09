import LucideIcon from './LucideIcon'

export default function About() {
  const usps = [
    { 
      title: 'Setup Experts', 
      desc: 'We have deep knowledge in designing fish tanks and making strong pond liners.',
      icon: 'HardHat'
    },
    { 
      title: 'Top Quality', 
      desc: 'Every product is tested to make sure it is safe for fish and lasts long in the sun.',
      icon: 'ShieldCheck'
    },
    { 
      title: 'Fast Delivery', 
      desc: 'We have a strong network to make sure you get your order quickly anywhere in India.',
      icon: 'Truck'
    },
    { 
      title: 'Best Prices', 
      desc: 'We offer low wholesale prices for dealers and big fish farms directly from the factory.',
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
              Building Better <br />
              <span style={{ color: 'var(--primary)' }}>Fish Farms</span>
            </h2>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', marginBottom: 32, lineHeight: 1.8 }}>
              Started in 2022 in Raipur, Yesha Enterprises has quickly become India's top seller for fish farming tools. We don't just sell things; we help you build a farm that works.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {[
                { val: '100+', label: 'Dealers in India', icon: 'Globe' },
                { val: '15+', label: 'Pond Liner Types', icon: 'Layers' },
                { val: '2Y+', label: 'Top Seller', icon: 'Award' },
                { val: '5.0', label: 'Happy Customers', icon: 'Star' }
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
          <div className="about-features-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {usps.map((usp, i) => (
              <div 
                key={i} 
                className="premium-card about-usp-card" 
                style={{ 
                  padding: 32, 
                  marginTop: i % 2 !== 0 ? 40 : 0,
                  marginBottom: i % 2 === 0 ? 40 : 0,
                  textAlign: 'left'
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
                <h3 style={{ fontSize: '1.15rem', marginBottom: 12, textAlign: 'left' }}>{usp.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, textAlign: 'left' }}>
                  {usp.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 1024px) {
          #about > .container > div { grid-template-columns: 1fr !important; gap: 40px !important; }
          .about-features-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .about-usp-card { margin-top: 0 !important; margin-bottom: 0 !important; }
        }
      `}</style>
    </section>
  )
}
