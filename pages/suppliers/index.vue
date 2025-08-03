<template>
  <div>
    <!-- Header -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Gas Suppliers</h1>
        <p class="mt-2 text-sm text-gray-700">
          Find verified gas suppliers in your area.
        </p>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="mt-6 bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div class="sm:col-span-2">
            <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search"
                v-model="filters.search"
                type="text"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search suppliers..."
              />
            </div>
          </div>
          <div>
            <label for="businessType" class="block text-sm font-medium text-gray-700">Business Type</label>
            <select
              id="businessType"
              v-model="filters.businessType"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Types</option>
              <option value="lpg_dealer">LPG Dealer</option>
              <option value="industrial_gas">Industrial Gas</option>
              <option value="medical_gas">Medical Gas</option>
              <option value="mixed">Mixed Supplier</option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              @click="applyFilters"
              class="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Suppliers Grid -->
    <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="supplier in suppliers"
        :key="supplier.id"
        class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
      >
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                <span class="text-lg font-medium text-gray-700">
                  {{ supplier.businessName.charAt(0) }}
                </span>
              </div>
            </div>
            <div class="ml-4 flex-1">
              <h3 class="text-lg font-medium text-gray-900">
                {{ supplier.businessName }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ formatBusinessType(supplier.businessType) }}
              </p>
            </div>
            <div class="flex-shrink-0">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="getVerificationColor(supplier.verificationStatus)"
              >
                {{ formatVerificationStatus(supplier.verificationStatus) }}
              </span>
            </div>
          </div>

          <div class="mt-4">
            <div class="flex items-center">
              <div class="flex items-center">
                <svg
                  v-for="star in 5"
                  :key="star"
                  class="h-4 w-4"
                  :class="star <= supplier.rating ? 'text-yellow-400' : 'text-gray-300'"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span class="ml-2 text-sm text-gray-600">
                {{ supplier.rating }}/5 ({{ supplier.totalOrders }} orders)
              </span>
            </div>

            <div class="mt-2">
              <p class="text-sm text-gray-600">
                Service Areas: {{ supplier.serviceAreas.join(', ') }}
              </p>
            </div>
          </div>

          <div class="mt-6 flex space-x-3">
            <NuxtLink
              :to="`/suppliers/${supplier.id}`"
              class="flex-1 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center"
            >
              View Details
            </NuxtLink>
            <button
              @click="toggleFavorite(supplier.id)"
              class="flex-shrink-0 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              :class="{ 'text-red-600 border-red-300': isFavorite(supplier.id) }"
            >
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="suppliers.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No suppliers found</h3>
      <p class="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Supplier, VerificationStatus } from '~/types'

// Set page meta
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

// Set head
useHead({
  title: 'Suppliers - GasConnect',
  meta: [
    {
      name: 'description',
      content: 'Find verified gas suppliers in your area on GasConnect.'
    }
  ]
})

// Reactive state
const suppliers = ref<Supplier[]>([])
const favorites = ref<string[]>([])
const isLoading = ref(false)
const currentPage = ref(1)
const pageSize = ref(12)
const totalSuppliers = ref(0)
const totalPages = computed(() => Math.ceil(totalSuppliers.value / pageSize.value))

const filters = reactive({
  search: '',
  businessType: ''
})

// Composables
const { apiCall } = useApi()

// Mock data for now - replace with real API calls
const mockSuppliers: Supplier[] = [
  {
    id: 'supplier1',
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
  },
  {
    id: 'supplier2',
    userId: 'user2',
    businessName: 'Abuja Gas Supply',
    businessType: 'mixed',
    verificationStatus: 'verified',
    rating: 4.5,
    totalOrders: 89,
    isActive: true,
    serviceAreas: ['Abuja', 'Nasarawa'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'supplier3',
    userId: 'user3',
    businessName: 'Port Harcourt Industrial Gas',
    businessType: 'industrial_gas',
    verificationStatus: 'verified',
    rating: 4.7,
    totalOrders: 203,
    isActive: true,
    serviceAreas: ['Rivers', 'Bayelsa'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'supplier4',
    userId: 'user4',
    businessName: 'Kano Medical Gas',
    businessType: 'medical_gas',
    verificationStatus: 'pending',
    rating: 4.2,
    totalOrders: 45,
    isActive: true,
    serviceAreas: ['Kano', 'Kaduna'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

// Initialize with mock data
suppliers.value = mockSuppliers
totalSuppliers.value = mockSuppliers.length

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

const formatVerificationStatus = (status: VerificationStatus) => {
  const statusMap: Record<VerificationStatus, string> = {
    pending: 'Pending',
    verified: 'Verified',
    rejected: 'Rejected'
  }
  return statusMap[status] || status
}

const getVerificationColor = (status: VerificationStatus) => {
  const colorMap: Record<VerificationStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    verified: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  }
  return colorMap[status] || 'bg-gray-100 text-gray-800'
}

const isFavorite = (supplierId: string) => {
  return favorites.value.includes(supplierId)
}

const toggleFavorite = async (supplierId: string) => {
  try {
    if (isFavorite(supplierId)) {
      // Remove from favorites
      favorites.value = favorites.value.filter(id => id !== supplierId)
      // TODO: API call to remove favorite
    } else {
      // Add to favorites
      favorites.value.push(supplierId)
      // TODO: API call to add favorite
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
  }
}

// Filter and pagination functions
const applyFilters = async () => {
  isLoading.value = true
  currentPage.value = 1

  try {
    // TODO: Replace with real API call
    // const response = await apiCall('/api/v1/suppliers', {
    //   method: 'GET',
    //   query: {
    //     page: currentPage.value,
    //     limit: pageSize.value,
    //     search: filters.search,
    //     businessType: filters.businessType
    //   }
    // })

    // For now, filter mock data
    let filteredSuppliers = [...mockSuppliers]

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredSuppliers = filteredSuppliers.filter(supplier =>
        supplier.businessName.toLowerCase().includes(searchTerm) ||
        supplier.serviceAreas.some(area => area.toLowerCase().includes(searchTerm))
      )
    }

    if (filters.businessType) {
      filteredSuppliers = filteredSuppliers.filter(supplier =>
        supplier.businessType === filters.businessType
      )
    }

    suppliers.value = filteredSuppliers
    totalSuppliers.value = filteredSuppliers.length
  } catch (error) {
    console.error('Error fetching suppliers:', error)
  } finally {
    isLoading.value = false
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    applyFilters()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    applyFilters()
  }
}

// Load suppliers on mount
onMounted(() => {
  applyFilters()

  // Load user favorites
  // TODO: Load from API or local storage
  favorites.value = ['supplier1'] // Mock favorite
})
</script>