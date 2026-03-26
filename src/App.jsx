import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from './lib/supabaseClient'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import AdminPanel from './components/AdminPanel'
import ProductDetailPage from './pages/ProductDetailPage'
import Preloader from './components/Preloader'

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: 'HDPE Pond Liner',
    category: 'Pond Liners',
    description: 'High-density polyethylene pond liners for Biofloc fish farming. UV stabilized, fish-safe, available in custom sizes.',
    price_range: '₹15 - ₹80/sq.ft',
    stock_status: 'In Stock',
    specs: '200–500 GSM, Custom Sizes',
    image_url: null,
  },
  {
    id: 2,
    name: 'Ring Blower / Air Pump',
    category: 'Blowers',
    description: 'High-efficiency ring blowers for aeration in Biofloc tanks. Energy-saving, low-noise continuous operation.',
    price_range: '₹8,000 - ₹45,000',
    stock_status: 'In Stock',
    specs: '1HP – 5HP, Single/Three Phase',
    image_url: null,
  },
  {
    id: 3,
    name: 'Circular Fish Tank',
    category: 'Tanks',
    description: 'Round HDPE/PVC tanks ideal for Biofloc farming. Easy to clean, durable, available in various volumes.',
    price_range: '₹3,500 - ₹25,000',
    stock_status: 'In Stock',
    specs: '500L – 10,000L capacity',
    image_url: null,
  },
  {
    id: 4,
    name: 'Diesel Generator',
    category: 'Generators',
    description: 'Reliable power backup generators for uninterrupted farm operations. Suitable for all aeration systems.',
    price_range: '₹45,000 - ₹2,50,000',
    stock_status: 'Custom Order',
    specs: '5KVA – 50KVA',
    image_url: null,
  },
  {
    id: 5,
    name: 'HDPE Shade Net',
    category: 'Shade Nets',
    description: 'Premium shade nets for outdoor ponds and greenhouses. Reduces heat stress, UV protection for fish.',
    price_range: '₹8 - ₹25/sq.ft',
    stock_status: 'In Stock',
    specs: '35%–90% shade, Custom Cut',
    image_url: null,
  },
]

const DEFAULT_SLIDES = [
  {
    id: 1,
    icon: 'ShieldCheck',
    headline: "India's Premier HDPE Pond Liner Solutions",
    subtitle: 'Quality & Reliability Since 2022',
    description: 'Supplying industrial-grade HDPE pond liners with precision engineering and global standards for Biofloc farming.',
    gradient: 'linear-gradient(135deg, rgba(10, 37, 64, 0.95), rgba(14, 116, 144, 0.8))',
    image_url: '/Users/aryanpandey/.gemini/antigravity/brain/c121a28e-08e5-47d5-acb1-3723c86c3fb2/yesha_hero_pond_liner_1774461327429_1774461926798.png',
    cta_primary: 'View Catalog',
    cta_secondary: 'Direct Inquiry',
    is_visible: true,
  },
  {
    id: 2,
    icon: 'Activity',
    headline: 'Advanced Biofloc Infrastructure',
    subtitle: 'High-Performance Aeration & Storage',
    description: 'Specializing in high-efficiency ring blowers, circular tanks, and power solutions for optimized aquatic growth.',
    gradient: 'linear-gradient(135deg, rgba(6, 95, 70, 0.95), rgba(5, 150, 105, 0.8))',
    image_url: '/Users/aryanpandey/.gemini/antigravity/brain/c121a28e-08e5-47d5-acb1-3723c86c3fb2/yesha_hero_aeration_1774461334185_1774461944246.png',
    cta_primary: 'Explore Specs',
    cta_secondary: 'Technical Support',
    is_visible: true,
  },
]

const DEFAULT_STATS = [
  'Established 2022', '100+ Distribution Partners', 'Pan-India Logistics',
  "Market Leader in Chhattisgarh", 'Comprehensive Product Suite',
  'Headquartered in Raipur', 'Bulk Procurement Program', 'Engineered Solutions',
]

const DEFAULT_CONTACT = {
  phone: '+91 99772 28924',
  email: 'yeshaenterprises01@gmail.com',
  address: 'Raipur, Chhattisgarh, India — 492001',
  instagram: 'https://www.instagram.com/yeshaenterprises01',
  facebook: 'https://www.facebook.com/yeshaenterpises01/',
  indiamart: 'https://www.indiamart.com/yesha-enterprises-raipur/profile.html',
  whatsapp: '919977228924',
}

