<template>
  <div>
    <!-- Header -->
    <div class="mb-8 sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Inventory Management</h1>
        <p class="mt-2 text-sm text-gray-700">
          Manage your gas products and stock levels.
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button
          @click="showAddModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Product
        </button>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="mb-6 bg-white shadow rounded-lg p-4">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
          <input
            id="search"
            v-model="filters.search"
            type="text"
            placeholder="Search products..."
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category"
            v-model="filters.category"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">All Categories</option>
            <option value="lpg">LPG</option>
            <option value="industrial">Industrial Gas</option>
            <option value="medical">Medical Gas</option>
            <option value="specialty">Specialty Gas</option>
          </select>
        </div>

        <div>
          <label for="status" class="block text-sm font-medium text-gray-700">Stock Status</label>
          <select
            id="status"
            v-model="filters.status"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">All Status</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>

        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Inventory Table -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div v-if="isLoading" class="p-8 text-center">
        <div class="inline-flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading inventory...
        </div>
      </div>

      <div v-else-if="filteredProducts.length === 0" class="p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No products found</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ hasFilters ? 'Try adjusting your filters.' : 'Get started by adding your first product.' }}
        </p>
        <div v-if="!hasFilters" class="mt-6">
          <button
            @click="showAddModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Product
          </button>
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
  title: 'Inventory Management - GasConnect',
  meta: [
    {
      name: 'description',
      content: 'Manage your gas inventory and stock levels on GasConnect.'
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
const isLoading = ref(true)
const showAddModal = ref(false)
const products = ref([])

const filters = reactive({
  search: '',
  category: '',
  status: ''
})

// Computed properties
const hasFilters = computed(() => {
  return filters.search || filters.category || filters.status
})

const filteredProducts = computed(() => {
  let filtered = products.value

  if (filters.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter((product: any) =>
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search)
    )
  }

  if (filters.category) {
    filtered = filtered.filter((product: any) => product.category === filters.category)
  }

  if (filters.status) {
    filtered = filtered.filter((product: any) => product.status === filters.status)
  }

  return filtered
})

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG').format(amount)
}

const getCategoryLabel = (category: string): string => {
  const labels = {
    lpg: 'LPG',
    industrial: 'Industrial Gas',
    medical: 'Medical Gas',
    specialty: 'Specialty Gas'
  }
  return labels[category as keyof typeof labels] || category
}

const getStatusLabel = (status: string): string => {
  const labels = {
    in_stock: 'In Stock',
    low_stock: 'Low Stock',
    out_of_stock: 'Out of Stock'
  }
  return labels[status as keyof typeof labels] || status
}

const getStatusClass = (status: string): string => {
  const classes = {
    in_stock: 'bg-green-100 text-green-800',
    low_stock: 'bg-yellow-100 text-yellow-800',
    out_of_stock: 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

// Actions
const clearFilters = () => {
  filters.search = ''
  filters.category = ''
  filters.status = ''
}

const editProduct = (product: any) => {
  // TODO: Implement edit product functionality
  console.log('Edit product:', product)
}

const updateStock = (product: any) => {
  // TODO: Implement update stock functionality
  console.log('Update stock for:', product)
}

const deleteProduct = (product: any) => {
  // TODO: Implement delete product functionality
  console.log('Delete product:', product)
}

// Load inventory data
const loadInventory = async () => {
  isLoading.value = true

  try {
    // Real API call to get inventory
    const response = await apiCall('/api/v1/inventory')

    if (response.success) {
      products.value = (response.data || []).map(item => ({
        id: item.id,
        name: item.gasType?.name || 'Unknown Product',
        description: item.gasType?.description || '',
        category: item.gasType?.category || 'unknown',
        stockLevel: item.quantity,
        minStockLevel: item.minQuantity || 0,
        unit: item.gasType?.unit || 'units',
        price: item.unitPrice,
        status: item.quantity > 0 ? (item.quantity < (item.minQuantity || 10) ? 'low_stock' : 'in_stock') : 'out_of_stock'
      }))
    } else {
      throw new Error(response.message || 'Failed to load inventory')
    }

    products.value = [
      {
        id: 1,
        name: 'LPG 12.5kg Cylinder',
        description: 'Standard cooking gas cylinder',
        category: 'lpg',
        stockLevel: 45,
        minStockLevel: 10,
        unit: 'cylinders',
        price: 8500,
        status: 'in_stock'
      },
      {
        id: 2,
        name: 'Oxygen Medical Grade',
        description: 'Medical oxygen for hospitals',
        category: 'medical',
        stockLevel: 8,
        minStockLevel: 15,
        unit: 'cylinders',
        price: 15000,
        status: 'low_stock'
      },
      {
        id: 3,
        name: 'Acetylene Industrial',
        description: 'Industrial acetylene for welding',
        category: 'industrial',
        stockLevel: 0,
        minStockLevel: 5,
        unit: 'cylinders',
        price: 12000,
        status: 'out_of_stock'
      }
    ]
  } catch (error) {
    console.error('Error loading inventory:', error)
    const toast = useNuxtApp().$toast
    if (toast) {
      toast.error('Failed to load inventory')
    }
  } finally {
    isLoading.value = false
  }
}

// Load data on mount
onMounted(() => {
  loadInventory()
})
</script>