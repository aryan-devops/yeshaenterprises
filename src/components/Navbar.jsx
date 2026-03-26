import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import LucideIcon from './LucideIcon'
import logoLight from '../assets/main-logo.svg'
import logoDark from '../assets/main-logo-dark.svg'
import brochurePdf from '../assets/yesha-enterprises.pdf'

export default function Navbar({ darkMode, toggleDarkMode, onAdminClick }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`)
      setMenuOpen(false)
      setSearchQuery('')
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Home', to: '/', icon: 'Home' },
    { label: 'Products', to: '/products', icon: 'Package' },
    { label: 'About', to: '/about', icon: 'Info' },
    { label: 'Contact', to: '/contact', icon: 'Phone' },
  ]

  return (
    <>
      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          height: var(--navbar-height);
          transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), 
                      background-color 0.4s ease,
                      box-shadow 0.4s ease;
          border-bottom: 1px solid transparent;
          will-change: transform, background-color;
        }

        .navbar-scrolled {
          background: var(--glass-bg);
          backdrop-filter: blur(12px) saturate(180%);
          border-bottom: 1px solid var(--glass-border);
          box-shadow: var(--shadow);
        }

        .nav-link {
          position: relative;
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.95rem;
          padding: 8px 12px;
          border-radius: 12px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 10px;
          line-height: 1;
        }

        .nav-link:hover {
          color: var(--primary);
          background: var(--surface-hover);
        }

        .nav-link.active {
          color: var(--primary);
          font-weight: 700;
          background: var(--surface-hover);
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 12px;
          right: 12px;
          height: 2px;
          background: var(--primary);
          border-radius: 2px;
        }

        .mobile-menu {
          position: fixed;
          top: var(--navbar-height);
          left: 0;
          right: 0;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: var(--shadow-xl);
          animation: slide-up 0.3s ease;
          z-index: 999;
        }

        /* ===== THEME BUTTON FIXED ===== */
        .theme-toggle {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0;
          line-height: 0;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .theme-toggle svg {
          width: 20px;
          height: 20px;
          display: block;
          transform: translateY(0.5px); /* optical alignment */
        }

        .theme-toggle:hover {
          transform: translateY(-2px);
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.2);
        }

        .admin-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 14px;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text-primary);
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .admin-btn:hover {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          box-shadow: 0 8px 16px rgba(var(--primary-rgb), 0.3);
        }
        .download-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 100px;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark, var(--primary)));
          color: white !important;
          font-weight: 700;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.25);
        }

        .download-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(var(--primary-rgb), 0.4);
        }
      `}</style>

      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div
          className="container"
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <NavLink
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <img
              src={darkMode ? logoDark : logoLight}
              alt="Yesha Enterprises"
              style={{ height: 'var(--logo-height)', width: 'auto', objectFit: 'contain' }}
            />
          </NavLink>

          {/* Desktop Nav */}
          <div
            className="nav-links-desktop"
            style={{ display: 'flex', alignItems: 'center', gap: 16 }}
          >
            {/* SEARCH FORM */}
            <form onSubmit={handleSearch} style={{ position: 'relative' }}>
              <LucideIcon name="Search" size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: 200, padding: '10px 16px 10px 42px', borderRadius: 100,
                  border: '1px solid var(--border)', background: 'var(--surface-hover)',
                  fontSize: '0.9rem', color: 'var(--text-primary)', outline: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'var(--primary)';
                  e.target.style.background = 'var(--surface)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(var(--primary-rgb), 0.15)';
                  e.target.style.width = '260px';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.background = 'var(--surface-hover)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.width = '200px';
                }}
              />
            </form>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '6px',
                borderRadius: '18px',
                border: '1px solid var(--glass-border)',
              }}
            >
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <LucideIcon name={link.icon} size={18} />
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>

            <div
              style={{
                width: '1px',
                height: '24px',
                background: 'var(--border)',
                margin: '0 12px',
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <a href={brochurePdf} download="Yesha_Enterprises_Brochure.pdf" className="download-btn hero-btn" style={{ marginLeft: 8, padding: '8px 16px', fontSize: '0.85rem' }}>
                <LucideIcon name="Download" size={16} strokeWidth={2.5} />
                <span>Brochure</span>
              </a>

              {/* FIXED BUTTON */}
              <button
                className="theme-toggle"
                onClick={toggleDarkMode}
                style={{ marginLeft: 8 }}
              >
                <LucideIcon
                  name={darkMode ? 'Sun' : 'Moon'}
                />
              </button>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="mobile-toggle"
            style={{
              display: 'none',
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)'
            }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <LucideIcon name={menuOpen ? 'X' : 'Menu'} size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: 8 }}>
            <LucideIcon name="Search" size={18} color="var(--text-primary)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '14px 16px 14px 44px', borderRadius: 100,
                border: '1px solid var(--border)', background: 'var(--surface-hover)',
                fontSize: '1rem', color: 'var(--text-primary)', outline: 'none'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </form>

          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
              onClick={() => setMenuOpen(false)}
              style={{ fontSize: '1.1rem', padding: '12px 16px' }}
            >
              <LucideIcon name={link.icon} size={22} />
              {link.label}
            </NavLink>
          ))}

          <div
            style={{
              height: '1px',
              background: 'var(--border)',
              margin: '8px 0',
            }}
          />

          <a href={brochurePdf} download="Yesha_Enterprises_Brochure.pdf" className="hero-btn btn-primary" style={{ width: '100%', marginTop: 8 }}>
            <LucideIcon name="Download" size={20} strokeWidth={2.5} />
            <span>Download Brochure</span>
          </a>

          <button
            className="theme-toggle"
            onClick={() => {
              toggleDarkMode()
              setMenuOpen(false)
            }}
            style={{ width: '100%', gap: 12 }}
          >
            <LucideIcon name={darkMode ? 'Sun' : 'Moon'} />
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .nav-links-desktop { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </>
  )
}