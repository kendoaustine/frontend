<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Supplier Dashboard</h1>
      <p class="mt-2 text-sm text-gray-700">
        Manage your business, inventory, and orders.
      </p>
    </div>

    <!-- Verification Status Banner -->
    <div v-if="!isVerified" class="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-yellow-800">
            Account Verification Required
          </h3>
          <div class="mt-2 text-sm text-yellow-700">
            <p>
              Your supplier account is pending verification. Please complete your business profile and upload required documents.
            </p>
          </div>
          <div class="mt-4">
            <div class="-mx-2 -my-1.5 flex">
              <button
                @click="navigateTo('/supplier/onboarding')"
                class="bg-yellow-50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
              >
                Complete Verification
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Real-time Analytics Dashboard -->
    <div v-if="isVerified" class="mb-8">
      <RealTimeDashboard />
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total Orders
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.totalOrders }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Revenue (This Month)
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  ₦{{ formatCurrency(stats.monthlyRevenue) }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Active Products
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.activeProducts }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Customer Rating
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.rating }}/5.0
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Set page meta
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role']
})

// Set head
useHead({
  title: 'Supplier Dashboard - GasConnect',
  meta: [
    {
      name: 'description',
      content: 'Manage your supplier business on GasConnect platform.'
    }
  ]
})

// Composables
const { user } = useAuth()
const { isSupplier } = useRoles()
const { apiCall } = useApi()

// Redirect if not supplier
if (!isSupplier.value) {
  throw createError({
    statusCode: 403,
    statusMessage: 'Access denied - Supplier role required'
  })
}

// Reactive data
const isVerified = ref(false)
const stats = reactive({
  totalOrders: 0,
  monthlyRevenue: 0,
  activeProducts: 0,
  rating: 0
})

const recentOrders = ref([])

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG').format(amount)
}

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusClass = (status: string): string => {
  const statusClasses = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'
}

// Load dashboard data
const loadDashboardData = async () => {
  try {
    // Real API calls using correct backend endpoints
    const [analyticsResponse, ordersResponse] = await Promise.all([
      apiCall('/api/v1/analytics/overview'),
      apiCall('/api/v1/orders?limit=5&status=pending,confirmed,processing,shipped')
    ])

    if (analyticsResponse.success) {
      const analytics = analyticsResponse.data
      Object.assign(stats, {
        totalOrders: analytics.totalOrders || 0,
        monthlyRevenue: analytics.monthlyRevenue || 0,
        activeProducts: analytics.activeProducts || 0,
        rating: analytics.averageRating || 0
      })
    }

    if (ordersResponse.success) {
      recentOrders.value = (ordersResponse.data.orders || []).map(order => ({
        id: order.orderNumber || order.id,
        customerName: order.user?.firstName + ' ' + order.user?.lastName || 'Unknown Customer',
        amount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt
      }))
    }

    // Mock stats
    Object.assign(stats, {
      totalOrders: 156,
      monthlyRevenue: 2450000,
      activeProducts: 12,
      rating: 4.7
    })

    // Mock recent orders
    recentOrders.value = [
      {
        id: 'ORD-001',
        customerName: 'Lagos General Hospital',
        amount: 85000,
        status: 'delivered',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 'ORD-002',
        customerName: 'Adebayo Restaurant',
        amount: 45000,
        status: 'processing',
        createdAt: '2024-01-14T14:20:00Z'
      },
      {
        id: 'ORD-003',
        customerName: 'Johnson Household',
        amount: 25000,
        status: 'confirmed',
        createdAt: '2024-01-14T09:15:00Z'
      }
    ]

    // Check verification status
    try {
      const verificationResponse = await apiCall('/api/v1/suppliers/verification-status')
      if (verificationResponse.success) {
        isVerified.value = verificationResponse.data.status === 'verified'
      }
    } catch (verificationError) {
      console.warn('Could not load verification status:', verificationError)
      isVerified.value = false
    }
  } catch (error: any) {
    console.error('Error loading dashboard data:', error)

    // Show user-friendly error message
    const toast = useNuxtApp().$toast
    if (toast) {
      if (error.status === 401) {
        toast.error('Please log in to access supplier dashboard')
        await navigateTo('/login')
      } else if (error.status === 403) {
        toast.error('Access denied - Supplier role required')
      } else {
        toast.error('Failed to load dashboard data. Please try again.')
      }
    }

    // Fallback to mock data for development
    Object.assign(stats, {
      totalOrders: 0,
      monthlyRevenue: 0,
      activeProducts: 0,
      rating: 0
    })
    recentOrders.value = []
    isVerified.value = false
  }
}

// Load data on mount
onMounted(() => {
  loadDashboardData()
})
</script>