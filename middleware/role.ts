import type { UserRole } from '~/types'

export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()
  const { isRouteAllowed, hasAnyRole } = useRoles()

  // First check if user is authenticated
  if (!isAuthenticated.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }

  // Check if the route is allowed for the user's role
  if (!isRouteAllowed(to.path)) {
    // Redirect to appropriate dashboard based on role
    const { getDashboardPath } = useRoles()
    return navigateTo(getDashboardPath())
  }

  // Additional role-specific checks
  const routeRoleRequirements: Record<string, UserRole[]> = {
    '/admin': ['platform_admin'],
    '/supplier': ['supplier'],
    '/driver': ['delivery_driver'],
    '/inventory': ['supplier', 'platform_admin'],
    '/analytics': ['supplier', 'platform_admin'],
    '/deliveries': ['delivery_driver', 'platform_admin']
  }

  // Check specific route requirements
  for (const [routePrefix, requiredRoles] of Object.entries(routeRoleRequirements)) {
    if (to.path.startsWith(routePrefix)) {
      if (!hasAnyRole(requiredRoles)) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Access Denied - Insufficient Permissions'
        })
      }
    }
  }
})