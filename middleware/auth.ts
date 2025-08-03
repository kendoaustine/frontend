export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated, user, initAuth } = useAuth()

  console.log('🛡️ Auth middleware running for:', to.fullPath)
  console.log('🔍 Current auth state:', {
    isAuthenticated: isAuthenticated.value,
    user: user.value
  })

  // Try to initialize auth state if not already done
  if (!user.value) {
    console.log('🔄 Initializing auth state in middleware...')
    initAuth()
    console.log('🔍 Auth state after middleware init:', {
      isAuthenticated: isAuthenticated.value,
      user: user.value
    })
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated.value) {
    console.log('❌ User not authenticated, redirecting to login')
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }

  console.log('✅ User authenticated, allowing access')
})