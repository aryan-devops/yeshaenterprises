import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import SEO from '../components/SEO'
import LucideIcon from '../components/LucideIcon'

// Generate contextual FAQs based on blog keywords/title
function getBlogFAQs(blog) {
  const title = blog.title?.toLowerCase() || ''
  const keywords = blog.keywords?.toLowerCase() || ''

  if (title.includes('pond liner') || keywords.includes('pond liner')) {
    return [
      { q: 'What is the best HDPE pond liner for fish farming in India?', a: 'The best HDPE pond liner for fish farming is one that is UV-stabilized, fish-safe, and at least 300 GSM thick. Yesha Enterprises supplies premium HDPE liners starting from ₹15/sq.ft, available in all custom sizes across India.' },
      { q: 'How long does an HDPE pond liner last?', a: 'A high quality HDPE pond liner lasts 10 to 20 years when properly installed and maintained. UV-resistant liners last even longer under direct Indian sunlight.' },
      { q: 'What size pond liner do I need for a 10,000 litre fish tank?', a: 'For a 10,000 litre round Biofloc tank, you typically need a pond liner sized approximately 10ft x 10ft (3m x 3m) depending on the depth. Contact our team for a free size calculation.' },
      { q: 'Is HDPE pond liner safe for fish?', a: 'Yes. HDPE pond liners used for aquaculture are completely non-toxic and fish-safe. They do not leach any chemicals into the water, making them ideal for Biofloc and other fish farming systems.' },
      { q: 'Where can I buy pond liner near me in Chhattisgarh?', a: 'Yesha Enterprises is the top pond liner supplier in Chhattisgarh with offices in Raipur. We supply to Bilaspur, Durg, Rajnandgaon, and all surrounding areas. Call us or WhatsApp for same-day dispatch.' },
      { q: 'What is the difference between HDPE and LLDPE pond liner?', a: 'HDPE liners are stiffer and more puncture-resistant, ideal for large and deep ponds. LLDPE liners are more flexible and easier to install on uneven surfaces. For most fish farming setups, HDPE is the better choice.' },
    ]
  }

  if (title.includes('ring blower') || title.includes('blower') || keywords.includes('ring blower')) {
    return [
      { q: 'What size ring blower do I need for a Biofloc tank?', a: 'For a 10,000 litre Biofloc tank, a 1HP ring blower is sufficient. For 5 tanks of 10,000 litres each, you would need a 3HP to 5HP blower. Always add 20% extra capacity for safety.' },
      { q: 'How long does a ring blower last?', a: 'A good quality ring blower lasts 5 to 10 years with proper maintenance. Always keep it clean, dry, and protected from rain and direct sunlight.' },
      { q: 'What happens if the ring blower stops in Biofloc farming?', a: 'If aeration stops for more than 2 hours in a Biofloc system, the fish can die due to oxygen depletion. Always keep a diesel generator as a backup power source for your ring blower.' },
      { q: 'Can I use a ring blower for multiple fish tanks?', a: 'Yes. One ring blower can supply air to multiple tanks using a manifold pipe system. Our team will help you design the right aeration layout for your farm.' },
    ]
  }

  if (title.includes('biofloc') || keywords.includes('biofloc')) {
    return [
      { q: 'What is Biofloc fish farming?', a: 'Biofloc is a modern fish farming method where good bacteria grow in the water and act as living food for the fish. It uses less water and produces more fish per square meter compared to traditional ponds.' },
      { q: 'How much does it cost to start a Biofloc fish farm in India?', a: 'A small Biofloc setup with 2 tanks costs approximately ₹80,000 to ₹1,50,000 including the pond liner, ring blower, and fish tank. Larger commercial setups cost more.' },
      { q: 'Which fish are best for Biofloc farming?', a: 'Tilapia, Catfish (Magur), Shrimp, and Rohu are the most popular fish for Biofloc farming in India. Tilapia and Catfish grow the fastest in Biofloc conditions.' },
      { q: 'Can I do Biofloc farming at home?', a: 'Yes! Even with 1-2 round tanks in your backyard, you can start a small Biofloc fish farm. Yesha Enterprises can help you with all the equipment you need.' },
    ]
  }

  // Generic fallback FAQs
  return [
    { q: 'Where is Yesha Enterprises located?', a: 'Yesha Enterprises is headquartered in Raipur, Chhattisgarh. We supply fish farming equipment across Chhattisgarh, Maharashtra, Odisha, and Madhya Pradesh.' },
    { q: 'Do you provide delivery across India?', a: 'Yes, we deliver HDPE pond liners, ring blowers, fish tanks, and all Biofloc equipment across India. Contact us for bulk delivery pricing.' },
    { q: 'Can I get a custom size pond liner?', a: 'Absolutely. We manufacture pond liners in any custom size — from small 4x4 ft to large 100x100 ft. Call or WhatsApp us with your measurements for a free quote.' },
    { q: 'How do I contact Yesha Enterprises?', a: 'You can call us at +91 99772 28924 or WhatsApp us for quick support. We are available Monday to Saturday, 9 AM to 7 PM.' },
  ]
}

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(index === 0)
  return (
    <div style={{ borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left', padding: '20px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'none', border: 'none', cursor: 'pointer', gap: 16
        }}
      >
        <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{q}</span>
        <LucideIcon name={open ? 'ChevronUp' : 'ChevronDown'} size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
      </button>
      {open && (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8, paddingBottom: 20, marginBottom: 0 }}>
          {a}
        </p>
      )}
    </div>
  )
}

