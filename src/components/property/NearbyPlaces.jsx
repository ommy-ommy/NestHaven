import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  GraduationCap,
  Hospital,
  Utensils,
  Hotel,
  Coffee,
  Dumbbell,
  TrainFront,
  Bus,
  ShoppingBag,
  Landmark,
  CreditCard,
  ShieldAlert,
  Fuel,
  Trees,
  MapPin,
  Star,
  Search,
  Navigation,
  Clock,
  Compass,
  ExternalLink,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import {
  getNearbyPlaces,
  NEARBY_CATEGORIES,
} from '../../utils/nearbyPlaces'
import './NearbyPlaces.css'

// Dynamic icon mapping for all 14 categories
const ICON_MAP = {
  GraduationCap,
  Hospital,
  Utensils,
  Hotel,
  Coffee,
  Dumbbell,
  TrainFront,
  Bus,
  ShoppingBag,
  Landmark,
  CreditCard,
  ShieldAlert,
  Fuel,
  Trees,
}

export default function NearbyPlaces({ property, onSelectPlaceOnMap }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState('distance') // 'distance' | 'rating'
  const [searchQuery, setSearchQuery] = useState('')

  const lat = property.lat || 19.0096
  const lng = property.lng || 72.8183
  const city = property.city || 'Mumbai'
  const locality = property.locality || 'Central'

  // Generate all nearby places for property coordinates
  const places = useMemo(() => {
    return getNearbyPlaces(lat, lng, city, locality)
  }, [lat, lng, city, locality])

  // Count per category
  const categoryCounts = useMemo(() => {
    const counts = { all: places.length }
    places.forEach(p => {
      counts[p.categoryId] = (counts[p.categoryId] || 0) + 1
    })
    return counts
  }, [places])

  // Filter and sort places
  const processedPlaces = useMemo(() => {
    let result = places.filter(place => {
      const matchesCategory =
        activeCategory === 'all' || place.categoryId === activeCategory
      const matchesSearch =
        !searchQuery ||
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesCategory && matchesSearch
    })

    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating)
    } else {
      result.sort((a, b) => a.distanceKm - b.distanceKm)
    }

    return result
  }, [places, activeCategory, searchQuery, sortBy])

  // Helper to render icon
  const renderCategoryIcon = (iconName, color, size = 18) => {
    const IconComponent = ICON_MAP[iconName] || MapPin
    return <IconComponent size={size} color={color || 'var(--color-primary)'} />
  }

  return (
    <div className="nearby-dashboard-container" id="property-nearby-section">
      {/* Header */}
      <div className="nearby-dash-header">
        <div className="nearby-header-left">
          <div className="nearby-badge">
            <Compass size={16} /> Location Intelligence
          </div>
          <h3>Nearby Places & Amenities ({places.length})</h3>
          <p className="nearby-subtitle">
            Explore essential amenities, transit hubs, and points of interest near <strong>{property.title}</strong>.
          </p>
        </div>

        {/* Sorting Controls */}
        <div className="nearby-sort-controls">
          <span className="sort-label"><ArrowUpDown size={14} /> Sort By:</span>
          <button
            className={`sort-btn ${sortBy === 'distance' ? 'sort-active' : ''}`}
            onClick={() => setSortBy('distance')}
          >
            Nearest First
          </button>
          <button
            className={`sort-btn ${sortBy === 'rating' ? 'sort-active' : ''}`}
            onClick={() => setSortBy('rating')}
          >
            Highest Rated
          </button>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="nearby-controls-bar">
        <div className="nearby-search-box">
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search nearby places (e.g., Hospital, Metro, Cafe)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* 14 Category Filter Pills */}
        <div className="nearby-category-pills">
          <button
            className={`category-pill ${activeCategory === 'all' ? 'pill-active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            <span>All Places</span>
            <span className="pill-count">{places.length}</span>
          </button>

          {NEARBY_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`category-pill ${activeCategory === cat.id ? 'pill-active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {renderCategoryIcon(cat.icon, activeCategory === cat.id ? '#ffffff' : cat.color, 14)}
              <span>{cat.label}</span>
              <span className="pill-count">{categoryCounts[cat.id] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Places Cards Grid */}
      <div className="nearby-places-grid">
        {processedPlaces.length === 0 ? (
          <div className="empty-places-state">
            <Compass size={40} color="#94a3b8" />
            <p>No places found matching your filter or search query.</p>
          </div>
        ) : (
          processedPlaces.map(place => (
            <motion.div
              key={place.id}
              className="nearby-place-card"
              whileHover={{ y: -3, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)' }}
            >
              <div className="place-card-header">
                <div className="place-icon-box" style={{ background: `${place.categoryColor}15` }}>
                  {renderCategoryIcon(place.categoryIcon, place.categoryColor, 20)}
                </div>
                <div className="place-header-details">
                  <span className="place-cat-label" style={{ color: place.categoryColor }}>
                    {place.categoryLabel}
                  </span>
                  <h4 className="place-title" title={place.name}>{place.name}</h4>
                </div>
              </div>

              <div className="place-card-stats">
                <div className="place-dist-badge">
                  <MapPin size={13} color="var(--color-primary-dark, #5d8225)" />
                  <strong>{place.formattedDistance}</strong>
                  <span className="place-time">• {place.estimatedTime}</span>
                </div>

                <div className="place-rating-badge">
                  <Star size={12} fill="#EAB308" color="#EAB308" />
                  <strong>{place.rating}</strong>
                </div>
              </div>

              {/* Status Badge: Open / Closed */}
              <div className="place-status-row">
                <span className={`open-status-tag ${place.isOpen ? 'tag-open' : 'tag-closed'}`}>
                  {place.isOpen ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  {place.isOpen ? 'Open Now' : 'Closed'}
                </span>
              </div>

              {/* Actions: Google Navigation & View on Map */}
              <div className="place-card-actions">
                <button
                  className="place-action-btn btn-map-view"
                  onClick={() => onSelectPlaceOnMap && onSelectPlaceOnMap(place)}
                >
                  <MapPin size={13} /> View on Map
                </button>

                <a
                  href={place.googleNavUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="place-action-btn btn-google-nav"
                >
                  <Navigation size={13} /> Directions <ExternalLink size={11} />
                </a>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
