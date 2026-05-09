import React, { useState } from 'react'
import SEO from './SEO'
import LucideIcon from './LucideIcon'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      q: "What is Biofloc Fish Farming?",
      a: "Biofloc fish farming is a highly profitable, modern method of growing fish in a limited space. It uses specialized round fish tanks, strong HDPE pond liners, and continuous air pumps (ring blowers) to convert fish waste into nutritious feed using beneficial bacteria."
    },
    {
      q: "Why do I need an HDPE Pond Liner?",
      a: "An HDPE Pond Liner is a thick, UV-protected sheet that prevents water from leaking into the soil. It keeps the water clean, protects fish from soil-borne diseases, and is essential for a successful, long-lasting Biofloc setup."
    },
    {
      q: "Which Ring Blower (Air Pump) should I buy?",
      a: "The size of the ring blower depends on your tank size. For a standard 10,000-liter Biofloc tank, a 1HP or 2HP ring blower is usually recommended to ensure constant oxygen supply for the fish and the floc."
    },
    {
      q: "Do you deliver fish farming tools across India?",
      a: "Yes! Yesha Enterprises is a top supplier of fish farming tools. We offer fast and secure delivery of HDPE Pond Liners, Ring Blowers, Circular Tanks, and accessories to everywhere in India."
    },
    {
      q: "How much does it cost to start a Biofloc farm?",
      a: "The cost depends on the size of your setup. A basic 10,000-liter tank setup with an HDPE liner and air pump can start from a very affordable price. We offer wholesale prices direct from the factory to help you save money."
    }
  ]

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  }

  return (
    <section style={{ padding: '80px 0', background: 'var(--surface)' }}>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto 60px' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: 800, marginBottom: 16 }}>Frequently Asked Questions</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Expert answers to help you start your fish farming journey.</p>
        </div>

        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div 
                key={i} 
                style={{ 
                  background: 'var(--bg)', 
                  border: `1px solid ${isOpen ? 'var(--primary)' : 'var(--border)'}`, 
                  borderRadius: 16, 
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
              >
                <button 
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  style={{ 
                    width: '100%', padding: '24px', display: 'flex', justifyContent: 'space-between', 
                    alignItems: 'center', textAlign: 'left', cursor: 'pointer', background: 'none', border: 'none',
                    color: isOpen ? 'var(--primary)' : 'var(--text-primary)'
                  }}
                >
                  <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{faq.q}</span>
                  <div style={{ 
                    width: 32, height: 32, borderRadius: '50%', background: isOpen ? 'rgba(var(--primary-rgb), 0.1)' : 'var(--surface-hover)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease'
                  }}>
                    <LucideIcon name="ChevronDown" size={20} />
                  </div>
                </button>
                <div style={{ 
                  height: isOpen ? 'auto' : 0, 
                  opacity: isOpen ? 1 : 0,
                  padding: isOpen ? '0 24px 24px' : '0 24px',
                  transition: 'all 0.3s ease'
                }}>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{faq.a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
