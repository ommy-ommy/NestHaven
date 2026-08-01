import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, UploadCloud, FileText, CheckCircle2, ShieldAlert } from 'lucide-react'
import { useDocuments, DOCUMENT_CATEGORIES } from '../../context/DocumentContext'
import './SellerDocumentUploadModal.css'

export default function SellerDocumentUploadModal({ isOpen, onClose, propertyId, propertyTitle, currentUser }) {
  const { uploadDocument } = useDocuments()

  const [category, setCategory] = useState(DOCUMENT_CATEGORIES[0])
  const [docName, setDocName] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [filePreview, setFilePreview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState(false)

  if (!isOpen) return null

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setSelectedFile(file)
    if (!docName) {
      setDocName(file.name)
    }

    // Create object URL for preview
    const objectUrl = URL.createObjectURL(file)
    setFilePreview(objectUrl)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedFile && !filePreview) return

    setIsSubmitting(true)

    // Calculate approximate size string
    const sizeInMb = selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(1) : '1.5'
    const fileSizeStr = `${sizeInMb} MB`
    const isPdf = selectedFile ? selectedFile.type.includes('pdf') || selectedFile.name.endsWith('.pdf') : true

    // Sample fallback URLs if local blob URL
    const demoPdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    const demoImgUrl = 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1000&q=80'

    const docPayload = {
      propertyId: propertyId || 'p1',
      propertyTitle: propertyTitle || 'Property Listing',
      name: docName || selectedFile?.name || `${category}.pdf`,
      category: category,
      type: isPdf ? 'pdf' : 'image',
      fileUrl: filePreview || (isPdf ? demoPdfUrl : demoImgUrl),
      fileSize: fileSizeStr,
      uploadedBy: currentUser?.name || 'Seller Agent',
      uploadedByEmail: currentUser?.email || 'seller@nesthaven.com',
      uploadedRole: currentUser?.role || 'seller',
      uploadDate: new Date().toISOString().split('T')[0],
    }

    uploadDocument(docPayload)

    setIsSubmitting(false)
    setSuccessMsg(true)

    setTimeout(() => {
      setSuccessMsg(false)
      setSelectedFile(null)
      setDocName('')
      setFilePreview('')
      onClose()
    }, 1500)
  }

  return (
    <div className="seller-upload-overlay" onClick={onClose}>
      <motion.div
        className="seller-upload-card"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="seller-upload-header">
          <div>
            <h3>Upload Verification Document</h3>
            <p className="upload-subtitle">For property: <strong>{propertyTitle || 'Listing'}</strong></p>
          </div>
          <button className="doc-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {successMsg ? (
          <div className="upload-success-box">
            <CheckCircle2 size={48} color="#10B981" />
            <h4>Document Uploaded Successfully!</h4>
            <p>Your document has been securely submitted for admin verification.</p>
          </div>
        ) : (
          <form className="seller-upload-form" onSubmit={handleSubmit}>
            {/* Category selection */}
            <div className="form-group">
              <label className="form-label">Document Category (Required)</label>
              <select
                className="form-input"
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
              >
                {DOCUMENT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Document display title */}
            <div className="form-group">
              <label className="form-label">Document Title / Label</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Registered Sale Deed 2025.pdf"
                value={docName}
                onChange={e => setDocName(e.target.value)}
                required
              />
            </div>

            {/* Dropzone File Input */}
            <div className="form-group">
              <label className="form-label">Select File (PDF or Image)</label>
              <div className="upload-dropzone" onClick={() => window.document.getElementById('file-upload-input').click()}>
                <input
                  id="file-upload-input"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <UploadCloud size={36} color="var(--color-primary, #8ab641)" />
                {selectedFile ? (
                  <div className="dropzone-file-selected">
                    <FileText size={20} />
                    <span>{selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                  </div>
                ) : (
                  <div className="dropzone-prompt">
                    <strong>Click or drag file to upload</strong>
                    <span>Supports PDF, PNG, JPG files up to 10MB</span>
                  </div>
                )}
              </div>
            </div>

            <div className="upload-security-info">
              <ShieldAlert size={14} color="#64748b" />
              <span>Documents are encrypted and audited before being published to interested buyers.</span>
            </div>

            <div className="upload-form-actions">
              <button type="button" className="btn btn-ghost btn-md" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-md" disabled={isSubmitting || (!selectedFile && !docName)}>
                {isSubmitting ? 'Uploading...' : 'Upload & Submit for Audit'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  )
}
