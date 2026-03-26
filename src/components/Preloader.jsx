import React, { useEffect, useState } from 'react';
import logo from '../assets/main-logo-dark.svg';

export default function Preloader({ loading }) {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (!loading) {
      setFade(true);
      const timer = setTimeout(() => setShow(false), 800);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: '#020617',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: fade ? 0 : 1,
      visibility: fade ? 'hidden' : 'visible',
      transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.8s',
    }}>
      <div style={{ position: 'relative', width: 'clamp(280px, 80vw, 450px)', height: 'clamp(280px, 80vw, 450px)' }}>
        {/* Pulsing Glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '120%',
          height: '120%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          animation: 'pulse-glow 2s ease-in-out infinite'
        }} />
        
        {/* Logo */}
        <img 
          src={logo} 
          alt="Yesha Enterprises" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain',
            animation: 'float-logo 3s ease-in-out infinite'
          }} 
        />
      </div>

      <div style={{ marginTop: 40, width: 200, height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, var(--primary), var(--aqua))',
          width: '100%',
          animation: 'progress-bar 2s cubic-bezier(0.65, 0, 0.35, 1) infinite'
        }} />
      </div>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.6; }
        }
        @keyframes float-logo {
          0%, 100% { transform: translateY(0) scale(1.05); }
          50% { transform: translateY(-10px) scale(1); }
        }
        @keyframes progress-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
