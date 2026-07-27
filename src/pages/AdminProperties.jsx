import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, CheckCircle, XCircle, Eye, Trash2, MapPin, IndianRupee } from 'lucide-react'
import { AdminLayout } from './AdminDashboard'
import './Admin.css'

const mockProperties = [
  { id: 'p1', title: 'Luxury Penthouse with Panoramic City Views', seller: 'Arjun Mehta', city: 'Mumbai', locality: 'Worli', price: 25000000, type: 'apartment', bhk: 4, status: 'approved', listed: '2024-12-01', views: 1240 },
  { id: 'p2', title: 'Modern Smart Home Villa', seller: 'Vikram Singh', city: 'Gurgaon', locality: 'DLF Phase 5', price: 85000000, type: 'villa', bhk: 5, status: 'approved', listed: '2024-11-15', views: 980 },
  { id: 'p3', title: 'Premium Sea-Facing Apartment', seller: 'Sneha Patel', city: 'Mumbai', locality: 'Bandra West', price: 45000000, type: 'apartment', bhk: 3, status: 'pending', listed: '2025-01-05', views: 450 },
  { id: 'p4', title: 'Heritage Haveli Conversion', seller: 'Ravi Kumar', city: 'Jaipur', locality: 'C-Scheme', price: 120000000, type: 'villa', bhk: 6, status: 'approved', listed: '2024-10-20', views: 2100 },
  { id: 'p5', title: 'Eco-Friendly Garden Apartment', seller: 'Arjun Mehta', city: 'Bangalore', locality: 'Whitefield', price: 12000000, type: 'apartment', bhk: 3, status: 'pending', listed: '2025-02-10', views: 320 },
  { id: 'p6', title: 'Compact Studio near Metro', seller: 'Sneha Patel', city: 'Delhi', locality: 'Dwarka', price: 3500000, type: 'apartment', bhk: 1, status: 'rejected', listed: '2025-01-28', views: 90 },
  { id: 'p7', title: 'Riverside Farmhouse Estate', seller: 'Vikram Singh', city: 'Pune', locality: 'Kharadi', price: 35000000, type: 'villa', bhk: 4, status: 'approved', listed: '2024-09-12', views: 1580 },
  { id: 'p8', title: 'Lake-View Luxury Apartment', seller: 'Ravi Kumar', city: 'Hyderabad', locality: 'Jubilee Hills', price: 28000000, type: 'apartment', bhk: 3, status: 'pending', listed: '2025-03-01', views: 210 },
]

function formatPrice(p) {
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(1)} Cr`
  if (p >= 100000) return `₹${(p / 100000).toFixed(1)} L`
  return `₹${p.toLocaleString('en-IN')}`
}

export default function AdminProperties() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [properties, setProperties] = useState(mockProperties)

  const filtered = properties.filter(p => {
    if (filter !== 'all' && p.status !== filter) return false
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.seller.toLowerCase().includes(search.toLowerCase()) && !p.city.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleApprove = (id) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p))
  }

  const handleReject = (id) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p))
  }

  const counts = {
    all: properties.length,
    approved: properties.filter(p => p.status === 'approved').length,
    pending: properties.filter(p => p.status === 'pending').length,
    rejected: properties.filter(p => p.status === 'rejected').length,
  }

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="admin-header">
          <h1>Property Management</h1>
          <p>Review, approve, or reject property listings</p>
        </div>

        {/* Summary Cards */}
        <div className="admin-stats" style={{ marginBottom: 'var(--space-xl)' }}>
          {[
            { label: 'Total', value: counts.all, color: 'var(--color-primary)' },
            { label: 'Approved', value: counts.approved, color: '#22C55E' },
            { label: 'Pending', value: counts.pending, color: 'var(--color-accent)' },
            { label: 'Rejected', value: counts.rejected, color: 'var(--color-coral)' },
          ].map((s, i) => (
            <motion.div key={i} className="admin-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className="admin-stat-info">
                <p className="admin-stat-value" style={{ color: s.color }}>{s.value}</p>
                <p className="admin-stat-label">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
          <div className="msg-search" style={{ maxWidth: 320 }}>
            <Search size={16} />
            <input type="text" placeholder="Search properties, sellers, cities..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            {['all', 'approved', 'pending', 'rejected'].map(f => (
              <button key={f} className={`filter-chip ${filter === f ? 'chip-active' : ''}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
              </button>
            ))}
          </div>
        </div>

        {/* Property Table */}
        <div className="admin-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Seller</th>
                  <th>Price</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Listed</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(property => (
                  <tr key={property.id}>
                    <td>
                      <div className="admin-property-cell">
                        <p className="admin-user-name" style={{ fontSize: '0.85rem', maxWidth: 220 }}>{property.title}</p>
                        <p className="admin-user-email"><MapPin size={11} /> {property.locality}, {property.city}</p>
                      </div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{property.seller}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-primary)', whiteSpace: 'nowrap' }}>{formatPrice(property.price)}</td>
                    <td><span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{property.type} · {property.bhk} BHK</span></td>
                    <td><span className={`status-badge status-${property.status === 'approved' ? 'active' : property.status}`}>{property.status}</span></td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{property.views.toLocaleString()}</td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{property.listed}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {property.status === 'pending' && (
                          <>
                            <button className="btn btn-ghost btn-sm" title="Approve" style={{ color: '#22C55E' }} onClick={() => handleApprove(property.id)}>
                              <CheckCircle size={15} />
                            </button>
                            <button className="btn btn-ghost btn-sm" title="Reject" style={{ color: 'var(--color-coral)' }} onClick={() => handleReject(property.id)}>
                              <XCircle size={15} />
                            </button>
                          </>
                        )}
                        <button className="btn btn-ghost btn-sm" title="View"><Eye size={14} /></button>
                        <button className="btn btn-ghost btn-sm" title="Delete" style={{ color: 'var(--color-coral)' }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--color-text-muted)' }}>
              <p>No properties match your filters.</p>
            </div>
          )}
        </div>
      </motion.div>
    </AdminLayout>
  )
}
