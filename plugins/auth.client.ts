export default defineNuxtPlugin(() => {
  console.log('🔌 Auth plugin loading...')

  // Initialize auth state from cookies on client side
  const { initAuth, user, isAuthenticated } = useAuth()

  console.log('🔍 Auth state before init:', {
    user: user.value,
    isAuthenticated: isAuthenticated.value
  })

  // Initialize auth state when the plugin loads
  initAuth()

  console.log('🔍 Auth state after init:', {
    user: user.value,
    isAuthenticated: isAuthenticated.value
  })

  console.log('✅ Auth plugin loaded')
})
