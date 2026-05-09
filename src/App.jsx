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
import ScrollToTop from './components/ScrollToTop'
import LocationPage from './pages/LocationPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'

const DEFAULT_BLOGS = [
  {
    id: '1',
    slug: 'how-to-start-biofloc-fish-farming-india',
    title: 'How to Start Biofloc Fish Farming in India: A Complete Guide',
    excerpt: 'Learn the step-by-step process of starting a profitable Biofloc fish farm in India. From setup to fish growth, everything you need to know.',
    content: '<p>Biofloc fish farming is a profitable and modern way to grow fish in a small space. Unlike traditional ponds, it uses special tanks and air pumps to keep the water clean and fish healthy.</p><br><h2>1. Tank Setup</h2><p>The first step is setting up a round fish tank with a high-quality HDPE pond liner. This prevents water leakage and keeps the fish safe.</p><br><h2>2. Air Pumps</h2><p>You need a strong ring blower to provide oxygen 24/7. This is very important for Biofloc.</p><br><h2>3. Water Preparation</h2><p>Before adding fish, you need to prepare the water with probiotics and molasses to create the "floc". This floc acts as food for the fish and keeps the water clean.</p><br><p><strong>Start your Biofloc journey today with the right tools!</strong></p>',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    keywords: 'Biofloc fish farming in India, how to start biofloc, biofloc setup guide, fish farming business',
    is_published: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    slug: 'why-hdpe-pond-liners-essential',
    title: 'Why HDPE Pond Liners are Essential for Successful Fish Farming',
    excerpt: 'Discover why top fish farmers choose HDPE pond liners over traditional ponds. Learn about their durability, cost-effectiveness, and fish safety.',
    content: '<p>When starting a fish farm, the base is everything. Many new farmers make the mistake of using cheap plastics or bare mud ponds.</p><br><h2>What is an HDPE Pond Liner?</h2><p>HDPE stands for High-Density Polyethylene. It is a very strong, thick plastic sheet designed specifically for water storage and aquaculture.</p><br><h2>Benefits of HDPE Liners</h2><ul><li><strong>No Water Loss:</strong> They stop water from leaking into the ground.</li><li><strong>Fish Safety:</strong> High-quality liners are non-toxic and safe for fish.</li><li><strong>Long Life:</strong> They are UV stabilized, meaning the sun will not destroy them quickly.</li><li><strong>Easy to Clean:</strong> Unlike mud ponds, HDPE liners are very easy to clean and manage disease outbreaks.</li></ul><br><p>Investing in a good HDPE pond liner from a trusted supplier like Yesha Enterprises will save you money in the long run.</p>',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    keywords: 'HDPE pond liner, pond liner benefits, fish farming pond liner, geomembrane, fish tank setup',
    is_published: true,
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    slug: 'choosing-right-ring-blower',
    title: 'Choosing the Right Ring Blower for Your Biofloc Setup',
    excerpt: 'Oxygen is life in Biofloc farming. Find out how to choose the perfect ring blower based on your tank size and fish capacity.',
    content: '<p>In Biofloc fish farming, you cannot rely on natural oxygen. You have a lot of fish in a small space, so you need a constant supply of air. This is where ring blowers come in.</p><br><h2>What does a Ring Blower do?</h2><p>A ring blower pushes air into the water through aeration tubes. This creates bubbles that give oxygen to the fish and the good bacteria (the floc).</p><br><h2>How to Choose?</h2><ul><li><strong>Tank Size:</strong> For a 10,000-liter tank, you usually need a 1HP ring blower.</li><li><strong>Power Supply:</strong> Choose between single-phase and three-phase blowers depending on your electricity connection.</li><li><strong>Quality:</strong> Always buy from a top seller to ensure it runs quietly and doesn\'t break down. A power failure without a backup can kill all your fish.</li></ul><br><p><strong>Always keep a diesel generator as a backup for your ring blower!</strong></p>',
    image_url: 'https://images.unsplash.com/photo-1583091176882-62a26fae3d16?w=800&q=80',
    keywords: 'Ring blower, biofloc aeration, fish tank air pump, choosing ring blower, 1HP blower',
    is_published: true,
    created_at: new Date(Date.now() - 172800000).toISOString()
  }
]

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: 'HDPE Pond Liner',
    category: 'Pond Liners',
    description: 'Top quality pond liners for fish farming. Safe for fish, protects from sun, and comes in any size you need.',
    price_range: '₹15 - ₹80/sq.ft',
    stock_status: 'In Stock',
    specs: '200–500 GSM, Custom Sizes',
    image_url: null,
  },
  {
    id: 2,
    name: 'Ring Blower / Air Pump',
    category: 'Blowers',
    description: 'Powerful air pumps for fish tanks. Saves power, runs quietly, and works all day without stopping.',
    price_range: '₹8,000 - ₹45,000',
    stock_status: 'In Stock',
    specs: '1HP – 5HP, Single/Three Phase',
    image_url: null,
  },
  {
    id: 3,
    name: 'Circular Fish Tank',
    category: 'Tanks',
    description: 'Round fish tanks perfect for Biofloc farming. Easy to clean, very strong, and available in many sizes.',
    price_range: '₹3,500 - ₹25,000',
    stock_status: 'In Stock',
    specs: '500L – 10,000L capacity',
    image_url: null,
  },
  {
    id: 4,
    name: 'Diesel Generator',
    category: 'Generators',
    description: 'Strong power backup for your fish farm. Keeps your farm running even when the power goes out.',
    price_range: '₹45,000 - ₹2,50,000',
    stock_status: 'Custom Order',
    specs: '5KVA – 50KVA',
    image_url: null,
  },
  {
    id: 5,
    name: 'HDPE Shade Net',
    category: 'Shade Nets',
    description: 'High-quality shade nets for ponds. Keeps the water cool and protects your fish from hot sun rays.',
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
    headline: "Top HDPE Pond Liner Supplier in India",
    subtitle: 'Best Quality Since 2022',
    description: 'We provide high-quality HDPE pond liners for Biofloc fish farming. Strong, safe, and made to last.',
    gradient: 'linear-gradient(135deg, rgba(10, 37, 64, 0.95), rgba(14, 116, 144, 0.8))',
    image_url: '/Users/aryanpandey/.gemini/antigravity/brain/c121a28e-08e5-47d5-acb1-3723c86c3fb2/yesha_hero_pond_liner_1774461327429_1774461926798.png',
    cta_primary: 'See Products',
    cta_secondary: 'Contact Us',
    is_visible: true,
  },
  {
    id: 2,
    icon: 'Activity',
    headline: 'Complete Biofloc Fish Farming Setup',
    subtitle: 'Best Air Pumps and Water Tanks',
    description: 'We sell the best ring blowers, round fish tanks, and power backups to help your fish grow faster.',
    gradient: 'linear-gradient(135deg, rgba(6, 95, 70, 0.95), rgba(5, 150, 105, 0.8))',
    image_url: '/Users/aryanpandey/.gemini/antigravity/brain/c121a28e-08e5-47d5-acb1-3723c86c3fb2/yesha_hero_aeration_1774461334185_1774461944246.png',
    cta_primary: 'View Details',
    cta_secondary: 'Get Help',
    is_visible: true,
  },
]

