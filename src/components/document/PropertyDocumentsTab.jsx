import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Lock, Eye, Download, FileText, CheckCircle2, Clock, AlertCircle, LogIn, FileCheck, Info } from 'lucide-react'
import { useDocuments } from '../../context/DocumentContext'
import { useAuth } from '../../context/AuthContext'
import DocumentPreviewModal from './DocumentPreviewModal'
import './PropertyDocumentsTab.css'

export default function PropertyDocumentsTab({ propertyId, propertyTitle }) {
  const { getDocumentsForProperty, incrementDownload } = useDocuments()
  const { user } = useAuth()
  const documents = getDocumentsForProperty(propertyId)

  const [selectedDoc, setSelectedDoc] = useState(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  const handleOpenPreview = (doc) => {
    setSelectedDoc(doc)
    setShowPreviewModal(true)
  }

  const handleDirectDownload = (doc, e) => {
    e.stopPropagation()
    incrementDownload(doc.id, user)
    const link = window.document.createElement('a')
    link.href = doc.fileUrl
    link.target = '_blank'
    link.download = doc.name
    window.document.body.appendChild(link)
    link.click()
    window.document.body.removeChild(link)
  }

  const verifiedCount = documents.filter(d => d.verificationStatus === 'Verified').length

  return (
    <div className="property-documents-section">
      <div className="doc-section-header">
        <div className="doc-header-text">
          <div className="doc-section-badge">
            <ShieldCheck size={16} /> Legal & Title Verification
          </div>
          <h3>Property Legal Documents ({documents.length})</h3>
          <p className="doc-header-subtitle">
            Authenticated document vault containing verified deeds, clearances, and certificates.
          </p>
        </div>
        {user && (
          <div className="doc-trust-score-badge">
            <CheckCircle2 size={18} color="#10B981" />
            <div>
              <strong>{verifiedCount} of {documents.length} Verified</strong>
              <span>Verified by NestHaven Legal Team</span>
            </div>
          </div>
        )}
      </div>

      {/* Security Restricted Guard for Non-Logged-In Users */}
      {!user ? (
        <motion.div
          className="doc-security-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="security-icon-circle">
            <Lock size={32} />
          </div>
          <h4>Security Protected Legal Documents</h4>
          <p>
            Due to privacy & legal compliance, document previews, deeds, and tax receipts are reserved exclusively for registered interested buyers & verified users.
          </p>

          <div className="protected-docs-preview-list">
            {documents.slice(0, 4).map((doc, idx) => (
              <div key={idx} className="protected-doc-item">
                <FileText size={16} color="#64748b" />
                <span className="protected-doc-name">{doc.category} ({doc.name})</span>
                <span className="protected-doc-status">{doc.verificationStatus}</span>
              </div>
            ))}
          </div>

          <a href="/login" className="btn btn-primary btn-md security-login-btn">
            <LogIn size={16} /> Log In to Access & Download Documents
          </a>
        </motion.div>
      ) : (
        /* Logged-In User Document Grid */
        <div className="property-docs-grid">
          {documents.length === 0 ? (
            <div className="empty-docs-box">
              <FileCheck size={40} color="#94a3b8" />
              <p>No legal documents uploaded yet for this property.</p>
            </div>
          ) : (
            documents.map(doc => (
              <motion.div
                key={doc.id}
                className="doc-card"
                whileHover={{ y: -3, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)' }}
              >
                <div className="doc-card-top">
                  <div className="doc-card-icon">
                    <FileText size={24} color="var(--color-primary-dark, #5d8225)" />
                  </div>
                  <div className="doc-card-title-group">
                    <span className="doc-card-category">{doc.category}</span>
                    <h4 className="doc-card-title" title={doc.name}>{doc.name}</h4>
                  </div>
                </div>

                <div className="doc-card-meta-row">
                  <span className={`doc-status-tag status-${doc.verificationStatus?.toLowerCase().replace(/\s+/g, '-')}`}>
                    {doc.verificationStatus === 'Verified' && <ShieldCheck size={12} />}
                    {doc.verificationStatus === 'Pending Review' && <Clock size={12} />}
                    {doc.verificationStatus === 'Rejected' && <AlertCircle size={12} />}
                    {doc.verificationStatus}
                  </span>
                  <span className="doc-file-size">{doc.fileSize}</span>
                </div>

                {doc.verificationNotes && (
                  <div className="doc-card-notes">
                    <Info size={12} style={{ shrink: 0, marginTop: '2px' }} />
                    <span>{doc.verificationNotes}</span>
                  </div>
                )}

                <div className="doc-card-footer">
                  <div className="doc-stats">
                    <span><Eye size={12} /> {doc.views?.length || 0}</span>
                    <span><Download size={12} /> {doc.downloadCount || 0}</span>
                  </div>
                  <div className="doc-card-actions">
                    <button
                      className="doc-btn doc-btn-preview"
                      onClick={() => handleOpenPreview(doc)}
                    >
                      <Eye size={14} /> Preview
                    </button>
                    <button
                      className="doc-btn doc-btn-download"
                      onClick={(e) => handleDirectDownload(doc, e)}
                      title="Download document"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        document={selectedDoc}
        currentUser={user}
      />
    </div>
  )
}
