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

  const faqs = (blog.faqs && blog.faqs.length > 0) ? blog.faqs : getBlogFAQs(blog)

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
            {/* Main Content Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
              <div
                className="blog-content"
                style={{ fontSize: '1.08rem', color: 'var(--text-secondary)', lineHeight: 1.9, minWidth: 0 }}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Share Buttons */}
              <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '32px 0', marginTop: 20 }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>Share this article</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  <a 
                    href={`https://wa.me/?text=${encodeURIComponent('Check out this article: ' + blog.title + ' ' + window.location.href)}`} 
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, background: '#25D366', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}
                  >
                    <LucideIcon name="MessageCircle" size={18} /> WhatsApp
                  </a>
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, background: '#1877F2', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}
                  >
                    <LucideIcon name="Facebook" size={18} /> Facebook
                  </a>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href)
                      alert('Link copied to clipboard!')
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, background: 'var(--surface-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' }}
                  >
                    <LucideIcon name="Link" size={18} /> Copy Link
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Card 1: Engage With Us */}
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 24 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>Engage With Us</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 18 }}>
                  Have a question? Our experts are ready to help you choose the right product for your farm.
                </p>
                <a
                  href={`https://wa.me/${contact?.whatsapp || '919977228924'}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#22c55e', color: 'white', padding: '12px 16px', borderRadius: 12, fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', marginBottom: 10 }}
                >
                  <LucideIcon name="MessageCircle" size={16} /> WhatsApp Us Now
                </a>
                <a
                  href="tel:+919977228924"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '12px 16px', borderRadius: 12, fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', marginBottom: 10 }}
                >
                  <LucideIcon name="Phone" size={16} /> Call: +91 99772 28924
                </a>
                <Link to="/contact" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--primary)', color: 'white', padding: '12px 16px', borderRadius: 12, fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
                  <LucideIcon name="Mail" size={16} /> Send Enquiry
                </Link>
              </div>

              {/* Card 2: Why Choose Us */}
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 24 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>Why Choose Yesha Enterprises?</h3>
                {[
                  { icon: 'ShieldCheck', text: '#1 Pond Liner Supplier in Chhattisgarh' },
                  { icon: 'Truck', text: 'Fast Delivery Across India' },
                  { icon: 'Scissors', text: 'Custom Sizes for Every Farm' },
                  { icon: 'BadgeIndianRupee', text: 'Best Wholesale Prices' },
                  { icon: 'HeadphonesIcon', text: 'Expert Support Before & After Sale' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <LucideIcon name={item.icon} size={16} color="white" />
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Card 3: View Products */}
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 24 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>Our Products</h3>
                {[
                  { label: 'HDPE Pond Liners', path: '/products' },
                  { label: 'Ring Blowers / Air Pumps', path: '/products' },
                  { label: 'Circular Fish Tanks', path: '/products' },
                  { label: 'Diesel Generators', path: '/products' },
                  { label: 'HDPE Shade Nets', path: '/products' },
                ].map((item, i) => (
                  <Link key={i} to={item.path} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none', textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
                    {item.label}
                    <LucideIcon name="ChevronRight" size={16} color="var(--primary)" />
                  </Link>
                ))}
              </div>

              {/* Card 4: Tags */}
              {blog.keywords && (
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 24 }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>Article Tags</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {blog.keywords.split(',').slice(0, 10).map((tag, i) => (
                      <span key={i} style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '5px 12px', borderRadius: 100, fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Card 5: Our Locations */}
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 24 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>We Serve Across India</h3>
                {[
                  { state: 'Chhattisgarh (HQ)', city: 'Raipur, Bilaspur, Durg', path: '/location/chhattisgarh' },
                  { state: 'Maharashtra', city: 'Nagpur, Amravati', path: '/location/maharashtra' },
                  { state: 'Odisha', city: 'Bhubaneswar, Cuttack', path: '/location/odisha' },
                ].map((loc, i) => (
                  <Link key={i} to={loc.path} style={{ display: 'block', textDecoration: 'none', marginBottom: i < 2 ? 12 : 0 }}>
                    <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', margin: '0 0 2px' }}>{loc.state}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{loc.city}</p>
                  </Link>
                ))}
              </div>

              {/* Card 6: Latest Articles */}
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 24 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>Latest Updates</h3>
                {blogs.filter(b => b.slug !== slug).slice(0, 3).map((b, i) => (
                  <Link key={i} to={`/blog/${b.slug}`} style={{ display: 'block', textDecoration: 'none', marginBottom: i < 2 ? 16 : 0, group: 'true' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px', lineHeight: 1.4, transition: 'color 0.2s' }} className="sidebar-blog-link">{b.title}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>{new Date(b.created_at).toLocaleDateString()}</p>
                  </Link>
                ))}
              </div>

              {/* Card 7: Business Hours */}
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 24 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>Business Hours</h3>
                {[
                  { days: 'Mon - Sat', hours: '09:00 AM - 07:00 PM' },
                  { days: 'Sunday', hours: 'Closed' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: i === 0 ? 8 : 0 }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>{item.days}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.hours}</span>
                  </div>
                ))}
              </div>

            </aside>
          </div>
        </div>

        {/* You May Also Like Section */}
        {blogs.filter(b => b.slug !== slug).length > 0 && (
          <div className="container" style={{ marginTop: 80 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>You May Also Like</h2>
              <Link to="/blog" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                View All <LucideIcon name="ArrowRight" size={18} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 30 }}>
              {blogs.filter(b => b.slug !== slug).slice(0, 2).map((b, i) => (
                <Link key={i} to={`/blog/${b.slug}`} className="premium-card" style={{ display: 'block', textDecoration: 'none', borderRadius: 24, overflow: 'hidden', transition: 'transform 0.3s ease' }}>
                  <div style={{ height: 220, background: `url(${b.image_url}) center/cover` }} />
                  <div style={{ padding: 24 }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 12 }}>{new Date(b.created_at).toLocaleDateString()}</div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12, lineHeight: 1.3 }}>{b.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 0 }}>{b.excerpt?.substring(0, 100)}...</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

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
        .sidebar-blog-link:hover { color: var(--primary) !important; }
      `}</style>
    </>
  )
}
