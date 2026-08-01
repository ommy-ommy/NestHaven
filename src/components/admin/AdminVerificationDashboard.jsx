import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Clock, AlertTriangle, CheckCircle, XCircle, Search, Filter, Eye, FileText, Check, Landmark, UserCheck, Building2, Crown, FileCheck } from 'lucide-react'
import { useVerification, VERIFICATION_BADGES } from '../../context/VerificationContext'
import VerificationBadge from '../verification/VerificationBadge'
import DocumentPreviewModal from '../document/DocumentPreviewModal'
import './AdminVerificationDashboard.css'

export default function AdminVerificationDashboard() {
  const { requests, approveVerification, rejectVerification } = useVerification()

  const [statusFilter, setStatusFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeReviewReq, setActiveReviewReq] = useState(null)
  const [selectedBadges, setSelectedBadges] = useState(['verified_owner', 'verified_document'])
  const [adminNotes, setAdminNotes] = useState('')

  const [selectedDocPreview, setSelectedDocPreview] = useState(null)
  const [showDocPreview, setShowDocPreview] = useState(false)

  // Metrics
  const totalReqs = requests.length
  const pendingReqs = requests.filter(r => r.status === 'Pending Approval').length
  const approvedReqs = requests.filter(r => r.status === 'Approved').length
  const rejectedReqs = requests.filter(r => r.status === 'Rejected').length

  const filteredRequests = requests.filter(r => {
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter
    const matchesSearch =
      r.propertyTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.sellerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.sellerEmail?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesSearch
  })

  const toggleBadgeSelection = (badgeId) => {
    if (selectedBadges.includes(badgeId)) {
      setSelectedBadges(prev => prev.filter(id => id !== badgeId))
    } else {
      setSelectedBadges(prev => [...prev, badgeId])
    }
  }

  const handleOpenReview = (req) => {
    setActiveReviewReq(req)
    setSelectedBadges(req.assignedBadges?.length > 0 ? req.assignedBadges : ['verified_owner', 'verified_document'])
    setAdminNotes(req.adminNotes || '')
  }

  const handleApproveSubmit = () => {
    if (!activeReviewReq) return
    approveVerification(activeReviewReq.id, selectedBadges, adminNotes || 'Documents verified & badges awarded by Admin Compliance.')
    setActiveReviewReq(null)
  }

  const handleRejectSubmit = () => {
    if (!activeReviewReq) return
    rejectVerification(activeReviewReq.id, adminNotes || 'Verification request rejected due to document mismatch.')
    setActiveReviewReq(null)
  }

  const handlePreviewDoc = (doc) => {
    if (!doc) return
    setSelectedDocPreview({
      id: `doc_preview_${Date.now()}`,
      name: doc.name,
      category: doc.type,
      fileUrl: doc.url,
      fileSize: '1.8 MB',
      verificationStatus: 'Pending Review',
    })
    setShowDocPreview(true)
  }

  return (
    <div className="admin-ver-container">
      {/* Header */}
      <div className="admin-ver-header">
        <div>
          <h2><ShieldCheck color="#2563EB" size={28} /> Property Verification & Badge Management</h2>
          <p>Review seller identity & title deeds to award official verified badges to listings.</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="admin-ver-metrics">
        <div className="ver-metric-card metric-blue">
          <div className="metric-icon"><ShieldCheck size={22} /></div>
          <div>
            <span className="metric-val">{totalReqs}</span>
            <span className="metric-lbl">Total Applications</span>
          </div>
        </div>

        <div className="ver-metric-card metric-amber">
          <div className="metric-icon"><Clock size={22} /></div>
          <div>
            <span className="metric-val">{pendingReqs}</span>
            <span className="metric-lbl">Pending Review</span>
          </div>
        </div>

        <div className="ver-metric-card metric-emerald">
          <div className="metric-icon"><CheckCircle size={22} /></div>
          <div>
            <span className="metric-val">{approvedReqs}</span>
            <span className="metric-lbl">Verified Badges Awarded</span>
          </div>
        </div>

        <div className="ver-metric-card metric-rose">
          <div className="metric-icon"><XCircle size={22} /></div>
          <div>
            <span className="metric-val">{rejectedReqs}</span>
            <span className="metric-lbl">Rejected</span>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="admin-ver-controls">
        <div className="search-box">
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search by property title, seller name, email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter size={16} color="#64748b" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="admin-ver-table-wrapper">
        <table className="admin-ver-table">
          <thead>
            <tr>
              <th>Property Listing</th>
              <th>Seller / Agent</th>
              <th>Date Submitted</th>
              <th>Status</th>
              <th>Active Badges</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-table-cell">
                  No verification applications found.
                </td>
              </tr>
            ) : (
              filteredRequests.map(req => (
                <tr key={req.id}>
                  <td>
                    <div className="table-prop-name">
                      <strong>{req.propertyTitle}</strong>
                      <span>ID: {req.propertyId}</span>
                    </div>
                  </td>

                  <td>
                    <div className="table-seller-info">
                      <strong>{req.sellerName}</strong>
                      <span>{req.sellerEmail}</span>
                    </div>
                  </td>

                  <td>{req.submittedDate}</td>

                  <td>
                    <span className={`status-badge-admin status-${req.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                      {req.status === 'Approved' && <ShieldCheck size={13} />}
                      {req.status === 'Pending Approval' && <Clock size={13} />}
                      {req.status === 'Rejected' && <XCircle size={13} />}
                      {req.status}
                    </span>
                  </td>

                  <td>
                    <div className="table-badges-cell">
                      {req.assignedBadges && req.assignedBadges.length > 0 ? (
                        req.assignedBadges.map(bId => {
                          const badge = VERIFICATION_BADGES.find(b => b.id === bId)
                          return badge ? <VerificationBadge key={bId} badge={badge} size="sm" /> : null
                        })
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>None</span>
                      )}
                    </div>
                  </td>

                  <td>
                    <button
                      className="btn btn-primary btn-sm review-action-btn"
                      onClick={() => handleOpenReview(req)}
                    >
                      <Eye size={14} /> Audit & Award Badges
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {activeReviewReq && (
        <div className="ver-review-overlay" onClick={() => setActiveReviewReq(null)}>
          <motion.div
            className="ver-review-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="ver-review-header">
              <div>
                <h3>Review Verification Credentials</h3>
                <p>Property: <strong>{activeReviewReq.propertyTitle}</strong></p>
              </div>
              <button className="doc-close-btn" onClick={() => setActiveReviewReq(null)}>
                <XCircle size={20} />
              </button>
            </div>

            <div className="ver-review-body">
              {/* Submitted Credentials Section */}
              <div className="review-section">
                <h4>1. Submitted Credentials & Documents</h4>
                <div className="submitted-docs-grid">
                  {Object.entries(activeReviewReq.documents || {}).map(([key, doc]) => (
                    <div key={key} className="doc-preview-chip">
                      <FileText size={16} color="#2563EB" />
                      <div className="chip-details">
                        <strong className="chip-type">{doc?.type || key}</strong>
                        <span className="chip-name">{doc?.name || 'Not Uploaded'}</span>
                      </div>
                      {doc?.url && (
                        <button
                          className="btn-chip-preview"
                          onClick={() => handlePreviewDoc(doc)}
                        >
                          View
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Select Badges Section */}
              <div className="review-section">
                <h4>2. Select Verification Badges to Award</h4>
                <div className="badge-picker-grid">
                  {VERIFICATION_BADGES.map(badge => {
                    const isSelected = selectedBadges.includes(badge.id)
                    return (
                      <div
                        key={badge.id}
                        className={`badge-picker-item ${isSelected ? 'picker-selected' : ''}`}
                        onClick={() => toggleBadgeSelection(badge.id)}
                      >
                        <div className="picker-checkbox">
                          {isSelected && <Check size={12} color="#ffffff" />}
                        </div>
                        <VerificationBadge badge={badge} size="md" />
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Admin Feedback Notes */}
              <div className="review-section">
                <h4>3. Admin Audit Notes</h4>
                <textarea
                  className="form-input"
                  rows={2}
                  placeholder="Enter audit remarks or rejection reasons..."
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="ver-review-footer">
              <button className="btn btn-ghost btn-sm" onClick={() => setActiveReviewReq(null)}>
                Cancel
              </button>
              <button className="btn btn-danger btn-sm" onClick={handleRejectSubmit}>
                Reject Request
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleApproveSubmit}>
                Approve & Award {selectedBadges.length} Badges
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={showDocPreview}
        onClose={() => setShowDocPreview(false)}
        document={selectedDocPreview}
        currentUser={{ name: 'Admin Inspector', role: 'admin' }}
      />
    </div>
  )
}
