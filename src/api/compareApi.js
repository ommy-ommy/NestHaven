/**
 * Compare API Module
 * Syncs compared property IDs to localStorage (for guests) & Supabase (for authenticated users)
 */
import { supabase } from '../lib/supabase'

const STORAGE_KEY = 'nesthaven_compare_list'

/**
 * Fetch compared property IDs from localStorage or Supabase
 */
export async function getComparedIdsFromApi(userId = null) {
  try {
    // Check localStorage first
    const localData = localStorage.getItem(STORAGE_KEY)
    let localIds = localData ? JSON.parse(localData) : []

    if (!userId) {
      return localIds
    }

    // If logged in, fetch user's saved comparisons from Supabase
    const { data, error } = await supabase
      .from('user_comparisons')
      .select('property_ids')
      .eq('user_id', userId)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.warn('Supabase compare fetch warning:', error.message)
    }

    if (data && Array.isArray(data.property_ids)) {
      // Merge local & DB comparison IDs (up to max 4)
      const merged = Array.from(new Set([...localIds, ...data.property_ids])).slice(0, 4)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
      return merged
    }

    return localIds
  } catch (err) {
    console.error('Error fetching compared properties:', err)
    const fallback = localStorage.getItem(STORAGE_KEY)
    return fallback ? JSON.parse(fallback) : []
  }
}

/**
 * Save updated compared property IDs to localStorage & Supabase
 */
export async function saveComparedIdsToApi(ids = [], userId = null) {
  try {
    const limitedIds = ids.slice(0, 4)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedIds))

    if (userId) {
      const { error } = await supabase
        .from('user_comparisons')
        .upsert(
          {
            user_id: userId,
            property_ids: limitedIds,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        )

      if (error) {
        console.warn('Supabase compare upsert warning:', error.message)
      }
    }

    return limitedIds
  } catch (err) {
    console.error('Error saving compared properties:', err)
    return ids
  }
}

/**
 * Clear comparison list
 */
export async function clearComparedIdsFromApi(userId = null) {
  try {
    localStorage.removeItem(STORAGE_KEY)

    if (userId) {
      await supabase
        .from('user_comparisons')
        .delete()
        .eq('user_id', userId)
    }
  } catch (err) {
    console.error('Error clearing compared properties:', err)
  }
}