const DEFAULT_TESTIMONIALS = [
  {
    name: 'Rakesh Jhunjhunwala',
    role: 'Fishery Owner, Raipur',
    content: 'The HDPE pond liners from Yesha Enterprises are top-notch. Durable and perfectly engineered for our Biofloc setup. Their technical support is exceptional.',
    avatar_icon: 'UserCheck'
  },
  {
    name: 'Suresh Raina',
    role: 'Aquaculture Dealer, Bilaspur',
    content: 'We have been sourcing ring blowers and circular tanks for over a year. The consistency in quality and fair wholesale pricing makes them our preferred partner.',
    avatar_icon: 'Briefcase'
  },
  {
    name: 'Anjali Sharma',
    role: 'Start-up Founder, Durg',
    content: 'Setting up a new fish farm was daunting, but Yesha Enterprises provided a complete solution from liners to aeration. Highly recommend for bulk requirements.',
    avatar_icon: 'User'
  }
]

export default function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [products, setProducts] = useState(DEFAULT_PRODUCTS)
  const [slides, setSlides] = useState(DEFAULT_SLIDES)
  const [stats, setStats] = useState(DEFAULT_STATS)
  const [contact, setContact] = useState(DEFAULT_CONTACT)
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS)
  const [enquiries, setEnquiries] = useState([])
  const [adminLoggedIn, setAdminLoggedIn] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch data from Supabase
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      
      const [
        { data: prodData },
        { data: slideData },
        { data: testimonialData },
        { data: settingsData },
        { data: enquiryData }
      ] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('hero_slides').select('*').order('display_order', { ascending: true }),
        supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
        supabase.from('site_settings').select('*'),
        supabase.from('enquiries').select('*').order('created_at', { ascending: false })
      ])

      if (prodData && prodData.length > 0) setProducts(prodData)
      if (slideData && slideData.length > 0) setSlides(slideData)
      if (testimonialData && testimonialData.length > 0) setTestimonials(testimonialData)
      if (enquiryData) setEnquiries(enquiryData)
      
      if (settingsData) {
        const contactInfo = settingsData.find(s => s.key === 'contact_info')
        const statsMarquee = settingsData.find(s => s.key === 'stats_marquee')
        if (contactInfo) {
          setContact({
            ...DEFAULT_CONTACT,
            ...contactInfo.value,
            facebook: 'https://www.facebook.com/yeshaenterpises01/', // User requested specific spelling
            indiamart: 'https://www.indiamart.com/yesha-enterprises-raipur/profile.html' // User requested specific IndiaMART profile link
          })
        }
        if (statsMarquee) setStats(statsMarquee.value)
      }
    } catch (error) {
      console.error('Error fetching data from Supabase:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const toggleDarkMode = useCallback(() => setDarkMode(d => !d), [])
  const handleAdminLogin = useCallback(() => setAdminLoggedIn(true), [])
  const handleAdminLogout = useCallback(() => setAdminLoggedIn(false), [])

  const sharedProps = { 
    products, setProducts, 
    slides, setSlides, 
    stats, setStats, 
    contact, setContact, 
    testimonials, setTestimonials,
    enquiries, setEnquiries, 
    darkMode, toggleDarkMode,
    refreshData: fetchData
  }

  return (
    <>
      <Preloader loading={loading} />
      <BrowserRouter>
        <Routes>
          {/* Admin Route (No Layout) */}
          <Route path="/admin" element={
            <AdminPanel
              {...sharedProps}
              loggedIn={adminLoggedIn} 
              onLogin={handleAdminLogin}
              onLogout={handleAdminLogout} 
              onClose={() => window.location.href = '/'}
            />
          } />

          {/* Public Routes (With Navbar/Footer Layout) */}
          <Route path="/" element={<MainLayout {...sharedProps} />}>
            <Route index element={<HomePage {...sharedProps} />} />
            <Route path="products" element={<ProductsPage products={products} contact={contact} />} />
            <Route path="product/:id" element={<ProductDetailPage products={products} contact={contact} />} />
            <Route path="about" element={<AboutPage contact={contact} testimonials={testimonials} />} />
            <Route path="contact" element={<ContactPage contact={contact} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
