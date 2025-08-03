<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Pricing Management</h1>
      <p class="mt-2 text-sm text-gray-700">
        Set competitive prices and manage bulk discounts for your products.
      </p>
    </div>

    <!-- Pricing Strategy Cards -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
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
                  Base Pricing
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.totalProducts }} Products
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <button
              @click="activeTab = 'base'"
              :class="[activeTab === 'base' ? 'text-blue-700' : 'text-gray-700', 'font-medium hover:text-blue-600']"
            >
              Manage base prices
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Bulk Discounts
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.bulkRules }} Rules
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <button
              @click="activeTab = 'bulk'"
              :class="[activeTab === 'bulk' ? 'text-green-700' : 'text-gray-700', 'font-medium hover:text-green-600']"
            >
              Configure bulk pricing
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Promotions
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.activePromotions }} Active
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <button
              @click="activeTab = 'promotions'"
              :class="[activeTab === 'promotions' ? 'text-purple-700' : 'text-gray-700', 'font-medium hover:text-purple-600']"
            >
              Manage promotions
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="bg-white shadow rounded-lg">
      <!-- Base Pricing Tab -->
      <div v-if="activeTab === 'base'" class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-medium text-gray-900">Base Product Pricing</h3>
          <button
            @click="showPriceModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Update Prices
          </button>
        </div>

        <div class="overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Price
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Market Average
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Competitiveness
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="product in products" :key="product.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                  <div class="text-sm text-gray-500">{{ product.category }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₦{{ formatCurrency(product.price) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ₦{{ formatCurrency(product.marketAverage) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getCompetitivenessClass(product.competitiveness)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ product.competitiveness }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="editPrice(product)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    Edit Price
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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
  title: 'Pricing Management - GasConnect',
  meta: [
    {
      name: 'description',
      content: 'Manage pricing and discounts for your gas products on GasConnect.'
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
const activeTab = ref('base')
const showPriceModal = ref(false)
const showBulkModal = ref(false)
const showPromotionModal = ref(false)

const stats = reactive({
  totalProducts: 0,
  bulkRules: 0,
  activePromotions: 0
})

const products = ref([])
const bulkRules = ref([])
const promotions = ref([])

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

const getCompetitivenessClass = (competitiveness: string): string => {
  const classes = {
    'Very Competitive': 'bg-green-100 text-green-800',
    'Competitive': 'bg-blue-100 text-blue-800',
    'Average': 'bg-yellow-100 text-yellow-800',
    'Above Average': 'bg-orange-100 text-orange-800',
    'Expensive': 'bg-red-100 text-red-800'
  }
  return classes[competitiveness as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getPromotionStatusClass = (status: string): string => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    scheduled: 'bg-blue-100 text-blue-800',
    expired: 'bg-gray-100 text-gray-800',
    paused: 'bg-yellow-100 text-yellow-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

// Actions
const editPrice = (product: any) => {
  console.log('Edit price for:', product)
  // TODO: Implement price editing
}

const editBulkRule = (rule: any) => {
  console.log('Edit bulk rule:', rule)
  // TODO: Implement bulk rule editing
}

const toggleBulkRule = (rule: any) => {
  rule.isActive = !rule.isActive
  console.log('Toggle bulk rule:', rule)
  // TODO: Implement API call to toggle rule
}

const editPromotion = (promotion: any) => {
  console.log('Edit promotion:', promotion)
  // TODO: Implement promotion editing
}

const deletePromotion = (promotion: any) => {
  console.log('Delete promotion:', promotion)
  // TODO: Implement promotion deletion
}

// Load pricing data
const loadPricingData = async () => {
  try {
    // Real API calls using correct backend endpoints
    const [inventoryResponse, pricingResponse] = await Promise.all([
      apiCall('/api/v1/inventory'),
      apiCall('/api/v1/pricing')
    ])

    if (inventoryResponse.success) {
      // Transform inventory data for pricing display
      products.value = (inventoryResponse.data || []).map(item => ({
        id: item.id,
        name: item.gasType?.name || 'Unknown Product',
        category: item.gasType?.category || 'Unknown',
        price: item.unitPrice,
        marketAverage: item.unitPrice * 1.1, // Simulate market average
        competitiveness: item.unitPrice < (item.unitPrice * 1.1) ? 'Very Competitive' : 'Average'
      }))
    }

    if (pricingResponse.success) {
      // Handle pricing rules and promotions
      const pricingData = pricingResponse.data
      bulkRules.value = pricingData.bulkRules || []
      promotions.value = pricingData.promotions || []
    }

    // Mock products with pricing data
    products.value = [
      {
        id: 1,
        name: 'LPG 12.5kg Cylinder',
        category: 'LPG',
        price: 8500,
        marketAverage: 9000,
        competitiveness: 'Very Competitive'
      },
      {
        id: 2,
        name: 'Oxygen Medical Grade',
        category: 'Medical Gas',
        price: 15000,
        marketAverage: 14500,
        competitiveness: 'Above Average'
      },
      {
        id: 3,
        name: 'Acetylene Industrial',
        category: 'Industrial Gas',
        price: 12000,
        marketAverage: 12500,
        competitiveness: 'Competitive'
      }
    ]

    // Mock bulk rules
    bulkRules.value = [
      {
        id: 1,
        name: 'Volume Discount - LPG',
        description: 'Discount for orders of 10+ LPG cylinders',
        minQuantity: 10,
        discount: 5,
        isActive: true
      },
      {
        id: 2,
        name: 'Hospital Bulk Discount',
        description: 'Special pricing for medical facilities',
        minQuantity: 20,
        discount: 10,
        isActive: true
      }
    ]

    // Mock promotions
    promotions.value = [
      {
        id: 1,
        name: 'New Year Special',
        description: '15% off all LPG products',
        discount: 15,
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        status: 'active'
      }
    ]

    // Update stats
    Object.assign(stats, {
      totalProducts: products.value.length,
      bulkRules: bulkRules.value.length,
      activePromotions: promotions.value.filter(p => p.status === 'active').length
    })
  } catch (error) {
    console.error('Error loading pricing data:', error)
    const toast = useNuxtApp().$toast
    if (toast) {
      toast.error('Failed to load pricing data')
    }
  }
}

// Load data on mount
onMounted(() => {
  loadPricingData()
})
</script>