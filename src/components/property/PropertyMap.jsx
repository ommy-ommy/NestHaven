import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  MapPin,
  Navigation,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  Eye,
  Crosshair,
  Building,
} from 'lucide-react'
import './PropertyMap.css'

export default function PropertyMap({ property, selectedPlace = null }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const layerRef = useRef(null)
  const markersRef = useRef({})

  const [mapType, setMapType] = useState('roadmap') // 'roadmap' | 'satellite' | 'terrain'
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef(null)

  const lat = Number(property.lat) || 19.0096
  const lng = Number(property.lng) || 72.8183

  // Map Tile Layers Configuration (Google Tile Engine)
  const tileUrls = {
    roadmap: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    satellite: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', // Hybrid Satellite + Labels
    terrain: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
  }

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Create Leaflet map centered at property coordinates
    const map = L.map(mapRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
    })

    // Add initial Google tile layer
    const initialLayer = L.tileLayer(tileUrls[mapType], {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(map)

    layerRef.current = initialLayer
    mapInstanceRef.current = map

    // Custom Property Marker Icon with Glassmorphism Badge & Pulse
    const propertyIcon = L.divIcon({
      className: 'custom-property-pin-wrapper',
      html: `
        <div class="property-marker-pin">
          <div class="pin-pulse"></div>
          <div class="pin-badge">
            <span class="pin-icon">🏡</span>
            <span class="pin-title">${property.title ? property.title.slice(0, 18) + '...' : 'NestHaven'}</span>
          </div>
          <div class="pin-pointer"></div>
        </div>
      `,
      iconSize: [160, 50],
      iconAnchor: [80, 50],
    })

    const mainMarker = L.marker([lat, lng], { icon: propertyIcon }).addTo(map)
    mainMarker.bindPopup(`
      <div class="map-popup-card">
        <h4>${property.title || 'NestHaven Property'}</h4>
        <p class="popup-address">${property.address || `${property.locality}, ${property.city}`}</p>
        <div class="popup-meta">
          <span class="popup-price">₹${(property.price || 0).toLocaleString('en-IN')}</span>
          <span class="popup-coords">📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}</span>
        </div>
      </div>
    `)

    markersRef.current.main = mainMarker

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [lat, lng])

  // Change Map Layer Type (Roadmap / Satellite / Terrain)
  useEffect(() => {
    if (!mapInstanceRef.current || !layerRef.current) return

    mapInstanceRef.current.removeLayer(layerRef.current)
    const newLayer = L.tileLayer(tileUrls[mapType], {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(mapInstanceRef.current)

    layerRef.current = newLayer
  }, [mapType])

  // Fly to selected place if user clicks "View on Map" in Nearby Places
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedPlace) return

    const map = mapInstanceRef.current
    const placeLat = Number(selectedPlace.lat)
    const placeLng = Number(selectedPlace.lng)

    if (isNaN(placeLat) || isNaN(placeLng)) return

    // Remove previous POI marker if exists
    if (markersRef.current.poi) {
      map.removeLayer(markersRef.current.poi)
    }

    // Create marker for selected POI
    const poiIcon = L.divIcon({
      className: 'custom-poi-pin-wrapper',
      html: `
        <div class="poi-marker-pin" style="--poi-color: ${selectedPlace.categoryColor || '#3B82F6'}">
          <div class="poi-badge">
            <span class="poi-name">${selectedPlace.name}</span>
            <span class="poi-dist">${selectedPlace.formattedDistance}</span>
          </div>
          <div class="poi-pointer"></div>
        </div>
      `,
      iconSize: [140, 45],
      iconAnchor: [70, 45],
    })

    const poiMarker = L.marker([placeLat, placeLng], { icon: poiIcon }).addTo(map)
    poiMarker.bindPopup(`
      <div class="map-popup-card">
        <h4>${selectedPlace.name}</h4>
        <p class="popup-address">${selectedPlace.categoryLabel} • ⭐ ${selectedPlace.rating}</p>
        <p style="font-size: 0.8rem; color: var(--color-primary-dark); font-weight: 600; margin-top: 4px;">
          📍 ${selectedPlace.formattedDistance} (${selectedPlace.estimatedTime})
        </p>
      </div>
    `).openPopup()

    markersRef.current.poi = poiMarker

    // Smooth pan & zoom to fit both main property & POI
    const bounds = L.latLngBounds([[lat, lng], [placeLat, placeLng]])
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 })
  }, [selectedPlace, lat, lng])

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
    }
  }

  // Zoom Controls
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn()
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut()
  const handleResetCenter = () => {
    mapInstanceRef.current?.flyTo([lat, lng], 15)
    if (markersRef.current.main) {
      markersRef.current.main.openPopup()
    }
  }

  // Links
  const googleDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
  const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`

  return (
    <div className={`property-map-container ${isFullscreen ? 'fullscreen-map' : ''}`} ref={containerRef}>
      {/* Header Glass Overlay */}
      <div className="map-glass-header">
        <div className="map-header-left">
          <div className="map-title-row">
            <Building size={18} color="var(--color-primary)" />
            <span className="map-header-title">Location & Interactive Map</span>
          </div>
          <div className="map-coords-badge">
            <MapPin size={13} />
            <span>Exact Location: <strong>{lat.toFixed(4)}° N, {lng.toFixed(4)}° E</strong></span>
          </div>
        </div>

        <div className="map-header-actions">
          {/* Map Layer Mode Selector */}
          <div className="map-layer-selector">
            <button
              className={`layer-btn ${mapType === 'roadmap' ? 'active' : ''}`}
              onClick={() => setMapType('roadmap')}
              title="Standard Roadmap View"
            >
              Roadmap
            </button>
            <button
              className={`layer-btn ${mapType === 'satellite' ? 'active' : ''}`}
              onClick={() => setMapType('satellite')}
              title="Satellite Hybrid View"
            >
              Satellite
            </button>
            <button
              className={`layer-btn ${mapType === 'terrain' ? 'active' : ''}`}
              onClick={() => setMapType('terrain')}
              title="Terrain Topo View"
            >
              Terrain
            </button>
          </div>

          {/* External Google Maps Links */}
          <a
            href={googleDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary map-directions-btn"
          >
            <Navigation size={15} />
            <span>Get Directions</span>
            <ExternalLink size={13} style={{ marginLeft: 2 }} />
          </a>
        </div>
      </div>

      {/* Map DOM Canvas */}
      <div className="map-canvas" ref={mapRef} />

      {/* Floating Floating Controls (Zoom, Reset, Streetview, Fullscreen) */}
      <div className="map-floating-controls">
        <button className="map-ctrl-btn" onClick={handleResetCenter} title="Center on Property">
          <Crosshair size={18} />
        </button>
        <button className="map-ctrl-btn" onClick={handleZoomIn} title="Zoom In">
          <ZoomIn size={18} />
        </button>
        <button className="map-ctrl-btn" onClick={handleZoomOut} title="Zoom Out">
          <ZoomOut size={18} />
        </button>
        <a
          href={streetViewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="map-ctrl-btn"
          title="Open Street View in Google Maps"
        >
          <Eye size={18} />
        </a>
        <button className="map-ctrl-btn" onClick={toggleFullscreen} title="Toggle Fullscreen">
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>

      {/* Footer Address bar */}
      <div className="map-footer-bar">
        <MapPin size={15} color="var(--color-primary)" />
        <span className="map-footer-address">{property.address || `${property.locality}, ${property.city}`}</span>
        <span className="map-google-badge">Powered by Google Maps</span>
      </div>
    </div>
  )
}
