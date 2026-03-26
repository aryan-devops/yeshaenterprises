import { Link } from 'react-router-dom'
import LucideIcon from './LucideIcon'
import logo from '../assets/main-logo-dark.svg'

export default function Footer({ contact, onAdminClick }) {
  const year = new Date().getFullYear()

  const links = [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' }
  ]

  const categories = ['Pond Liners', 'Blowers', 'Tanks', 'Generators', 'Shade Nets']

  return (
    <footer style={{ background: '#020617', color: 'white', padding: '100px 0 40px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr', gap: 60, marginBottom: 80 }}>

          {/* Brand Col */}
          <div>
            <div style={{ marginBottom: 24 }}>
              <img 
                src={logo} 
                alt="Yesha Enterprises" 
                style={{ height: 150, width: 'auto', objectFit: 'contain' }} 
              />
            </div>

            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: 32 }}>
              India's premier distribution hub for industrial-grade Biofloc infrastructure.
            </p>

            {/* ✅ FIXED SOCIAL ICONS */}
            <div style={{ display: 'flex', gap: 16 }}>
              {[
                { icon: 'Instagram', link: contact.instagram },
                { icon: 'Facebook', link: contact.facebook },
                { icon: 'Globe', link: contact.indiamart } // IndiaMART
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.7)',
                    transition: 'all 0.3s ease'
                  }}
                  className="social-icon"
                >
                  <LucideIcon name={social.icon} size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: 28 }}>Sitemap</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {links.map((link, i) => (
                <Link key={i} to={link.to} className="footer-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: 28 }}>Solutions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {categories.map((cat, i) => (
                <Link key={i} to="/products" className="footer-link">
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: 28 }}>Central Hub</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* ✅ FIXED ICON ALIGNMENT */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <LucideIcon name="MapPin" size={58} color="var(--primary)" strokeWidth={2} />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                  {contact.address}
                </span>
              </div>

              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <LucideIcon name="Phone" size={22} color="var(--primary)" strokeWidth={2} />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                  {contact.phone}
                </span>
              </div>

              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <LucideIcon name="Mail" size={22} color="var(--primary)" strokeWidth={2} />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                  {contact.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          paddingTop: 40,
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20
        }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
            © {year} Yesha Enterprises. All rights reserved.
          </p>

          <button onClick={onAdminClick} style={{ fontSize: '0.85rem', display: 'flex', gap: 8 }}>
            <LucideIcon name="Lock" size={14} />
            Admin Portal
          </button>
        </div>
      </div>

      {/* ✅ CLEAN CSS */}
      <style>{`
        footer h4 {
          color: white !important;
        }

        .social-icon:hover {
          border-color: var(--primary) !important;
          color: white !important;
          transform: translateY(-4px) scale(1.05);
        }

        .footer-link {
          color: rgba(255,255,255,0.6);
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .footer-link:hover {
          color: var(--primary);
          transform: translateX(6px);
        }

        @media (max-width: 1024px) {
          footer > .container > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }

        @media (max-width: 640px) {
          footer > .container > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}