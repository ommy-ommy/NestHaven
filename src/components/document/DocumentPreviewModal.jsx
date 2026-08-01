import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Download, ShieldCheck, Clock, AlertTriangle, Eye, FileText, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'
import { useDocuments } from '../../context/DocumentContext'
import './DocumentPreviewModal.css'

export default function DocumentPreviewModal({ isOpen, onClose, document, currentUser }) {
  const { recordView, incrementDownload } = useDocuments()
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    if (isOpen && document) {
      recordView(document.id, currentUser)
      setZoom(1)
      setRotation(0)
    }
  }, [isOpen, document])

  if (!isOpen || !document) return null

  const isPdf = document.type === 'pdf' || document.name.toLowerCase().endsWith('.pdf')

  const handleDownload = () => {
    incrementDownload(document.id, currentUser)

    // Create virtual download trigger link
    const link = window.document.createElement('a')
    link.href = document.fileUrl
    link.target = '_blank'
    link.download = document.name
    window.document.body.appendChild(link)
    link.click()
    window.document.body.removeChild(link)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="doc-status-badge badge-verified">
            <ShieldCheck size={14} /> Verified Document
          </span>
        )
      case 'Rejected':
        return (
          <span className="doc-status-badge badge-rejected">
            <AlertTriangle size={14} /> Rejected
          </span>
        )
      default:
        return (
          <span className="doc-status-badge badge-pending">
            <Clock size={14} /> Pending Review
          </span>
        )
    }
  }

  return (
    <div className="doc-preview-overlay" onClick={onClose}>
      <motion.div
        className="doc-preview-card"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="doc-preview-header">
          <div className="doc-header-info">
            <div className="doc-category-tag">{document.category}</div>
            <h3 className="doc-preview-title">{document.name}</h3>
            <div className="doc-header-meta">
              {getStatusBadge(document.verificationStatus)}
              <span className="doc-meta-item">
                <FileText size={13} /> {document.fileSize}
              </span>
              <span className="doc-meta-item">
                <Clock size={13} /> Uploaded {document.uploadDate}
              </span>
              <span className="doc-meta-item">
                <Eye size={13} /> {document.views?.length || 0} Views
              </span>
              <span className="doc-meta-item">
                <Download size={13} /> {document.downloadCount || 0} Downloads
              </span>
            </div>
          </div>
          <div className="doc-header-actions">
            <button className="doc-download-btn" onClick={handleDownload}>
              <Download size={16} /> Download File
            </button>
            <button className="doc-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Verification Banner */}
        {document.verificationNotes && (
          <div className={`doc-notes-banner banner-${document.verificationStatus?.toLowerCase().replace(/\s+/g, '-')}`}>
            <strong>Audit Note:</strong> {document.verificationNotes}
          </div>
        )}

        {/* Preview Viewer Body */}
        <div className="doc-preview-body">
          {!isPdf && (
            <div className="doc-image-toolbar">
              <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} title="Zoom Out">
                <ZoomOut size={16} />
              </button>
              <span>{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(z => Math.min(3, z + 0.25))} title="Zoom In">
                <ZoomIn size={16} />
              </button>
              <button onClick={() => setRotation(r => (r + 90) % 360)} title="Rotate">
                <RotateCw size={16} />
              </button>
              <button onClick={() => { setZoom(1); setRotation(0) }} title="Reset">
                Reset
              </button>
            </div>
          )}

          <div className="doc-viewer-container">
            {isPdf ? (
              <div className="pdf-viewer-wrapper">
                <iframe
                  src={`${document.fileUrl}#toolbar=1&navpanes=0`}
                  title={document.name}
                  className="pdf-iframe"
                />
              </div>
            ) : (
              <div className="image-viewer-wrapper">
                <img
                  src={document.fileUrl}
                  alt={document.name}
                  className="image-preview-img"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    transition: 'transform 0.2s ease',
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="doc-preview-footer">
          <div className="doc-security-notice">
            <ShieldCheck size={14} color="#10B981" />
            <span>Encrypted NestHaven Document Vault — Access logged for <strong>{currentUser?.name || currentUser?.email || 'Authenticated User'}</strong>.</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close Preview
          </button>
        </div>
      </motion.div>
    </div>
  )
}
