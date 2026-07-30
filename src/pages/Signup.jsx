import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2, Home, ArrowRight, CheckCircle, AlertCircle, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Signup() {
  const navigate = useNavigate()
  const { signUpWithEmail, signInWithGoogle, loginAs } = useAuth()
  const [step, setStep] = useState(0) // 0: select role, 1: form, 2: confirmation
  const [selectedRole, setSelectedRole] = useState('buyer')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    company: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [confirmationSent, setConfirmationSent] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setStep(1)
  }

  const handleChange = (e) => {
    setError(null)
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleGoogleSignup = async () => {
    try {
      setLoading(true)
      setError(null)
      await signInWithGoogle(selectedRole || 'buyer')
    } catch (err) {
      console.error('Google Signup error:', err)
      setError(
        err.message ||
        'Google Sign-In requires enabling Google Provider in your Supabase Dashboard (Authentication -> Providers -> Google).'
      )
      setLoading(false)
    }
  }

  const handleEmailSignup = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields.')
      return
    }

    try {
      setLoading(true)
      setError(null)

      await signUpWithEmail(formData.email.trim(), formData.password, {
        full_name: formData.fullName,
        phone: formData.phone,
        role: selectedRole || 'buyer',
        company: formData.company,
      })

      setRegisteredEmail(formData.email)
      setConfirmationSent(true)
    } catch (err) {
      console.error('Email Signup error:', err)
      let msg = err.message || 'Failed to sign up. Please try again.'
      if (err.message && err.message.toLowerCase().includes('already registered')) {
        msg = '❌ An account with this email address already exists. Please log in instead.'
      }
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleDemoComplete = () => {
    loginAs(selectedRole || 'buyer')
    navigate(selectedRole === 'seller' ? '/seller/dashboard' : '/buyer/dashboard')
  }

  return (
    <motion.div className="auth-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="auth-container">
        {/* Left: Form */}
        <div className="auth-form-side">
          <Link to="/" className="auth-logo">
            <div className="logo-icon"><Home size={18} /></div>
            NestHaven
          </Link>

          {step === 0 && (
            <motion.div className="role-selection" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2>Create Your Profile</h2>
              <p className="auth-subtitle">Select your role to get started with NestHaven</p>

              <div className="role-cards">
                <motion.button
                  className="role-card"
                  onClick={() => handleRoleSelect('seller')}
                  whileHover={{ y: -8, boxShadow: '0 16px 40px rgba(138, 182, 65, 0.15)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="role-icon role-icon-seller"><Building2 size={32} /></div>
                  <h3>I'm a Seller</h3>
                  <p>List and sell your properties, manage inquiries, and connect with verified buyers.</p>
                  <ul className="role-features">
                    <li><CheckCircle size={14} /> List unlimited properties</li>
                    <li><CheckCircle size={14} /> Manage buyer inquiries</li>
                    <li><CheckCircle size={14} /> Analytics dashboard</li>
                    <li><CheckCircle size={14} /> Verified seller badge</li>
                  </ul>
                  <span className="role-cta">Get Started <ArrowRight size={16} /></span>
                </motion.button>

                <motion.button
                  className="role-card"
                  onClick={() => handleRoleSelect('buyer')}
                  whileHover={{ y: -8, boxShadow: '0 16px 40px rgba(138, 182, 65, 0.15)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="role-icon role-icon-buyer"><Home size={32} /></div>
                  <h3>I'm a Buyer</h3>
                  <p>Find your dream home, schedule visits, and connect directly with property owners.</p>
                  <ul className="role-features">
                    <li><CheckCircle size={14} /> Browse all listings</li>
                    <li><CheckCircle size={14} /> Save favorites</li>
                    <li><CheckCircle size={14} /> Schedule property visits</li>
                    <li><CheckCircle size={14} /> Direct owner contact</li>
                  </ul>
                  <span className="role-cta">Get Started <ArrowRight size={16} /></span>
                </motion.button>
              </div>

              <p className="auth-footer-text">
                Already have an account? <Link to="/login" className="auth-link">Log in</Link>
              </p>
            </motion.div>
          )}

          {step === 1 && confirmationSent ? (
            <motion.div className="signup-success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(138, 182, 65, 0.15)',
                color: 'var(--color-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Mail size={32} />
              </div>
              <h2 style={{ fontSize: 'var(--fs-2xl)', marginBottom: '0.5rem' }}>Check Your Email</h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                We have sent a confirmation email to <br />
                <strong style={{ color: 'var(--color-text)' }}>{registeredEmail}</strong>.<br />
                Please click the link inside the email to verify and activate your account.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <Link to="/login" className="btn btn-primary btn-md">
                  Go to Login
                </Link>
                <button className="btn btn-ghost btn-md" onClick={() => setConfirmationSent(false)}>
                  Resend / Edit Info
                </button>
              </div>
            </motion.div>
          ) : step === 1 && (
            <motion.div className="signup-form" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
              <button className="back-btn" onClick={() => setStep(0)}>← Back to role selection</button>
              <h2>Create {selectedRole === 'seller' ? 'Seller' : 'Buyer'} Account</h2>
              <p className="auth-subtitle">Sign up with Google or enter your email & password</p>

              {/* Error Banner */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#991b1b',
                    fontSize: 'var(--fs-sm)',
                    marginBottom: '1.25rem',
                    lineHeight: '1.5'
                  }}
                >
                  <AlertCircle size={18} style={{ shrink: 0, marginTop: '2px' }} />
                  <div style={{ flex: 1 }}>{error}</div>
                </motion.div>
              )}

              {/* Social Login Button */}
              <div className="social-buttons" style={{ flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  className="social-btn google-btn"
                  onClick={handleGoogleSignup}
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  {loading ? 'Connecting to Google...' : `Sign Up with Google`}
                </button>
              </div>

              <div className="auth-divider" style={{ margin: '1.25rem 0' }}>
                <span>or sign up with email</span>
              </div>

              {/* Manual Email & Password Form */}
              <form className="auth-form" onSubmit={handleEmailSignup}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    className="form-input"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                {selectedRole === 'seller' && (
                  <div className="form-group">
                    <label className="form-label">Company / Agency Name</label>
                    <input
                      className="form-input"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="e.g. Apex Realty"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    className="form-input"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    className="form-input"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    className="form-input"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
                  {loading ? 'Creating Account...' : 'Create Account & Send Confirmation'}
                </button>
              </form>

              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid var(--color-border)' }}>
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Demo Mode</p>
                <button className="btn btn-secondary btn-sm" onClick={handleDemoComplete}>
                  Continue with Demo Profile
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right: Visual */}
        <div className="auth-visual-side">
          <div className="auth-visual-content">
            <div className="auth-visual-shapes">
              <div className="av-shape av-shape-1" />
              <div className="av-shape av-shape-2" />
              <div className="av-shape av-shape-3" />
            </div>
            <div className="auth-visual-text">
              <h2>Find Your <span className="text-gradient">Dream</span> Home</h2>
              <p>Join 15,000+ users who found their perfect property on NestHaven.</p>
              <div className="auth-visual-stats">
                <div><strong>15K+</strong><span>Properties</span></div>
                <div><strong>8.5K+</strong><span>Happy Users</span></div>
                <div><strong>98%</strong><span>Satisfaction</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
