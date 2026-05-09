import React from 'react'
import { Link } from 'react-router-dom'
import LucideIcon from './LucideIcon'

export default function RecentBlogs({ blogs }) {
  // Only show published blogs, maximum 3
  const recentBlogs = (blogs || []).filter(b => b.is_published).slice(0, 3)

  if (recentBlogs.length === 0) return null

  return (
    <section style={{ padding: '80px 0', background: 'var(--surface)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 800, marginBottom: 12 }}>
              Latest <span style={{ color: 'var(--primary)' }}>Articles</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Expert advice and guides for fish farming success.</p>
          </div>
          <Link to="/blog" className="hero-btn" style={{ background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)', padding: '12px 24px' }}>
            View All Posts <LucideIcon name="ArrowRight" size={18} style={{ marginLeft: 8 }} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 30 }}>
          {recentBlogs.map(blog => (
            <Link to={`/blog/${blog.slug}`} key={blog.id} style={{ textDecoration: 'none' }}>
              <div className="premium-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '100%', height: 200, background: 'var(--surface-hover)', overflow: 'hidden' }}>
                  {blog.image_url ? (
                    <img src={blog.image_url} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="hover-zoom" />
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      <LucideIcon name="Image" size={48} />
                    </div>
                  )}
                </div>
                <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12, lineHeight: 1.3 }}>
                    {blog.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 20, flexGrow: 1 }}>
                    {blog.excerpt?.substring(0, 100)}...
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>
                    Read Article <LucideIcon name="ArrowRight" size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        .hover-zoom:hover { transform: scale(1.05); }
      `}</style>
    </section>
  )
}
