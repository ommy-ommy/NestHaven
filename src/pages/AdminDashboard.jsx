import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, Users, Building2, Flag, Settings, Home, TrendingUp, Eye, UserCheck, DollarSign, BarChart3 } from 'lucide-react'
import './Admin.css'

function AdminLayout({ children }) {
  const location = useLocation()
  const links = [
    { path: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { path: '/admin/users', icon: <Users size={18} />, label: 'Users' },
    { path: '/admin/properties', icon: <Building2 size={18} />, label: 'Properties' },
  ]

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-logo">
          <div className="logo-icon"><Home size={16} /></div>
          <span>NestHaven</span>
          <span className="admin-tag">Admin</span>
        </Link>
        <nav className="admin-nav">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`admin-link ${location.pathname === link.path ? 'admin-link-active' : ''}`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <Link to="/" className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
            <Home size={14} /> Back to Site
          </Link>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  )
}

export default function AdminDashboard() {
  const stats = [
    { icon: <Users size={22} />, label: 'Total Users', value: '8,542', change: '+12%', color: 'var(--color-primary)' },
    { icon: <Building2 size={22} />, label: 'Total Properties', value: '15,230', change: '+8%', color: 'var(--color-accent)' },
    { icon: <Eye size={22} />, label: 'Monthly Views', value: '2.4M', change: '+24%', color: 'var(--color-teal)' },
    { icon: <DollarSign size={22} />, label: 'Revenue', value: '₹18.5L', change: '+15%', color: '#8B5CF6' },
  ]

  const recentActivity = [
    { action: 'New user registration', detail: 'Priya Sharma signed up as Buyer', time: '5 min ago' },
    { action: 'Property listed', detail: 'Luxury Villa in DLF Phase 5 by Vikram Singh', time: '15 min ago' },
    { action: 'Property reported', detail: 'Suspicious listing in Dwarka flagged', time: '1 hour ago' },
    { action: 'User verified', detail: 'Sneha Patel completed seller verification', time: '2 hours ago' },
    { action: 'Meeting completed', detail: 'Property visit for Penthouse in Worli', time: '3 hours ago' },
  ]

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="admin-header">
          <h1>Dashboard</h1>
          <p>Welcome to the NestHaven admin panel</p>
        </div>

        <div className="admin-stats">
          {stats.map((stat, i) => (
            <motion.div key={i} className="admin-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="admin-stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>{stat.icon}</div>
              <div className="admin-stat-info">
                <p className="admin-stat-value">{stat.value}</p>
                <p className="admin-stat-label">{stat.label}</p>
              </div>
              <span className="admin-stat-change" style={{ color: 'var(--color-primary)' }}><TrendingUp size={14} /> {stat.change}</span>
            </motion.div>
          ))}
        </div>

        <div className="admin-grid-2">
          {/* Chart */}
          <div className="admin-card">
            <h3><BarChart3 size={18} /> Monthly Overview</h3>
            <div className="chart-placeholder">
              <div className="chart-bars">
                {[70, 85, 55, 92, 78, 95, 65, 88, 72, 90, 60, 98].map((h, i) => (
                  <motion.div key={i} className="chart-bar" initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }} />
                ))}
              </div>
              <div className="chart-labels">
                {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => <span key={m}>{m}</span>)}
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="admin-card">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {recentActivity.map((a, i) => (
                <div key={i} className="activity-item">
                  <div className="activity-dot" />
                  <div>
                    <p className="activity-action">{a.action}</p>
                    <p className="activity-detail">{a.detail}</p>
                  </div>
                  <span className="activity-time">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  )
}

export { AdminLayout }
