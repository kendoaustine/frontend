<template>
  <div>
    <!-- Welcome Section -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">
        Welcome back, {{ user?.firstName }}!
      </h2>
      <p class="text-gray-600">
        Here's what's happening with your account today.
      </p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.name"
        class="bg-white overflow-hidden shadow rounded-lg"
      >
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <component :is="stat.icon" class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  {{ stat.name }}
                </dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">
                    {{ stat.value }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <NuxtLink :to="stat.href" class="font-medium text-blue-700 hover:text-blue-900">
              View all
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Orders Banner -->
    <div v-if="activeOrders.length > 0" class="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <svg class="h-8 w-8 text-blue-600 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 class="text-lg font-medium text-blue-900">
              {{ activeOrders.length }} Active Order{{ activeOrders.length > 1 ? 's' : '' }}
            </h3>
            <p class="text-sm text-blue-700">
              Track your orders and get real-time updates on delivery status.
            </p>
          </div>
        </div>
        <NuxtLink
          to="/orders"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          View All Orders
        </NuxtLink>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mb-8">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink
          v-for="action in quickActions"
          :key="action.name"
          :to="action.href"
          class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div>
            <span class="rounded-lg inline-flex p-3 ring-4 ring-white" :class="action.iconBackground">
              <component :is="action.icon" class="h-6 w-6 text-white" />
            </span>
          </div>
          <div class="mt-8">
            <h3 class="text-lg font-medium">
              <span class="absolute inset-0" aria-hidden="true"></span>
              {{ action.name }}
            </h3>
            <p class="mt-2 text-sm text-gray-500">
              {{ action.description }}
            </p>
          </div>
          <span class="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400">
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
            </svg>
          </span>
        </NuxtLink>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div v-if="recentActivity.length > 0" class="flow-root">
          <ul class="-mb-8">
            <li
              v-for="(activity, index) in recentActivity"
              :key="activity.id"
              class="relative pb-8"
            >
              <div v-if="index !== recentActivity.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></div>
              <div class="relative flex space-x-3">
                <div>
                  <span class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white" :class="activity.iconBackground">
                    <component :is="activity.icon" class="h-5 w-5 text-white" />
                  </span>
                </div>
                <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p class="text-sm text-gray-500">
                      {{ activity.content }}
                    </p>
                  </div>
                  <div class="text-right text-sm whitespace-nowrap text-gray-500">
                    <time :datetime="activity.datetime">{{ activity.date }}</time>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div v-else class="text-center py-6">
          <p class="text-gray-500">No recent activity</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { USER_ROLES } from '~/constants'

// Set page meta
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

// Set head
useHead({
  title: 'Dashboard - GasConnect',
  meta: [
    {
      name: 'description',
      content: 'Your GasConnect dashboard with orders, suppliers, and account overview.'
    }
  ]
})

// Composables
const { user, hasRole } = useAuth()
const { apiCall } = useApi()

// Reactive state for customer dashboard
const activeOrders = ref([])
const favoriteSuppliers = ref([])
const recentActivity = ref([])

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG').format(amount)
}

const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  }
  return statusMap[status] || status
}

const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return colorMap[status] || 'bg-gray-100 text-gray-800'
}

const getOrderProgress = (status: string): number => {
  const progressMap: Record<string, number> = {
    pending: 20,
    confirmed: 40,
    processing: 60,
    shipped: 80,
    delivered: 100
  }
  return progressMap[status] || 0
}

// Mock data - replace with real API calls
const stats = computed(() => {
  if (hasRole(USER_ROLES.SUPPLIER)) {
    return [
      {
        name: 'Total Orders',
        value: '24',
        icon: 'ShoppingCartIcon',
        href: '/orders'
      },
      {
        name: 'Revenue',
        value: '₦125,000',
        icon: 'CurrencyNairaIcon',
        href: '/analytics'
      },
      {
        name: 'Inventory Items',
        value: '12',
        icon: 'CubeIcon',
        href: '/inventory'
      },
      {
        name: 'Rating',
        value: '4.8',
        icon: 'StarIcon',
        href: '/profile'
      }
    ]
  } else {
    return [
      {
        name: 'Total Orders',
        value: '8',
        icon: 'ShoppingCartIcon',
        href: '/orders'
      },
      {
        name: 'Pending Orders',
        value: '2',
        icon: 'ClockIcon',
        href: '/orders?status=pending'
      },
      {
        name: 'Saved Addresses',
        value: '3',
        icon: 'MapPinIcon',
        href: '/addresses'
      },
      {
        name: 'Favorite Suppliers',
        value: '5',
        icon: 'HeartIcon',
        href: '/suppliers'
      }
    ]
  }
})

