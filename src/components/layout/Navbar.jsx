import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Search, Heart, User, Menu, X, LogIn, Building2, ChevronDown, MessageSquare, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useFavorites } from '../../context/FavoriteContext'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, isAuthenticated, logout, loginAs } = useAuth()
  const { favoritesCount } = useFavorites()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setProfileOpen(false)
  }, [location])

  const navLinks = [
    { path: '/properties', label: 'Buy', icon: <Building2 size={16} /> },
    { path: '/rent', label: 'Rent', icon: <Home size={16} /> },
    { path: '/properties', label: 'Explore', icon: <Search size={16} /> },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <div className="navbar-inner container-wide">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <Home size={20} />
          </div>
          <span className="logo-text">NestHaven</span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`nav-link ${isActive(link.path) ? 'nav-link-active' : ''}`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          <Link to="/buyer/dashboard" className="nav-action-btn favorites-btn" title="Favorites">
            <Heart size={20} />
            {favoritesCount > 0 && (
              <span className="favorites-badge">{favoritesCount}</span>
            )}
          </Link>

          {isAuthenticated && (
            <Link to="/messages" className="nav-action-btn" title="Messages">
              <MessageSquare size={20} />
            </Link>
          )}

          {isAuthenticated ? (
            <div className="profile-dropdown-wrapper">
              <button 
                className="profile-trigger"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="profile-avatar">
                  {user?.name?.charAt(0)}
                </div>
                <span className="profile-name">{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={14} className={profileOpen ? 'rotate' : ''} />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    className="profile-dropdown"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">{user?.name?.charAt(0)}</div>
                      <div>
                        <p className="dropdown-name">{user?.name}</p>
                        <p className="dropdown-role">{user?.role === 'seller' ? 'Seller' : 'Buyer'}</p>
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    <Link to={user?.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard'} className="dropdown-item">
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>
                    <Link to="/messages" className="dropdown-item">
                      <MessageSquare size={16} />
                      Messages
                    </Link>
                    {user?.role === 'seller' && (
                      <Link to="/seller/add-property" className="dropdown-item">
                        <Building2 size={16} />
                        Add Property
                      </Link>
                    )}
                    <div className="dropdown-divider" />
                    <button className="dropdown-item dropdown-logout" onClick={() => { logout(); navigate('/'); }}>
                      <LogIn size={16} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="auth-buttons">
              <div className="quick-login-group">
                <button className="btn btn-ghost btn-sm" onClick={() => loginAs('buyer')}>
                  Demo Buyer
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => loginAs('seller')}>
                  Demo Seller
                </button>
              </div>
              <Link to="/signup" className="btn btn-primary btn-sm">
                <User size={16} />
                Create Profile
              </Link>
            </div>
          )}

          {/* Mobile Toggle */}
          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map((link) => (
              <Link key={link.label} to={link.path} className="mobile-link">
                {link.icon}
                {link.label}
              </Link>
            ))}
            <div className="mobile-divider" />
            {!isAuthenticated ? (
              <>
                <button className="mobile-link" onClick={() => { loginAs('buyer'); setMobileOpen(false); }}>
                  Demo Buyer Login
                </button>
                <button className="mobile-link" onClick={() => { loginAs('seller'); setMobileOpen(false); }}>
                  Demo Seller Login
                </button>
                <Link to="/signup" className="btn btn-primary" style={{ margin: '0.5rem 0' }}>
                  Create Profile
                </Link>
              </>
            ) : (
              <>
                <Link to={user?.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard'} className="mobile-link">
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <button className="mobile-link" onClick={() => { logout(); navigate('/'); setMobileOpen(false); }}>
                  <LogIn size={16} />
                  Logout
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