export default function BlogPostPage({ blogs, contact = {} }) {
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

  const faqs = getBlogFAQs(blog)

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "image": blog.image_url ? [blog.image_url] : [],
    "datePublished": blog.created_at,
    "dateModified": blog.created_at,
    "author": { "@type": "Organization", "name": "Yesha Enterprises" },
    "publisher": {
      "@type": "Organization",
      "name": "Yesha Enterprises",
      "logo": { "@type": "ImageObject", "url": "https://yeshaenterprises.in/favicon.ico" }
    },
    "description": blog.excerpt
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  }

  return (
    <>
      <SEO
        title={`${blog.title} - Yesha Enterprises Blog`}
        description={blog.excerpt}
        keywords={blog.keywords || "biofloc, fish farming, hdpe pond liner, aquaculture"}
        image={blog.image_url}
      />
      <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>

      <article style={{ background: 'var(--bg)', paddingBottom: '100px' }}>

        {/* Header */}
        <header style={{
          position: 'relative', height: '60vh', minHeight: 400, display: 'flex', alignItems: 'flex-end',
          background: blog.image_url ? `url(${blog.image_url}) center/cover` : 'var(--surface)'
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,0) 100%)' }} />
          <div className="container" style={{ position: 'relative', zIndex: 10, paddingBottom: 60, width: '100%' }}>
            <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)', textDecoration: 'none', marginBottom: 24, fontWeight: 700, fontSize: '0.9rem' }}>
              <LucideIcon name="ArrowLeft" size={16} /> Back to Blog
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <span style={{ background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: 100, fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Guide
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
                {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h1 style={{ color: 'var(--text-primary)', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1, maxWidth: 900, marginBottom: 0 }}>
              {blog.title}
            </h1>
          </div>
        </header>

        {/* Main Body */}
        <div className="container" style={{ marginTop: 60 }}>
          <div className="blog-grid">

            {/* Article Content */}
            <div
              className="blog-content"
              style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.9 }}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Right Sidebar */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Engage With Us — Dark Card */}
              <div style={{
                background: '#0f172a',
                borderRadius: 24,
                padding: 32,
                color: 'white',
                position: 'sticky',
                top: 120
              }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <LucideIcon name="MessageCircle" size={24} color="white" />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 10, color: 'white' }}>Engage With Us</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 24 }}>
                  Have a question about pond liners or Biofloc setup? Our expert team is ready to help you get started.
                </p>

                <a
                  href={`https://wa.me/${contact?.whatsapp || '919977228924'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    background: '#25D366', color: 'white', padding: '14px 20px',
                    borderRadius: 14, fontWeight: 700, fontSize: '0.95rem',
                    textDecoration: 'none', marginBottom: 12, transition: 'opacity 0.2s'
                  }}
                >
                  <LucideIcon name="MessageCircle" size={18} /> WhatsApp Us
                </a>

                <Link
                  to="/products"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    background: 'rgba(255,255,255,0.08)', color: 'white', padding: '14px 20px',
                    borderRadius: 14, fontWeight: 700, fontSize: '0.95rem',
                    textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)',
                    marginBottom: 24, transition: 'background 0.2s'
                  }}
                >
                  <LucideIcon name="ShoppingBag" size={18} /> View Products
                </Link>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20 }}>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>📞 Call Us Directly</p>
                  <p style={{ fontWeight: 700, fontSize: '1rem', color: 'white' }}>+91 99772 28924</p>
                </div>

                {blog.keywords && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20, marginTop: 20 }}>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>🏷 Tags</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {blog.keywords.split(',').slice(0, 6).map((tag, i) => (
                        <span key={i} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 100, fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="container" style={{ marginTop: 80 }}>
          <div style={{ maxWidth: 860 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LucideIcon name="HelpCircle" size={22} color="white" />
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 2 }}>Quick Answers</p>
                <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Frequently Asked Questions</h2>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 40, paddingLeft: 60 }}>
              Common questions related to this article, answered by our experts.
            </p>

            <div style={{ border: '1px solid var(--border)', borderRadius: 20, padding: '0 32px', background: 'var(--surface)' }}>
              {faqs.map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
              ))}
            </div>
          </div>
        </div>

      </article>

      <style>{`
        .blog-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 320px;
          gap: 60px;
          align-items: start;
        }
        @media (max-width: 1024px) {
          .blog-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .blog-content h2 { font-size: 1.8rem; margin-top: 40px; margin-bottom: 16px; color: var(--text-primary); font-weight: 800; }
        .blog-content h3 { font-size: 1.4rem; margin-top: 32px; margin-bottom: 12px; color: var(--text-primary); font-weight: 700; }
        .blog-content p { margin-bottom: 20px; }
        .blog-content ul, .blog-content ol { margin-bottom: 24px; padding-left: 24px; }
        .blog-content li { margin-bottom: 10px; }
        .blog-content strong { color: var(--text-primary); }
        .blog-content blockquote { border-left: 4px solid var(--primary); padding: 16px 20px; font-style: italic; color: var(--text-secondary); background: var(--surface); border-radius: 0 12px 12px 0; margin-bottom: 24px; }
        .blog-content img { max-width: 100%; border-radius: 16px; margin: 24px 0; }
        .blog-content a { color: var(--primary); text-decoration: underline; }
      `}</style>
    </>
  )
}