const quickActions = computed(() => {
  if (hasRole(USER_ROLES.SUPPLIER)) {
    return [
      {
        name: 'Add Inventory',
        description: 'Add new gas products to your inventory',
        href: '/inventory/new',
        icon: 'PlusIcon',
        iconBackground: 'bg-blue-500'
      },
      {
        name: 'View Orders',
        description: 'Check and manage incoming orders',
        href: '/orders',
        icon: 'ShoppingCartIcon',
        iconBackground: 'bg-green-500'
      },
      {
        name: 'Analytics',
        description: 'View sales and performance analytics',
        href: '/analytics',
        icon: 'ChartBarIcon',
        iconBackground: 'bg-purple-500'
      }
    ]
  } else {
    return [
      {
        name: 'Place Order',
        description: 'Order gas from verified suppliers',
        href: '/orders/new',
        icon: 'PlusIcon',
        iconBackground: 'bg-blue-500'
      },
      {
        name: 'Find Suppliers',
        description: 'Browse gas suppliers in your area',
        href: '/suppliers',
        icon: 'MagnifyingGlassIcon',
        iconBackground: 'bg-green-500'
      },
      {
        name: 'Track Orders',
        description: 'Track your current and past orders',
        href: '/orders',
        icon: 'TruckIcon',
        iconBackground: 'bg-yellow-500'
      }
    ]
  }
})

// Initialize recentActivity with mock data
recentActivity.value = [
  {
    id: 1,
    content: 'Order #1234 has been delivered',
    datetime: '2025-01-01T10:00:00Z',
    date: '2 hours ago',
    icon: 'CheckCircleIcon',
    iconBackground: 'bg-green-500'
  },
  {
    id: 2,
    content: 'New supplier "Lagos Gas Co." added to favorites',
    datetime: '2025-01-01T08:00:00Z',
    date: '4 hours ago',
    icon: 'HeartIcon',
    iconBackground: 'bg-red-500'
  },
  {
    id: 3,
    content: 'Order #1233 is out for delivery',
    datetime: '2024-12-31T16:00:00Z',
    date: '1 day ago',
    icon: 'TruckIcon',
    iconBackground: 'bg-blue-500'
  }
]

// Load dashboard data for customers
const loadCustomerDashboardData = async () => {
  if (!hasRole(USER_ROLES.CUSTOMER)) return

  try {
    // Load active orders, favorite suppliers, and recent activity in parallel
    const [ordersResponse, suppliersResponse] = await Promise.all([
      apiCall('/api/v1/orders?status=pending,confirmed,processing,shipped&limit=5'),
      apiCall('/api/v1/users/favorites/suppliers?limit=3')
    ])

    if (ordersResponse.success) {
      activeOrders.value = ordersResponse.data.orders || []
    }

    if (suppliersResponse.success) {
      favoriteSuppliers.value = suppliersResponse.data || []
    }
  } catch (error: any) {
    console.error('Error loading customer dashboard data:', error)

    // Fallback to mock data for development
    if (!hasRole(USER_ROLES.SUPPLIER)) {
      activeOrders.value = [
        {
          id: 'order1',
          orderNumber: 'GC-2024-001',
          status: 'processing',
          totalAmount: 18500,
          supplier: {
            id: 'supplier1',
            businessName: 'Lagos Gas Co.',
            rating: 4.8
          }
        },
        {
          id: 'order2',
          orderNumber: 'GC-2024-002',
          status: 'shipped',
          totalAmount: 12000,
          supplier: {
            id: 'supplier2',
            businessName: 'Abuja Gas Supply',
            rating: 4.5
          }
        }
      ]

      favoriteSuppliers.value = [
        {
          id: 'supplier1',
          businessName: 'Lagos Gas Co.',
          rating: 4.8,
          totalOrders: 150
        },
        {
          id: 'supplier2',
          businessName: 'Abuja Gas Supply',
          rating: 4.5,
          totalOrders: 89
        }
      ]
    }
  }
}

// Initialize auth and load data on mount
onMounted(async () => {
  const { initAuth } = useAuth()
  initAuth()

  // Load customer-specific data
  await loadCustomerDashboardData()
})
</script>