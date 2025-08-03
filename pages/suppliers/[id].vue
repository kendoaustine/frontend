<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <div class="inline-flex items-center">
        <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading supplier details...
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Error loading supplier</h3>
      <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
      <div class="mt-6">
        <button
          @click="loadSupplierDetails"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Supplier Details -->
    <div v-else-if="supplier">
      <!-- Header -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-start justify-between">
            <div class="flex items-start space-x-4">
              <!-- Supplier Avatar -->
              <div class="flex-shrink-0">
                <div class="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                  <span class="text-2xl font-medium text-gray-700">
                    {{ supplier.businessName.charAt(0) }}
                  </span>
                </div>
              </div>

              <!-- Supplier Info -->
              <div class="flex-1">
                <div class="flex items-center space-x-3">
                  <h1 class="text-2xl font-bold text-gray-900">{{ supplier.businessName }}</h1>
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getVerificationColor(supplier.verificationStatus)"
                  >
                    {{ formatVerificationStatus(supplier.verificationStatus) }}
                  </span>
                </div>

                <p class="mt-1 text-sm text-gray-600">{{ formatBusinessType(supplier.businessType) }}</p>

                <!-- Rating -->
                <div class="mt-2 flex items-center">
                  <div class="flex items-center">
                    <svg
                      v-for="star in 5"
                      :key="star"
                      class="h-5 w-5"
                      :class="star <= supplier.rating ? 'text-yellow-400' : 'text-gray-300'"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span class="ml-2 text-sm text-gray-600">
                    {{ supplier.rating }}/5 ({{ supplier.totalOrders }} orders completed)
                  </span>
                </div>

                <!-- Service Areas -->
                <div class="mt-2">
                  <span class="text-sm text-gray-500">Service Areas: </span>
                  <span class="text-sm text-gray-900">{{ supplier.serviceAreas.join(', ') }}</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex-shrink-0 flex space-x-3">
              <button
                @click="toggleFavorite"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                :class="{ 'text-red-600 border-red-300 bg-red-50': isFavorite }"
              >
                <svg class="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                </svg>
                {{ isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}
              </button>

              <button
                @click="showContactModal = true"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Contact Supplier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Supplier, InventoryItem } from '~/types'

// Set page meta
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

// Get route params
const route = useRoute()
const supplierId = route.params.id as string

// Set head
useHead({
  title: 'Supplier Details - GasConnect',
  meta: [
    {
      name: 'description',
      content: 'View supplier details and available products on GasConnect.'
    }
  ]
})

// Composables
const { apiCall } = useApi()
const { user } = useAuth()

// Reactive state
const supplier = ref<Supplier | null>(null)
const products = ref<InventoryItem[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const isFavorite = ref(false)
const showContactModal = ref(false)

const productFilters = reactive({
  gasType: '',
  cylinderSize: ''
})

// Computed properties
const filteredProducts = computed(() => {
  let filtered = products.value

  if (productFilters.gasType) {
    filtered = filtered.filter(product =>
      product.gasType?.toLowerCase().includes(productFilters.gasType.toLowerCase())
    )
  }

  if (productFilters.cylinderSize) {
    filtered = filtered.filter(product =>
      product.cylinderSize === productFilters.cylinderSize
    )
  }

  return filtered
})

const hasProductFilters = computed(() => {
  return productFilters.gasType || productFilters.cylinderSize
})

// Utility functions
const formatBusinessType = (type: string) => {
  const typeMap: Record<string, string> = {
    lpg_dealer: 'LPG Dealer',
    industrial_gas: 'Industrial Gas',
    medical_gas: 'Medical Gas',
    mixed: 'Mixed Supplier'
  }
  return typeMap[type] || type
}

const formatVerificationStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    verified: 'Verified',
    rejected: 'Rejected'
  }
  return statusMap[status] || status
}

const getVerificationColor = (status: string) => {
  const colorMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    verified: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  }
  return colorMap[status] || 'bg-gray-100 text-gray-800'
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG').format(amount)
}

