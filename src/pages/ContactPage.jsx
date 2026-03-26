import Contact from '../components/Contact'
import PageHero from '../components/PageHero'

export default function ContactPage({ contact }) {
  return (
    <>
      <PageHero
        title="Get In Touch"
        subtitle="Contact Yesha Enterprises"
        description="Bulk orders · Dealer inquiries · Product information — We're here to help"
        bgImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
        gradient="linear-gradient(135deg, #0a2540dd 0%, #0a4f7acc 50%, #22d3ee44 100%)"
        badge="CONTACT"
        icon="📞"
      />
      <Contact contact={contact} />
    </>
  )
}
