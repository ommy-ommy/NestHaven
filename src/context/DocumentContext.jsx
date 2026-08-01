import { createContext, useContext, useState, useEffect } from 'react'

const DocumentContext = createContext(null)

export const DOCUMENT_CATEGORIES = [
  'Sale Deed',
  'Ownership Certificate',
  'Property Tax Receipt',
  'Encumbrance Certificate',
  'Building Approval',
  'Floor Plan PDF',
  'RERA Certificate',
  'Business License',
  'GST Certificate',
  'Electricity Bill',
  'Water Bill',
  'Lease Agreement',
]

// High quality sample demo documents for properties
const initialDocuments = [
  {
    id: 'doc_101',
    propertyId: 'p1',
    propertyTitle: 'Luxury Penthouse with Panoramic City Views',
    name: 'Registered Sale Deed 2024.pdf',
    category: 'Sale Deed',
    type: 'pdf',
    fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
    fileSize: '2.4 MB',
    uploadedBy: 'Arjun Mehta',
    uploadedByEmail: 'arjun@nesthaven.com',
    uploadedRole: 'seller',
    uploadDate: '2026-07-15',
    verificationStatus: 'Verified',
    verificationNotes: 'Verified against Maharashtra Land Revenue Registrar Portal on 2026-07-16.',
    downloadCount: 18,
    views: [
      { user: 'Priya Sharma', email: 'priya@gmail.com', role: 'buyer', timestamp: '2026-07-28 14:32' },
      { user: 'Rohan Verma', email: 'rohan@gmail.com', role: 'buyer', timestamp: '2026-07-30 09:15' },
    ],
  },
  {
    id: 'doc_102',
    propertyId: 'p1',
    propertyTitle: 'Luxury Penthouse with Panoramic City Views',
    name: 'BMC Building Approval & Blueprint.pdf',
    category: 'Building Approval',
    type: 'pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '4.1 MB',
    uploadedBy: 'Arjun Mehta',
    uploadedByEmail: 'arjun@nesthaven.com',
    uploadedRole: 'seller',
    uploadDate: '2026-07-16',
    verificationStatus: 'Verified',
    verificationNotes: 'Approved by Municipal Corporation of Greater Mumbai (BMC).',
    downloadCount: 12,
    views: [
      { user: 'Priya Sharma', email: 'priya@gmail.com', role: 'buyer', timestamp: '2026-07-29 11:05' },
    ],
  },
  {
    id: 'doc_103',
    propertyId: 'p1',
    propertyTitle: 'Luxury Penthouse with Panoramic City Views',
    name: 'MahaRERA Registration Certificate.png',
    category: 'RERA Certificate',
    type: 'image',
    fileUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1000&q=80',
    fileSize: '1.2 MB',
    uploadedBy: 'Arjun Mehta',
    uploadedByEmail: 'arjun@nesthaven.com',
    uploadedRole: 'seller',
    uploadDate: '2026-07-18',
    verificationStatus: 'Verified',
    verificationNotes: 'MahaRERA Reg No: P51900001234 active & confirmed.',
    downloadCount: 24,
    views: [
      { user: 'Vikram Das', email: 'vikram@gmail.com', role: 'buyer', timestamp: '2026-07-31 16:45' },
    ],
  },
  {
    id: 'doc_104',
    propertyId: 'p1',
    propertyTitle: 'Luxury Penthouse with Panoramic City Views',
    name: 'Penthouse Architectural Floor Plan.pdf',
    category: 'Floor Plan PDF',
    type: 'pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '3.8 MB',
    uploadedBy: 'Arjun Mehta',
    uploadedByEmail: 'arjun@nesthaven.com',
    uploadedRole: 'seller',
    uploadDate: '2026-07-20',
    verificationStatus: 'Verified',
    verificationNotes: 'Architect stamp & dimensions verified.',
    downloadCount: 15,
    views: [],
  },
  {
    id: 'doc_105',
    propertyId: 'p1',
    propertyTitle: 'Luxury Penthouse with Panoramic City Views',
    name: 'Property Tax Payment Receipt 2025-26.pdf',
    category: 'Property Tax Receipt',
    type: 'pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '950 KB',
    uploadedBy: 'Arjun Mehta',
    uploadedByEmail: 'arjun@nesthaven.com',
    uploadedRole: 'seller',
    uploadDate: '2026-07-22',
    verificationStatus: 'Pending Review',
    verificationNotes: 'Awaiting updated tax clearance verification for FY26.',
    downloadCount: 5,
    views: [],
  },
  {
    id: 'doc_106',
    propertyId: 'p2',
    propertyTitle: 'Modern 3BHK Apartment in Koramangala',
    name: 'BBMP Khata Ownership Certificate.pdf',
    category: 'Ownership Certificate',
    type: 'pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '1.8 MB',
    uploadedBy: 'Prestige Group Agent',
    uploadedByEmail: 'agent@prestige.com',
    uploadedRole: 'seller',
    uploadDate: '2026-07-25',
    verificationStatus: 'Verified',
    verificationNotes: 'A-Khata certificate validated with BBMP portal.',
    downloadCount: 9,
    views: [
      { user: 'Priya Sharma', email: 'priya@gmail.com', role: 'buyer', timestamp: '2026-08-01 10:20' },
    ],
  },
  {
    id: 'doc_107',
    propertyId: 'p2',
    propertyTitle: 'Modern 3BHK Apartment in Koramangala',
    name: 'Encumbrance Certificate (15 Years).pdf',
    category: 'Encumbrance Certificate',
    type: 'pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '2.1 MB',
    uploadedBy: 'Prestige Group Agent',
    uploadedByEmail: 'agent@prestige.com',
    uploadedRole: 'seller',
    uploadDate: '2026-07-26',
    verificationStatus: 'Verified',
    verificationNotes: 'NIL Encumbrance clear title confirmed.',
    downloadCount: 11,
    views: [],
  },
  {
    id: 'doc_108',
    propertyId: 'p2',
    propertyTitle: 'Modern 3BHK Apartment in Koramangala',
    name: 'BESCOM Electricity Bill June 2026.pdf',
    category: 'Electricity Bill',
    type: 'pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '620 KB',
    uploadedBy: 'Prestige Group Agent',
    uploadedByEmail: 'agent@prestige.com',
    uploadedRole: 'seller',
    uploadDate: '2026-07-27',
    verificationStatus: 'Verified',
    verificationNotes: 'No pending utility dues.',
    downloadCount: 4,
    views: [],
  },
]

