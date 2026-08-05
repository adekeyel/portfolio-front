import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Portfolio from './pages/Portfolio.jsx'
import Booking from './pages/Booking.jsx'
import Contact from './pages/Contact.jsx'
import Careers from './pages/Careers.jsx'
import Privacy from './pages/Privacy.jsx'
import Terms from './pages/Terms.jsx'
import BookingConfirmed from './pages/BookingConfirmed.jsx'
import AdminLayout from './admin/AdminLayout.jsx'
import AdminLogin from './admin/AdminLogin.jsx'
import AdminDashboard from './admin/AdminDashboard.jsx'
import AdminProfile from './admin/AdminProfile.jsx'
import AdminPortfolio from './admin/AdminPortfolio.jsx'
import AdminServices from './admin/AdminServices.jsx'
import AdminBookings from './admin/AdminBookings.jsx'
import AdminJobs from './admin/AdminJobs.jsx'
import AdminTestimonials from './admin/AdminTestimonials.jsx'
import AdminSettings from './admin/AdminSettings.jsx'
import ProtectedRoute from './admin/ProtectedRoute.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/booking/confirmed" element={<BookingConfirmed />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="portfolio" element={<AdminPortfolio />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="jobs" element={<AdminJobs />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
