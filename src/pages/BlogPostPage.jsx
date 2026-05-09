import React, { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import SEO from '../components/SEO'
import LucideIcon from '../components/LucideIcon'

export default function BlogPostPage({ blogs }) {
  const { slug } = useParams()
  const navigate = useNavigate()

  const blog = blogs.find(b => b.slug === slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!blog) {
    return (
      <div style={{ padding: '160px 0', textAlign: 'center' }}>
        <LucideIcon name="FileQuestion" size={64} color="var(--primary)" style={{ marginBottom: 24 }} />
        <h2>Article Not Found</h2>
        <button onClick={() => navigate('/blog')} className="hero-btn" style={{ marginTop: 24, background: 'var(--primary)', color: 'white' }}>
          Back to Blog
        </button>
      </div>
    )
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "image": blog.image_url ? [blog.image_url] : [],
    "datePublished": blog.created_at,
    "dateModified": blog.created_at,
    "author": {
      "@type": "Organization",
      "name": "Yesha Enterprises"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Yesha Enterprises",
      "logo": {
        "@type": "ImageObject",
        "url": "https://yeshaenterprises.in/favicon.ico"
      }
    },
    "description": blog.excerpt
  }

  return (
    <>
      <SEO 
        title={`${blog.title} - Yesha Enterprises Blog`}
        description={blog.excerpt}
        keywords={blog.keywords || "biofloc, fish farming, hdpe pond liner, aquaculture"}
        image={blog.image_url}
      />
      <script type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </script>

      <article style={{ background: 'var(--bg)', paddingBottom: '100px' }}>
        {/* Header */}
        <header style={{ 
          position: 'relative', height: '60vh', minHeight: 400, display: 'flex', alignItems: 'flex-end',
          background: blog.image_url ? `url(${blog.image_url}) center/cover` : 'var(--surface)'
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)' }} />
          <div className="container" style={{ position: 'relative', zIndex: 10, paddingBottom: 60, width: '100%' }}>
            
            <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'white', opacity: 0.8, textDecoration: 'none', marginBottom: 24, fontWeight: 600, fontSize: '0.9rem' }}>
              <LucideIcon name="ArrowLeft" size={16} /> Back to Blog
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <span style={{ background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: 100, fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Guide
              </span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600 }}>
                {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            
            <h1 style={{ color: 'white', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1, maxWidth: 900, marginBottom: 0 }}>
              {blog.title}
            </h1>
          </div>
        </header>

        <div className="container" style={{ marginTop: 60 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 60, alignItems: 'start' }}>
            
            {/* Main Content */}
            <div 
              className="blog-content" 
              style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Sidebar */}
            <div style={{ position: 'sticky', top: 120 }}>
              <div className="premium-card" style={{ padding: 30, borderRadius: 24, marginBottom: 30 }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: 20 }}>Need Fish Farming Tools?</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 24 }}>Yesha Enterprises is the top supplier of HDPE Pond Liners and Biofloc tools in India.</p>
                <Link to="/products" className="hero-btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>Shop Now</Link>
              </div>

              {blog.keywords && (
                <div style={{ padding: 24, borderRadius: 24, background: 'var(--surface-hover)', border: '1px solid var(--border)' }}>
                  <h4 style={{ fontSize: '1rem', marginBottom: 16 }}>Tags</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {blog.keywords.split(',').map((tag, i) => (
                      <span key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: 100, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </article>
      <style>{`
        @media (max-width: 1024px) {
          .container > div {
            grid-template-columns: 1fr !important;
          }
        }
        .blog-content h2 { font-size: 2rem; margin-top: 40px; margin-bottom: 20px; color: var(--text-primary); }
        .blog-content h3 { font-size: 1.5rem; margin-top: 30px; margin-bottom: 16px; color: var(--text-primary); }
        .blog-content p { margin-bottom: 24px; }
        .blog-content ul, .blog-content ol { margin-bottom: 24px; padding-left: 24px; }
        .blog-content li { margin-bottom: 12px; }
        .blog-content strong { color: var(--text-primary); }
        .blog-content blockquote { border-left: 4px solid var(--primary); padding-left: 16px; font-style: italic; color: var(--text-muted); background: var(--surface-hover); padding: 16px; border-radius: 8px; margin-bottom: 24px; }
        .blog-content img { max-width: 100%; border-radius: 16px; margin: 24px 0; }
        .blog-content a { color: var(--primary); text-decoration: underline; }
      `}</style>
    </>
  )
}
