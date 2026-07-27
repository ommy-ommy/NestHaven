import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Home, Key, FileText, Shield } from 'lucide-react'
import { useProperties } from '../context/PropertyContext'
import PropertyCard from '../components/property/PropertyCard'
import './Properties.css'

export default function RentPage() {
  const { properties, updateFilter, getFilteredProperties } = useProperties()

  useEffect(() => {
    updateFilter('listingType', 'rent')
  }, [])

  const rentalProperties = properties.filter(p => p.listingType === 'rent')

  const rentBenefits = [
    { icon: <Key size={24} />, title: 'Verified Listings', desc: 'Every rental property is verified by our team for authenticity.' },
    { icon: <Shield size={24} />, title: 'Secure Deposits', desc: 'Your security deposits are protected through our escrow system.' },
    { icon: <FileText size={24} />, title: 'Digital Agreements', desc: 'Sign rental agreements digitally — no paperwork hassle.' },
    { icon: <Home size={24} />, title: 'Zero Brokerage', desc: 'Connect directly with owners. No middlemen, no extra fees.' },
  ]

  return (
    <motion.div className="properties-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero */}
      <div className="properties-header" style={{ padding: 'var(--space-3xl) 0', background: 'linear-gradient(135deg, var(--color-bg-warm), var(--color-primary-lighter))' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
            <span className="section-label"><Key size={14} /> Rentals</span>
            <h1 style={{ fontSize: 'var(--fs-3xl)', marginBottom: 'var(--space-md)' }}>Find Your Perfect Rental</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--fs-md)' }}>
              Discover verified rental properties across India. Zero brokerage, direct owner contact.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Benefits */}
      <div className="container" style={{ padding: 'var(--space-2xl) 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-lg)' }}>
          {rentBenefits.map((b, i) => (
            <motion.div
              key={i}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)', padding: 'var(--space-lg)', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'var(--color-primary-lighter)', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {b.icon}
              </div>
              <div>
                <h4 style={{ fontSize: 'var(--fs-base)', marginBottom: 4 }}>{b.title}</h4>
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Rental Listings */}
      <div className="container" style={{ paddingBottom: 'var(--space-4xl)' }}>
        <h2 style={{ marginBottom: 'var(--space-xl)' }}>Available Rentals</h2>
        <div className="properties-grid">
          {rentalProperties.map((property, i) => (
            <motion.div key={property.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
