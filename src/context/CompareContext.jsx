import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { useProperties } from './PropertyContext'
import {
  getComparedIdsFromApi,
  saveComparedIdsToApi,
  clearComparedIdsFromApi,
} from '../api/compareApi'

const CompareContext = createContext(null)

export function CompareProvider({ children }) {
  const { user } = useAuth()
  const { properties } = useProperties()
  const [comparedIds, setComparedIds] = useState([])
  const [limitWarning, setLimitWarning] = useState(false)

  // Sync with localStorage & Supabase on mount or user change
  useEffect(() => {
    async function loadComparedList() {
      const ids = await getComparedIdsFromApi(user?.id)
      setComparedIds(ids)
    }
    loadComparedList()
  }, [user?.id])

  // Resolve full property objects for compared IDs
  const comparedProperties = comparedIds
    .map(id => properties.find(p => String(p.id) === String(id)))
    .filter(Boolean)

  const isInCompare = (propertyId) => {
    return comparedIds.some(id => String(id) === String(propertyId))
  }

  const addToCompare = async (propertyId) => {
    const stringId = String(propertyId)
    if (comparedIds.includes(stringId)) return true

    if (comparedIds.length >= 4) {
      setLimitWarning(true)
      setTimeout(() => setLimitWarning(false), 4000)
      return false
    }

    const updated = [...comparedIds, stringId]
    setComparedIds(updated)
    await saveComparedIdsToApi(updated, user?.id)
    return true
  }

  const removeFromCompare = async (propertyId) => {
    const stringId = String(propertyId)
    const updated = comparedIds.filter(id => id !== stringId)
    setComparedIds(updated)
    await saveComparedIdsToApi(updated, user?.id)
  }

  const toggleCompare = async (propertyId) => {
    const stringId = String(propertyId)
    if (isInCompare(stringId)) {
      await removeFromCompare(stringId)
    } else {
      await addToCompare(stringId)
    }
  }

  const clearCompare = async () => {
    setComparedIds([])
    await clearComparedIdsFromApi(user?.id)
  }

  return (
    <CompareContext.Provider
      value={{
        comparedIds,
        comparedProperties,
        comparedCount: comparedIds.length,
        isInCompare,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        clearCompare,
        limitWarning,
      }}
    >
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const context = useContext(CompareContext)
  if (!context) throw new Error('useCompare must be used within CompareProvider')
  return context
}
