import { createContext, useContext, useState, useEffect } from 'react'

const VerificationContext = createContext(null)

export const VERIFICATION_BADGES = [
  { id: 'verified_owner', label: 'Verified Owner', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', icon: 'ShieldCheck' },
  { id: 'verified_agent', label: 'Verified Agent', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', icon: 'UserCheck' },
  { id: 'government_verified', label: 'Government Verified', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', icon: 'Landmark' },
  { id: 'business_verified', label: 'Business Verified', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', icon: 'Building2' },
  { id: 'premium_listing', label: 'Premium Listing', color: '#EAB308', bg: '#FEFCE8', border: '#FEF08A', icon: 'Crown' },
  { id: 'verified_document', label: 'Verified Document', color: '#0891B2', bg: '#ECFEFF', border: '#A5F3FC', icon: 'FileCheck' },
]

// Initial sample verification requests and pre-verified properties
const initialVerificationRequests = [
  {
    id: 'ver_101',
    propertyId: 'p1',
    propertyTitle: 'Luxury Penthouse with Panoramic City Views',
    sellerId: 's1',
    sellerName: 'Arjun Mehta',
    sellerEmail: 'arjun@nesthaven.com',
    sellerRole: 'seller',
    submittedDate: '2026-07-20',
    status: 'Approved',
    assignedBadges: ['verified_owner', 'government_verified', 'premium_listing', 'verified_document'],
    adminNotes: 'Government registration records and BMC clearance validated on 2026-07-21.',
    documents: {
      identityProof: { name: 'Aadhaar_Arjun_Mehta.pdf', type: 'Identity Proof', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      ownershipDocument: { name: 'Property_Sale_Deed_Registry.pdf', type: 'Ownership Document', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      propertyTaxReceipt: { name: 'BMC_Tax_Receipt_2025-26.pdf', type: 'Property Tax Receipt', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    },
  },
  {
    id: 'ver_102',
    propertyId: 'p2',
    propertyTitle: 'Modern 3BHK Apartment in Koramangala',
    sellerId: 's2',
    sellerName: 'Prestige Group Agent',
    sellerEmail: 'agent@prestige.com',
    sellerRole: 'seller',
    submittedDate: '2026-07-24',
    status: 'Approved',
    assignedBadges: ['verified_agent', 'business_verified', 'verified_document'],
    adminNotes: 'Agency RERA & GST registration verified with Karnataka RERA Portal.',
    documents: {
      identityProof: { name: 'Passport_Prestige_Agent.pdf', type: 'Identity Proof', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      ownershipDocument: { name: 'BBMP_Khata_Certificate.pdf', type: 'Ownership Document', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      propertyTaxReceipt: { name: 'BBMP_Tax_Receipt_2025.pdf', type: 'Property Tax Receipt', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      businessLicense: { name: 'Karnataka_RERA_Agency_License.pdf', type: 'Business License', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      gstCertificate: { name: 'Prestige_Realty_GST_Cert.pdf', type: 'GST Certificate', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    },
  },
  {
    id: 'ver_103',
    propertyId: 'p3',
    propertyTitle: 'Spacious Villa with Private Garden',
    sellerId: 's3',
    sellerName: 'Vikram Singh',
    sellerEmail: 'vikram.singh@royalestate.com',
    sellerRole: 'seller',
    submittedDate: '2026-07-28',
    status: 'Approved',
    assignedBadges: ['verified_owner', 'government_verified', 'verified_document'],
    adminNotes: 'DLF Phase 5 Villa Title Deed and MCG tax receipt verified.',
    documents: {
      identityProof: { name: 'Aadhaar_Vikram_Singh.pdf', type: 'Identity Proof', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      ownershipDocument: { name: 'DLF_Phase5_Villa_Registry.pdf', type: 'Ownership Document', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      propertyTaxReceipt: { name: 'Gurgaon_MCG_Tax_Paid.pdf', type: 'Property Tax Receipt', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    },
  },
  {
    id: 'ver_105',
    propertyId: 'p5',
    propertyTitle: 'Waterfront Luxury Duplex in Bandra West',
    sellerId: 's5',
    sellerName: 'Rajesh Sharma',
    sellerEmail: 'rajesh@sharmarealty.com',
    sellerRole: 'seller',
    submittedDate: '2026-07-29',
    status: 'Approved',
    assignedBadges: ['verified_agent', 'premium_listing', 'verified_document'],
    adminNotes: 'RERA Registration & Bandra Title verified.',
    documents: {
      identityProof: { name: 'Pan_Rajesh_Sharma.pdf', type: 'Identity Proof', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      ownershipDocument: { name: 'Bandra_Duplex_Registry.pdf', type: 'Ownership Document', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    },
  },
  {
    id: 'ver_107',
    propertyId: 'p7',
    propertyTitle: 'High-End Smart Residence in Hitech City',
    sellerId: 's7',
    sellerName: 'Aarav Reddy',
    sellerEmail: 'aarav@reddyhousing.com',
    sellerRole: 'seller',
    submittedDate: '2026-07-30',
    status: 'Approved',
    assignedBadges: ['verified_owner', 'business_verified', 'government_verified'],
    adminNotes: 'GHMC approval and Telangana RERA clearance verified.',
    documents: {
      identityProof: { name: 'Aadhaar_Aarav_Reddy.pdf', type: 'Identity Proof', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      ownershipDocument: { name: 'GHMC_Building_Approval.pdf', type: 'Ownership Document', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    },
  },
  {
    id: 'ver_109',
    propertyId: 'p9',
    propertyTitle: 'Modern Sea Facing Flat in ECR Beach Road',
    sellerId: 's9',
    sellerName: 'Karthik Raman',
    sellerEmail: 'karthik@chennaiproperties.com',
    sellerRole: 'seller',
    submittedDate: '2026-07-31',
    status: 'Approved',
    assignedBadges: ['verified_agent', 'premium_listing', 'government_verified', 'verified_document'],
    adminNotes: 'CMDA approval & ECR title deed verified.',
    documents: {
      identityProof: { name: 'Passport_Karthik.pdf', type: 'Identity Proof', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      ownershipDocument: { name: 'CMDA_Sale_Deed.pdf', type: 'Ownership Document', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    },
  },
  {
    id: 'ver_111',
    propertyId: 'p11',
    propertyTitle: 'Elegant 3BHK Apartment in Viman Nagar',
    sellerId: 's11',
    sellerName: 'Amit Joshi',
    sellerEmail: 'amit@punehomes.com',
    sellerRole: 'seller',
    submittedDate: '2026-08-01',
    status: 'Approved',
    assignedBadges: ['verified_owner', 'government_verified', 'verified_document'],
    adminNotes: 'PMC Tax receipt & Viman Nagar registry verified.',
    documents: {
      identityProof: { name: 'Aadhaar_Amit_Joshi.pdf', type: 'Identity Proof', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      ownershipDocument: { name: 'PMC_Khata_Certificate.pdf', type: 'Ownership Document', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    },
  },
]

export function VerificationProvider({ children }) {
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('nesthaven_verification_requests')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.length >= initialVerificationRequests.length) {
          return parsed
        }
      } catch (e) {
        console.error(e)
      }
    }
    localStorage.setItem('nesthaven_verification_requests', JSON.stringify(initialVerificationRequests))
    return initialVerificationRequests
  })

  useEffect(() => {
    localStorage.setItem('nesthaven_verification_requests', JSON.stringify(requests))
  }, [requests])

  // Get verification record for a specific property
  const getVerificationForProperty = (propertyId) => {
    return requests.find(r => String(r.propertyId) === String(propertyId))
  }

  // Get active badges for a specific property
  const getBadgesForProperty = (propertyId) => {
    const record = getVerificationForProperty(propertyId)
    if (!record || record.status !== 'Approved') return []
    return (record.assignedBadges || []).map(bId => VERIFICATION_BADGES.find(b => b.id === bId)).filter(Boolean)
  }

  // Submit new verification request (for sellers)
  const submitVerification = (newRequest) => {
    const reqObj = {
      id: `ver_${Date.now()}`,
      propertyId: newRequest.propertyId,
      propertyTitle: newRequest.propertyTitle || 'Property Listing',
      sellerId: newRequest.sellerId || 's1',
      sellerName: newRequest.sellerName || 'Seller',
      sellerEmail: newRequest.sellerEmail || 'seller@nesthaven.com',
      sellerRole: newRequest.sellerRole || 'seller',
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'Pending Approval',
      assignedBadges: [],
      adminNotes: 'Submitted for verification review.',
      documents: newRequest.documents || {},
    }

    setRequests(prev => [reqObj, ...prev.filter(r => String(r.propertyId) !== String(newRequest.propertyId))])
    return reqObj
  }

  // Approve verification and assign selected badges
  const approveVerification = (requestId, badges = ['verified_owner', 'verified_document'], notes = '') => {
    setRequests(prev =>
      prev.map(r => {
        if (r.id === requestId) {
          return {
            ...r,
            status: 'Approved',
            assignedBadges: badges,
            adminNotes: notes || 'Documents verified and approved by NestHaven Legal Team.',
          }
        }
        return r
      })
    )
  }

  // Reject verification request
  const rejectVerification = (requestId, notes = '') => {
    setRequests(prev =>
      prev.map(r => {
        if (r.id === requestId) {
          return {
            ...r,
            status: 'Rejected',
            assignedBadges: [],
            adminNotes: notes || 'Verification rejected due to incomplete or unclear documents.',
          }
        }
        return r
      })
    )
  }

  return (
    <VerificationContext.Provider
      value={{
        requests,
        getVerificationForProperty,
        getBadgesForProperty,
        submitVerification,
        approveVerification,
        rejectVerification,
      }}
    >
      {children}
    </VerificationContext.Provider>
  )
}

export function useVerification() {
  const context = useContext(VerificationContext)
  if (!context) {
    throw new Error('useVerification must be used within a VerificationProvider')
  }
  return context
}
