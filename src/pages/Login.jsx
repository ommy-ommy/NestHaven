import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, AlertCircle, Info } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Login() {
  const { signInWithGoogle, signInWithEmail, loginAs, authError, clearAuthError } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Form State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Sync global auth errors (e.g. from OAuth redirect hash)
  useEffect(() => {
    if (authError) {
      setError(authError)
    }
  }, [authError])

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setError(null)
      if (clearAuthError) clearAuthError()
      const res = await signInWithGoogle('buyer')
      if (res?.user) {
        navigate('/buyer/dashboard')
      }
    } catch (err) {
      console.error('Google Login error:', err)
      setError(err.message || 'Google sign-in failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter both your email address and password.')
      return
    }

    try {
      setLoading(true)
      setError(null)
      if (clearAuthError) clearAuthError()
      
      const data = await signInWithEmail(email.trim(), password)
      if (data?.user) {
        navigate('/buyer/dashboard')
      }
    } catch (err) {
      console.error('Email Login error:', err)
      let msg = 'Invalid email address or password. Please check your credentials and try again.'
      
      if (err.message) {
        const lowerMsg = err.message.toLowerCase()
        if (lowerMsg.includes('invalid login credentials') || lowerMsg.includes('invalid credentials')) {
          msg = '❌ Invalid email address or password. Please check your login details.'
        } else if (lowerMsg.includes('email not confirmed')) {
          msg = '📩 Your email address has not been confirmed yet. Please check your inbox for the confirmation link.'
        } else if (lowerMsg.includes('user not found')) {
          msg = '❌ No account found with this email address. Please sign up first.'
        } else {
          msg = `❌ ${err.message}`
        }
      }
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = (role) => {
    setError(null)
    if (clearAuthError) clearAuthError()
    loginAs(role)
    navigate(role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard')
  }

  return (
    <motion.div className="auth-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="auth-container">
        <div className="auth-form-side">
          <Link to="/" className="auth-logo">
            <div className="logo-icon"><Home size={18} /></div>
            NestHaven
          </Link>

          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Sign in to access your NestHaven account</p>

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
            <button className="social-btn google-btn" onClick={handleGoogleLogin} disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              {loading ? 'Connecting...' : 'Continue with Google'}
            </button>
          </div>

          <div className="auth-divider" style={{ margin: '1.25rem 0' }}>
            <span>or sign in with email</span>
          </div>

          {/* Email & Password Form */}
          <form className="auth-form" onSubmit={handleEmailLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="auth-footer-text" style={{ marginTop: '1.5rem' }}>
            Don't have an account? <Link to="/signup" className="auth-link">Create one</Link>
          </p>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Quick Demo Mode</p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => handleDemoLogin('buyer')}>Login as Buyer</button>
              <button className="btn btn-secondary btn-sm" onClick={() => handleDemoLogin('seller')}>Login as Seller</button>
            </div>
          </div>
        </div>

        <div className="auth-visual-side">
          <div className="auth-visual-content">
            <div className="auth-visual-shapes">
              <div className="av-shape av-shape-1" />
              <div className="av-shape av-shape-2" />
              <div className="av-shape av-shape-3" />
            </div>
            <div className="auth-visual-text">
              <h2>Welcome <span className="text-gradient">Back</span></h2>
              <p>Your dream home is just a few clicks away. Sign in to continue your search.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
