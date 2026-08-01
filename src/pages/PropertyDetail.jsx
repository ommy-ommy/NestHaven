import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, BedDouble, Bath, Maximize, Building2, Compass, Star, Heart, Share2, Phone, MessageSquare, Calendar, ChevronLeft, ChevronRight, X, Eye, Clock, Shield, Check, Calculator, CheckCircle2, GitCompare } from 'lucide-react'
import { properties, formatPrice } from '../data/properties'
import { reviews, amenityLabels } from '../data/cities'
import { useFavorites } from '../context/FavoriteContext'
import { useCompare } from '../context/CompareContext'
import { useAuth } from '../context/AuthContext'
import { useVerification } from '../context/VerificationContext'
import { supabase } from '../lib/supabase'
import PropertyCard from '../components/property/PropertyCard'
import PropertyMap from '../components/property/PropertyMap'
import NearbyPlaces from '../components/property/NearbyPlaces'
import PropertyDocumentsTab from '../components/document/PropertyDocumentsTab'
import { PropertyVerificationBar, PrimaryBlueVerificationBadge } from '../components/verification/VerificationBadge'
import './PropertyDetail.css'

export default function PropertyDetail() {
  const { id } = useParams()
  const property = properties.find(p => p.id === id) || properties[0]
  const propertyReviews = reviews.filter(r => r.propertyId === property.id)
  const similarProperties = properties.filter(p => p.id !== property.id && p.city === property.city).slice(0, 3)
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isInCompare, toggleCompare } = useCompare()
  const { user } = useAuth()
  const { getBadgesForProperty } = useVerification()
  const fav = isFavorite(property.id)
  const compared = isInCompare(property.id)
  const activeBadges = getBadgesForProperty(property.id)

  const [activeImg, setActiveImg] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [meetingDate, setMeetingDate] = useState('')
  const [meetingTime, setMeetingTime] = useState('10:00 AM')
  const [customMessage, setCustomMessage] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [selectedMapPlace, setSelectedMapPlace] = useState(null)

  const [emiMonths, setEmiMonths] = useState(240)
  const [emiRate, setEmiRate] = useState(8.5)

  const monthlyEmi = (() => {
    const P = property.price * 0.8
    const r = emiRate / 12 / 100
    const n = emiMonths
    return Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1))
  })()

  // Save message/inquiry to Supabase
  const handleSendMessage = async (msgText, isMeeting = false) => {
    try {
      const payload = {
        sender_id: user?.id || null,
        receiver_id: property.sellerId || 's1',
        property_id: String(property.id),
        sender_name: user?.name || 'Interested Buyer',
        sender_email: user?.email || 'buyer@example.com',
        sender_phone: user?.phone || '+91 98765 43210',
        message: msgText || `Inquiry regarding ${property.title}`,
        meeting_date: isMeeting ? meetingDate : null,
        meeting_time: isMeeting ? meetingTime : null,
      }

      await supabase.from('messages').insert([payload])
      setBookingSuccess(true)
      setTimeout(() => setBookingSuccess(false), 4000)
    } catch (err) {
      console.error('Error saving message to Supabase:', err)
    }
  }

  return (
    <motion.div className="detail-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Gallery */}
      <div className="container" style={{ paddingTop: '1.25rem' }}>
        <section className="detail-gallery">
          <div className="gallery-main" onClick={() => setLightbox(true)}>
            <img src={property.images[activeImg]} alt={property.title} />
            <div className="gallery-overlay">
              <span className="gallery-view-all">View All Photos</span>
            </div>
          </div>
          <div className="gallery-thumbs">
            {property.images.slice(0, 4).map((img, i) => (
              <div
                key={i}
                className={`gallery-thumb ${i === activeImg ? 'thumb-active' : ''}`}
                onClick={() => setActiveImg(i)}
              >
                <img src={img} alt="" />
                {i === 3 && property.images.length > 4 && (
                  <div className="thumb-more">+{property.images.length - 4}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(false)}>
          <button className="lightbox-close"><X size={24} /></button>
          <button className="lightbox-nav lightbox-prev" onClick={e => { e.stopPropagation(); setActiveImg(p => (p - 1 + property.images.length) % property.images.length) }}>
            <ChevronLeft size={28} />
          </button>
          <img src={property.images[activeImg]} alt="" className="lightbox-img" onClick={e => e.stopPropagation()} />
          <button className="lightbox-nav lightbox-next" onClick={e => { e.stopPropagation(); setActiveImg(p => (p + 1) % property.images.length) }}>
            <ChevronRight size={28} />
          </button>
          <div className="lightbox-counter">{activeImg + 1} / {property.images.length}</div>
        </div>
      )}

      <div className="container">
        {bookingSuccess && (
          <div style={{
            padding: '1rem',
            background: 'rgba(138, 182, 65, 0.15)',
            border: '1px solid var(--color-primary)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--color-primary-dark)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem',
            fontWeight: 600
          }}>
            <CheckCircle2 size={24} />
            <span>Success! Your message and meeting request have been sent to the property owner and saved in Supabase.</span>
          </div>
        )}

        {/* Hero Grid: Main Title/Price Info + Right Seller Contact Card */}
        <div className="detail-hero-grid">
          {/* Main Info */}
          <div className="detail-hero-left">
            {/* Title Section */}
            <div className="detail-title-section">
              <div className="detail-badges" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="badge badge-primary">{property.type.charAt(0).toUpperCase() + property.type.slice(1)}</span>
                <span className="badge badge-dark">{property.listingType === 'rent' ? 'For Rent' : 'For Sale'}</span>
                {property.featured && <span className="badge badge-accent">Featured</span>}
                {isVerified && <PropertyVerificationBar badges={activeBadges} size="md" />}
              </div>
              <h1>{property.title}</h1>
              <div className="detail-location">
                <MapPin size={16} />
                <span>{property.address}</span>
              </div>
              <div className="detail-actions-row">
                <button
                  className={`btn btn-ghost ${compared ? 'compare-active' : ''}`}
                  onClick={() => toggleCompare(property.id)}
                  style={compared ? { background: 'var(--color-primary-lighter)', color: 'var(--color-primary-dark)', fontWeight: 600 } : {}}
                >
                  <GitCompare size={18} color={compared ? 'var(--color-primary)' : 'currentColor'} />
                  {compared ? 'In Comparison' : 'Compare'}
                </button>
                <button className={`btn btn-ghost ${fav ? 'fav-active' : ''}`} onClick={() => toggleFavorite(property.id)}>
                  <Heart size={18} fill={fav ? '#E8695E' : 'none'} color={fav ? '#E8695E' : 'currentColor'} />
                  {fav ? 'Saved' : 'Save'}
                </button>
                <button className="btn btn-ghost"><Share2 size={18} /> Share</button>
              </div>
            </div>

            {/* Price & Specs Card */}
            <div className="detail-price-card">
              <div className="detail-price">
                <span className="price-value">{formatPrice(property.price, property.listingType)}</span>
                {property.pricePerSqft > 0 && <span className="price-sqft">₹{property.pricePerSqft.toLocaleString('en-IN')} per sqft</span>}
              </div>
              <div className="detail-specs">
                {property.bhk > 0 && <div className="spec-item"><BedDouble size={20} /><div><strong>{property.bhk} BHK</strong><span>Bedrooms</span></div></div>}
                <div className="spec-item"><Bath size={20} /><div><strong>{property.bathrooms}</strong><span>Bathrooms</span></div></div>
                <div className="spec-item"><Maximize size={20} /><div><strong>{property.area.toLocaleString()} sqft</strong><span>Area</span></div></div>
                {property.floor > 0 && <div className="spec-item"><Building2 size={20} /><div><strong>Floor {property.floor}</strong><span>of {property.totalFloors}</span></div></div>}
                <div className="spec-item"><Compass size={20} /><div><strong>{property.facing}</strong><span>Facing</span></div></div>
              </div>
            </div>
          </div>

          {/* Right Hero Sidebar: Seller Card */}
          <div className="detail-hero-right">
            <aside className="detail-sidebar">
              <div className="seller-card">
                <div className="seller-header">
                  <div className="seller-avatar-lg">{property.sellerName.charAt(0)}</div>
                  <div>
                    <h4>{property.sellerName}</h4>
                    <p className="seller-company">{property.sellerCompany}</p>
                    <div className="seller-rating">
                      <Star size={14} fill="var(--color-accent)" color="var(--color-accent)" />
                      <span>{property.sellerRating}</span>
                      {isVerified && <span className="seller-badge"><Shield size={12} /> Verified</span>}
                    </div>
                  </div>
                </div>
                <div className="seller-actions">
                  <button
                    className="btn btn-primary seller-action-btn"
                    onClick={() => handleSendMessage(`Interested in calling owner for property ${property.title}`)}
                  >
                    <Phone size={16} />
                    Contact Owner
                  </button>
                  <button
                    className="btn btn-secondary seller-action-btn"
                    onClick={() => setShowMessageModal(!showMessageModal)}
                  >
                    <MessageSquare size={16} />
                    Send Message
                  </button>
                  <button className="btn btn-dark seller-action-btn" onClick={() => setShowSchedule(!showSchedule)}>
                    <Calendar size={16} />
                    Schedule Visit
                  </button>
                </div>

                {showMessageModal && (
                  <div className="schedule-panel" style={{ marginTop: '1rem' }}>
                    <h4>Send Message to {property.sellerName}</h4>
                    <textarea
                      className="form-input"
                      rows={3}
                      placeholder="Type your question or offer..."
                      value={customMessage}
                      onChange={e => setCustomMessage(e.target.value)}
                    />
                    <button
                      className="btn btn-primary"
                      style={{ width: '100%', marginTop: '0.75rem' }}
                      onClick={() => {
                        handleSendMessage(customMessage || `Interested in property: ${property.title}`)
                        setShowMessageModal(false)
                        setCustomMessage('')
                      }}
                    >
                      Send to Supabase
                    </button>
                  </div>
                )}

                {showSchedule && (
                  <motion.div className="schedule-panel" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
                    <h4>Pick a Date & Time</h4>
                    <input
                      type="date"
                      className="form-input"
                      value={meetingDate}
                      onChange={e => setMeetingDate(e.target.value)}
                    />
                    <div className="time-slots">
                      {['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'].map(t => (
                        <button
                          key={t}
                          className={`time-slot ${meetingTime === t ? 'active' : ''}`}
                          onClick={() => setMeetingTime(t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <button
                      className="btn btn-primary"
                      style={{ width: '100%', marginTop: '0.75rem' }}
                      onClick={() => {
                        handleSendMessage(`Schedule visit for ${property.title} on ${meetingDate || 'upcoming date'} at ${meetingTime}`, true)
                        setShowSchedule(false)
                      }}
                    >
                      Confirm Booking
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Rental Info */}
              {property.listingType === 'rent' && (
                <div className="rental-info-card">
                  <h4>Rental Details</h4>
                  <div className="rental-details">
                    <div className="rental-row"><span>Monthly Rent</span><strong>{formatPrice(property.price, 'rent')}</strong></div>
                    <div className="rental-row"><span>Security Deposit</span><strong>₹{property.rentDeposit?.toLocaleString('en-IN')}</strong></div>
                    <div className="rental-row"><span>Lease Duration</span><strong>{property.leaseDuration}</strong></div>
                    <div className="rental-row"><span>Furnishing</span><strong>{property.furnished.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</strong></div>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>

        {/* Full-Width Centered Content Stack */}
        <div className="detail-full-stack">
          {/* Description */}
          <div className="detail-section">
            <h3>About this Property</h3>
            <p className="detail-description">{property.description}</p>
            <div className="detail-meta-grid">
              <div className="meta-item"><Clock size={14} /> Listed {property.listedDate}</div>
              <div className="meta-item"><Eye size={14} /> {property.views} views</div>
              {isVerified && <div className="meta-item"><Shield size={14} /> Verified Listing</div>}
            </div>
          </div>

          {/* Amenities */}
          <div className="detail-section">
            <h3>Amenities & Features</h3>
            <div className="amenities-grid">
              {property.amenities.map(a => {
                const info = amenityLabels[a]
                return info ? (
                  <div key={a} className="amenity-item">
                    <Check size={16} />
                    <span>{info.label}</span>
                  </div>
                ) : null
              })}
            </div>
          </div>

          {/* EMI Calculator */}
          {property.listingType === 'buy' && (
            <div className="detail-section">
              <h3><Calculator size={20} /> EMI Calculator</h3>
              <div className="emi-card">
                <div className="emi-inputs">
                  <div className="emi-group">
                    <label>Loan Amount (80%)</label>
                    <p className="emi-value">₹{(property.price * 0.8).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="emi-group">
                    <label>Interest Rate: {emiRate}%</label>
                    <input type="range" min="6" max="14" step="0.1" value={emiRate} onChange={e => setEmiRate(parseFloat(e.target.value))} className="price-slider" />
                  </div>
                  <div className="emi-group">
                    <label>Tenure: {emiMonths / 12} years</label>
                    <input type="range" min="60" max="360" step="12" value={emiMonths} onChange={e => setEmiMonths(parseInt(e.target.value))} className="price-slider" />
                  </div>
                </div>
                <div className="emi-result">
                  <span className="emi-label">Monthly EMI</span>
                  <span className="emi-amount">₹{monthlyEmi.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Map & Directions */}
          <div className="detail-section" id="property-map-section">
            <PropertyMap property={property} selectedPlace={selectedMapPlace} />
          </div>

          {/* Nearby Places Section (14 Categories) */}
          <NearbyPlaces
            property={property}
            onSelectPlaceOnMap={(place) => {
              setSelectedMapPlace(place)
              document.getElementById('property-map-section')?.scrollIntoView({ behavior: 'smooth' })
            }}
          />

          {/* Property Documents & Legal Verification Tab */}
          <PropertyDocumentsTab propertyId={property.id} propertyTitle={property.title} />

          {/* Reviews */}
          <div className="detail-section">
            <h3>Reviews & Ratings</h3>
            <div className="review-summary">
              <div className="review-score">
                <span className="score-value">{property.rating}</span>
                <div className="score-stars">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.round(property.rating) ? 'var(--color-accent)' : 'none'} color="var(--color-accent)" />
                  ))}
                </div>
                <span className="score-count">{property.reviewCount} reviews</span>
              </div>
            </div>
            <div className="reviews-list">
              {propertyReviews.length > 0 ? propertyReviews.map(review => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <div className="review-avatar">{review.userName.charAt(0)}</div>
                    <div>
                      <p className="review-name">{review.userName}</p>
                      <p className="review-date">{review.date}</p>
                    </div>
                    <div className="review-stars">
                      {Array(review.rating).fill(0).map((_, j) => (
                        <Star key={j} size={12} fill="var(--color-accent)" color="var(--color-accent)" />
                      ))}
                    </div>
                  </div>
                  <p className="review-text">{review.comment}</p>
                </div>
              )) : (
                <p className="no-reviews">No reviews yet for this property.</p>
              )}
            </div>
          </div>

          {/* Similar Properties */}
          {similarProperties.length > 0 && (
            <div className="detail-section">
              <h3>Similar Properties</h3>
              <div className="similar-grid">
                {similarProperties.map(p => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
