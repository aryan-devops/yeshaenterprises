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
    id: '4',
    slug: 'hdpe-pond-liner-complete-guide-india',
    title: 'HDPE Pond Liner: Complete Buying Guide for Fish Farmers in India (2024)',
    excerpt: 'Everything you need to know about HDPE pond liners — sizes, prices, installation, and where to buy the best pond liner in India. Read before you buy!',
    content: `<p>If you are setting up a fish pond in India, the most important decision you will make is choosing the right <strong>pond liner</strong>. A good pond liner is the foundation of every successful fish farm — it stops water from leaking, keeps fish safe, and saves you money for years.</p>

<p>In this complete guide, we cover everything about <strong>HDPE pond liners</strong> — what they are, what sizes are available, how to install them, and where you can buy the best pond liner at the lowest price in India.</p>

<h2>What is an HDPE Pond Liner?</h2>
<p>HDPE stands for <strong>High-Density Polyethylene</strong>. An HDPE pond liner is a thick, flexible plastic sheet used to line the bottom and sides of a fish pond or water storage pond. It acts as a waterproof barrier between the water and the soil below.</p>

<p>HDPE liners are the <strong>best type of pond liner</strong> available today because they are:</p>
<ul>
<li><strong>UV Resistant:</strong> They do not crack or break down in direct sunlight — making them a true <em>UV resistant pond liner</em> built for Indian weather.</li>
<li><strong>Fish Safe:</strong> 100% non-toxic. Safe for fish, shrimp, and all aquatic life.</li>
<li><strong>Leak Proof:</strong> They completely stop pond leaks, so you never lose water into the soil.</li>
<li><strong>Durable:</strong> A high quality pond liner from a trusted manufacturer lasts 10–20 years.</li>
<li><strong>Available in Any Size:</strong> Whether you need a 20 x 20 pond liner, a 50 x 50 pond liner, or a 100 by 100 pond liner — we can cut it to your exact measurement.</li>
</ul>

<h2>HDPE vs LLDPE Pond Liner — Which is Better?</h2>
<p>Both <strong>HDPE</strong> and <strong>LLDPE pond liners</strong> are popular choices for fish farmers. Here is how they compare:</p>
<ul>
<li><strong>HDPE Liner:</strong> Stiffer, more resistant to punctures, best for large ponds and irrigation ponds. Ideal for <em>deep pond liner</em> applications.</li>
<li><strong>LLDPE Liner:</strong> More flexible and stretchy, easier to install on uneven ground. Great for smaller fish ponds and biofloc tanks.</li>
</ul>
<p>For most fish farming setups in India — including <strong>Biofloc pond liner</strong> applications — we recommend HDPE because of its superior strength and long life.</p>

<h2>Common Pond Liner Sizes Available</h2>
<p>One of the biggest advantages of HDPE fish pond liners is that they can be manufactured in any custom size. Here are the most popular sizes we supply:</p>
<ul>
<li>15 x 15 pond liner (small backyard pond)</li>
<li>20 x 20 pond liner (medium farm pond)</li>
<li>20 x 50 pond liner (rectangular irrigation pond)</li>
<li>50 x 50 pond liner (large biofloc setup)</li>
<li>50 x 100 pond liner (commercial fish farming)</li>
<li>100 by 100 pond liner (large-scale irrigation pond)</li>
<li>1000 sq ft pond liner and custom bulk sizes</li>
</ul>
<p>Need a size that is not listed? Contact us and we will cut a <strong>custom pond liner</strong> exactly to your specifications. We are one of the few <strong>pond liner manufacturers in India</strong> offering fully custom-cut orders.</p>

<h2>Pond Liner Prices in India</h2>
<p>The price of a pond liner depends on its thickness (GSM or micron) and the total area. At Yesha Enterprises, we offer <strong>wholesale pond liners</strong> at the most competitive prices in Chhattisgarh, Maharashtra, and Odisha.</p>
<ul>
<li><strong>200 GSM HDPE Liner:</strong> Starting from ₹15/sq.ft</li>
<li><strong>300 GSM HDPE Liner:</strong> Starting from ₹22/sq.ft</li>
<li><strong>500 GSM HDPE Liner:</strong> Starting from ₹35/sq.ft</li>
</ul>
<p>We offer <strong>bulk pond liner</strong> discounts for large orders. If you are looking for <strong>cheap pond liner</strong> options without sacrificing quality, contact our team for the best deal.</p>

<h2>How to Install a Pond Liner</h2>
<p>Proper <strong>pond liner installation</strong> is key to getting the most out of your liner. Follow these steps:</p>
<ol>
<li><strong>Dig the Pond:</strong> Excavate the pond to your desired depth. Make sure the sides are smooth with no sharp rocks or roots.</li>
<li><strong>Lay the Underlayer:</strong> Place a <em>fish pond underlayment</em> (geotextile fabric) at the bottom to protect the liner from being punctured by stones.</li>
<li><strong>Unfold the Liner:</strong> Roll out the HDPE liner carefully from one end to the other. This is best done on a warm day as the liner becomes more flexible.</li>
<li><strong>Fit the Corners:</strong> Fold and tuck the liner neatly into the corners. For round ponds, make small pleats to fit the liner smoothly.</li>
<li><strong>Anchor the Edges:</strong> Bury the edges of the liner in a trench around the pond, or secure them with anchor stakes and stones.</li>
<li><strong>Add Water:</strong> Slowly fill the pond with water. The weight of the water will pull the liner into shape.</li>
</ol>
<p>If you need professional help, we also connect our customers with <strong>pond liner installation near me</strong> services across Chhattisgarh.</p>

<h2>Where to Buy Pond Liner in India</h2>
<p>Finding a trusted <strong>pond liner supplier</strong> is critical. Here is what to look for:</p>
<ul>
<li>ISI or BIS certified materials</li>
<li>UV stabilized and fish-safe HDPE grade</li>
<li>Custom sizing options</li>
<li>Warranty and after-sales support</li>
<li>Ability to supply <strong>bulk pond liner</strong> for large projects</li>
</ul>
<p><strong>Yesha Enterprises</strong> is the #1 <strong>pond liner manufacturer in Chhattisgarh</strong>, serving farmers across Raipur, Bilaspur, Durg, Nagpur, and Bhubaneswar. We stock liners ready for immediate dispatch — no waiting for custom orders.</p>

<h2>Why Choose Yesha Enterprises for Your Pond Liner?</h2>
<ul>
<li>✅ <strong>High quality pond liner</strong> made from virgin HDPE grade material</li>
<li>✅ Custom sizes — from 4 x 4 to 100 x 100 and beyond</li>
<li>✅ Best <strong>pond liner prices</strong> in Central India</li>
<li>✅ <strong>Wholesale pond liners</strong> available for dealers and bulk buyers</li>
<li>✅ Delivery across India — Chhattisgarh, Maharashtra, Odisha, MP</li>
<li>✅ Expert guidance on choosing the right liner for your pond design</li>
</ul>

<p>Ready to <strong>buy pond liner</strong> for your fish farm? <strong>Call us today</strong> or WhatsApp for a free quote and pond liner size calculation. Our expert team will help you choose the best and most durable pond liner for your specific needs.</p>`,
    image_url: '/blog-hdpe-pond-liner.png',
    keywords: 'hdpe pond liner, pond liner, hdpe liner, best pond liner, fish pond liners, buy pond liner, lldpe pond liner, pond liner installation, 20 x 20 pond liner, flexible pond liner, pond liner manufacturers, pond liner manufacturers in india, pond liner prices, water pond liner, bulk pond liner, irrigation pond liner, wholesale pond liners, pond liner size, largest pond liner available, deep pond liner, pond liner for fish farming, hdpe pond liner manufacturer, high quality pond liner, pond liner with drain, uv resistant pond liner, pond liner india, pond liner manufacturers in maharashtra, fish tank liner, hdpe fish pond liner, pond liner fitters near me, best fish pond liner, quality pond liner, pond liner supplier, good quality pond liner, blue liner for pond, pond liner tank, pond liner design, water feature pond liner, fish pond membrane, fish farming pond design, biofloc tanks, 1000 sq ft pond, design of ponds, cheap pond liner',
    is_published: true,
    created_at: new Date(Date.now() - 259200000).toISOString()
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
      if (blogData && blogData.length > 0) {
        // Merge: Supabase blogs take priority, then add any default blogs not already in Supabase
        const supabaseSlugs = new Set(blogData.map(b => b.slug))
        const extraDefaults = DEFAULT_BLOGS.filter(b => !supabaseSlugs.has(b.slug))
        setBlogs([...blogData, ...extraDefaults])
      }
      
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
