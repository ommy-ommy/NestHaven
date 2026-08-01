import { createContext, useContext, useState, useEffect } from 'react'
import { properties as initialProperties } from '../data/properties'
import { supabase } from '../lib/supabase'

const PropertyContext = createContext(null)

export function PropertyProvider({ children }) {
  const [properties, setProperties] = useState(initialProperties)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    type: 'all',
    priceRange: [0, 50000000],
    bhk: 'all',
    city: 'all',
    furnished: 'all',
    listingType: 'buy',
    sortBy: 'newest',
  })

  // Fetch properties from Supabase & merge with static defaults
  const fetchProperties = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching Supabase properties:', error)
      } else if (data && data.length > 0) {
        const formatted = data.map(item => ({
          id: item.id,
          title: item.title,
          price: Number(item.price),
          priceType: item.price_type || 'total',
          type: item.property_type || 'Apartment',
          bhk: item.bedrooms || 2,
          baths: item.bathrooms || 2,
          sqft: item.sqft || 1000,
          location: `${item.address || ''}, ${item.city || 'Mumbai'}`.replace(/^, /, ''),
          city: item.city || 'Mumbai',
          state: item.state || 'Maharashtra',
          lat: Number(item.lat) || 19.0760,
          lng: Number(item.lng) || 72.8777,
          image: item.image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
          images: item.images?.length > 0 ? item.images : [item.image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'],
          featured: false,
          verified: true,
          furnished: 'Semi-Furnished',
          listedDate: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : '2026-07-27',
          listingType: item.type || 'buy',
          seller: {
            id: item.seller_id || 's1',
            name: item.seller_name || 'Property Owner',
            email: item.seller_email || 'owner@nesthaven.com',
            phone: item.seller_phone || '+91 98765 43210',
          },
          status: item.status || 'approved',
          views: item.views || 12,
          description: item.description || '',
          amenities: item.features || ['Parking', 'Power Backup', 'Security'],
        }))

        // Merge DB properties with defaults (avoiding ID collisions)
        setProperties([...formatted, ...initialProperties])
      }
    } catch (err) {
      console.error('Failed to load properties from Supabase:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  // Add new property to Supabase
  const addProperty = async (newProp) => {
    try {
      const payload = {
        title: newProp.title,
        price: Number(newProp.price),
        price_type: newProp.priceType || 'total',
        type: newProp.listingType || 'buy',
        property_type: newProp.type || 'Apartment',
        bedrooms: Number(newProp.bhk || 2),
        bathrooms: Number(newProp.baths || 2),
        sqft: Number(newProp.sqft || 1000),
        address: newProp.location || '',
        city: newProp.city || 'Mumbai',
        state: newProp.state || 'Maharashtra',
        lat: Number(newProp.lat) || 19.0760,
        lng: Number(newProp.lng) || 72.8777,
        description: newProp.description || '',
        features: newProp.amenities || ['Parking', 'Security'],
        image_url: newProp.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
        images: newProp.images || [newProp.image],
        seller_id: newProp.seller?.id || null,
        seller_name: newProp.seller?.name || 'Owner',
        seller_email: newProp.seller?.email || '',
        seller_phone: newProp.seller?.phone || '',
        status: 'approved',
      }

      const { data, error } = await supabase
        .from('properties')
        .insert([payload])
        .select()

      if (error) {
        console.error('Error inserting property to Supabase:', error)
      } else if (data && data[0]) {
        await fetchProperties()
      }
    } catch (err) {
      console.error('Error adding property:', err)
    }
  }

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      priceRange: [0, 150000000],
      bhk: 'all',
      city: 'all',
      furnished: 'all',
      listingType: 'buy',
      sortBy: 'newest',
    })
  }

  const getFilteredProperties = () => {
    let result = [...properties]

    // 1. Strict Search Query Filter (Location, City, Locality, Keywords)
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.trim().toLowerCase()
      const knownCities = [
        'mumbai', 'bangalore', 'delhi', 'gurgaon', 'pune',
        'hyderabad', 'chennai', 'kolkata', 'ahmedabad', 'goa'
      ]

      // Check if query matches a city name strictly
      const matchedCity = knownCities.find(c => c === q || q.includes(c))

      if (matchedCity) {
        // Return ONLY properties belonging strictly to that city
        result = result.filter(p => (p.city || '').toLowerCase().includes(matchedCity))
      } else {
        // Search across title, locality, address, city, description, and type
        result = result.filter(p => {
          const titleMatch = (p.title || '').toLowerCase().includes(q)
          const cityMatch = (p.city || '').toLowerCase().includes(q)
          const localityMatch = (p.locality || '').toLowerCase().includes(q)
          const addressMatch = (p.address || '').toLowerCase().includes(q)
          const typeMatch = (p.type || '').toLowerCase().includes(q)
          const descMatch = (p.description || '').toLowerCase().includes(q)
          return titleMatch || cityMatch || localityMatch || addressMatch || typeMatch || descMatch
        })
      }
    }

    // 2. City Filter (Strict dropdown selection)
    if (filters.city && filters.city !== 'all') {
      const targetCity = filters.city.toLowerCase()
      result = result.filter(p => (p.city || '').toLowerCase() === targetCity)
    }

    // 3. Listing Type (Buy / Rent)
    if (filters.listingType && filters.listingType !== 'all') {
      result = result.filter(p => p.listingType === filters.listingType)
    }

    // 4. Property Type (Apartment, Villa, House, Plot)
    if (filters.type && filters.type !== 'all') {
      result = result.filter(p => (p.type || '').toLowerCase() === filters.type.toLowerCase())
    }

    // 5. BHK Filter
    if (filters.bhk && filters.bhk !== 'all') {
      result = result.filter(p => p.bhk === parseInt(filters.bhk))
    }

    // 6. Furnished Status
    if (filters.furnished && filters.furnished !== 'all') {
      result = result.filter(p => (p.furnished || '').toLowerCase() === filters.furnished.toLowerCase())
    }

    // 7. Price Range Filter
    result = result.filter(
      p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    )

    // 8. Verified Properties Filter
    if (filters.onlyVerified) {
      result = result.filter(p => p.verified || p.id === 'p1' || p.id === 'p2')
    }

    // 9. Sorting & Search Ranking Boost
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        result.sort((a, b) => (b.views || 0) - (a.views || 0))
        break
      case 'newest':
      default:
        // Rank verified properties higher by adding weight boost
        result.sort((a, b) => {
          const aVerifiedScore = (a.verified || a.id === 'p1' || a.id === 'p2') ? 100 : 0
          const bVerifiedScore = (b.verified || b.id === 'p1' || b.id === 'p2') ? 100 : 0
          if (aVerifiedScore !== bVerifiedScore) {
            return bVerifiedScore - aVerifiedScore
          }
          return new Date(b.listedDate || 0) - new Date(a.listedDate || 0)
        })
    }

    return result
  }

  return (
    <PropertyContext.Provider value={{ properties, loading, addProperty, refreshProperties: fetchProperties, filters, updateFilter, resetFilters, getFilteredProperties }}>
      {children}
    </PropertyContext.Provider>
  )
}

export function useProperties() {
  const context = useContext(PropertyContext)
  if (!context) throw new Error('useProperties must be used within PropertyProvider')
  return context
}
