export default function BlobBackground() {
  const blobs = [
    { color: 'var(--primary)', size: '40vw', top: '-10%', left: '-10%', delay: '0s' },
    { color: 'var(--aqua)', size: '35vw', top: '60%', left: '70%', delay: '-5s' },
    { color: 'var(--secondary)', size: '30vw', top: '20%', left: '80%', delay: '-2s' },
    { color: 'var(--primary-dark)', size: '45vw', top: '70%', left: '-5%', delay: '-8s' }
  ]

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: -1,
      overflow: 'hidden',
      background: 'var(--bg)',
      pointerEvents: 'none'
    }}>
      <style>{`
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          mix-blend-mode: multiply;
          animation: float-blob-custom 25s infinite alternate ease-in-out;
        }
        [data-theme='dark'] .blob {
          opacity: 0.1;
          mix-blend-mode: screen;
          filter: blur(120px);
        }
        @keyframes float-blob-custom {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(5vw, -5vh) scale(1.1) rotate(120deg); }
          66% { transform: translate(-3vw, 3vh) scale(0.9) rotate(240deg); }
          100% { transform: translate(0, 0) scale(1) rotate(360deg); }
        }
      `}</style>

      {blobs.map((b, i) => (
        <div 
          key={i} 
          className="blob" 
          style={{
            backgroundColor: b.color,
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            animationDelay: b.delay
          }} 
        />
      ))}
      
      {/* Subtle Noise Texture overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: 0.02,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3Unique_id='yesha-noise'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        pointerEvents: 'none'
      }} />
    </div>
  )
}
