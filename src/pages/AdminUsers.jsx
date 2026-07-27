import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, UserCheck, Ban, MoreVertical, Shield } from 'lucide-react'
import { AdminLayout } from './AdminDashboard'
import './Admin.css'

const mockUsers = [
  { id: 1, name: 'Arjun Mehta', email: 'arjun@company.com', role: 'seller', status: 'active', properties: 24, joined: '2023-03-15' },
  { id: 2, name: 'Priya Sharma', email: 'priya@gmail.com', role: 'buyer', status: 'active', properties: 0, joined: '2024-01-10' },
  { id: 3, name: 'Sneha Patel', email: 'sneha@urbanrealty.com', role: 'seller', status: 'pending', properties: 15, joined: '2024-06-20' },
  { id: 4, name: 'Vikram Singh', email: 'vikram@royal.com', role: 'seller', status: 'active', properties: 31, joined: '2022-11-05' },
  { id: 5, name: 'Rahul Gupta', email: 'rahul@gmail.com', role: 'buyer', status: 'active', properties: 0, joined: '2025-02-14' },
  { id: 6, name: 'Meera Krishnan', email: 'meera@outlook.com', role: 'buyer', status: 'banned', properties: 0, joined: '2024-09-01' },
  { id: 7, name: 'Ravi Kumar', email: 'ravi@homefinder.in', role: 'seller', status: 'active', properties: 18, joined: '2023-07-22' },
  { id: 8, name: 'Karan Malhotra', email: 'karan@yahoo.com', role: 'buyer', status: 'active', properties: 0, joined: '2025-05-10' },
]

export default function AdminUsers() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = mockUsers.filter(u => {
    if (filter !== 'all' && u.role !== filter) return false
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="admin-header">
          <h1>User Management</h1>
          <p>Manage all buyers and sellers on the platform</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
          <div className="msg-search" style={{ maxWidth: 300 }}>
            <Search size={16} />
            <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            {['all', 'buyer', 'seller'].map(f => (
              <button key={f} className={`filter-chip ${filter === f ? 'chip-active' : ''}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}s{f === 'all' ? '' : ''}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>User</th><th>Role</th><th>Status</th><th>Properties</th><th>Joined</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="admin-user-cell">
                        <div className="admin-user-avatar">{user.name.charAt(0)}</div>
                        <div><p className="admin-user-name">{user.name}</p><p className="admin-user-email">{user.email}</p></div>
                      </div>
                    </td>
                    <td><span className={`badge ${user.role === 'seller' ? 'badge-primary' : 'badge-accent'}`}>{user.role}</span></td>
                    <td><span className={`status-badge status-${user.status}`}>{user.status}</span></td>
                    <td>{user.properties}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{user.joined}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost btn-sm" title="Verify"><UserCheck size={14} /></button>
                        <button className="btn btn-ghost btn-sm" title="Ban" style={{ color: 'var(--color-coral)' }}><Ban size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  )
}
