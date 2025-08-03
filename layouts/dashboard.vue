<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" class="fixed inset-0 flex z-40 md:hidden">
      <div class="fixed inset-0 bg-gray-600 bg-opacity-75" @click="mobileMenuOpen = false"></div>
      <div class="relative flex-1 flex flex-col max-w-xs w-full bg-white">
        <div class="absolute top-0 right-0 -mr-12 pt-2">
          <button
            type="button"
            class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            @click="mobileMenuOpen = false"
          >
            <span class="sr-only">Close sidebar</span>
            <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
          <div class="flex-shrink-0 flex items-center px-4">
            <h1 class="text-xl font-bold text-blue-600">GasConnect</h1>
          </div>
          <nav class="mt-5 px-2 space-y-1">
            <NuxtLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
              :class="[
                $route.path === item.href
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <component :is="item.icon" class="mr-4 h-6 w-6" />
              {{ item.name }}
            </NuxtLink>
          </nav>
        </div>
      </div>
    </div>

    <!-- Static sidebar for desktop -->
    <div class="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div class="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
        <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div class="flex items-center flex-shrink-0 px-4">
            <h1 class="text-xl font-bold text-blue-600">GasConnect</h1>
          </div>
          <nav class="mt-5 flex-1 px-2 bg-white space-y-1">
            <NuxtLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
              :class="[
                $route.path === item.href
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <component :is="item.icon" class="mr-3 h-6 w-6" />
              {{ item.name }}
            </NuxtLink>
          </nav>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="md:pl-64 flex flex-col flex-1">
      <!-- Top navigation -->
      <div class="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-200">
        <button
          type="button"
          class="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          @click="mobileMenuOpen = true"
        >
          <span class="sr-only">Open sidebar</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Header -->
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <h1 class="text-3xl font-bold text-gray-900">
              {{ pageTitle }}
            </h1>

            <!-- User menu -->
            <div class="relative">
              <button
                type="button"
                class="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                @click="userMenuOpen = !userMenuOpen"
              >
                <span class="sr-only">Open user menu</span>
                <div class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span class="text-sm font-medium text-gray-700">
                    {{ user?.firstName?.charAt(0) }}{{ user?.lastName?.charAt(0) }}
                  </span>
                </div>
              </button>

              <!-- User dropdown -->
              <div
                v-if="userMenuOpen"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                @click.away="userMenuOpen = false"
              >
                <NuxtLink
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Your Profile
                </NuxtLink>
                <NuxtLink
                  to="/settings"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </NuxtLink>
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main content area -->
      <main class="flex-1">
        <div class="py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <slot />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { USER_ROLES } from '~/constants'

// Reactive state
const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)

// Composables
const { user, logout } = useAuth()
const { hasRole, isAdmin, isSupplier, isCustomer, isDriver, currentRoleDisplayName } = useRoles()
const route = useRoute()

// Page title based on current route
const pageTitle = computed(() => {
  const routeName = route.name as string
  const titles: Record<string, string> = {
    'dashboard': 'Dashboard',
    'orders': 'Orders',
    'orders-new': 'New Order',
    'orders-id': 'Order Details',
    'suppliers': 'Suppliers',
    'suppliers-id': 'Supplier Details',
    'inventory': 'Inventory',
    'analytics': 'Analytics',
    'profile': 'Profile',
    'settings': 'Settings',
    'addresses': 'Addresses'
  }
  return titles[routeName] || 'Dashboard'
})

// Navigation items based on user role
const navigation = computed(() => {
  const baseNavigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: 'HomeIcon'
    }
  ]

  // Customer navigation
  if (isCustomer.value) {
    return [
      ...baseNavigation,
      {
        name: 'Orders',
        href: '/orders',
        icon: 'ShoppingCartIcon'
      },
      {
        name: 'Suppliers',
        href: '/suppliers',
        icon: 'BuildingStorefrontIcon'
      },
      {
        name: 'Addresses',
        href: '/addresses',
        icon: 'MapPinIcon'
      }
    ]
  }

  // Supplier navigation
  if (isSupplier.value) {
    return [
      ...baseNavigation,
      {
        name: 'Orders',
        href: '/orders',
        icon: 'ShoppingCartIcon'
      },
      {
        name: 'Inventory',
        href: '/inventory',
        icon: 'CubeIcon'
      },
      {
        name: 'Analytics',
        href: '/analytics',
        icon: 'ChartBarIcon'
      }
    ]
  }

  // Delivery driver navigation
  if (isDriver.value) {
    return [
      ...baseNavigation,
      {
        name: 'Deliveries',
        href: '/deliveries',
        icon: 'TruckIcon'
      },
      {
        name: 'Routes',
        href: '/routes',
        icon: 'MapIcon'
      }
    ]
  }

  // Platform admin navigation
  if (isAdmin.value) {
    return [
      ...baseNavigation,
      {
        name: 'Users',
        href: '/admin/users',
        icon: 'UsersIcon'
      },
      {
        name: 'Suppliers',
        href: '/admin/suppliers',
        icon: 'BuildingStorefrontIcon'
      },
      {
        name: 'Orders',
        href: '/admin/orders',
        icon: 'ShoppingCartIcon'
      },
      {
        name: 'Analytics',
        href: '/admin/analytics',
        icon: 'ChartBarIcon'
      },
      {
        name: 'Settings',
        href: '/admin/settings',
        icon: 'CogIcon'
      }
    ]
  }

  return baseNavigation
})

// Handle logout
const handleLogout = async () => {
  try {
    await logout()
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Close user menu when clicking outside
const closeUserMenu = () => {
  userMenuOpen.value = false
}

// Watch for route changes to close mobile menu
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})

// Initialize auth on mount
onMounted(() => {
  const { initAuth } = useAuth()
  initAuth()
})
</script>