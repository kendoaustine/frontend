<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Place New Order</h1>
      <p class="mt-2 text-sm text-gray-700">
        Select your gas supplier and products to place a new order.
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Step 1: Select Supplier -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            1. Select Supplier
          </h3>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="supplier in suppliers"
              :key="supplier.id"
              class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 cursor-pointer"
              :class="{ 'ring-2 ring-blue-500 border-blue-500': form.supplierId === supplier.id }"
              @click="selectSupplier(supplier.id)"
            >
              <input
                :id="`supplier-${supplier.id}`"
                v-model="form.supplierId"
                :value="supplier.id"
                name="supplier"
                type="radio"
                class="sr-only"
              />
              <div class="flex-shrink-0">
                <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <span class="text-sm font-medium text-gray-700">
                    {{ supplier.businessName.charAt(0) }}
                  </span>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <label :for="`supplier-${supplier.id}`" class="focus:outline-none">
                  <span class="absolute inset-0" aria-hidden="true"></span>
                  <p class="text-sm font-medium text-gray-900">
                    {{ supplier.businessName }}
                  </p>
                  <p class="text-sm text-gray-500 truncate">
                    Rating: {{ supplier.rating }}/5 • {{ supplier.totalOrders }} orders
                  </p>
                </label>
              </div>
            </div>
          </div>

          <p v-if="errors.supplierId" class="mt-2 text-sm text-red-600">
            {{ errors.supplierId }}
          </p>
        </div>
      </div>

      <!-- Step 2: Select Products -->
      <div v-if="form.supplierId" class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            2. Select Products
          </h3>

          <div v-if="isLoadingProducts" class="text-center py-8">
            <div class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading products...
            </div>
          </div>

          <div v-else-if="availableProducts.length > 0" class="space-y-4">
            <div
              v-for="product in availableProducts"
              :key="product.id"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h4 class="text-sm font-medium text-gray-900">{{ product.gasType?.name }}</h4>
                  <p class="text-sm text-gray-500 mt-1">{{ product.gasType?.description }}</p>
                  <div class="mt-2 flex items-center space-x-4">
                    <span class="text-lg font-bold text-gray-900">₦{{ formatCurrency(product.unitPrice) }}</span>
                    <span class="text-sm text-gray-500">per {{ product.gasType?.unit }}</span>
                    <span class="text-sm text-gray-500">{{ product.quantity }} available</span>
                  </div>
                </div>

                <div class="flex-shrink-0 ml-4 flex items-center space-x-3">
                  <div class="flex items-center">
                    <button
                      type="button"
                      @click="decreaseQuantity(product.gasTypeId)"
                      :disabled="getItemQuantity(product.gasTypeId) === 0"
                      class="inline-flex items-center p-1 border border-gray-300 rounded-l-md bg-white text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    >
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                      </svg>
                    </button>

                    <input
                      :value="getItemQuantity(product.gasTypeId)"
                      @input="updateQuantity(product.gasTypeId, $event)"
                      type="number"
                      min="0"
                      :max="product.quantity"
                      class="w-16 text-center border-t border-b border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />

                    <button
                      type="button"
                      @click="increaseQuantity(product.gasTypeId)"
                      :disabled="getItemQuantity(product.gasTypeId) >= product.quantity"
                      class="inline-flex items-center p-1 border border-gray-300 rounded-r-md bg-white text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    >
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No products available</h3>
            <p class="mt-1 text-sm text-gray-500">This supplier has no products in stock.</p>
          </div>

          <p v-if="errors.items" class="mt-2 text-sm text-red-600">
            {{ errors.items }}
          </p>
        </div>
      </div>

      <!-- Step 3: Delivery Address -->
      <div v-if="form.items.length > 0" class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            3. Delivery Address
          </h3>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div
              v-for="address in addresses"
              :key="address.id"
              class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 cursor-pointer"
              :class="{ 'ring-2 ring-blue-500 border-blue-500': form.deliveryAddressId === address.id }"
              @click="form.deliveryAddressId = address.id"
            >
              <input
                :id="`address-${address.id}`"
                v-model="form.deliveryAddressId"
                :value="address.id"
                name="address"
                type="radio"
                class="sr-only"
              />
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <label :for="`address-${address.id}`" class="focus:outline-none">
                  <span class="absolute inset-0" aria-hidden="true"></span>
                  <p class="text-sm font-medium text-gray-900 capitalize">
                    {{ address.type }} Address
                  </p>
                  <p class="text-sm text-gray-500 truncate">
                    {{ address.street }}, {{ address.city }}, {{ address.state }}
                  </p>
                </label>
              </div>
            </div>
          </div>

          <p v-if="errors.deliveryAddressId" class="mt-2 text-sm text-red-600">
            {{ errors.deliveryAddressId }}
          </p>
        </div>
      </div>

      <!-- Order Summary -->
      <div v-if="form.items.length > 0" class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            Order Summary
          </h3>

          <div class="space-y-3">
            <div v-for="item in orderItems" :key="item.gasTypeId" class="flex justify-between">
              <span class="text-sm text-gray-600">{{ item.gasType }} × {{ item.quantity }}</span>
              <span class="text-sm font-medium text-gray-900">₦{{ formatCurrency(item.totalPrice) }}</span>
            </div>

            <div class="border-t border-gray-200 pt-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Subtotal</span>
                <span class="text-sm font-medium text-gray-900">₦{{ formatCurrency(subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Delivery Fee</span>
                <span class="text-sm font-medium text-gray-900">₦{{ formatCurrency(deliveryFee) }}</span>
              </div>
              <div class="flex justify-between border-t border-gray-200 pt-3">
                <span class="text-base font-medium text-gray-900">Total</span>
                <span class="text-base font-bold text-gray-900">₦{{ formatCurrency(total) }}</span>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="mt-6">
            <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions (Optional)
            </label>
            <textarea
              id="notes"
              v-model="form.notes"
              rows="3"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Any special delivery instructions..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div v-if="form.deliveryAddressId" class="flex justify-end space-x-3">
        <NuxtLink
          to="/orders"
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </NuxtLink>
        <button
          type="submit"
          :disabled="isLoading"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading" class="mr-2">
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ isLoading ? 'Placing Order...' : 'Place Order' }}
        </button>
      </div>
    </form>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mt-6 rounded-md bg-red-50 p-4">
      <div class="flex">
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">
            {{ errorMessage }}
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Supplier, Address, InventoryItem, OrderItem } from '~/types'

