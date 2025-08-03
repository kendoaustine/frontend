import type { User, LoginCredentials, RegisterData, AuthResponse } from '~/types'

export const useAuth = () => {
  const { apiCall, clearAuth } = useApi()

  // Reactive state
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  const isLoading = ref(false)

  // Initialize auth state from cookies
  const initAuth = () => {
    console.log('🔄 initAuth called')
    const userData = useCookie<User>('user-data')
    const authToken = useCookie('auth-token')

    console.log('🍪 Cookie values:', {
      userData: userData.value,
      authToken: authToken.value ? 'present' : 'missing'
    })

    if (userData.value && authToken.value) {
      user.value = userData.value
      console.log('✅ Auth state restored from cookies:', user.value)
    } else {
      console.log('❌ No valid auth data in cookies')
    }
  }

  // Login function
  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true

    try {
      // Direct API call to handle backend's actual response format
      const config = useRuntimeConfig()
      const response = await $fetch(`${config.public.authServiceUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })

      // Backend returns: { message, user, tokens }
      if (response.user && response.tokens) {
        const { user: userData, tokens } = response

        // Store user data and tokens
        user.value = userData
        const userCookie = useCookie<User>('user-data', {
          default: () => userData,
          maxAge: 60 * 60 * 24 * 7 // 7 days
        })
        const tokenCookie = useCookie('auth-token', {
          default: () => tokens.accessToken,
          maxAge: tokens.expiresIn || 3600 // Use actual expiration
        })
        const refreshTokenCookie = useCookie('refresh-token', {
          default: () => tokens.refreshToken,
          maxAge: 60 * 60 * 24 * 30 // 30 days for refresh token
        })

        userCookie.value = userData
        tokenCookie.value = tokens.accessToken
        refreshTokenCookie.value = tokens.refreshToken

        return { success: true, user: userData }
      }

      throw new Error(response.message || 'Login failed')
    } catch (error: any) {
      console.error('Login error:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Register function
  const register = async (data: RegisterData) => {
    isLoading.value = true

    try {
      // Direct API call to handle backend's actual response format
      const config = useRuntimeConfig()
      const response = await $fetch(`${config.public.authServiceUrl}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      // Backend returns: { message, user, tokens }
      if (response.user && response.tokens) {
        const { user: userData, tokens } = response

        // Store user data and tokens
        user.value = userData
        const userCookie = useCookie<User>('user-data', {
          default: () => userData,
          maxAge: 60 * 60 * 24 * 7 // 7 days
        })
        const tokenCookie = useCookie('auth-token', {
          default: () => tokens.accessToken,
          maxAge: tokens.expiresIn || 3600 // Use actual expiration
        })
        const refreshTokenCookie = useCookie('refresh-token', {
          default: () => tokens.refreshToken,
          maxAge: 60 * 60 * 24 * 30 // 30 days for refresh token
        })

        userCookie.value = userData
        tokenCookie.value = tokens.accessToken
        refreshTokenCookie.value = tokens.refreshToken

        return { success: true, user: userData }
      }

      throw new Error(response.message || 'Registration failed')
    } catch (error: any) {
      console.error('Registration error:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Logout function
  const logout = async () => {
    try {
      // Call logout endpoint if available
      await apiCall('/api/v1/auth/logout', {
        method: 'POST'
      })
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error)
    } finally {
      // Clear local state
      user.value = null
      await clearAuth()
      await navigateTo('/login')
    }
  }

  // Get current user profile
  const getCurrentUser = async () => {
    try {
      const response = await apiCall<User>('/api/v1/auth/me')

      if (response.success && response.data) {
        user.value = response.data
        const userCookie = useCookie<User>('user-data')
        userCookie.value = response.data
        return response.data
      }

      throw new Error('Failed to get user data')
    } catch (error) {
      // If getting user fails, clear auth
      await logout()
      throw error
    }
  }

  // Check if user has specific role
  const hasRole = (role: string) => {
    return user.value?.role === role
  }

  // Check if user has any of the specified roles
  const hasAnyRole = (roles: string[]) => {
    return user.value ? roles.includes(user.value.role) : false
  }

  // Refresh access token
  const refreshToken = async () => {
    try {
      const refreshTokenCookie = useCookie('refresh-token')

      if (!refreshTokenCookie.value) {
        throw new Error('No refresh token available')
      }

      const response = await apiCall<{ tokens: AuthResponse['tokens'] }>('/api/v1/auth/refresh', {
        method: 'POST',
        body: { refreshToken: refreshTokenCookie.value }
      })

      if (response.success && response.data) {
        const { tokens } = response.data

        // Update stored tokens
        const tokenCookie = useCookie('auth-token')
        const newRefreshTokenCookie = useCookie('refresh-token')

        tokenCookie.value = tokens.accessToken
        if (tokens.refreshToken) {
          newRefreshTokenCookie.value = tokens.refreshToken
        }

        return { success: true }
      }

      throw new Error(response.message || 'Token refresh failed')
    } catch (error: any) {
      // If refresh fails, logout user
      await logout()
      throw error
    }
  }

  return {
    // State
    user: readonly(user),
    isAuthenticated,
    isLoading: readonly(isLoading),

    // Methods
    initAuth,
    login,
    register,
    logout,
    getCurrentUser,
    hasRole,
    hasAnyRole,
    refreshToken
  }
}