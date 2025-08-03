import type { UserRole } from '~/types'
import { USER_ROLES } from '~/constants'

export const useRoles = () => {
  const { user } = useAuth()

  // Role hierarchy for permission checking
  const roleHierarchy: Record<UserRole, number> = {
    platform_admin: 5,
    supplier: 4,
    delivery_driver: 3,
    hospital: 2,
    artisan: 2,
    household: 1
  }

  // Check if user has specific role
  const hasRole = (role: UserRole): boolean => {
    return user.value?.role === role
  }

  // Check if user has any of the specified roles
  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user.value ? roles.includes(user.value.role) : false
  }

  // Check if user has role with minimum level
  const hasMinimumRole = (minimumRole: UserRole): boolean => {
    if (!user.value?.role) return false

    const userLevel = roleHierarchy[user.value.role] || 0
    const requiredLevel = roleHierarchy[minimumRole] || 0

    return userLevel >= requiredLevel
  }

  // Get user's role level
  const getUserRoleLevel = (): number => {
    return user.value?.role ? roleHierarchy[user.value.role] || 0 : 0
  }

  // Check if user is admin
  const isAdmin = computed(() => hasRole(USER_ROLES.PLATFORM_ADMIN))

  // Check if user is supplier
  const isSupplier = computed(() => hasRole(USER_ROLES.SUPPLIER))

  // Check if user is customer (household, hospital, artisan)
  const isCustomer = computed(() =>
    hasAnyRole([USER_ROLES.HOUSEHOLD, USER_ROLES.HOSPITAL, USER_ROLES.ARTISAN])
  )

  // Check if user is delivery driver
  const isDriver = computed(() => hasRole(USER_ROLES.DELIVERY_DRIVER))

  // Get role display name
  const getRoleDisplayName = (role?: UserRole): string => {
    const roleNames: Record<UserRole, string> = {
      household: 'Household Customer',
      hospital: 'Hospital/Medical Facility',
      artisan: 'Artisan/Workshop',
      supplier: 'Gas Supplier',
      delivery_driver: 'Delivery Driver',
      platform_admin: 'Platform Administrator'
    }

    return role ? roleNames[role] || role : 'Unknown'
  }

  // Get current user's role display name
  const currentRoleDisplayName = computed(() =>
    getRoleDisplayName(user.value?.role)
  )

  // Get allowed routes for current user role
  const getAllowedRoutes = (): string[] => {
    if (!user.value?.role) return ['/login', '/register', '/']

    const commonRoutes = ['/dashboard', '/profile', '/settings']

    switch (user.value.role) {
      case USER_ROLES.HOUSEHOLD:
      case USER_ROLES.HOSPITAL:
      case USER_ROLES.ARTISAN:
        return [
          ...commonRoutes,
          '/orders',
          '/orders/new',
          '/suppliers',
          '/addresses'
        ]

      case USER_ROLES.SUPPLIER:
        return [
          ...commonRoutes,
          '/orders',
          '/inventory',
          '/analytics',
          '/pricing'
        ]

      case USER_ROLES.DELIVERY_DRIVER:
        return [
          ...commonRoutes,
          '/deliveries',
          '/routes',
          '/orders'
        ]

      case USER_ROLES.PLATFORM_ADMIN:
        return [
          ...commonRoutes,
          '/admin/users',
          '/admin/suppliers',
          '/admin/orders',
          '/admin/analytics',
          '/admin/settings',
          '/orders',
          '/suppliers',
          '/inventory'
        ]

      default:
        return commonRoutes
    }
  }

  // Check if route is allowed for current user
  const isRouteAllowed = (route: string): boolean => {
    const allowedRoutes = getAllowedRoutes()
    return allowedRoutes.some(allowedRoute =>
      route.startsWith(allowedRoute) || route === allowedRoute
    )
  }

  // Get dashboard redirect path based on role
  const getDashboardPath = (): string => {
    if (!user.value?.role) return '/login'

    switch (user.value.role) {
      case USER_ROLES.PLATFORM_ADMIN:
        return '/admin/dashboard'
      case USER_ROLES.SUPPLIER:
        return '/supplier/dashboard'
      case USER_ROLES.DELIVERY_DRIVER:
        return '/driver/dashboard'
      default:
        return '/dashboard'
    }
  }

  return {
    // Role checking functions
    hasRole,
    hasAnyRole,
    hasMinimumRole,
    getUserRoleLevel,

    // Computed role states
    isAdmin,
    isSupplier,
    isCustomer,
    isDriver,

    // Display functions
    getRoleDisplayName,
    currentRoleDisplayName,

    // Route management
    getAllowedRoutes,
    isRouteAllowed,
    getDashboardPath
  }
}