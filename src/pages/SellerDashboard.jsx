import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2, Eye, MessageSquare, Star, Plus, Edit3, Trash2, TrendingUp, Users, BarChart3, FileText, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { properties, formatPrice } from '../data/properties'
import SellerDocumentUploadModal from '../components/document/SellerDocumentUploadModal'
import './Dashboard.css'

export default function SellerDashboard() {
  const { user } = useAuth()
  const myListings = properties.filter(p => p.sellerId === 's1')

  const [selectedPropertyForUpload, setSelectedPropertyForUpload] = useState(null)
  const [showUploadModal, setShowUploadModal] = useState(false)

  const stats = [
    { icon: <Building2 size={22} />, label: 'Total Listings', value: user?.totalListings || 24, color: 'var(--color-primary)' },
    { icon: <Eye size={22} />, label: 'Total Views', value: '12.5K', color: 'var(--color-accent)' },
    { icon: <MessageSquare size={22} />, label: 'Inquiries', value: 48, color: 'var(--color-teal)' },
    { icon: <Star size={22} />, label: 'Avg Rating', value: user?.rating || 4.8, color: '#E8A838' },
  ]

  return (
    <motion.div className="dashboard-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="container">
        <div className="dash-header">
          <div>
            <h1>Seller Dashboard</h1>
            <p>Welcome back, {user?.name || 'Seller'}! Here's your overview.</p>
          </div>
          <Link to="/seller/add-property" className="btn btn-primary">
            <Plus size={16} />
            Add Property
          </Link>
        </div>

        {/* Stats */}
        <div className="dash-stats">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="dash-stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="stat-card-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                {stat.icon}
              </div>
              <div>
                <p className="stat-card-value">{stat.value}</p>
                <p className="stat-card-label">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Performance Chart */}
        <div className="dash-section">
          <div className="dash-section-header">
            <h3><BarChart3 size={20} /> Performance Overview</h3>
          </div>
          <div className="chart-placeholder">
            <div className="chart-bars">
              {[65, 80, 45, 90, 70, 85, 60, 95, 75, 88, 55, 92].map((h, i) => (
                <motion.div
                  key={i}
                  className="chart-bar"
                  style={{ '--bar-height': `${h}%` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.6, ease: 'easeOut' }}
                />
              ))}
            </div>
            <div className="chart-labels">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* My Listings */}
        <div className="dash-section">
          <div className="dash-section-header">
            <h3><Building2 size={20} /> My Listings</h3>
            <Link to="/seller/add-property" className="btn btn-ghost btn-sm">View All</Link>
          </div>
          <div className="listings-table-wrap">
            <table className="listings-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Price</th>
                  <th>Type</th>
                  <th>Views</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myListings.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="listing-cell">
                        <img src={p.images[0]} alt="" className="listing-thumb" />
                        <div>
                          <p className="listing-title">{p.title}</p>
                          <p className="listing-loc">{p.locality}, {p.city}</p>
                        </div>
                      </div>
                    </td>
                    <td><strong>{formatPrice(p.price, p.listingType)}</strong></td>
                    <td><span className="badge badge-primary">{p.listingType}</span></td>
                    <td>{p.views}</td>
                    <td><span className="table-rating"><Star size={12} fill="var(--color-accent)" color="var(--color-accent)" /> {p.rating}</span></td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}
                          onClick={() => {
                            setSelectedPropertyForUpload(p)
                            setShowUploadModal(true)
                          }}
                          title="Upload & Manage Legal Verification Documents"
                        >
                          <FileText size={13} />
                          Upload Docs
                        </button>
                        <button className="btn btn-ghost btn-sm"><Edit3 size={14} /></button>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-coral)' }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="dash-section">
          <div className="dash-section-header">
            <h3><MessageSquare size={20} /> Recent Inquiries</h3>
          </div>
          <div className="inquiries-list">
            {[
              { name: 'Priya Sharma', property: 'Luxury Penthouse in Worli', time: '2 hours ago', type: 'Visit Request' },
              { name: 'Rahul Gupta', property: 'Cozy 2BHK in Dwarka', time: '5 hours ago', type: 'Price Query' },
              { name: 'Aditya Joshi', property: 'Elegant 4BHK in Marine Drive', time: '1 day ago', type: 'Meeting Scheduled' },
            ].map((inq, i) => (
              <div key={i} className="inquiry-item">
                <div className="inquiry-avatar">{inq.name.charAt(0)}</div>
                <div className="inquiry-info">
                  <p className="inquiry-name">{inq.name}</p>
                  <p className="inquiry-property">{inq.property}</p>
                </div>
                <div className="inquiry-meta">
                  <span className="badge badge-primary">{inq.type}</span>
                  <span className="inquiry-time">{inq.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SellerDocumentUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        propertyId={selectedPropertyForUpload?.id}
        propertyTitle={selectedPropertyForUpload?.title}
        currentUser={user}
      />
    </motion.div>
  )
}
