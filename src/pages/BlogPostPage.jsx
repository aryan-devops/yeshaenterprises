import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import SEO from '../components/SEO'
import LucideIcon from '../components/LucideIcon'

function getBlogFAQs(blog) {
  const title = blog.title?.toLowerCase() || ''
  const keywords = blog.keywords?.toLowerCase() || ''

  if (title.includes('pond liner') || keywords.includes('pond liner')) {
    return [
      { q: 'What is the best HDPE pond liner for fish farming in India?', a: 'The best HDPE pond liner is UV-stabilized, fish-safe, and at least 300 GSM thick. Yesha Enterprises supplies premium HDPE liners starting from ₹15/sq.ft in all custom sizes.' },
      { q: 'How long does an HDPE pond liner last?', a: 'A high quality HDPE pond liner lasts 10 to 20 years when properly installed. UV-resistant liners last even longer under direct Indian sunlight.' },
      { q: 'What size pond liner do I need for a 10,000 litre fish tank?', a: 'For a 10,000 litre round Biofloc tank, you typically need a liner of approximately 10ft x 10ft depending on depth. Contact us for a free size calculation.' },
      { q: 'Is HDPE pond liner safe for fish?', a: 'Yes. HDPE pond liners are completely non-toxic and fish-safe. They do not leach any chemicals into the water, making them ideal for Biofloc and aquaculture systems.' },
      { q: 'Where can I buy pond liner in Chhattisgarh?', a: 'Yesha Enterprises is the top pond liner supplier in Chhattisgarh with offices in Raipur. We supply to Bilaspur, Durg, Rajnandgaon, and all surrounding areas.' },
      { q: 'What is the difference between HDPE and LLDPE pond liner?', a: 'HDPE liners are stiffer and more puncture-resistant, ideal for large and deep ponds. LLDPE liners are more flexible. For most fish farming setups, HDPE is the better choice.' },
    ]
  }
  if (title.includes('ring blower') || keywords.includes('ring blower')) {
    return [
      { q: 'What size ring blower do I need for a Biofloc tank?', a: 'For a 10,000 litre Biofloc tank, a 1HP ring blower is sufficient. For 5 tanks of 10,000 litres each, you would need a 3HP to 5HP blower.' },
      { q: 'How long does a ring blower last?', a: 'A good quality ring blower lasts 5 to 10 years with proper maintenance. Always keep it clean and protected from rain.' },
      { q: 'What happens if the ring blower stops in Biofloc?', a: 'If aeration stops for more than 2 hours, fish can die due to oxygen loss. Always keep a diesel generator as a backup.' },
      { q: 'Can I use one ring blower for multiple tanks?', a: 'Yes. One ring blower can supply air to multiple tanks using a manifold pipe system. Our team can help you design the right aeration layout.' },
    ]
  }
  if (title.includes('biofloc') || keywords.includes('biofloc')) {
    return [
      { q: 'What is Biofloc fish farming?', a: 'Biofloc is a modern fish farming method where good bacteria grow in the water and act as natural food for the fish. It uses less water and produces more fish per square meter.' },
      { q: 'How much does it cost to start Biofloc farming in India?', a: 'A small Biofloc setup with 2 tanks costs approximately ₹80,000 to ₹1,50,000 including pond liner, ring blower, and fish tank.' },
      { q: 'Which fish are best for Biofloc farming?', a: 'Tilapia, Catfish (Magur), Shrimp, and Rohu are the most popular choices for Biofloc farming in India. Tilapia and Catfish grow the fastest.' },
      { q: 'Can I do Biofloc farming at home?', a: 'Yes! Even 1-2 round tanks in your backyard can start a small Biofloc fish farm. We can help you with all the equipment.' },
    ]
  }
  return [
    { q: 'Where is Yesha Enterprises located?', a: 'Yesha Enterprises is headquartered in Raipur, Chhattisgarh. We supply across Chhattisgarh, Maharashtra, Odisha, and Madhya Pradesh.' },
    { q: 'Do you deliver across India?', a: 'Yes, we deliver HDPE pond liners, ring blowers, fish tanks, and all Biofloc equipment across India. Contact us for bulk delivery pricing.' },
    { q: 'Can I get a custom size pond liner?', a: 'Absolutely. We manufacture pond liners in any custom size — from 4x4 ft to 100x100 ft. Call or WhatsApp us for a free quote.' },
    { q: 'How do I contact Yesha Enterprises?', a: 'Call us at +91 99772 28924 or WhatsApp for quick support. We are available Monday to Saturday, 9 AM to 7 PM.' },
  ]
}

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(index === 0)
  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left', padding: '20px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          background: 'none', border: 'none', cursor: 'pointer', gap: 16
        }}
      >
        <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{q}</span>
        <span style={{ flexShrink: 0, marginTop: 2 }}>
          <LucideIcon name={open ? 'ChevronUp' : 'ChevronDown'} size={20} color="var(--primary)" />
        </span>
      </button>
      {open && (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8, paddingBottom: 20, margin: 0 }}>
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

  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  if (!blog) {
    return (
      <div style={{ padding: '160px 0', textAlign: 'center' }}>
        <LucideIcon name="FileQuestion" size={64} color="var(--primary)" />
        <h2 style={{ marginTop: 24 }}>Article Not Found</h2>
        <button onClick={() => navigate('/blog')} className="hero-btn" style={{ marginTop: 24, background: 'var(--primary)', color: 'white' }}>
          Back to Blog
        </button>
      </div>
    )
  }

  const faqs = getBlogFAQs(blog)

  const articleSchema = {
    "@context": "https://schema.org", "@type": "Article",
    "headline": blog.title, "image": blog.image_url ? [blog.image_url] : [],
    "datePublished": blog.created_at, "dateModified": blog.created_at,
    "author": { "@type": "Organization", "name": "Yesha Enterprises" },
    "publisher": { "@type": "Organization", "name": "Yesha Enterprises", "logo": { "@type": "ImageObject", "url": "https://yeshaenterprises.in/favicon.ico" } },
    "description": blog.excerpt
  }

  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } }))
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

      <article style={{ background: 'var(--bg)', paddingBottom: 100 }}>

        {/* Hero Header */}
        <header style={{
          position: 'relative', height: '60vh', minHeight: 400,
          display: 'flex', alignItems: 'flex-end',
          background: blog.image_url ? `url(${blog.image_url}) center/cover` : 'var(--surface)'
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.75) 45%, rgba(255,255,255,0) 100%)' }} />
          <div className="container" style={{ position: 'relative', zIndex: 10, paddingBottom: 60, width: '100%' }}>
            <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: 20, fontWeight: 600, fontSize: '0.9rem' }}>
              <LucideIcon name="ArrowLeft" size={16} /> Back to Blog
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ background: 'var(--primary)', color: 'white', padding: '4px 14px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Guide</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h1 style={{ color: 'var(--text-primary)', fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', fontWeight: 800, lineHeight: 1.15, maxWidth: 860, margin: 0 }}>
              {blog.title}
            </h1>
          </div>
        </header>

        {/* Content + Sidebar Grid */}
        <div className="container" style={{ marginTop: 60 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 48, alignItems: 'start' }} className="blog-layout">

            {/* Article Body */}
            <div
              className="blog-content"
              style={{ fontSize: '1.08rem', color: 'var(--text-secondary)', lineHeight: 1.9, minWidth: 0 }}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Sidebar */}
            <aside>
              {/* Engage With Us — Dark Card */}
              <div style={{
                background: '#0f172a', borderRadius: 20, padding: 28,
                position: 'sticky', top: 120,
              }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white', marginBottom: 8 }}>Engage With Us</h3>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: 22 }}>
                  Need expert advice on pond liners or Biofloc setup? Talk to our team directly.
                </p>

                <a
                  href={`https://wa.me/${contact?.whatsapp || '919977228924'}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#22c55e', color: 'white', padding: '12px 16px', borderRadius: 12, fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', marginBottom: 10 }}
                >
                  <LucideIcon name="MessageCircle" size={16} /> WhatsApp Us Now
                </a>

                <Link to="/products" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(255,255,255,0.07)', color: 'white', padding: '12px 16px', borderRadius: 12, fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', marginBottom: 22 }}>
                  <LucideIcon name="Package" size={16} /> View Products
                </Link>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 18, marginBottom: 4 }}>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>📞 Call Us</p>
                  <p style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem', margin: 0 }}>+91 99772 28924</p>
                </div>

                {blog.keywords && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 18, marginTop: 18 }}>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>🏷 Tags</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {blog.keywords.split(',').slice(0, 5).map((tag, i) => (
                        <span key={i} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: 100, fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>
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

        {/* FAQ Section — full width aligned to article column */}
        <div className="container" style={{ marginTop: 80 }}>
          <div style={{ maxWidth: 'calc(100% - 348px)' }} className="blog-faq-width">
            {/* Heading */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <LucideIcon name="HelpCircle" size={20} color="white" />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 2 }}>Quick Answers</p>
                <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Frequently Asked Questions</h2>
              </div>
            </div>

            {/* FAQ Cards */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '0 32px' }}>
              {faqs.map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
              ))}
            </div>
          </div>
        </div>

      </article>

      <style>{`
        @media (max-width: 1024px) {
          .blog-layout { grid-template-columns: 1fr !important; }
          .blog-faq-width { max-width: 100% !important; }
        }
        .blog-content h2 { font-size: 1.7rem; margin-top: 40px; margin-bottom: 14px; color: var(--text-primary); font-weight: 800; }
        .blog-content h3 { font-size: 1.35rem; margin-top: 30px; margin-bottom: 12px; color: var(--text-primary); font-weight: 700; }
        .blog-content p { margin-bottom: 18px; }
        .blog-content ul, .blog-content ol { margin-bottom: 20px; padding-left: 22px; }
        .blog-content li { margin-bottom: 10px; }
        .blog-content strong { color: var(--text-primary); }
        .blog-content blockquote { border-left: 4px solid var(--primary); padding: 14px 20px; background: var(--surface); border-radius: 0 12px 12px 0; margin-bottom: 20px; }
        .blog-content img { max-width: 100%; border-radius: 14px; margin: 20px 0; }
        .blog-content a { color: var(--primary); text-decoration: underline; }
      `}</style>
    </>
  )
}
