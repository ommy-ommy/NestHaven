import { useState, useMemo } from 'react'
import {
  GraduationCap,
  School,
  Hospital,
  Pill,
  Utensils,
  Coffee,
  Dumbbell,
  Trees,
  ShoppingBag,
  Fuel,
  TrainTrack,
  Bus,
  Train,
  Plane,
  CreditCard,
  MapPin,
  Star,
  Search,
  Navigation,
  Clock,
  Compass,
} from 'lucide-react'
import {
  getNearbyPlaces,
  NEARBY_CATEGORIES,
  CATEGORY_GROUPS,
} from '../../utils/nearbyPlaces'
import './NearbyPlaces.css'

// Icon mapping helper
const ICON_MAP = {
  GraduationCap,
  School,
  Hospital,
  Pill,
  Utensils,
  Coffee,
  Dumbbell,
  Trees,
  ShoppingBag,
  Fuel,
  TrainTrack,
  Bus,
  Train,
  Plane,
  CreditCard,
}

export default function NearbyPlaces({ property, onSelectPlaceOnMap }) {
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const lat = property.lat || 19.0096
  const lng = property.lng || 72.8183
  const city = property.city || 'Mumbai'
  const locality = property.locality || 'Central'

  // Generate all nearby places using property coordinates
  const places = useMemo(() => {
    return getNearbyPlaces(lat, lng, city, locality)
  }, [lat, lng, city, locality])

  // Count places per category
  const categoryCounts = useMemo(() => {
    const counts = { all: places.length }
    places.forEach(p => {
      counts[p.categoryId] = (counts[p.categoryId] || 0) + 1
    })
    return counts
  }, [places])

  // Filter places based on selected group, active category, and search query
  const filteredPlaces = useMemo(() => {
    return places.filter(place => {
      const matchesGroup =
        selectedGroup === 'all' || place.group === selectedGroup
      const matchesCategory =
        activeCategory === 'all' || place.categoryId === activeCategory
      const matchesSearch =
        !searchQuery ||
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesGroup && matchesCategory && matchesSearch
    })
  }, [places, selectedGroup, activeCategory, searchQuery])

  // Render Icon dynamically
  const renderCategoryIcon = (iconName, color, size = 18) => {
    const IconComponent = ICON_MAP[iconName] || MapPin
    return <IconComponent size={size} color={color || 'var(--color-primary)'} />
  }

  return (
    <div className="nearby-places-section">
      {/* Section Header */}
      <div className="nearby-header">
        <div>
          <h3 className="nearby-title">
            <Compass size={22} color="var(--color-primary)" />
            Nearby Amenities & Neighborhood Points of Interest
          </h3>
          <p className="nearby-subtitle">
            Explore key landmarks, transit hubs, healthcare, and essential services near this property.
          </p>
        </div>
        <div className="nearby-total-badge">
          <span>{places.length} Nearby POIs Found</span>
        </div>
      </div>

      {/* Category Group Tabs */}
      <div className="nearby-group-tabs">
        {CATEGORY_GROUPS.map(group => (
          <button
            key={group.id}
            className={`group-tab ${selectedGroup === group.id ? 'active' : ''}`}
            onClick={() => {
              setSelectedGroup(group.id)
              setActiveCategory('all')
            }}
          >
            {group.label}
          </button>
        ))}
      </div>

      {/* 16 Category Filter Pills */}
      <div className="nearby-pills-row">
        <button
          className={`cat-pill ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          <span>All Categories</span>
          <span className="pill-count">{places.length}</span>
        </button>

        {NEARBY_CATEGORIES.filter(
          cat => selectedGroup === 'all' || cat.group === selectedGroup
        ).map(cat => {
          const count = categoryCounts[cat.id] || 0
          return (
            <button
              key={cat.id}
              className={`cat-pill ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {renderCategoryIcon(cat.icon, activeCategory === cat.id ? '#ffffff' : cat.color, 14)}
              <span>{cat.label}</span>
              <span className="pill-count">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Search Input Bar */}
      <div className="nearby-search-bar">
        <Search size={16} color="var(--color-text-muted)" />
        <input
          type="text"
          placeholder="Search nearby places (e.g. Metro, Hospital, Cafe, School)..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
            ✕
          </button>
        )}
      </div>

      {/* Places Cards Grid */}
      <div className="nearby-grid">
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map(place => (
            <div key={place.id} className="nearby-card">
              <div className="card-top-row">
                <div className="card-icon-badge" style={{ backgroundColor: `${place.categoryColor}15` }}>
                  {renderCategoryIcon(place.categoryIcon, place.categoryColor, 20)}
                </div>
                <div className="card-rating">
                  <Star size={13} fill="#F59E0B" color="#F59E0B" />
                  <span>{place.rating}</span>
                </div>
              </div>

              <h4 className="card-place-name">{place.name}</h4>
              <span className="card-category-tag">{place.categoryLabel}</span>

              <div className="card-metrics-row">
                <div className="metric-item">
                  <Navigation size={13} color="var(--color-primary-dark)" />
                  <strong>{place.formattedDistance}</strong>
                </div>
                <div className="metric-item">
                  <Clock size={13} color="var(--color-text-muted)" />
                  <span>{place.estimatedTime}</span>
                </div>
              </div>

              <button
                className="btn btn-ghost view-map-btn"
                onClick={() => onSelectPlaceOnMap && onSelectPlaceOnMap(place)}
              >
                <MapPin size={13} />
                <span>View on Map</span>
              </button>
            </div>
          ))
        ) : (
          <div className="nearby-empty-state">
            <p>No nearby places found matching "{searchQuery}". Try selecting another category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
