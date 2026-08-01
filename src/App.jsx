import { useEffect, useState } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useAuth } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import RentPage from './pages/RentPage'
import Compare from './pages/Compare'
import Signup from './pages/Signup'
import Login from './pages/Login'
import SellerDashboard from './pages/SellerDashboard'
import SellerAddProperty from './pages/SellerAddProperty'
import BuyerDashboard from './pages/BuyerDashboard'
import Messages from './pages/Messages'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminProperties from './pages/AdminProperties'
import AdminDocuments from './pages/AdminDocuments'
import CompareFloatingBar from './components/property/CompareFloatingBar'
import './App.css'

// Protected route wrapper
function ProtectedRoute({ children, allowedRole }) {
  const { user, isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="skeleton" style={{ width: '120px', height: '120px', borderRadius: '50%' }} />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to={user?.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard'} replace />
  }

  return children
}

// Scroll-reveal IntersectionObserver hook
function useScrollReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale')
    
    if (!targets.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )

    targets.forEach(t => observer.observe(t))
    return () => observer.disconnect()
  })
}

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])
  return null
}

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const [showBackToTop, setShowBackToTop] = useState(false)

  // Activate scroll-reveal animations
  useScrollReveal()

  // Back-to-top button visibility
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="app">
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes - Free Access */}
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/rent" element={<RentPage />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Seller Routes */}
          <Route
            path="/seller/dashboard"
            element={
              <ProtectedRoute allowedRole="seller">
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/add-property"
            element={
              <ProtectedRoute allowedRole="seller">
                <SellerAddProperty />
              </ProtectedRoute>
            }
          />

          {/* Protected Buyer Routes */}
          <Route
            path="/buyer/dashboard"
            element={
              <ProtectedRoute allowedRole="buyer">
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected General Routes */}
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/documents" element={<AdminDocuments />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/properties" element={<AdminProperties />} />
        </Routes>
      </AnimatePresence>
      {!isAdminRoute && <Footer />}

      {/* Floating Compare Drawer */}
      <CompareFloatingBar />

      {/* Back to Top Button */}
      <button
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  )
}

export default App