// Set page meta
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

// Set head
useHead({
  title: 'New Order - GasConnect',
  meta: [
    {
      name: 'description',
      content: 'Place a new gas order on GasConnect.'
    }
  ]
})

// Composables
const { apiCall } = useApi()
const { user } = useAuth()

// Reactive state
const form = reactive({
  supplierId: '',
  deliveryAddressId: '',
  items: [] as OrderItem[],
  notes: ''
})

const errors = reactive<Record<string, string>>({})
const errorMessage = ref('')
const isLoading = ref(false)
const isLoadingProducts = ref(false)

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG').format(amount)
}

// Mock data - replace with real API calls
const suppliers = ref<Supplier[]>([
  {
    id: 'supplier1',
    userId: 'user1',
    businessName: 'Lagos Gas Co.',
    businessType: 'lpg_dealer',
    verificationStatus: 'verified',
    rating: 4.8,
    totalOrders: 150,
    isActive: true,
    serviceAreas: ['Lagos'],
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
    serviceAreas: ['Abuja'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
])

const addresses = ref<Address[]>([
  {
    id: 'addr1',
    userId: 'user1',
    type: 'home',
    street: '123 Main Street',
    city: 'Lagos',
    state: 'Lagos',
    country: 'Nigeria',
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
])

const availableProducts = ref<InventoryItem[]>([])

// Computed properties
const orderItems = computed(() => {
  return form.items.filter(item => item.quantity > 0).map(item => {
    const product = availableProducts.value.find(p => p.gasTypeId === item.gasTypeId)
    return {
      ...item,
      gasType: product?.gasType
    }
  })
})

const subtotal = computed(() => {
  return form.items.reduce((sum, item) => sum + item.totalPrice, 0)
})

const deliveryFee = computed(() => 1500) // Fixed delivery fee for now

const total = computed(() => subtotal.value + deliveryFee.value)

// Methods
const selectSupplier = async (supplierId: string) => {
  form.supplierId = supplierId
  form.items = []
  isLoadingProducts.value = true

  // Load supplier's inventory
  try {
    // Real API call to get supplier's available inventory
    const response = await apiCall(`/api/v1/inventory/available?supplierId=${supplierId}`)

    if (response.success) {
      availableProducts.value = response.data || []
    } else {
      throw new Error(response.message || 'Failed to load products')
    }
  } catch (error: any) {
    console.error('Error loading inventory:', error)

    // Fallback to mock data for development
    availableProducts.value = [
      {
        id: 'inv1',
        supplierId: supplierId,
        gasTypeId: 'lpg_12_5kg',
        quantity: 50,
        unitPrice: 8500,
        isAvailable: true,
        lastUpdated: '2025-01-01T00:00:00Z',
        gasType: {
          id: 'lpg_12_5kg',
          name: 'LPG 12.5kg',
          category: 'lpg',
          description: 'Standard 12.5kg LPG cylinder',
          unit: 'cylinder',
          specifications: {}
        }
      },
      {
        id: 'inv2',
        supplierId: supplierId,
        gasTypeId: 'lpg_6kg',
        quantity: 30,
        unitPrice: 4500,
        isAvailable: true,
        lastUpdated: '2025-01-01T00:00:00Z',
        gasType: {
          id: 'lpg_6kg',
          name: 'LPG 6kg',
          category: 'lpg',
          description: 'Compact 6kg LPG cylinder',
          unit: 'cylinder',
          specifications: {}
        }
      }
    ]

    const toast = useNuxtApp().$toast
    if (toast) {
      toast.warning('Using demo data - API connection failed')
    }
  } finally {
    isLoadingProducts.value = false
  }
}

const getItemQuantity = (gasTypeId: string) => {
  const item = form.items.find(i => i.gasTypeId === gasTypeId)
  return item?.quantity || 0
}

const updateQuantity = (gasTypeId: string, event: Event) => {
  const target = event.target as HTMLInputElement
  const quantity = parseInt(target.value) || 0
  const product = availableProducts.value.find(p => p.gasTypeId === gasTypeId)

  if (!product) return

  const existingItemIndex = form.items.findIndex(i => i.gasTypeId === gasTypeId)

  if (quantity === 0) {
    if (existingItemIndex >= 0) {
      form.items.splice(existingItemIndex, 1)
    }
  } else {
    const totalPrice = quantity * product.unitPrice
    const item: OrderItem = {
      id: `item-${gasTypeId}`,
      gasTypeId,
      quantity,
      unitPrice: product.unitPrice,
      totalPrice
    }

    if (existingItemIndex >= 0) {
      form.items[existingItemIndex] = item
    } else {
      form.items.push(item)
    }
  }
}

const increaseQuantity = (gasTypeId: string) => {
  const currentQuantity = getItemQuantity(gasTypeId)
  const product = availableProducts.value.find(p => p.gasTypeId === gasTypeId)

  if (product && currentQuantity < product.quantity) {
    updateQuantity(gasTypeId, { target: { value: (currentQuantity + 1).toString() } } as any)
  }
}

const decreaseQuantity = (gasTypeId: string) => {
  const currentQuantity = getItemQuantity(gasTypeId)

  if (currentQuantity > 0) {
    updateQuantity(gasTypeId, { target: { value: (currentQuantity - 1).toString() } } as any)
  }
}

const handleSubmit = async () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => delete errors[key])
  errorMessage.value = ''

  // Validate form
  if (!form.supplierId) {
    errors.supplierId = 'Please select a supplier'
  }

  if (form.items.length === 0) {
    errors.items = 'Please select at least one product'
  }

  if (!form.deliveryAddressId) {
    errors.deliveryAddressId = 'Please select a delivery address'
  }

  if (Object.keys(errors).length > 0) {
    return
  }

  isLoading.value = true

  try {
    // Real API call to create order
    const orderData = {
      supplierId: form.supplierId,
      deliveryAddressId: form.deliveryAddressId,
      items: form.items.map(item => ({
        gasTypeId: item.gasTypeId,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      })),
      notes: form.notes,
      totalAmount: total.value,
      deliveryFee: deliveryFee.value
    }

    const response = await apiCall('/api/v1/orders', {
      method: 'POST',
      body: orderData
    })

    if (response.success) {
      const toast = useNuxtApp().$toast
      if (toast) {
        toast.success('Order placed successfully!')
      }

      // Redirect to order details page
      await navigateTo(`/orders/${response.data.id}`)
    } else {
      throw new Error(response.message || 'Failed to place order')
    }
  } catch (error: any) {
    console.error('Error placing order:', error)
    errorMessage.value = error.message || 'Failed to place order. Please try again.'

    const toast = useNuxtApp().$toast
    if (toast) {
      toast.error(errorMessage.value)
    }
  } finally {
    isLoading.value = false
  }
}

// Load initial data
onMounted(async () => {
  try {
    // Load suppliers and user addresses in parallel
    const [suppliersResponse, addressesResponse] = await Promise.all([
      apiCall('/api/v1/suppliers?verified=true&active=true'),
      apiCall('/api/v1/users/addresses')
    ])

    if (suppliersResponse.success) {
      suppliers.value = suppliersResponse.data || []
    }

    if (addressesResponse.success) {
      addresses.value = addressesResponse.data || []
    }

    // Check for pre-selected supplier from query params
    const route = useRoute()
    const preSelectedSupplierId = route.query.supplierId as string
    if (preSelectedSupplierId && suppliers.value.find(s => s.id === preSelectedSupplierId)) {
      await selectSupplier(preSelectedSupplierId)
    }
  } catch (error: any) {
    console.error('Error loading initial data:', error)

    // Use mock data as fallback
    suppliers.value = [
      {
        id: 'supplier1',
        userId: 'user1',
        businessName: 'Lagos Gas Co.',
        businessType: 'lpg_dealer',
        verificationStatus: 'verified',
        rating: 4.8,
        totalOrders: 150,
        isActive: true,
        serviceAreas: ['Lagos'],
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
        serviceAreas: ['Abuja'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ]

    addresses.value = [
      {
        id: 'addr1',
        userId: user.value?.id || 'user1',
        type: 'home',
        street: '123 Main Street',
        city: 'Lagos',
        state: 'Lagos',
        country: 'Nigeria',
        isDefault: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ]

    const toast = useNuxtApp().$toast
    if (toast) {
      toast.warning('Using demo data - API connection failed')
    }
  }
})
</script>