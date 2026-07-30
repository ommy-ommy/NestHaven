import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

const mockUsers = {
  seller: {
    id: 's1',
    name: 'Arjun Mehta',
    email: 'arjun@nesthaven.com',
    phone: '+91 98765 43210',
    role: 'seller',
    avatar: null,
    company: 'Mehta Properties',
    experience: '8 years',
    rating: 4.8,
    totalListings: 24,
    totalSold: 18,
    verified: true,
    joinedDate: '2023-03-15',
  },
  buyer: {
    id: 'b1',
    name: 'Priya Sharma',
    email: 'priya@gmail.com',
    phone: '+91 99887 65432',
    role: 'buyer',
    avatar: null,
    propertiesVisited: 12,
    propertiesOwned: 2,
    favoriteCount: 8,
    meetingsScheduled: 5,
    verified: true,
    joinedDate: '2024-01-10',
    creditCards: [
      { last4: '4242', brand: 'Visa', expiry: '12/27' },
      { last4: '8888', brand: 'Mastercard', expiry: '06/28' },
    ],
  },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  // Fetch or sync DB profile for authenticated user
  const fetchProfile = async (authUser) => {
    if (!authUser) return null
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      const storedRole = localStorage.getItem('pending_role')
      let userRole = data?.role || authUser.user_metadata?.role || storedRole || 'buyer'

      // Update role if pending_role was saved during signup flow
      if (storedRole && storedRole !== data?.role) {
        await supabase
          .from('profiles')
          .upsert({ id: authUser.id, role: storedRole, email: authUser.email })
        localStorage.removeItem('pending_role')
      }

      const formattedUser = {
        id: authUser.id,
        name: data?.full_name || authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
        email: authUser.email,
        phone: data?.phone || authUser.user_metadata?.phone || '+91 98765 43210',
        role: userRole,
        avatar: data?.avatar_url || authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null,
        company: data?.company || authUser.user_metadata?.company || (userRole === 'seller' ? 'Independent Seller' : null),
        experience: data?.experience || '1-3 years',
        verified: data?.verified ?? true,
        propertiesVisited: data?.properties_visited || 12,
        propertiesOwned: data?.properties_owned || 1,
        favoriteCount: 8,
        meetingsScheduled: 3,
        creditCards: [
          { last4: '4242', brand: 'Visa', expiry: '12/27' },
          { last4: '8888', brand: 'Mastercard', expiry: '06/28' },
        ],
      }
      return formattedUser
    } catch (err) {
      console.error('Error fetching profile:', err)
      return {
        id: authUser.id,
        name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
        email: authUser.email,
        role: authUser.user_metadata?.role || localStorage.getItem('pending_role') || 'buyer',
      }
    }
  }

  useEffect(() => {
    // Check URL hash for OAuth redirect errors (e.g. provider not enabled)
    if (window.location.hash && window.location.hash.includes('error=')) {
      const params = new URLSearchParams(window.location.hash.substring(1))
      const desc = params.get('error_description') || params.get('error')
      if (desc) {
        setAuthError(desc.replace(/\+/g, ' '))
        // Clean URL hash without reloading page
        window.history.replaceState(null, '', window.location.pathname)
      }
    }

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      try {
        if (error) {
          setAuthError(error.message)
        }
        setSession(session)
        if (session?.user) {
          const profile = await fetchProfile(session.user)
          setUser(profile)
        }
      } catch (err) {
        console.error('getSession profile error:', err)
      } finally {
        setLoading(false)
      }
    }).catch(err => {
      console.error('getSession error:', err)
      setLoading(false)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        setSession(session)
        if (session?.user) {
          const profile = await fetchProfile(session.user)
          setUser(profile)
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error('onAuthStateChange profile error:', err)
      } finally {
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Manual Email & Password Sign Up
  const signUpWithEmail = async (email, password, userMetadata = {}) => {
    setAuthError(null)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: userMetadata,
      },
    })
    if (error) throw error

    // Create profile entry right away if user created
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: data.user.email,
        full_name: userMetadata.full_name || '',
        phone: userMetadata.phone || '',
        role: userMetadata.role || 'buyer',
        company: userMetadata.company || '',
      })
    }

    return data
  }

  // Manual Email & Password Sign In
  const signInWithEmail = async (email, password) => {
    setAuthError(null)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  // Official Google OAuth 2.0 Sign In with Google Account Selection Prompt
  const signInWithGoogle = async (role = 'buyer') => {
    setAuthError(null)
    localStorage.setItem('pending_role', role)

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          prompt: 'select_account', // Forces Google to open official Account Chooser screen showing all emails!
          access_type: 'offline',
        },
      },
    })

    if (error) throw error
    return data
  }

  // Update profile role
  const updateRole = async (newRole) => {
    if (user?.id) {
      await supabase.from('profiles').upsert({ id: user.id, role: newRole })
      setUser(prev => ({ ...prev, role: newRole }))
    }
  }

  // Demo mock login fallback
  const loginAs = (role) => {
    setAuthError(null)
    setUser(mockUsers[role])
  }

  const logout = async () => {
    setAuthError(null)
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('SignOut error:', err)
    }
    setUser(null)
    setSession(null)
    localStorage.removeItem('pending_role')
  }

  const clearAuthError = () => setAuthError(null)

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        loading,
        authError,
        clearAuthError,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
        loginWithGoogleAccount,
        updateRole,
        login: loginAs,
        logout,
        loginAs,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
