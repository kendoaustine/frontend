<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
      <p class="mt-2 text-sm text-gray-700">
        Track your business performance and sales metrics.
      </p>
    </div>

    <!-- Time Period Selector -->
    <div class="mb-6 bg-white shadow rounded-lg p-4">
      <div class="flex items-center space-x-4">
        <label for="period" class="text-sm font-medium text-gray-700">Time Period:</label>
        <select
          id="period"
          v-model="selectedPeriod"
          @change="loadAnalytics"
          class="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 3 months</option>
          <option value="1y">Last year</option>
        </select>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total Revenue
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  ₦{{ formatCurrency(metrics.totalRevenue) }}
                </dd>
                <dd class="text-sm text-green-600">
                  +{{ metrics.revenueGrowth }}% from last period
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
              <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total Orders
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ metrics.totalOrders }}
                </dd>
                <dd class="text-sm text-green-600">
                  +{{ metrics.ordersGrowth }}% from last period
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
              <svg class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  New Customers
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ metrics.newCustomers }}
                </dd>
                <dd class="text-sm text-blue-600">
                  +{{ metrics.customersGrowth }}% from last period
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
              <svg class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Average Order Value
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  ₦{{ formatCurrency(metrics.averageOrderValue) }}
                </dd>
                <dd class="text-sm text-green-600">
                  +{{ metrics.aovGrowth }}% from last period
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
  title: 'Analytics Dashboard - GasConnect',
  meta: [
    {
      name: 'description',
      content: 'View analytics and performance metrics for your gas business on GasConnect.'
    }
  ]
})

// Composables
const { isSupplier, isAdmin } = useRoles()
const { apiCall } = useApi()

// Check permissions
if (!isSupplier.value && !isAdmin.value) {
  throw createError({
    statusCode: 403,
    statusMessage: 'Access denied - Supplier or Admin role required'
  })
}

// Reactive data
const selectedPeriod = ref('30d')
const isLoading = ref(true)

const metrics = reactive({
  totalRevenue: 0,
  revenueGrowth: 0,
  totalOrders: 0,
  ordersGrowth: 0,
  newCustomers: 0,
  customersGrowth: 0,
  averageOrderValue: 0,
  aovGrowth: 0
})

const topProducts = ref([])
const customerInsights = reactive({
  repeatCustomers: 0,
  averageRating: 0,
  customerLifetime: 0
})

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG').format(amount)
}

// Load analytics data
const loadAnalytics = async () => {
  isLoading.value = true

  try {
    // Real API calls using correct backend endpoints
    const [overviewResponse, inventoryAnalyticsResponse] = await Promise.all([
      apiCall(`/api/v1/analytics/overview?period=${selectedPeriod.value}`),
      apiCall(`/api/v1/analytics/inventory?period=${selectedPeriod.value}`)
    ])

    if (overviewResponse.success) {
      const data = overviewResponse.data
      Object.assign(metrics, {
        totalRevenue: data.totalRevenue || 0,
        revenueGrowth: data.revenueGrowth || 0,
        totalOrders: data.totalOrders || 0,
        ordersGrowth: data.ordersGrowth || 0,
        newCustomers: data.newCustomers || 0,
        customersGrowth: data.customersGrowth || 0,
        averageOrderValue: data.averageOrderValue || 0,
        aovGrowth: data.aovGrowth || 0
      })
    }

    if (inventoryAnalyticsResponse.success) {
      const data = inventoryAnalyticsResponse.data
      topProducts.value = data.topProducts || []

      Object.assign(customerInsights, {
        repeatCustomers: data.repeatCustomers || 0,
        averageRating: data.averageRating || 0,
        customerLifetime: data.customerLifetime || 0
      })
    }

    // Mock metrics based on selected period
    const periodMultiplier = {
      '7d': 0.2,
      '30d': 1,
      '90d': 3,
      '1y': 12
    }[selectedPeriod.value] || 1

    Object.assign(metrics, {
      totalRevenue: Math.round(2450000 * periodMultiplier),
      revenueGrowth: Math.round(Math.random() * 20 + 5),
      totalOrders: Math.round(156 * periodMultiplier),
      ordersGrowth: Math.round(Math.random() * 15 + 3),
      newCustomers: Math.round(45 * periodMultiplier),
      customersGrowth: Math.round(Math.random() * 25 + 8),
      averageOrderValue: Math.round(15700 + Math.random() * 5000),
      aovGrowth: Math.round(Math.random() * 10 + 2)
    })

    // Mock top products
    topProducts.value = [
      {
        id: 1,
        name: 'LPG 12.5kg Cylinder',
        category: 'LPG',
        unitsSold: Math.round(89 * periodMultiplier),
        revenue: Math.round(756500 * periodMultiplier),
        growth: 15
      },
      {
        id: 2,
        name: 'Oxygen Medical Grade',
        category: 'Medical Gas',
        unitsSold: Math.round(34 * periodMultiplier),
        revenue: Math.round(510000 * periodMultiplier),
        growth: 8
      },
      {
        id: 3,
        name: 'Acetylene Industrial',
        category: 'Industrial Gas',
        unitsSold: Math.round(23 * periodMultiplier),
        revenue: Math.round(276000 * periodMultiplier),
        growth: -3
      }
    ]

    // Mock customer insights
    Object.assign(customerInsights, {
      repeatCustomers: 68,
      averageRating: 4.7,
      customerLifetime: 245
    })
  } catch (error) {
    console.error('Error loading analytics:', error)
    const toast = useNuxtApp().$toast
    if (toast) {
      toast.error('Failed to load analytics data')
    }
  } finally {
    isLoading.value = false
  }
}

// Load data on mount and when period changes
onMounted(() => {
  loadAnalytics()
})

watch(selectedPeriod, () => {
  loadAnalytics()
})
</script>