export function DocumentProvider({ children }) {
  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('nesthaven_documents')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved nesthaven_documents:', e)
      }
    }
    return initialDocuments
  })

  useEffect(() => {
    localStorage.setItem('nesthaven_documents', JSON.stringify(documents))
  }, [documents])

  const getDocumentsForProperty = (propertyId) => {
    return documents.filter(doc => String(doc.propertyId) === String(propertyId))
  }

  const uploadDocument = (newDoc) => {
    const docObj = {
      id: `doc_${Date.now()}`,
      propertyId: newDoc.propertyId,
      propertyTitle: newDoc.propertyTitle || 'Property Listing',
      name: newDoc.name,
      category: newDoc.category,
      type: newDoc.type || (newDoc.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image'),
      fileUrl: newDoc.fileUrl,
      fileSize: newDoc.fileSize || '1.5 MB',
      uploadedBy: newDoc.uploadedBy || 'Property Owner',
      uploadedByEmail: newDoc.uploadedByEmail || 'seller@nesthaven.com',
      uploadedRole: newDoc.uploadedRole || 'seller',
      uploadDate: newDoc.uploadDate || new Date().toISOString().split('T')[0],
      verificationStatus: 'Pending Review',
      verificationNotes: 'Submitted for verification. NestHaven team will audit within 24 hours.',
      downloadCount: 0,
      views: [],
    }
    setDocuments(prev => [docObj, ...prev])
    return docObj
  }

  const deleteDocument = (docId) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId))
  }

  const updateVerificationStatus = (docId, status, notes = '') => {
    setDocuments(prev =>
      prev.map(doc => {
        if (doc.id === docId) {
          return {
            ...doc,
            verificationStatus: status,
            verificationNotes: notes || (status === 'Verified' ? 'Verified by NestHaven Legal Team.' : 'Document rejected. Please upload valid copy.'),
          }
        }
        return doc
      })
    )
  }

  const recordView = (docId, currentUser) => {
    if (!currentUser) return
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16)
    setDocuments(prev =>
      prev.map(doc => {
        if (doc.id === docId) {
          // Avoid duplicate view logs for exact same minute
          const exists = doc.views.some(v => v.email === currentUser.email && v.timestamp === nowStr)
          if (!exists) {
            const newView = {
              user: currentUser.name || currentUser.email?.split('@')[0] || 'Interested Buyer',
              email: currentUser.email || 'buyer@example.com',
              role: currentUser.role || 'buyer',
              timestamp: nowStr,
            }
            return { ...doc, views: [newView, ...doc.views] }
          }
        }
        return doc
      })
    )
  }

  const incrementDownload = (docId, currentUser) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16)
    setDocuments(prev =>
      prev.map(doc => {
        if (doc.id === docId) {
          let updatedViews = doc.views
          if (currentUser) {
            const downloadLog = {
              user: `${currentUser.name || currentUser.email?.split('@')[0]} (Downloaded)`,
              email: currentUser.email || 'buyer@example.com',
              role: currentUser.role || 'buyer',
              timestamp: nowStr,
            }
            updatedViews = [downloadLog, ...doc.views]
          }
          return {
            ...doc,
            downloadCount: (doc.downloadCount || 0) + 1,
            views: updatedViews,
          }
        }
        return doc
      })
    )
  }

  return (
    <DocumentContext.Provider
      value={{
        documents,
        getDocumentsForProperty,
        uploadDocument,
        deleteDocument,
        updateVerificationStatus,
        recordView,
        incrementDownload,
      }}
    >
      {children}
    </DocumentContext.Provider>
  )
}

export function useDocuments() {
  const context = useContext(DocumentContext)
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider')
  }
  return context
}
