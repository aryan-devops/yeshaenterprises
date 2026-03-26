import { useState, useEffect, useRef, useCallback } from 'react'
import LucideIcon from './LucideIcon'

export default function HeroSlider({ slides, contact }) {
  const [current, setCurrent] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const [paused, setPaused] = useState(false)
  const [progressKey, setProgressKey] = useState(0)
  const touchStartX = useRef(null)
  const intervalRef = useRef(null)
  const totalSlides = slides?.length || 0

  const goTo = useCallback((idx) => {
    setCurrent((idx + totalSlides) % totalSlides)
    setAnimKey(k => k + 1)
    setProgressKey(k => k + 1)
  }, [totalSlides])

  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    if (paused) return
    intervalRef.current = setInterval(() => {
      next()
    }, 5000)
    return () => clearInterval(intervalRef.current)
  }, [paused, next])

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) > 50) delta < 0 ? next() : prev()
    touchStartX.current = null
  }

  if (!totalSlides) return null
  const slide = slides[current]

  return (
    <section
      style={{ position: 'relative', height: '100vh', minHeight: 'clamp(600px, 100vh, 900px)', overflow: 'hidden' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <style>{`
        .hero-progress-bar {
          position: absolute; top: 0; left: 0; height: 6px;
          background: var(--primary);
          box-shadow: 0 0 15px var(--primary);
          animation: progress-horizontal 5s linear infinite;
          z-index: 100;
        }
        @keyframes progress-horizontal { from { width: 0; } to { width: 100%; } }

        .hero-content {
          position: relative; z-index: 10;
          max-width: 900px; padding: 0 24px;
        }

        .hero-title {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: clamp(2.2rem, 10vw, 4rem);
          color: white;
          line-height: 1.1;
          margin-bottom: 24px;
          opacity: 0;
          transform: translateY(30px);
          animation: slide-up 0.8s forwards;
        }

        .hero-description {
          color: rgba(255,255,255,0.75);
          margin-bottom: 30px;
          max-width: 520px;
          font-size: clamp(1rem, 4vw, 1.15rem);
          opacity: 0;
          animation: fade-in 1s 0.5s forwards;
        }

        @media (max-width: 768px) {
          .hero-content {
            padding-top: 40px;
            text-align: center;
          }
          .hero-icon-container {
            margin: 0 auto 24px;
          }
          .hero-description {
            margin: 0 auto 30px;
          }
          .hero-btns {
            flex-direction: column;
            width: 100%;
          }
          .hero-btn {
            width: 100%;
            justify-content: center;
          }
          .hero-controls {
            right: 20px !important;
            bottom: 30px !important;
          }
        }

        .hero-icon-container {
          width: 72px;
          height: 72px;
          border-radius: 20px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        /* ===== ICON FIX ===== */
        svg {
          display: block;
          transform: translateY(0.5px);
        }

        .hero-btn {
          padding: 16px 32px;
          border-radius: 100px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          transition: 0.3s;
        }

        .hero-btn-primary {
          background: white;
          color: black;
        }

        .hero-btn-secondary {
          background: rgba(255,255,255,0.1);
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
        }

        /* ===== SLIDER BUTTON FIX ===== */
        .slider-btn {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 0;
          line-height: 0;
          cursor: pointer;
          transition: 0.3s;
        }

        .slider-btn:hover {
          transform: scale(1.08);
          background: rgba(255,255,255,0.15);
        }

        .slider-btn svg {
          width: 20px;
          height: 20px;
        }
      `}</style>

      {/* Progress */}
      <div key={progressKey} className="hero-progress-bar" />

      {/* Slides */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {slides.map((s, i) => (
          <div key={i}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: i === current ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              zIndex: i === current ? 1 : 0
            }}
          >
            {/* Background Image Layer */}
            {s.image_url && (
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${s.image_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.5)'
              }} />
            )}
            
            <div style={{
              position: 'absolute', inset: 0,
              background: slide?.gradient || 'linear-gradient(135deg, rgba(10, 37, 64, 0.8), rgba(0,0,0,0.6))',
              mixBlendMode: slide?.image_url ? 'multiply' : 'normal'
            }} />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
        <div key={animKey} className="hero-content">
          <div className="hero-subtitle">{slide.subtitle}</div>

          <div className="hero-icon-container">
            <LucideIcon name={slide.icon} size={42} color="white" />
          </div>

          <h1 className="hero-title">{slide.headline}</h1>
          <p className="hero-description">{slide.description}</p>

          <div className="hero-btns" style={{ display: 'flex', gap: 16 }}>
            <a href="/products" className="hero-btn hero-btn-primary">
              {slide?.cta_primary || slide?.cta1 || 'View Catalog'}
              <LucideIcon name="ChevronRight" size={18} />
            </a>

            <a href={`https://wa.me/${contact?.whatsapp || ''}`} className="hero-btn hero-btn-secondary">
              <LucideIcon name="MessageCircle" size={18} />
              {slide?.cta_secondary || slide?.cta2 || 'Direct Inquiry'}
            </a>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="hero-controls" style={{
        position: 'absolute',
        bottom: 50,
        right: 50,
        display: 'flex',
        gap: 12,
        zIndex: 50
      }}>
        <button className="slider-btn" onClick={prev}>
          <LucideIcon name="ArrowLeft" color="white" />
        </button>

        <button className="slider-btn" onClick={next}>
          <LucideIcon name="ArrowRight" color="white" />
        </button>
      </div>
    </section>
  )
}