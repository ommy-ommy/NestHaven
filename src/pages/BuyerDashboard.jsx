import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Eye, Home as HomeIcon, Calendar, CreditCard, MapPin, Shield, Star, Building2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoriteContext'
import { properties } from '../data/properties'
import PropertyCard from '../components/property/PropertyCard'
import './Dashboard.css'

export default function BuyerDashboard() {
  const { user } = useAuth()
  const { favorites } = useFavorites()
  const favoriteProperties = properties.filter(p => favorites.has(p.id))

  const stats = [
    { icon: <Eye size={22} />, label: 'Properties Visited', value: user?.propertiesVisited || 12, color: 'var(--color-primary)' },
    { icon: <HomeIcon size={22} />, label: 'Properties Owned', value: user?.propertiesOwned || 2, color: 'var(--color-accent)' },
    { icon: <Heart size={22} />, label: 'Favorites', value: favorites.size, color: 'var(--color-coral)' },
    { icon: <Calendar size={22} />, label: 'Meetings', value: user?.meetingsScheduled || 5, color: 'var(--color-teal)' },
  ]

  const meetings = [
    { title: 'Luxury Penthouse Visit', seller: 'Arjun Mehta', date: 'Jul 28, 2026', time: '2:00 PM', type: 'In-Person', status: 'Upcoming' },
    { title: '3BHK Apartment Tour', seller: 'Sneha Patel', date: 'Jul 30, 2026', time: '11:00 AM', type: 'Video Call', status: 'Upcoming' },
    { title: 'Villa Inspection', seller: 'Vikram Singh', date: 'Jul 22, 2026', time: '4:00 PM', type: 'In-Person', status: 'Completed' },
  ]

  return (
    <motion.div className="dashboard-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="container">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar-large">{user?.name?.charAt(0) || 'P'}</div>
          <div className="profile-info">
            <h2>{user?.name || 'Priya Sharma'}</h2>
            <p>{user?.email || 'priya@gmail.com'} • {user?.phone || '+91 99887 65432'}</p>
            <div className="profile-badges">
              <span className="badge badge-primary"><Shield size={10} /> Verified</span>
              <span className="badge badge-accent">Member since {user?.joinedDate || '2024'}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="dash-stats">
          {stats.map((stat, i) => (
            <motion.div key={i} className="dash-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="stat-card-icon" style={{ background: `${stat.color}15`, color: stat.color }}>{stat.icon}</div>
              <div><p className="stat-card-value">{stat.value}</p><p className="stat-card-label">{stat.label}</p></div>
            </motion.div>
          ))}
        </div>

        {/* Credit Cards */}
        <div className="dash-section">
          <div className="dash-section-header"><h3><CreditCard size={20} /> Payment Methods</h3></div>
          <div className="credit-cards">
            {(user?.creditCards || [{ last4: '4242', brand: 'Visa', expiry: '12/27' }, { last4: '8888', brand: 'Mastercard', expiry: '06/28' }]).map((card, i) => (
              <motion.div key={i} className={`credit-card-mock ${i === 0 ? 'cc-visa' : 'cc-mastercard'}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.15 }}>
                <div className="cc-pattern" />
                <div className="cc-brand">{card.brand}</div>
                <div className="cc-number">•••• •••• •••• {card.last4}</div>
                <div className="cc-bottom"><span>Card Holder</span><span>{card.expiry}</span></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Favorites */}
        <div className="dash-section">
          <div className="dash-section-header">
            <h3><Heart size={20} /> Favorite Properties</h3>
            <Link to="/properties" className="btn btn-ghost btn-sm">Browse More</Link>
          </div>
          {favoriteProperties.length > 0 ? (
            <div className="favorites-grid">
              {favoriteProperties.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          ) : (
            <div className="no-favorites">
              <Heart size={48} />
              <h3>No favorites yet</h3>
              <p>Start exploring properties and save your favorites here!</p>
              <Link to="/properties" className="btn btn-primary" style={{ marginTop: 'var(--space-md)' }}>Explore Properties</Link>
            </div>
          )}
        </div>

        {/* Meetings */}
        <div className="dash-section">
          <div className="dash-section-header"><h3><Calendar size={20} /> My Meetings</h3></div>
          <div className="meetings-grid">
            {meetings.map((m, i) => (
              <motion.div key={i} className="meeting-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                  <h4>{m.title}</h4>
                  <span className={`badge ${m.status === 'Upcoming' ? 'badge-primary' : 'badge-accent'}`}>{m.status}</span>
                </div>
                <div className="meeting-detail"><Building2 size={14} /> {m.seller}</div>
                <div className="meeting-detail"><Calendar size={14} /> {m.date} at {m.time}</div>
                <div className="meeting-detail"><MapPin size={14} /> {m.type}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
