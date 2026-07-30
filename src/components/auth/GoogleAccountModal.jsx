import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Check, ShieldCheck, UserPlus } from 'lucide-react'
import './GoogleAccountModal.css'

export default function GoogleAccountModal({ isOpen, onClose, onSelectAccount, role = 'buyer' }) {
  const [customEmail, setCustomEmail] = useState('')
  const [customName, setCustomName] = useState('')
  const [showAddCustom, setShowAddCustom] = useState(false)

  if (!isOpen) return null

  // Pre-configured browser Google accounts simulation
  const accounts = [
    {
      id: 'g1',
      name: 'Ommy Sharma',
      email: 'ommy.sharma@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
    },
    {
      id: 'g2',
      name: 'Om Prakash',
      email: 'omprakash.realestate@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80',
    },
    {
      id: 'g3',
      name: 'NestHaven User',
      email: 'user.nesthaven@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    },
  ]

  const handleChoose = (acc) => {
    onSelectAccount({
      id: `google_${Date.now()}`,
      name: acc.name,
      email: acc.email,
      avatar: acc.avatar,
      role: role,
    })
  }

  const handleCustomSubmit = (e) => {
    e.preventDefault()
    if (!customEmail) return

    const derivedName = customName || customEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    onSelectAccount({
      id: `google_${Date.now()}`,
      name: derivedName,
      email: customEmail,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(derivedName)}&background=8AB641&color=fff`,
      role: role,
    })
  }

  return (
    <div className="google-modal-overlay" onClick={onClose}>
      <motion.div
        className="google-modal-card"
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="google-modal-header">
          <div className="google-header-logo">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Sign in with Google</span>
          </div>
          <button className="google-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Title */}
        <div className="google-modal-body">
          <h3 className="google-prompt-title">Choose an account</h3>
          <p className="google-prompt-sub">to continue to <strong>NestHaven Real Estate</strong></p>

          {/* Accounts List */}
          <div className="google-accounts-list">
            {accounts.map(acc => (
              <button
                key={acc.id}
                className="google-account-item"
                onClick={() => handleChoose(acc)}
              >
                <img src={acc.avatar} alt={acc.name} className="account-avatar" />
                <div className="account-details">
                  <span className="account-name">{acc.name}</span>
                  <span className="account-email">{acc.email}</span>
                </div>
              </button>
            ))}
          </div>

          {!showAddCustom ? (
            <button
              className="google-use-another-btn"
              onClick={() => setShowAddCustom(true)}
            >
              <UserPlus size={16} />
              <span>Use another Google email account</span>
            </button>
          ) : (
            <form className="custom-email-form" onSubmit={handleCustomSubmit}>
              <div className="form-group" style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>Enter Google Email Address</label>
                <input
                  type="email"
                  placeholder="your.email@gmail.com"
                  className="form-input"
                  value={customEmail}
                  onChange={e => setCustomEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>Your Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Ommy Sharma"
                  className="form-input"
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                  Continue as {customName || customEmail.split('@')[0] || 'User'}
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowAddCustom(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="google-disclaimer">
            <ShieldCheck size={14} color="#10B981" />
            <span>To continue, Google will share your name, email address, and profile picture with NestHaven.</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
