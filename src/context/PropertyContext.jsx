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
      type: 'all',
      priceRange: [0, 50000000],
      bhk: 'all',
      city: 'all',
      furnished: 'all',
      listingType: 'buy',
      sortBy: 'newest',
    })
  }

  const getFilteredProperties = () => {
    let result = [...properties]

    if (filters.listingType !== 'all') {
      result = result.filter(p => p.listingType === filters.listingType)
    }
    if (filters.type !== 'all') {
      result = result.filter(p => p.type === filters.type)
    }
    if (filters.bhk !== 'all') {
      result = result.filter(p => p.bhk === parseInt(filters.bhk))
    }
    if (filters.city !== 'all') {
      result = result.filter(p => p.city === filters.city)
    }
    if (filters.furnished !== 'all') {
      result = result.filter(p => p.furnished === filters.furnished)
    }
    result = result.filter(
      p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    )

    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        result.sort((a, b) => b.views - a.views)
        break
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.listedDate) - new Date(a.listedDate))
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
