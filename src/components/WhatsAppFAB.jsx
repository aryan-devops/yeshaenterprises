import LucideIcon from './LucideIcon'

export default function WhatsAppFAB({ contact }) {
  return (
    <a
      href={`https://wa.me/${contact.whatsapp}?text=Hi, I'd like to get a professional consultation for Biofloc products.`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 18,
        background: '#25d366',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
        zIndex: 1000,
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        animation: 'fab-bounce 3s infinite'
      }}
      className="wa-fab"
    >
      <style>{`
        .wa-fab:hover {
          transform: translateY(-6px) scale(1.08) rotate(8deg);
          box-shadow: 0 12px 32px rgba(37, 211, 102, 0.5);
        }
        @keyframes fab-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
      <LucideIcon name="MessageCircle" size={26} />

      {/* Pulse Effect */}
      <div style={{
        position: 'absolute',
        inset: -4,
        borderRadius: 22,
        border: '2px solid rgba(37, 211, 102, 0.6)',
        animation: 'pulse-ring 2s infinite',
        pointerEvents: 'none'
      }} />
    </a>
  )
}
