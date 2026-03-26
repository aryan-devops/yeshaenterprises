import HeroSlider from '../components/HeroSlider'
import StatsMarquee from '../components/StatsMarquee'
import Products from '../components/Products'
import About from '../components/About'
import VisionMission from '../components/VisionMission'
import Testimonials from '../components/Testimonials'
import useScrollReveal from '../hooks/useScrollReveal'

export default function HomePage({ slides, stats, products, contact, testimonials }) {
  const visibleSlides = slides.filter(s => s.is_visible || s.visible)
  const reveal = useScrollReveal()

  return (
    <>
      <HeroSlider slides={visibleSlides} contact={contact} />
      
      <div className="reveal" ref={reveal}>
        <StatsMarquee stats={stats} />
      </div>

      <div className="reveal" ref={reveal}>
        <Products products={products} contact={contact} previewMode={true} />
      </div>

      <div className="reveal" ref={reveal}>
        <About />
      </div>

      <div className="reveal" ref={reveal}>
        <VisionMission />
      </div>

      <div className="reveal" ref={reveal}>
        <Testimonials reviews={testimonials} />
      </div>
    </>
  )
}
