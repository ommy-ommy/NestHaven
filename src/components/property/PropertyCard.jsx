import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MapPin, Maximize, BedDouble, Bath, ChevronLeft, ChevronRight, Star, Eye, GitCompare } from 'lucide-react'
import { formatPrice } from '../../data/properties'
import { useFavorites } from '../../context/FavoriteContext'
import { useCompare } from '../../context/CompareContext'
import { useVerification } from '../../context/VerificationContext'
import { PrimaryBlueVerificationBadge, PropertyVerificationBar } from '../verification/VerificationBadge'
import './PropertyCard.css'

export default function PropertyCard({ property, layout = 'vertical' }) {
  const [imgIdx, setImgIdx] = useState(0)
  const [imgLoaded, setImgLoaded] = useState(false)
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isInCompare, toggleCompare } = useCompare()
  const { getBadgesForProperty, getVerificationForProperty } = useVerification()
  const fav = isFavorite(property.id)
  const compared = isInCompare(property.id)

  const activeBadges = getBadgesForProperty(property.id)
  const verRecord = getVerificationForProperty(property.id)
  const isVerified = property.verified || verRecord?.status === 'Approved' || activeBadges.length > 0

  const nextImg = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setImgIdx(prev => (prev + 1) % property.images.length)
    setImgLoaded(false)
  }

  const prevImg = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setImgIdx(prev => (prev - 1 + property.images.length) % property.images.length)
    setImgLoaded(false)
  }

  const handleFav = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(property.id)
  }

  return (
    <Link to={`/property/${property.id}`} className={`property-card ${layout === 'horizontal' ? 'property-card-horizontal' : ''}`}>
      <div className="pcard-image-wrap">
        <img
          src={property.images[imgIdx]}
          alt={property.title}
          className={`pcard-image ${imgLoaded ? 'loaded' : ''}`}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
        />
        <div className="pcard-image-overlay" />

        {/* Badges */}
        <div className="pcard-badges">
          {isVerified && <PrimaryBlueVerificationBadge text="Verified" />}
          {property.featured && <span className="badge badge-accent">Featured</span>}
          <span className="badge badge-dark">{property.listingType === 'rent' ? 'Rent' : 'Buy'}</span>
        </div>

        {/* Favorite & Compare buttons */}
        <div className="pcard-actions-top">
          <button
            className={`pcard-compare-btn ${compared ? 'pcard-compare-active' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleCompare(property.id)
            }}
            title={compared ? 'Remove from comparison' : 'Add to comparison'}
          >
            <GitCompare size={15} />
            <span className="compare-text">{compared ? 'Comparing' : 'Compare'}</span>
          </button>
          <button className={`pcard-fav ${fav ? 'pcard-fav-active' : ''}`} onClick={handleFav} aria-label="Toggle favorite">
            <Heart size={18} fill={fav ? '#E8695E' : 'none'} color={fav ? '#E8695E' : 'white'} />
          </button>
        </div>

        {/* Image Nav */}
        {property.images.length > 1 && (
          <>
            <button className="pcard-img-nav pcard-img-prev" onClick={prevImg} aria-label="Previous image">
              <ChevronLeft size={16} />
            </button>
            <button className="pcard-img-nav pcard-img-next" onClick={nextImg} aria-label="Next image">
              <ChevronRight size={16} />
            </button>
            <div className="pcard-img-dots">
              {property.images.map((_, i) => (
                <span key={i} className={`pcard-dot ${i === imgIdx ? 'pcard-dot-active' : ''}`} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="pcard-body">
        <div className="pcard-price-row">
          <span className="pcard-price">{formatPrice(property.price, property.listingType)}</span>
          {property.pricePerSqft > 0 && (
            <span className="pcard-price-sqft">₹{property.pricePerSqft.toLocaleString('en-IN')}/sqft</span>
          )}
        </div>

        <h3 className="pcard-title">{property.title}</h3>

        <div className="pcard-location">
          <MapPin size={14} />
          <span>{property.locality}, {property.city}</span>
        </div>

        <div className="pcard-specs">
          {property.bhk > 0 && (
            <div className="pcard-spec">
              <BedDouble size={14} />
              <span>{property.bhk} BHK</span>
            </div>
          )}
          <div className="pcard-spec">
            <Bath size={14} />
            <span>{property.bathrooms} Bath</span>
          </div>
          <div className="pcard-spec">
            <Maximize size={14} />
            <span>{property.area.toLocaleString()} sqft</span>
          </div>
        </div>

        {activeBadges.length > 0 && (
          <div style={{ marginBottom: '0.65rem' }}>
            <PropertyVerificationBar badges={activeBadges} size="sm" />
          </div>
        )}

        <div className="pcard-footer">
          <div className="pcard-seller">
            <div className="pcard-seller-avatar">{property.sellerName.charAt(0)}</div>
            <span className="pcard-seller-name">{property.sellerName}</span>
          </div>
          <div className="pcard-meta">
            <span className="pcard-rating">
              <Star size={12} fill="var(--color-accent)" color="var(--color-accent)" />
              {property.rating}
            </span>
            <span className="pcard-views">
              <Eye size={12} />
              {property.views}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
