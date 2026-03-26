import LucideIcon from './LucideIcon'
import useScrollReveal from '../hooks/useScrollReveal'

export default function Testimonials({ reviews = [] }) {
  const reveal = useScrollReveal()
  
  // Fallback reviews if none are provided
  const displayReviews = reviews.length > 0 ? reviews : [
    {
      name: 'Rakesh Jhunjhunwala',
      role: 'Fishery Owner, Raipur',
      content: 'The HDPE pond liners from Yesha Enterprises are top-notch. Durable and perfectly engineered for our Biofloc setup. Their technical support is exceptional.',
      avatar: 'UserCheck'
    },
    {
      name: 'Suresh Raina',
      role: 'Aquaculture Dealer, Bilaspur',
      content: 'We have been sourcing ring blowers and circular tanks for over a year. The consistency in quality and fair wholesale pricing makes them our preferred partner.',
      avatar: 'Briefcase'
    },
    {
      name: 'Anjali Sharma',
      role: 'Start-up Founder, Durg',
      content: 'Setting up a new fish farm was daunting, but Yesha Enterprises provided a complete solution from liners to aeration. Highly recommend for bulk requirements.',
      avatar: 'User'
    }
  ]

  return (
    <section style={{ padding: '120px 0', background: 'var(--surface)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 60 }} className="animate-slide-up">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: '100px',
            background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)',
            fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em',
            marginBottom: 16
          }}>
            <LucideIcon name="Package" size={16} />
            OUR CLIENT SAY
          </div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: 20 }}>What Client's say about us.</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto', fontSize: '1.1rem' }}>
            Our customer and there reviews are very much valuable for us and we're dedicated to provide best quality products and services to our customers.
          </p>
        </div>

        <div
          className="reveal-grid"
          ref={reveal}
          style={{ 
            display: 'flex', 
            gap: 32, 
            overflowX: displayReviews.length > 3 ? 'auto' : 'visible',
            paddingBottom: displayReviews.length > 3 ? 40 : 0,
            paddingLeft: 4, paddingRight: 4,
            scrollSnapType: 'x mandatory',
            scrollPadding: '0 24px',
            flexWrap: displayReviews.length > 3 ? 'nowrap' : 'wrap',
            justifyContent: displayReviews.length > 3 ? 'flex-start' : 'center',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none'
          }}
        >
          {displayReviews.map((r, i) => (
            <div 
              key={i} 
              className="premium-card stagger-1" 
              style={{ 
                padding: 40, 
                flex: displayReviews.length > 3 ? '0 0 400px' : '1 1 350px',
                maxWidth: displayReviews.length > 3 ? 400 : 450,
                scrollSnapAlign: 'center',
                margin: displayReviews.length > 3 ? '10px 0' : 0
              }}
            >
              <div style={{ color: 'var(--primary)', marginBottom: 24 }}>
                <LucideIcon name="Quote" size={40} strokeWidth={1} />
              </div>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: 32, fontStyle: 'italic', lineHeight: 1.7, minHeight: 120 }}>
                "{r.content}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14, background: 'rgba(var(--primary-rgb), 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
                }}>
                  <LucideIcon name={r.avatar_icon || r.avatar || 'User'} size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{r.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {displayReviews.length > 3 && (
          <style>{`
            .reveal-grid::-webkit-scrollbar { display: none; }
          `}</style>
        )}
      </div>
    </section>
  )
}
