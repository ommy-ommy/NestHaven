import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const FavoriteContext = createContext(null)

export function FavoriteProvider({ children }) {
  const [favorites, setFavorites] = useState(new Set(['p2', 'p5', 'p8']))
  const { user } = useAuth()

  // Fetch favorites from Supabase when user logs in
  useEffect(() => {
    if (user?.id) {
      supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', user.id)
        .then(({ data, error }) => {
          if (!error && data) {
            const favIds = data.map(item => item.property_id)
            setFavorites(new Set(favIds))
          }
        })
    }
  }, [user])

  const toggleFavorite = async (propertyId) => {
    const isFav = favorites.has(propertyId)
    
    // Update local state immediately for instant feedback
    setFavorites(prev => {
      const next = new Set(prev)
      if (isFav) {
        next.delete(propertyId)
      } else {
        next.add(propertyId)
      }
      return next
    })

    // Sync to Supabase if authenticated
    if (user?.id) {
      try {
        if (isFav) {
          await supabase
            .from('favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('property_id', String(propertyId))
        } else {
          await supabase
            .from('favorites')
            .upsert({ user_id: user.id, property_id: String(propertyId) })
        }
      } catch (err) {
        console.error('Error syncing favorite to Supabase:', err)
      }
    }
  }

  const isFavorite = (propertyId) => favorites.has(propertyId)

  const favoritesCount = favorites.size

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorite, favoritesCount }}>
      {children}
    </FavoriteContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoriteContext)
  if (!context) throw new Error('useFavorites must be used within FavoriteProvider')
  return context
}
