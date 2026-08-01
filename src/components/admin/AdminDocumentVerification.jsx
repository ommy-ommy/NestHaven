import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Clock, AlertTriangle, Eye, Download, FileText, CheckCircle, XCircle, Search, Filter, History, Trash2, ArrowUpRight } from 'lucide-react'
import { useDocuments, DOCUMENT_CATEGORIES } from '../../context/DocumentContext'
import DocumentPreviewModal from '../document/DocumentPreviewModal'
import './AdminDocumentVerification.css'

export default function AdminDocumentVerification() {
  const { documents, updateVerificationStatus, deleteDocument } = useDocuments()

  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAuditDoc, setSelectedAuditDoc] = useState(null)

  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  const [notesInput, setNotesInput] = useState('')
  const [activeEditingId, setActiveEditingId] = useState(null)

  // Metrics
  const totalDocs = documents.length
  const pendingCount = documents.filter(d => d.verificationStatus === 'Pending Review').length
  const verifiedCount = documents.filter(d => d.verificationStatus === 'Verified').length
  const rejectedCount = documents.filter(d => d.verificationStatus === 'Rejected').length
  const totalDownloads = documents.reduce((acc, d) => acc + (d.downloadCount || 0), 0)

  // Filtered documents
  const filteredDocs = documents.filter(doc => {
    const matchesStatus = statusFilter === 'All' || doc.verificationStatus === statusFilter
    const matchesCategory = categoryFilter === 'All' || doc.category === categoryFilter
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.propertyTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.uploadedBy?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesCategory && matchesSearch
  })

  const handleApprove = (docId) => {
    updateVerificationStatus(docId, 'Verified', 'Verified by NestHaven Admin Legal Compliance team.')
  }

  const handleRejectSubmit = (docId) => {
    updateVerificationStatus(docId, 'Rejected', notesInput || 'Document rejected due to clarity/validity issues.')
    setActiveEditingId(null)
    setNotesInput('')
  }

  const handleOpenPreview = (doc) => {
    setSelectedPreviewDoc(doc)
    setShowPreviewModal(true)
  }

  return (
    <div className="admin-doc-verification-container">
      {/* Header */}
      <div className="admin-doc-header">
        <div>
          <h2><ShieldCheck color="var(--color-primary, #8ab641)" size={28} /> Admin Property Document Verification Vault</h2>
          <p>Review, audit, approve, or reject property verification documents uploaded by sellers.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="admin-doc-metrics">
        <div className="metric-card metric-total">
          <div className="metric-icon"><FileText size={22} /></div>
          <div>
            <span className="metric-val">{totalDocs}</span>
            <span className="metric-lbl">Total Documents</span>
          </div>
        </div>

        <div className="metric-card metric-pending">
          <div className="metric-icon"><Clock size={22} /></div>
          <div>
            <span className="metric-val">{pendingCount}</span>
            <span className="metric-lbl">Pending Audit</span>
          </div>
        </div>

        <div className="metric-card metric-verified">
          <div className="metric-icon"><CheckCircle size={22} /></div>
          <div>
            <span className="metric-val">{verifiedCount}</span>
            <span className="metric-lbl">Verified Clear</span>
          </div>
        </div>

        <div className="metric-card metric-downloads">
          <div className="metric-icon"><Download size={22} /></div>
          <div>
            <span className="metric-val">{totalDownloads}</span>
            <span className="metric-lbl">Total Downloads Logged</span>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="admin-doc-controls">
        <div className="search-box">
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search by title, seller name, category, or property..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="filter-item">
            <Filter size={16} color="#64748b" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="filter-item">
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              <option value="All">All Categories ({DOCUMENT_CATEGORIES.length})</option>
              {DOCUMENT_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table of Uploaded Documents */}
      <div className="admin-doc-table-wrapper">
        <table className="admin-doc-table">
          <thead>
            <tr>
              <th>Document / Category</th>
              <th>Property Title</th>
              <th>Uploaded By</th>
              <th>Status</th>
              <th>Views & Downloads</th>
              <th>Actions & Verification</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-table-cell">
                  No documents found matching your filter criteria.
                </td>
              </tr>
            ) : (
              filteredDocs.map(doc => (
                <tr key={doc.id}>
                  {/* Document & Category */}
                  <td>
                    <div className="table-doc-main">
                      <FileText size={20} color="var(--color-primary-dark, #5d8225)" />
                      <div>
                        <span className="table-doc-name" title={doc.name}>{doc.name}</span>
                        <div className="table-doc-sub">
                          <span className="table-category-tag">{doc.category}</span>
                          <span>• {doc.fileSize}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Property Title */}
                  <td>
                    <div className="table-prop-title" title={doc.propertyTitle}>
                      {doc.propertyTitle}
                    </div>
                  </td>

                  {/* Uploaded By */}
                  <td>
                    <div className="table-uploader-info">
                      <strong>{doc.uploadedBy}</strong>
                      <span>{doc.uploadedByEmail || 'seller@nesthaven.com'}</span>
                      <small>Uploaded {doc.uploadDate}</small>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td>
                    <span className={`status-badge-admin status-${doc.verificationStatus?.toLowerCase().replace(/\s+/g, '-')}`}>
                      {doc.verificationStatus === 'Verified' && <ShieldCheck size={13} />}
                      {doc.verificationStatus === 'Pending Review' && <Clock size={13} />}
                      {doc.verificationStatus === 'Rejected' && <AlertTriangle size={13} />}
                      {doc.verificationStatus}
                    </span>
                  </td>

                  {/* Views & Downloads Log button */}
                  <td>
                    <div className="table-stats-col">
                      <span><Eye size={13} /> {doc.views?.length || 0} views</span>
                      <span><Download size={13} /> {doc.downloadCount || 0} downloads</span>
                      <button
                        className="btn-link-audit"
                        onClick={() => setSelectedAuditDoc(doc)}
                      >
                        <History size={13} /> View Audit Log
                      </button>
                    </div>
                  </td>

                  {/* Verification Actions */}
                  <td>
                    <div className="table-actions-cell">
                      <button
                        className="btn-admin-action btn-preview"
                        onClick={() => handleOpenPreview(doc)}
                        title="Preview Document"
                      >
                        <Eye size={14} /> Preview
                      </button>

                      {doc.verificationStatus !== 'Verified' && (
                        <button
                          className="btn-admin-action btn-approve"
                          onClick={() => handleApprove(doc.id)}
                          title="Approve Document"
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                      )}

                      {doc.verificationStatus !== 'Rejected' && (
                        <button
                          className="btn-admin-action btn-reject"
                          onClick={() => { setActiveEditingId(doc.id); setNotesInput(''); }}
                          title="Reject Document"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      )}

                      <button
                        className="btn-admin-action btn-delete"
                        onClick={() => deleteDocument(doc.id)}
                        title="Delete Document"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Rejection Note Form Input Inline */}
                    {activeEditingId === doc.id && (
                      <div className="inline-reject-box">
                        <input
                          type="text"
                          placeholder="Reason for rejection..."
                          value={notesInput}
                          onChange={e => setNotesInput(e.target.value)}
                        />
                        <button className="btn btn-primary btn-sm" onClick={() => handleRejectSubmit(doc.id)}>
                          Submit Rejection
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setActiveEditingId(null)}>
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Audit Log Modal */}
      {selectedAuditDoc && (
        <div className="audit-modal-overlay" onClick={() => setSelectedAuditDoc(null)}>
          <motion.div
            className="audit-modal-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="audit-modal-header">
              <div>
                <h3><History size={18} /> Access & Download Audit Log</h3>
                <p>Document: <strong>{selectedAuditDoc.name}</strong></p>
              </div>
              <button className="doc-close-btn" onClick={() => setSelectedAuditDoc(null)}>
                <XCircle size={20} />
              </button>
            </div>

            <div className="audit-modal-body">
              <div className="audit-summary-strip">
                <div>Total Views: <strong>{selectedAuditDoc.views?.length || 0}</strong></div>
                <div>Total Downloads: <strong>{selectedAuditDoc.downloadCount || 0}</strong></div>
                <div>Upload Date: <strong>{selectedAuditDoc.uploadDate}</strong></div>
              </div>

              <h4>Detailed Access Log Entries ({selectedAuditDoc.views?.length || 0})</h4>
              {(!selectedAuditDoc.views || selectedAuditDoc.views.length === 0) ? (
                <p className="no-views-msg">No access or view entries recorded yet for this document.</p>
              ) : (
                <div className="audit-log-list">
                  {selectedAuditDoc.views.map((log, i) => (
                    <div key={i} className="audit-log-item">
                      <div className="log-user-details">
                        <strong>{log.user}</strong>
                        <span>{log.email} ({log.role || 'buyer'})</span>
                      </div>
                      <div className="log-timestamp">
                        <Clock size={12} /> {log.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="audit-modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedAuditDoc(null)}>
                Close Audit Log
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Document Previewer Modal */}
      <DocumentPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        document={selectedPreviewDoc}
        currentUser={{ name: 'Admin Inspector', role: 'admin', email: 'admin@nesthaven.com' }}
      />
    </div>
  )
}
