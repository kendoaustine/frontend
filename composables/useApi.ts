import type { ApiResponse, ApiError } from '~/types'

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: any
  headers?: Record<string, string>
  baseURL?: string
}

export const useApi = () => {
  const config = useRuntimeConfig()

  const apiCall = async <T = any>(
    endpoint: string,
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> => {
    const {
      method = 'GET',
      body,
      headers = {},
      baseURL
    } = options

    // Determine base URL based on endpoint
    let url = endpoint
    if (!baseURL) {
      if (endpoint.includes('/auth')) {
        url = `${config.public.authServiceUrl}${endpoint}`
      } else if (endpoint.includes('/orders')) {
        url = `${config.public.ordersServiceUrl}${endpoint}`
      } else if (endpoint.includes('/supplier')) {
        url = `${config.public.supplierServiceUrl}${endpoint}`
      }
    } else {
      url = `${baseURL}${endpoint}`
    }

    // Get auth token from storage
    const authToken = useCookie('auth-token')

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers
    }

    if (authToken.value) {
      requestHeaders.Authorization = `Bearer ${authToken.value}`
    }

    try {
      const response = await $fetch<ApiResponse<T>>(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        retry: 3,
        retryDelay: 1000,
        timeout: 10000
      })

      return response
    } catch (error: any) {
      // Handle different types of errors
      if (error.status === 401) {
        // Try to refresh token first
        try {
          const refreshTokenCookie = useCookie('refresh-token')
          if (refreshTokenCookie.value) {
            // Attempt token refresh
            const refreshResponse = await $fetch('/api/v1/auth/refresh', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken: refreshTokenCookie.value }),
              baseURL: config.public.authServiceUrl
            })

            if (refreshResponse.success) {
              // Update tokens and retry original request
              const tokenCookie = useCookie('auth-token')
              tokenCookie.value = refreshResponse.data.tokens.accessToken

              if (refreshResponse.data.tokens.refreshToken) {
                refreshTokenCookie.value = refreshResponse.data.tokens.refreshToken
              }

              // Retry original request with new token
              const retryHeaders = {
                ...requestHeaders,
                Authorization: `Bearer ${refreshResponse.data.tokens.accessToken}`
              }

              const retryResponse = await $fetch<ApiResponse<T>>(url, {
                method,
                headers: retryHeaders,
                body: body ? JSON.stringify(body) : undefined,
                retry: 0 // Don't retry again
              })

              return retryResponse
            }
          }
        } catch (refreshError) {
          console.warn('Token refresh failed:', refreshError)
        }

        // If refresh failed or no refresh token, clear auth and redirect
        await clearAuth()
        await navigateTo('/login')
      }

      const apiError: ApiError = {
        status: error.status || 500,
        message: error.data?.message || error.message || 'An error occurred',
        errors: error.data?.errors
      }

      throw apiError
    }
  }

  const clearAuth = async () => {
    const authToken = useCookie('auth-token')
    const userData = useCookie('user-data')

    authToken.value = null
    userData.value = null
  }

  return {
    apiCall,
    clearAuth
  }
}