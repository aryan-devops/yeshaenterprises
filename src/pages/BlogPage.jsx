import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import PageHero from '../components/PageHero'
import LucideIcon from '../components/LucideIcon'

export default function BlogPage({ blogs }) {
  const [searchQuery, setSearchQuery] = useState('')

  const publishedBlogs = blogs.filter(b => b.is_published)

  const filteredBlogs = useMemo(() => {
    if (!searchQuery.trim()) return publishedBlogs
    const lowerQuery = searchQuery.toLowerCase()
    return publishedBlogs.filter(b => 
      b.title.toLowerCase().includes(lowerQuery) || 
      b.excerpt.toLowerCase().includes(lowerQuery) ||
      (b.keywords && b.keywords.toLowerCase().includes(lowerQuery))
    )
  }, [publishedBlogs, searchQuery])

  return (
    <>
      <SEO 
        title="Blog - Fish Farming Tips & Guides"
        description="Read the latest tips, guides, and news about Biofloc fish farming, HDPE pond liners, and aquaculture tools."
        keywords="fish farming blog, biofloc tips, pond liner guide, fish farming business"
      />
      <PageHero
        title="Fish Farming Knowledge Hub"
        subtitle="Guides, Tips & Industry News"
        description="Learn how to grow your fish farming business with expert advice."
        bgImage="https://images.unsplash.com/photo-1583091176882-62a26fae3d16?w=1920&q=80"
        gradient="linear-gradient(135deg, rgba(6, 78, 59, 0.9), rgba(5, 150, 105, 0.8))"
        badge="OUR BLOG"
        icon="BookOpen"
      />

      <section style={{ padding: '80px 0', background: 'var(--bg)', minHeight: '60vh' }}>
        <div className="container">
          
          {/* Search Bar */}
          <div style={{ maxWidth: 600, margin: '0 auto 60px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <LucideIcon name="Search" size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search guides, tips, or keywords..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%', padding: '18px 20px 18px 56px', borderRadius: 100, 
                border: '1px solid var(--border)', background: 'var(--surface)',
                fontSize: '1.1rem', color: 'var(--text-primary)', outline: 'none',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {filteredBlogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <LucideIcon name="SearchX" size={64} color="var(--text-muted)" style={{ marginBottom: 20 }} />
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>No articles found</h3>
              <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search terms.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 30 }}>
              {filteredBlogs.map(blog => (
                <Link to={`/blog/${blog.slug}`} key={blog.id} style={{ textDecoration: 'none' }}>
                  <div className="premium-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ width: '100%', height: 220, background: 'var(--surface-hover)', overflow: 'hidden' }}>
                      {blog.image_url ? (
                        <img src={blog.image_url} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="hover-zoom" />
                      ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                          <LucideIcon name="Image" size={48} />
                        </div>
                      )}
                    </div>
                    <div style={{ padding: 30, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16, lineHeight: 1.3 }}>
                        {blog.title}
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 24, flexGrow: 1 }}>
                        {blog.excerpt}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>
                        Read Article <LucideIcon name="ArrowRight" size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </section>
      <style>{`
        .hover-zoom:hover { transform: scale(1.05); }
      `}</style>
    </>
  )
}
