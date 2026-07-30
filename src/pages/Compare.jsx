import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GitCompare,
  X,
  Plus,
  Check,
  Building2,
  MapPin,
  Tag,
  Star,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { useCompare } from '../context/CompareContext'
import { useProperties } from '../context/PropertyContext'
import { formatPrice } from '../data/properties'
import { amenityLabels } from '../data/cities'
import { getNearbyPlaces } from '../utils/nearbyPlaces'
import './Compare.css'

export default function Compare() {
  const {
    comparedProperties,
    comparedCount,
    removeFromCompare,
    addToCompare,
    clearCompare,
  } = useCompare()
  const { properties } = useProperties()

  const [highlightDiff, setHighlightDiff] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  // Calculate cheapest property ID among selected
  const cheapestPropertyId = (() => {
    if (!comparedProperties.length) return null
    return comparedProperties.reduce((min, p) => (p.price < min.price ? p : min), comparedProperties[0])?.id
  })()

  // Helper to check if a attribute value differs across properties
  const isDifferent = (getValueFn) => {
    if (comparedProperties.length < 2) return false
    const firstVal = String(getValueFn(comparedProperties[0]) ?? '')
    return comparedProperties.some(p => String(getValueFn(p) ?? '') !== firstVal)
  }

  // Available properties to add (excluding already compared ones)
  const availableToAdd = properties.filter(
    p => !comparedProperties.some(cp => String(cp.id) === String(p.id))
  )

  // List of all possible amenities for side-by-side comparison
  const allAmenityKeys = [
    'swimming-pool',
    'gym',
    'parking',
    'security',
    'power-backup',
    'lift',
    'club-house',
    'garden',
    'playground',
    'tennis-court',
  ]

  if (comparedCount === 0) {
    return (
      <motion.div className="compare-page container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="compare-empty-card">
          <div className="empty-icon">
            <GitCompare size={48} color="var(--color-primary)" />
          </div>
          <h2>No Properties Selected for Comparison</h2>
          <p>Select up to 4 properties from our listings to compare specs, prices, amenities, and nearby locations side-by-side.</p>
          <Link to="/properties" className="btn btn-primary btn-lg" style={{ marginTop: '1.5rem' }}>
            Browse Properties
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div className="compare-page container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Top Header */}
      <div className="compare-header">
        <div>
          <div className="compare-badge">
            <GitCompare size={16} />
            <span>Side-by-Side Matrix</span>
          </div>
          <h1>Property Comparison ({comparedCount} of 4)</h1>
          <p>Analyze specifications, pricing, amenities, and ratings to make an informed decision.</p>
        </div>

        <div className="compare-header-actions">
          {/* Highlight Differences Toggle Switch */}
          <label className={`toggle-switch-card ${highlightDiff ? 'active' : ''}`}>
            <input
              type="checkbox"
              checked={highlightDiff}
              onChange={e => setHighlightDiff(e.target.checked)}
            />
            <Sparkles size={16} color={highlightDiff ? 'var(--color-primary-dark)' : 'currentColor'} />
            <span>Highlight Differences</span>
          </label>

          {comparedCount < 4 && (
            <button className="btn btn-secondary" onClick={() => setShowAddModal(true)}>
              <Plus size={16} />
              Add Property ({4 - comparedCount} left)
            </button>
          )}

          <button className="btn btn-ghost" onClick={clearCompare} title="Clear all comparison selections">
            <Trash2 size={16} />
            Clear All
          </button>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="compare-matrix-wrapper">
        <table className="compare-table">
          <thead>
            {/* Header Row: Images & Title */}
            <tr>
              <th className="sticky-col feature-label-col">Property Overview</th>
              {comparedProperties.map(p => {
                const isCheapest = String(p.id) === String(cheapestPropertyId)
                return (
                  <th key={p.id} className={`property-col ${isCheapest ? 'best-value-col' : ''}`}>
                    <div className="compare-card-head">
                      <button
                        className="remove-property-btn"
                        onClick={() => removeFromCompare(p.id)}
                        title="Remove from comparison"
                      >
                        <X size={16} />
                      </button>

                      <div className="compare-img-wrap">
                        <img src={p.image || p.images?.[0]} alt={p.title} />
                        {isCheapest && (
                          <div className="best-value-badge">
                            💰 Best Price
                          </div>
                        )}
                        <span className="badge badge-dark listing-badge">
                          {p.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                        </span>
                      </div>

                      <h3 className="compare-prop-title">{p.title}</h3>
                      <p className="compare-prop-price">{formatPrice(p.price, p.listingType)}</p>

                      <Link to={`/property/${p.id}`} className="btn btn-primary btn-sm view-detail-btn">
                        View Details
                      </Link>
                    </div>
                  </th>
                )
              })}

              {/* Add Property Column if < 4 */}
              {comparedCount < 4 && (
                <th className="property-col add-col">
                  <div className="add-property-slot" onClick={() => setShowAddModal(true)}>
                    <div className="add-icon-circle">
                      <Plus size={24} />
                    </div>
                    <span>Add Property to Compare</span>
                    <small>Select from remaining listings</small>
                  </div>
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {/* Section: Basic Details */}
            <tr className="section-header-tr">
              <td colSpan={comparedCount + (comparedCount < 4 ? 2 : 1)}>📍 Location & Basics</td>
            </tr>

            <tr className={highlightDiff && isDifferent(p => p.city) ? 'row-diff' : ''}>
              <td className="sticky-col feature-label">Location / City</td>
              {comparedProperties.map(p => (
                <td key={p.id}>{p.address || `${p.locality}, ${p.city}`}</td>
              ))}
              {comparedCount < 4 && <td />}
            </tr>

            <tr className={highlightDiff && isDifferent(p => p.type) ? 'row-diff' : ''}>
              <td className="sticky-col feature-label">Property Type</td>
              {comparedProperties.map(p => (
                <td key={p.id} className="cap-text">{p.type}</td>
              ))}
              {comparedCount < 4 && <td />}
            </tr>

            {/* Section: Price & Valuation */}
            <tr className="section-header-tr">
              <td colSpan={comparedCount + (comparedCount < 4 ? 2 : 1)}>🏷️ Pricing & Valuation</td>
            </tr>

            <tr className={highlightDiff && isDifferent(p => p.price) ? 'row-diff' : ''}>
              <td className="sticky-col feature-label">Total Price</td>
              {comparedProperties.map(p => {
                const isCheapest = String(p.id) === String(cheapestPropertyId)
                return (
                  <td key={p.id}>
                    <strong className={isCheapest ? 'green-price' : ''}>
                      {formatPrice(p.price, p.listingType)}
                    </strong>
                    {isCheapest && <span className="cheapest-tag"> (Lowest Price)</span>}
                  </td>
                )
              })}
              {comparedCount < 4 && <td />}
            </tr>

            <tr className={highlightDiff && isDifferent(p => p.pricePerSqft) ? 'row-diff' : ''}>
              <td className="sticky-col feature-label">Price per Sq.ft</td>
              {comparedProperties.map(p => (
                <td key={p.id}>
                  {p.pricePerSqft > 0 ? `₹${p.pricePerSqft.toLocaleString('en-IN')}` : 'N/A'}
                </td>
              ))}
              {comparedCount < 4 && <td />}
            </tr>

            <tr className={highlightDiff && isDifferent(p => p.listingType) ? 'row-diff' : ''}>
              <td className="sticky-col feature-label">Listing Category</td>
              {comparedProperties.map(p => (
                <td key={p.id} className="cap-text">For {p.listingType}</td>
              ))}
              {comparedCount < 4 && <td />}
            </tr>

            {/* Section: Key Specifications */}
            <tr className="section-header-tr">
              <td colSpan={comparedCount + (comparedCount < 4 ? 2 : 1)}>📐 Key Specifications</td>
            </tr>

            <tr className={highlightDiff && isDifferent(p => p.area) ? 'row-diff' : ''}>
              <td className="sticky-col feature-label">Super Area</td>
              {comparedProperties.map(p => (
                <td key={p.id}>{p.area ? `${p.area.toLocaleString()} sqft` : `${p.sqft || 1000} sqft`}</td>
              ))}
              {comparedCount < 4 && <td />}
            </tr>

            <tr className={highlightDiff && isDifferent(p => p.bhk) ? 'row-diff' : ''}>
              <td className="sticky-col feature-label">Bedrooms (BHK)</td>
              {comparedProperties.map(p => (
                <td key={p.id}>{p.bhk ? `${p.bhk} BHK` : 'N/A'}</td>
              ))}
              {comparedCount < 4 && <td />}
            </tr>

            <tr className={highlightDiff && isDifferent(p => p.bathrooms || p.baths) ? 'row-diff' : ''}>
              <td className="sticky-col feature-label">Bathrooms</td>
              {comparedProperties.map(p => (
                <td key={p.id}>{p.bathrooms || p.baths || 2} Bathrooms</td>
              ))}
              {comparedCount < 4 && <td />}
            </tr>

            <tr className={highlightDiff && isDifferent(p => p.floor) ? 'row-diff' : ''}>
              <td className="sticky-col feature-label">Floor Position</td>
              {comparedProperties.map(p => (
                <td key={p.id}>{p.floor ? `Floor ${p.floor} of ${p.totalFloors || 20}` : 'Ground Floor / House'}</td>
              ))}
              {comparedCount < 4 && <td />}
            </tr>

            <tr className={highlightDiff && isDifferent(p => p.facing) ? 'row-diff' : ''}>
              <td className="sticky-col feature-label">Facing Direction</td>
              {comparedProperties.map(p => (
                <td key={p.id}>{p.facing || 'East'}</td>
              ))}
              {comparedCount < 4 && <td />}
            </tr>

            <tr className={highlightDiff && isDifferent(p => p.furnished) ? 'row-diff' : ''}>
              <td className="sticky-col feature-label">Furnished Status</td>
              {comparedProperties.map(p => (
                <td key={p.id} className="cap-text">{p.furnished || 'Semi-Furnished'}</td>
              ))}
              {comparedCount < 4 && <td />}
            </tr>

            {/* Section: Amenities Side-by-Side */}
            <tr className="section-header-tr">
              <td colSpan={comparedCount + (comparedCount < 4 ? 2 : 1)}>✨ Amenities Comparison</td>
            </tr>

            {allAmenityKeys.map(amenityKey => {
              const labelInfo = amenityLabels[amenityKey] || { label: amenityKey }
              const diff = isDifferent(p => (p.amenities || []).includes(amenityKey))

              return (
                <tr key={amenityKey} className={highlightDiff && diff ? 'row-diff' : ''}>
                  <td className="sticky-col feature-label">{labelInfo.label}</td>
                  {comparedProperties.map(p => {
                    const hasAmenity = (p.amenities || []).includes(amenityKey)
                    return (
                      <td key={p.id}>
                        {hasAmenity ? (
                          <span className="check-yes"><Check size={16} /> Yes</span>
                        ) : (
                          <span className="check-no"><X size={14} /> No</span>
                        )}
                      </td>
                    )
                  })}
                  {comparedCount < 4 && <td />}
                </tr>
              )
            })}

            {/* Section: Nearby Amenities Count */}
            <tr className="section-header-tr">
              <td colSpan={comparedCount + (comparedCount < 4 ? 2 : 1)}>🏙️ Nearby Facilities & Transit</td>
            </tr>

            <tr className={highlightDiff ? 'row-diff' : ''}>
              <td className="sticky-col feature-label">Nearby Transit & Services</td>
              {comparedProperties.map(p => {
                const nearby = getNearbyPlaces(p.lat, p.lng, p.city, p.locality)
                const schoolsCount = nearby.filter(n => n.group === 'education').length
                const hospitalsCount = nearby.filter(n => n.group === 'healthcare').length
                const transitCount = nearby.filter(n => n.group === 'transit').length

                return (
                  <td key={p.id}>
                    <div className="nearby-summary-pill">
                      <span>🏫 {schoolsCount} Schools/Colleges</span>
                      <span>🏥 {hospitalsCount} Hospitals</span>
                      <span>🚇 {transitCount} Transit Hubs</span>
                    </div>
                  </td>
                )
              })}
              {comparedCount < 4 && <td />}
            </tr>

            {/* Section: Seller Info & Status */}
            <tr className="section-header-tr">
              <td colSpan={comparedCount + (comparedCount < 4 ? 2 : 1)}>👤 Seller & Status</td>
            </tr>

            <tr className={highlightDiff && isDifferent(p => p.sellerName || p.seller?.name) ? 'row-diff' : ''}>
              <td className="sticky-col feature-label">Seller / Agent</td>
              {comparedProperties.map(p => (
                <td key={p.id}>{p.sellerName || p.seller?.name || 'Verified Owner'}</td>
              ))}
              {comparedCount < 4 && <td />}
            </tr>

            <tr className={highlightDiff && isDifferent(p => p.sellerRating || p.rating) ? 'row-diff' : ''}>
              <td className="sticky-col feature-label">Rating & Verification</td>
              {comparedProperties.map(p => (
                <td key={p.id}>
                  <span className="rating-badge-td">
                    <Star size={13} fill="#F59E0B" color="#F59E0B" />
                    <strong>{p.rating || 4.7}</strong> ({p.reviewCount || 12} reviews)
                  </span>
                </td>
              ))}
              {comparedCount < 4 && <td />}
            </tr>

            <tr className={highlightDiff && isDifferent(p => p.listedDate) ? 'row-diff' : ''}>
              <td className="sticky-col feature-label">Listing Date</td>
              {comparedProperties.map(p => (
                <td key={p.id}>{p.listedDate || '2026-06-01'}</td>
              ))}
              {comparedCount < 4 && <td />}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Add Property Modal Picker */}
      <AnimatePresence>
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <motion.div
              className="modal-card compare-picker-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Add Property to Comparison</h3>
                <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="picker-grid">
                {availableToAdd.length > 0 ? (
                  availableToAdd.map(p => (
                    <div key={p.id} className="picker-item-card">
                      <img src={p.image || p.images?.[0]} alt={p.title} />
                      <div className="picker-item-info">
                        <h4>{p.title}</h4>
                        <p>{p.locality}, {p.city}</p>
                        <span className="picker-price">{formatPrice(p.price, p.listingType)}</span>
                      </div>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          addToCompare(p.id)
                          setShowAddModal(false)
                        }}
                      >
                        <Plus size={14} /> Add
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="no-more-props">All available properties are already added for comparison!</p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
