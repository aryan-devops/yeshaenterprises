import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WhatsAppFAB from '../components/WhatsAppFAB'
import BlobBackground from '../components/BlobBackground'

export default function MainLayout({ darkMode, toggleDarkMode, openAdmin, contact, stats }) {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <BlobBackground />
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} onAdminClick={openAdmin} contact={contact} />
      <main style={{ paddingTop: 'var(--navbar-height)' }}>
        <Outlet />
      </main>
      <Footer contact={contact} onAdminClick={openAdmin} />
      <WhatsAppFAB contact={contact} />
    </div>
  )
}