const getStockStatusColor = (stockLevel: number): string => {
  if (stockLevel === 0) return 'bg-red-100 text-red-800'
  if (stockLevel < 10) return 'bg-yellow-100 text-yellow-800'
  return 'bg-green-100 text-green-800'
}

const getStockStatusText = (stockLevel: number): string => {
  if (stockLevel === 0) return 'Out of Stock'
  if (stockLevel < 10) return 'Low Stock'
  return 'In Stock'
}

// Actions
const toggleFavorite = async () => {
  try {
    if (isFavorite.value) {
      // TODO: API call to remove from favorites
      // await apiCall(`/api/v1/users/favorites/${supplierId}`, { method: 'DELETE' })
      isFavorite.value = false
    } else {
      // TODO: API call to add to favorites
      // await apiCall('/api/v1/users/favorites', {
      //   method: 'POST',
      //   body: { supplierId }
      // })
      isFavorite.value = true
    }

    const toast = useNuxtApp().$toast
    if (toast) {
      toast.success(isFavorite.value ? 'Added to favorites' : 'Removed from favorites')
    }
  } catch (error: any) {
    console.error('Error toggling favorite:', error)
    const toast = useNuxtApp().$toast
    if (toast) {
      toast.error('Failed to update favorites')
    }
  }
}

const addToCart = (product: InventoryItem) => {
  // TODO: Implement add to cart functionality
  console.log('Adding to cart:', product)

  // Navigate to order form with pre-selected product
  navigateTo(`/orders/new?supplierId=${supplierId}&productId=${product.id}`)
}

// Load supplier details
const loadSupplierDetails = async () => {
  isLoading.value = true
  error.value = null

  try {
    // TODO: Replace with real API calls
    // const [supplierResponse, inventoryResponse] = await Promise.all([
    //   apiCall(`/api/v1/suppliers/${supplierId}`),
    //   apiCall(`/api/v1/inventory/available?supplierId=${supplierId}`)
    // ])

    // Mock data for now
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock supplier data
    supplier.value = {
      id: supplierId,
      userId: 'user1',
      businessName: 'Lagos Gas Co.',
      businessType: 'lpg_dealer',
      verificationStatus: 'verified',
      rating: 4.8,
      totalOrders: 150,
      isActive: true,
      serviceAreas: ['Lagos', 'Ogun'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }

    // Mock products data
    products.value = [
      {
        id: 'product1',
        supplierId: supplierId,
        gasTypeId: 'gas1',
        gasType: 'Cooking Gas',
        name: 'LPG 12.5kg Cylinder',
        description: 'Standard cooking gas cylinder for household use',
        cylinderSize: '12.5kg',
        unit: 'cylinder',
        price: 8500,
        stockLevel: 45,
        isAvailable: true,
        lastUpdated: '2024-01-01T00:00:00Z'
      },
      {
        id: 'product2',
        supplierId: supplierId,
        gasTypeId: 'gas2',
        gasType: 'Cooking Gas',
        name: 'LPG 6kg Cylinder',
        description: 'Compact cooking gas cylinder',
        cylinderSize: '6kg',
        unit: 'cylinder',
        price: 4500,
        stockLevel: 23,
        isAvailable: true,
        lastUpdated: '2024-01-01T00:00:00Z'
      },
      {
        id: 'product3',
        supplierId: supplierId,
        gasTypeId: 'gas3',
        gasType: 'Industrial',
        name: 'Acetylene Industrial',
        description: 'Industrial acetylene for welding',
        cylinderSize: '25kg',
        unit: 'cylinder',
        price: 12000,
        stockLevel: 0,
        isAvailable: false,
        lastUpdated: '2024-01-01T00:00:00Z'
      }
    ]

    // Check if supplier is in user's favorites
    // TODO: Load from API
    isFavorite.value = false
  } catch (err: any) {
    console.error('Error loading supplier details:', err)
    error.value = err.message || 'Failed to load supplier details'
  } finally {
    isLoading.value = false
  }
}

// Load data on mount
onMounted(() => {
  loadSupplierDetails()
})
</script>