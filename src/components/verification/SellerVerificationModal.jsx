import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, ShieldCheck, UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react'
import { useVerification } from '../../context/VerificationContext'
import './SellerVerificationModal.css'

export default function SellerVerificationModal({ isOpen, onClose, property, currentUser }) {
  const { submitVerification } = useVerification()

  const [files, setFiles] = useState({
    identityProof: null,
    ownershipDocument: null,
    propertyTaxReceipt: null,
    businessLicense: null,
    gstCertificate: null,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState(false)

  if (!isOpen || !property) return null

  const handleFileSelect = (field, file) => {
    if (!file) return
    setFiles(prev => ({
      ...prev,
      [field]: {
        name: file.name,
        type: field === 'identityProof' ? 'Identity Proof' : field === 'ownershipDocument' ? 'Ownership Document' : field === 'propertyTaxReceipt' ? 'Property Tax Receipt' : field === 'businessLicense' ? 'Business License' : 'GST Certificate',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload = {
      propertyId: property.id,
      propertyTitle: property.title,
      sellerId: currentUser?.id || property.sellerId || 's1',
      sellerName: currentUser?.name || property.sellerName || 'Seller Agent',
      sellerEmail: currentUser?.email || 'seller@nesthaven.com',
      sellerRole: currentUser?.role || 'seller',
      documents: files,
    }

    submitVerification(payload)

    setIsSubmitting(false)
    setSuccessMsg(true)

    setTimeout(() => {
      setSuccessMsg(false)
      onClose()
    }, 1800)
  }

  return (
    <div className="ver-upload-overlay" onClick={onClose}>
      <motion.div
        className="ver-upload-card"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="ver-upload-header">
          <div className="ver-header-title-group">
            <div className="ver-icon-badge">
              <ShieldCheck size={20} color="#2563EB" />
            </div>
            <div>
              <h3>Apply for Official Property Verification</h3>
              <p className="ver-subtitle">For: <strong>{property.title}</strong></p>
            </div>
          </div>
          <button className="doc-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {successMsg ? (
          <div className="ver-success-box">
            <CheckCircle2 size={52} color="#10B981" />
            <h4>Verification Documents Submitted!</h4>
            <p>Your property verification application has been sent to the NestHaven Admin Compliance team. After approval, official verification badges will be displayed on your listing.</p>
          </div>
        ) : (
          <form className="ver-upload-form" onSubmit={handleSubmit}>
            <p className="ver-form-intro">
              Upload your verification documents below to earn official badges (<strong>Verified Owner</strong>, <strong>Government Verified</strong>, <strong>Verified Document</strong>) and boost your listing rank in search.
            </p>

            {/* Document Upload Fields */}
            <div className="ver-inputs-grid">
              {/* 1. Identity Proof */}
              <div className="ver-doc-field">
                <label className="ver-field-label">
                  1. Identity Proof (Required) <span className="req-star">*</span>
                </label>
                <div className="ver-file-row">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    id="ver-id-proof"
                    style={{ display: 'none' }}
                    onChange={e => handleFileSelect('identityProof', e.target.files[0])}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm ver-choose-btn"
                    onClick={() => window.document.getElementById('ver-id-proof').click()}
                  >
                    <UploadCloud size={14} /> Choose File
                  </button>
                  <span className="ver-file-status">
                    {files.identityProof ? files.identityProof.name : 'Aadhaar, Passport, or Voter ID'}
                  </span>
                </div>
              </div>

              {/* 2. Ownership Document */}
              <div className="ver-doc-field">
                <label className="ver-field-label">
                  2. Ownership Document (Required) <span className="req-star">*</span>
                </label>
                <div className="ver-file-row">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    id="ver-ownership-doc"
                    style={{ display: 'none' }}
                    onChange={e => handleFileSelect('ownershipDocument', e.target.files[0])}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm ver-choose-btn"
                    onClick={() => window.document.getElementById('ver-ownership-doc').click()}
                  >
                    <UploadCloud size={14} /> Choose File
                  </button>
                  <span className="ver-file-status">
                    {files.ownershipDocument ? files.ownershipDocument.name : 'Registered Sale Deed / Title Registry'}
                  </span>
                </div>
              </div>

              {/* 3. Property Tax Receipt */}
              <div className="ver-doc-field">
                <label className="ver-field-label">
                  3. Property Tax Receipt (Required) <span className="req-star">*</span>
                </label>
                <div className="ver-file-row">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    id="ver-tax-doc"
                    style={{ display: 'none' }}
                    onChange={e => handleFileSelect('propertyTaxReceipt', e.target.files[0])}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm ver-choose-btn"
                    onClick={() => window.document.getElementById('ver-tax-doc').click()}
                  >
                    <UploadCloud size={14} /> Choose File
                  </button>
                  <span className="ver-file-status">
                    {files.propertyTaxReceipt ? files.propertyTaxReceipt.name : 'Latest Municipal Tax Receipt'}
                  </span>
                </div>
              </div>

              {/* 4. Business License (Optional) */}
              <div className="ver-doc-field">
                <label className="ver-field-label">
                  4. Business / RERA License (For Agencies)
                </label>
                <div className="ver-file-row">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    id="ver-license-doc"
                    style={{ display: 'none' }}
                    onChange={e => handleFileSelect('businessLicense', e.target.files[0])}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm ver-choose-btn"
                    onClick={() => window.document.getElementById('ver-license-doc').click()}
                  >
                    <UploadCloud size={14} /> Choose File
                  </button>
                  <span className="ver-file-status">
                    {files.businessLicense ? files.businessLicense.name : 'Optional RERA / Trade License'}
                  </span>
                </div>
              </div>

              {/* 5. GST Certificate (Optional) */}
              <div className="ver-doc-field">
                <label className="ver-field-label">
                  5. GST Certificate (For Commercial Entities)
                </label>
                <div className="ver-file-row">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    id="ver-gst-doc"
                    style={{ display: 'none' }}
                    onChange={e => handleFileSelect('gstCertificate', e.target.files[0])}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm ver-choose-btn"
                    onClick={() => window.document.getElementById('ver-gst-doc').click()}
                  >
                    <UploadCloud size={14} /> Choose File
                  </button>
                  <span className="ver-file-status">
                    {files.gstCertificate ? files.gstCertificate.name : 'Optional GST Registration'}
                  </span>
                </div>
              </div>
            </div>

            <div className="ver-form-footer">
              <button type="button" className="btn btn-ghost btn-md" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-md" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting Application...' : 'Submit Verification Credentials'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  )
}
