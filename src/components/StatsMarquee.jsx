import LucideIcon from './LucideIcon'

export default function StatsMarquee({ stats }) {
  const doubleStats = [...stats, ...stats]

  return (
    <section style={{ 
      background: 'var(--surface)', 
      borderBottom: '1px solid var(--border)', 
      padding: '24px 0', 
      overflow: 'hidden',
      position: 'relative',
      zIndex: 20,
      width: '100%',
      maxWidth: '100vw'
    }}>
      <style>{`
        .marquee-container {
          display: flex; gap: 60px;
          animation: ticker 40s linear infinite;
          width: fit-content;
        }
        .marquee-container:hover { animation-play-state: paused; }
        .marquee-item {
          display: flex; align-items: center; gap: 12px;
          color: var(--text-secondary);
          font-weight: 700; font-size: 0.9rem;
          text-transform: uppercase; letter-spacing: 0.15em;
          white-space: nowrap;
        }
        .marquee-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--primary);
          box-shadow: 0 0 10px var(--primary);
        }
      `}</style>
      
      <div className="marquee-container">
        {doubleStats.map((stat, i) => (
          <div key={i} className="marquee-item">
            <div className="marquee-dot" />
            {stat}
          </div>
        ))}
      </div>
    </section>
  )
}
