import { useState, useEffect, useRef } from 'react'
import LucideIcon from './LucideIcon'
import useScrollReveal from '../hooks/useScrollReveal'

const Stars = ({ count = 5 }) => (
  <div style={{ display: 'flex', gap: 3 }}>
    {Array.from({ length: count }).map((_, i) => (
      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ))}
  </div>
)

const INITIALS_COLORS = [
  ['#0ea5e9', '#0284c7'],
  ['#10b981', '#059669'],
  ['#8b5cf6', '#7c3aed'],
  ['#f59e0b', '#d97706'],
  ['#ef4444', '#dc2626'],
]

function Avatar({ name, icon }) {
  const initials = name?.split(' ').map(w => w[0]).slice(0, 2).join('') || '?'
  const colorIdx = (name?.charCodeAt(0) || 0) % INITIALS_COLORS.length
  const [bg, dark] = INITIALS_COLORS[colorIdx]
  return (
    <div style={{
      width: 46, height: 46, borderRadius: '50%',
      background: `linear-gradient(135deg, ${bg}, ${dark})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, color: 'white', fontWeight: 800, fontSize: '1rem',
      boxShadow: `0 4px 12px ${bg}55`
    }}>
      {initials}
    </div>
  )
}

export default function Testimonials({ reviews = [] }) {
  const reveal = useScrollReveal()
  const trackRef = useRef(null)
  const [active, setActive] = useState(0)

  const displayReviews = reviews.length > 0 ? reviews : [
    {
      name: 'Rakesh Jhunjhunwala',
      role: 'Fishery Owner, Raipur',
      rating: 5,
      content: 'The HDPE pond liners from Yesha Enterprises are top-notch. Durable and perfectly engineered for our Biofloc setup. Their technical support is exceptional.'
    },
    {
      name: 'Suresh Raina',
      role: 'Aquaculture Dealer, Bilaspur',
      rating: 5,
      content: 'We have been sourcing ring blowers and circular tanks for over a year. The consistency in quality and fair wholesale pricing makes them our preferred partner.'
    },
    {
      name: 'Anjali Sharma',
      role: 'Start-up Founder, Durg',
      rating: 5,
      content: 'Setting up a new fish farm was daunting, but Yesha Enterprises provided a complete solution from liners to aeration. Highly recommend for bulk requirements.'
    },
    {
      name: 'Vijay Patel',
      role: 'Farm Manager, Bhilai',
      rating: 5,
      content: 'Outstanding service and prompt delivery. The Biofloc tanks are exactly as described — built for durability. Repeat customer since day one.'
    }
  ]

  // Auto-scroll
  useEffect(() => {
    const interval = setInterval(() => {
      setActive(prev => (prev + 1) % displayReviews.length)
    }, 4500)
    return () => clearInterval(interval)
  }, [displayReviews.length])

  return (
    <section className="tm-section">
      <div className="container">
        {/* Header */}
        <div className="tm-header animate-slide-up">
          <div className="section-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 100, background: 'rgba(var(--primary-rgb),0.1)', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 14 }}>
            <LucideIcon name="MessageSquare" size={14} />
            CLIENT STORIES
          </div>
          <h2 className="tm-title">What Our Clients Say</h2>
          <p className="tm-subtitle">Trusted by fishery owners, dealers, and aquaculture start-ups across India.</p>
        </div>

        {/* Featured large card */}
        <div className="tm-featured reveal" ref={reveal}>
          <div className="tm-quote-mark">"</div>
          <p className="tm-featured-text">{displayReviews[active]?.content}</p>
          <div className="tm-featured-footer">
            <Avatar name={displayReviews[active]?.name} icon={displayReviews[active]?.avatar_icon} />
            <div>
              <div className="tm-name">{displayReviews[active]?.name}</div>
              <div className="tm-role">{displayReviews[active]?.role}</div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <Stars count={displayReviews[active]?.rating || 5} />
            </div>
          </div>

          {/* Dot Progress */}
          <div className="tm-dots">
            {displayReviews.map((_, i) => (
              <button
                key={i}
                className={`tm-dot ${i === active ? 'active' : ''}`}
                onClick={() => setActive(i)}
                aria-label={`Review ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Scrollable mini cards */}
        <div className="tm-track" ref={trackRef}>
          {displayReviews.map((r, i) => (
            <button
              key={i}
              className={`tm-mini ${i === active ? 'active' : ''}`}
              onClick={() => setActive(i)}
            >
              <Avatar name={r.name} icon={r.avatar_icon} />
              <div className="tm-mini-info">
                <div className="tm-mini-name">{r.name}</div>
                <div className="tm-mini-role">{r.role}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .tm-section {
          padding: clamp(48px, 8vh, 100px) 0;
          background: var(--bg);
          overflow: hidden;
        }
        .tm-header {
          text-align: center;
          margin-bottom: clamp(28px, 5vw, 48px);
        }
        .tm-title {
          font-size: clamp(1.7rem, 5vw, 2.6rem);
          font-weight: 800;
          font-family: var(--font-heading);
          margin-bottom: 12px;
          color: var(--text-primary);
        }
        .tm-subtitle {
          color: var(--text-secondary);
          font-size: clamp(0.88rem, 2.5vw, 1rem);
          max-width: 480px;
          margin: 0 auto;
        }

        /* Featured Card */
        .tm-featured {
          position: relative;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: clamp(24px, 5vw, 48px);
          margin-bottom: 20px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.06);
        }
        .tm-quote-mark {
          position: absolute;
          top: -10px;
          right: 24px;
          font-size: 9rem;
          font-weight: 900;
          color: rgba(var(--primary-rgb), 0.08);
          line-height: 1;
          font-family: Georgia, serif;
          pointer-events: none;
          user-select: none;
        }
        .tm-featured-text {
          font-size: clamp(1rem, 3vw, 1.2rem);
          line-height: 1.75;
          color: var(--text-secondary);
          font-style: italic;
          margin-bottom: 28px;
          position: relative;
          z-index: 1;
          min-height: 80px;
        }
        .tm-featured-footer {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        .tm-name {
          font-weight: 700;
          font-size: 1rem;
          color: var(--text-primary);
        }
        .tm-role {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        /* Dots */
        .tm-dots {
          display: flex;
          gap: 8px;
          margin-top: 24px;
        }
        .tm-dot {
          width: 8px; height: 8px;
          border-radius: 100px;
          background: var(--border);
          border: none; cursor: pointer;
          transition: all 0.3s ease;
        }
        .tm-dot.active {
          width: 28px;
          background: var(--primary);
        }

        /* Mini Cards Track */
        .tm-track {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 8px;
          scrollbar-width: none;
          -ms-overflow-style: none;
          scroll-snap-type: x mandatory;
        }
        .tm-track::-webkit-scrollbar { display: none; }

        .tm-mini {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          border-radius: 16px;
          border: 1.5px solid var(--border);
          background: var(--surface);
          cursor: pointer;
          flex-shrink: 0;
          scroll-snap-align: center;
          transition: all 0.25s ease;
          text-align: left;
          min-width: 200px;
        }
        .tm-mini.active {
          border-color: var(--primary);
          background: rgba(var(--primary-rgb), 0.06);
          box-shadow: 0 4px 16px rgba(var(--primary-rgb), 0.12);
        }
        .tm-mini-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
        }
        .tm-mini-role {
          font-size: 0.75rem;
          color: var(--text-muted);
          white-space: nowrap;
        }

        @media (max-width: 480px) {
          .tm-featured-footer { gap: 10px; }
          .tm-featured { padding: 20px; }
          .tm-quote-mark { font-size: 6rem; }
          .tm-mini { min-width: 170px; padding: 12px 14px; }
        }
      `}</style>
    </section>
  )
}
