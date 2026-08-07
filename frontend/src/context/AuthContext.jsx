import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef
} from 'react'

import {
  login as authLogin,
  logout as authLogout,
  getCurrentUser,
  isAuthenticated as checkAuth
} from '../services/AuthService'

const AuthContext = createContext(null)

const TOKEN_EXPIRY_CHECK_INTERVAL = 10000 // Check every 10 seconds

/**
 * Returns the default dashboard route based on the user's highest priority role.
 */
export const getDefaultRouteForUser = (user) => {
  if (!user?.roles?.length) {
    return '/login'
  }

  const rolePriority = {
    ROLE_SUPER_ADMIN: 1,
    ROLE_ADMIN: 2,
    ROLE_PRINCIPAL: 3,
    ROLE_SCHOOL_ADMIN: 4,
    ROLE_TEACHER: 5,
    ROLE_STUDENT: 6
  }

  const roleRoutes = {
    ROLE_SUPER_ADMIN: '/admin',
    ROLE_ADMIN: '/admin',
    ROLE_PRINCIPAL: '/principal',
    ROLE_SCHOOL_ADMIN: '/school',
    ROLE_TEACHER: '/teacher',
    ROLE_STUDENT: '/student'
  }

  const highestRole = [...user.roles].sort(
    (a, b) => (rolePriority[a] ?? 999) - (rolePriority[b] ?? 999)
  )[0]

  return roleRoutes[highestRole] ?? '/unauthorized'
}

/**
 * Checks whether the user has one or more required roles.
 */
export const hasRoleForUser = (user, roles) => {
  if (!user?.roles?.length) {
    return false
  }

  const requiredRoles = Array.isArray(roles) ? roles : [roles]

  return requiredRoles.some(role => user.roles.includes(role))
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sessionExpired, setSessionExpired] = useState(false)
  const expiryTimerRef = useRef(null)

  // Clear error when user changes
  useEffect(() => {
    if (user) setError(null)
  }, [user])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (expiryTimerRef.current) {
        clearInterval(expiryTimerRef.current)
      }
    }
  }, [])

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (checkAuth()) {
          const currentUser = await getCurrentUser()

          if (currentUser) {
            setUser(currentUser)
          } else {
            setUser(null)
            authLogout()
          }
        }
      } catch (err) {
        console.error('Authentication initialization failed:', err)
        setUser(null)
        authLogout()
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Token expiry background checker - runs every 10 seconds
  useEffect(() => {
    if (!user) {
      // Clear any existing timer if user is null
      if (expiryTimerRef.current) {
        clearInterval(expiryTimerRef.current)
        expiryTimerRef.current = null
      }
      return
    }

    // Start expiry checker
    expiryTimerRef.current = setInterval(async () => {
      try {
        // Check if token is expired using JWT decode
        const token = localStorage.getItem('token') || sessionStorage.getItem('session_token')
        if (!token) {
          handleExpiredSession()
          return
        }

        // Decode JWT to check exp claim
        try {
          const parts = token.split('.')
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
            if (payload.exp) {
              const expMs = payload.exp * 1000
              if (Date.now() >= expMs) {
                handleExpiredSession()
                return
              }
            }
          }
        } catch {
          // Can't decode, ignore
        }

        // Also verify by calling /auth/me (less frequently)
        // This is already covered by API interceptor
      } catch {
      }
    }, TOKEN_EXPIRY_CHECK_INTERVAL)

    return () => {
      if (expiryTimerRef.current) {
        clearInterval(expiryTimerRef.current)
        expiryTimerRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleExpiredSession = useCallback(() => {
    setUser(null)
    setSessionExpired(true)
    authLogout()
    window.location.href = '/login?expired=true'
  }, [])

  const login = useCallback(async (username, password, rememberMe = true) => {
    try {
      setLoading(true)
      setError(null)
      setSessionExpired(false)

      await authLogin({ username, password }, rememberMe)

      const currentUser = await getCurrentUser()

      setUser(currentUser)

      return currentUser
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Login failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      setLoading(true)
      authLogout()
    } catch (err) {
      console.error('Logout failed:', err)
    } finally {
      setUser(null)
      setError(null)
      setSessionExpired(false)
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const clearSessionExpired = useCallback(() => {
    setSessionExpired(false)
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      sessionExpired,
      login,
      logout,
      clearError,
      clearSessionExpired,
      isAuthenticated: !!user,
      getDefaultRoute: () => getDefaultRouteForUser(user),
      hasRole: (roles) => hasRoleForUser(user, roles)
    }),
    [user, loading, error, sessionExpired, login, logout, clearError, clearSessionExpired]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

export default AuthContext