import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X, MapPin, Grid3X3, List, ChevronDown, Compass } from 'lucide-react'
import { useProperties } from '../context/PropertyContext'
import PropertyCard from '../components/property/PropertyCard'
import './Properties.css'

export default function Properties() {
  const { filters, updateFilter, resetFilters, getFilteredProperties } = useProperties()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const location = useLocation()

  // Parse URL search parameters (e.g. ?q=pune or ?city=Pune)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const qParam = params.get('q') || params.get('search')
    const cityParam = params.get('city')
    const typeParam = params.get('type')

    if (qParam) {
      updateFilter('search', qParam)
    }
    if (cityParam) {
      updateFilter('city', cityParam)
    }
    if (typeParam) {
      updateFilter('listingType', typeParam === 'rent' ? 'rent' : 'buy')
    }
  }, [location.search])

  const filtered = getFilteredProperties()

  const filterOptions = {
    type: ['all', 'apartment', 'villa', 'house', 'plot'],
    bhk: ['all', '1', '2', '3', '4'],
    city: ['all', 'Mumbai', 'Bangalore', 'Delhi', 'Gurgaon', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Goa'],
    furnished: ['all', 'furnished', 'semi-furnished', 'unfurnished'],
    sortBy: [
      { value: 'newest', label: 'Newest First' },
      { value: 'price-low', label: 'Price: Low to High' },
      { value: 'price-high', label: 'Price: High to Low' },
      { value: 'popular', label: 'Most Popular' },
    ]
  }

  const popularCities = ['Mumbai', 'Bangalore', 'Delhi', 'Pune', 'Gurgaon', 'Hyderabad', 'Chennai', 'Goa']

  return (
    <motion.div
      className="properties-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="properties-header">
        <div className="container">
          <div className="properties-header-content">
            <div>
              <h1>
                {filters.listingType === 'rent' ? 'Properties for Rent' : 'Properties for Sale'}
              </h1>
              <p>{filtered.length} properties matching search criteria</p>
            </div>
            <div className="properties-header-actions">
              <div className="listing-type-toggle">
                <button
                  className={`toggle-btn ${filters.listingType === 'buy' ? 'toggle-active' : ''}`}
                  onClick={() => updateFilter('listingType', 'buy')}
                >
                  Buy
                </button>
                <button
                  className={`toggle-btn ${filters.listingType === 'rent' ? 'toggle-active' : ''}`}
                  onClick={() => updateFilter('listingType', 'rent')}
                >
                  Rent
                </button>
              </div>
              <div className="view-toggle">
                <button className={`view-btn ${viewMode === 'grid' ? 'view-active' : ''}`} onClick={() => setViewMode('grid')}>
                  <Grid3X3 size={18} />
                </button>
                <button className={`view-btn ${viewMode === 'list' ? 'view-active' : ''}`} onClick={() => setViewMode('list')}>
                  <List size={18} />
                </button>
              </div>
              <button className="btn btn-secondary filter-mobile-btn" onClick={() => setSidebarOpen(true)}>
                <SlidersHorizontal size={16} />
                Filters
              </button>
            </div>
          </div>

          {/* Location Search Bar */}
          <div className="prop-search-bar-wrap">
            <div className="prop-search-input-box">
              <MapPin size={18} color="var(--color-primary)" />
              <input
                type="text"
                placeholder="Search location, city (e.g. Pune, Mumbai, Bangalore), locality, or property type..."
                value={filters.search || ''}
                onChange={e => updateFilter('search', e.target.value)}
              />
              {filters.search && (
                <button className="prop-search-clear" onClick={() => updateFilter('search', '')}>
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Quick City Tags */}
            <div className="city-quick-tags">
              <span className="city-tag-label"><Compass size={14} /> Quick Cities:</span>
              <button
                className={`city-tag-btn ${!filters.search && filters.city === 'all' ? 'active' : ''}`}
                onClick={() => {
                  updateFilter('search', '')
                  updateFilter('city', 'all')
                }}
              >
                All India
              </button>
              {popularCities.map(cityName => (
                <button
                  key={cityName}
                  className={`city-tag-btn ${
                    filters.search?.toLowerCase() === cityName.toLowerCase() ||
                    filters.city?.toLowerCase() === cityName.toLowerCase()
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => {
                    updateFilter('search', cityName)
                    updateFilter('city', 'all')
                  }}
                >
                  {cityName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="properties-layout">
          {/* Sidebar */}
          <aside className={`filter-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
            <div className="sidebar-header">
              <h3><SlidersHorizontal size={18} /> Filters</h3>
              <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Property Type */}
            <div className="filter-group">
              <label className="filter-label">Property Type</label>
              <div className="filter-chips">
                {filterOptions.type.map(t => (
                  <button
                    key={t}
                    className={`filter-chip ${filters.type === t ? 'chip-active' : ''}`}
                    onClick={() => updateFilter('type', t)}
                  >
                    {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* BHK */}
            <div className="filter-group">
              <label className="filter-label">BHK</label>
              <div className="filter-chips">
                {filterOptions.bhk.map(b => (
                  <button
                    key={b}
                    className={`filter-chip ${filters.bhk === b ? 'chip-active' : ''}`}
                    onClick={() => updateFilter('bhk', b)}
                  >
                    {b === 'all' ? 'All' : `${b} BHK`}
                  </button>
                ))}
              </div>
            </div>

            {/* City */}
            <div className="filter-group">
              <label className="filter-label">City</label>
              <select
                className="filter-select"
                value={filters.city}
                onChange={e => updateFilter('city', e.target.value)}
              >
                {filterOptions.city.map(c => (
                  <option key={c} value={c}>{c === 'all' ? 'All Cities' : c}</option>
                ))}
              </select>
            </div>

            {/* Furnished */}
            <div className="filter-group">
              <label className="filter-label">Furnishing</label>
              <div className="filter-chips">
                {filterOptions.furnished.map(f => (
                  <button
                    key={f}
                    className={`filter-chip ${filters.furnished === f ? 'chip-active' : ''}`}
                    onClick={() => updateFilter('furnished', f)}
                  >
                    {f === 'all' ? 'All' : f.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <label className="filter-label">
                Max Price: {filters.listingType === 'rent' ? `₹${(filters.priceRange[1] / 1000).toFixed(0)}K/mo` : `₹${(filters.priceRange[1] / 10000000).toFixed(1)} Cr`}
              </label>
              <input
                type="range"
                className="price-slider"
                min={filters.listingType === 'rent' ? 5000 : 1000000}
                max={filters.listingType === 'rent' ? 200000 : 150000000}
                step={filters.listingType === 'rent' ? 5000 : 1000000}
                value={filters.priceRange[1]}
                onChange={e => updateFilter('priceRange', [0, parseInt(e.target.value)])}
              />
            </div>

            <button className="btn btn-secondary reset-btn" onClick={resetFilters}>
              <X size={14} />
              Reset All Filters
            </button>
          </aside>

          {/* Backdrop */}
          {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

          {/* Properties Grid */}
          <main className="properties-main">
            {/* Sort Bar */}
            <div className="sort-bar">
              <span className="results-count">{filtered.length} results</span>
              <div className="sort-select-wrap">
                <select
                  className="sort-select"
                  value={filters.sortBy}
                  onChange={e => updateFilter('sortBy', e.target.value)}
                >
                  {filterOptions.sortBy.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="sort-chevron" />
              </div>
            </div>

            {filtered.length > 0 ? (
              <div className={viewMode === 'grid' ? 'properties-grid' : 'properties-list'}>
                {filtered.map((property, i) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                  >
                    <PropertyCard property={property} layout={viewMode === 'list' ? 'horizontal' : 'vertical'} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <Search size={48} />
                <h3>No properties found</h3>
                <p>Try adjusting your filters to see more results.</p>
                <button className="btn btn-primary" onClick={resetFilters}>Reset Filters</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </motion.div>
  )
}