const DEFAULT_STATS = [
  'Started in 2022', '100+ Happy Partners', 'Delivery Across India',
  "Top Seller in Chhattisgarh", 'All Fish Farming Products',
  'Main Office in Raipur', 'Bulk Order Discounts', 'Expert Setup Help',
]

const DEFAULT_CONTACT = {
  phone: '+91 99772 28924, 9770403382',
  email: 'yeshaenterprises01@gmail.com',
  address: 'Office No. 71 Govind Sarang Parisar, New Rajendra Nagar Raipur, Chhattisgarh, India — 492001',
  instagram: 'https://www.instagram.com/yeshaenterprises01',
  facebook: 'https://www.facebook.com/yeshaenterpises01/',
  indiamart: 'https://www.indiamart.com/yesha-enterprises-raipur/profile.html',
  tradeindia: 'https://www.tradeindia.com/yesha-enterprises-36400761/',
  exportersindia: 'https://www.exportersindia.com/yeshaenterprises/',
  whatsapp: '919977228924',
}

const DEFAULT_TESTIMONIALS = [
  {
    name: 'Rakesh Jhunjhunwala',
    role: 'Fishery Owner, Raipur',
    content: 'The pond liners from Yesha Enterprises are excellent. They are very strong and perfect for my fish farm. Their team is very helpful.',
    avatar_icon: 'UserCheck'
  },
  {
    name: 'Suresh Raina',
    role: 'Aquaculture Dealer, Bilaspur',
    content: 'I buy air pumps and fish tanks from them regularly. The quality is always great and the prices are very fair.',
    avatar_icon: 'Briefcase'
  },
  {
    name: 'Anjali Sharma',
    role: 'Start-up Founder, Durg',
    content: 'Starting a new fish farm was hard, but Yesha Enterprises gave me everything I needed, from liners to air pumps. Highly recommended!',
    avatar_icon: 'User'
  }
]

export default function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [products, setProducts] = useState(DEFAULT_PRODUCTS)
  const [slides, setSlides] = useState(DEFAULT_SLIDES)
  const [stats, setStats] = useState(DEFAULT_STATS)
  const [contact, setContact] = useState(DEFAULT_CONTACT)
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS)
  const [enquiries, setEnquiries] = useState([])
  const [blogs, setBlogs] = useState(DEFAULT_BLOGS)
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
        { data: enquiryData },
        { data: blogData }
      ] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('hero_slides').select('*').order('display_order', { ascending: true }),
        supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
        supabase.from('site_settings').select('*'),
        supabase.from('enquiries').select('*').order('created_at', { ascending: false }),
        supabase.from('blogs').select('*').order('created_at', { ascending: false })
      ])

      if (prodData && prodData.length > 0) setProducts(prodData)
      if (slideData && slideData.length > 0) setSlides(slideData)
      if (testimonialData && testimonialData.length > 0) setTestimonials(testimonialData)
      if (enquiryData) setEnquiries(enquiryData)
      if (blogData && blogData.length > 0) setBlogs(blogData)
      
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
    blogs, setBlogs,
    darkMode, toggleDarkMode,
    refreshData: fetchData
  }

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
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
            <Route path="blog" element={<BlogPage blogs={blogs} />} />
            <Route path="blog/:slug" element={<BlogPostPage blogs={blogs} />} />
            
            {/* Location Landing Pages */}
            <Route path="location/chhattisgarh" element={<LocationPage state="Chhattisgarh" city="Raipur" {...sharedProps} />} />
            <Route path="location/maharashtra" element={<LocationPage state="Maharashtra" city="Nagpur" {...sharedProps} />} />
            <Route path="location/odisha" element={<LocationPage state="Odisha" city="Bhubaneswar" {...sharedProps} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
