<template>
  <div>
    <!-- Header -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Orders</h1>
        <p class="mt-2 text-sm text-gray-700">
          A list of all your orders including their status, date, and total amount.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <NuxtLink
          to="/orders/new"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
        >
          New Order
        </NuxtLink>
      </div>
    </div>

    <!-- Real-time Status Banner -->
    <div v-if="activeOrders.length > 0" class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-center">
        <svg class="h-5 w-5 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="flex-1">
          <h3 class="text-sm font-medium text-blue-800">
            {{ activeOrders.length }} Active Order{{ activeOrders.length > 1 ? 's' : '' }}
          </h3>
          <p class="text-sm text-blue-700">
            Track your orders in real-time. Updates are automatically refreshed.
          </p>
        </div>
        <button
          @click="refreshOrders"
          :disabled="isRefreshing"
          class="ml-3 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <svg v-if="isRefreshing" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="mt-6 bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-5">
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              v-model="filters.status"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label for="supplier" class="block text-sm font-medium text-gray-700">Supplier</label>
            <select
              id="supplier"
              v-model="filters.supplierId"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Suppliers</option>
              <option v-for="supplier in uniqueSuppliers" :key="supplier.id" :value="supplier.id">
                {{ supplier.businessName }}
              </option>
            </select>
          </div>

          <div>
            <label for="dateFrom" class="block text-sm font-medium text-gray-700">From Date</label>
            <input
              id="dateFrom"
              v-model="filters.dateFrom"
              type="date"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label for="dateTo" class="block text-sm font-medium text-gray-700">To Date</label>
            <input
              id="dateTo"
              v-model="filters.dateTo"
              type="date"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
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
    </div>

    <!-- Orders Table -->
    <div class="mt-8 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" class="relative px-6 py-3">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="order in filteredOrders" :key="order.id" :class="{ 'bg-blue-50': isActiveOrder(order) }">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="text-sm font-medium text-gray-900">
                        #{{ order.orderNumber || order.id.slice(-8) }}
                      </div>
                      <div v-if="isActiveOrder(order)" class="ml-2">
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          <svg class="animate-pulse h-2 w-2 mr-1" fill="currentColor" viewBox="0 0 8 8">
                            <circle cx="4" cy="4" r="3" />
                          </svg>
                          Live
                        </span>
                      </div>
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatDate(order.createdAt) }}</div>
                    <div v-if="order.estimatedDeliveryDate" class="text-xs text-gray-500">
                      ETA: {{ formatDate(order.estimatedDeliveryDate) }}
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-8 w-8">
                        <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span class="text-xs font-medium text-gray-600">
                            {{ order.supplier?.businessName?.charAt(0) || 'S' }}
                          </span>
                        </div>
                      </div>
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">
                          {{ order.supplier?.businessName || 'Unknown Supplier' }}
                        </div>
                        <div v-if="order.supplier?.rating" class="flex items-center">
                          <svg class="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span class="ml-1 text-xs text-gray-500">{{ order.supplier.rating }}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ order.items.length }} item{{ order.items.length > 1 ? 's' : '' }}</div>
                    <div class="text-xs text-gray-500">
                      {{ getOrderItemsSummary(order.items) }}
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">₦{{ formatCurrency(order.totalAmount) }}</div>
                    <div v-if="order.deliveryFee" class="text-xs text-gray-500">
                      +₦{{ formatCurrency(order.deliveryFee) }} delivery
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex flex-col space-y-1">
                      <span
                        class="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full"
                        :class="getStatusColor(order.status)"
                      >
                        <svg v-if="isActiveOrder(order)" class="animate-spin -ml-1 mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ formatStatus(order.status) }}
                      </span>

                      <!-- Progress Bar for Active Orders -->
                      <div v-if="isActiveOrder(order)" class="w-full bg-gray-200 rounded-full h-1">
                        <div
                          class="bg-blue-600 h-1 rounded-full transition-all duration-300"
                          :style="{ width: `${getOrderProgress(order.status)}%` }"
                        ></div>
                      </div>
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center justify-end space-x-2">
                      <NuxtLink
                        :to="`/orders/${order.id}`"
                        class="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        View Details
                      </NuxtLink>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="orders.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No orders</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by placing your first order.</p>
      <div class="mt-6">
        <NuxtLink
          to="/orders/new"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Place Order
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order, OrderStatus } from '~/types'
import { ORDER_STATUSES } from '~/constants'

// Set page meta
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

// Set head
useHead({
  title: 'Orders - GasConnect',
  meta: [
    {
      name: 'description',
      content: 'View and manage your gas orders on GasConnect.'
    }
  ]
})

// Reactive state
const orders = ref<Order[]>([])
const isLoading = ref(false)
const isRefreshing = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const totalOrders = ref(0)
const totalPages = computed(() => Math.ceil(totalOrders.value / pageSize.value))

const filters = reactive({
  status: '',
  supplierId: '',
  dateFrom: '',
  dateTo: ''
})

// Composables
const { apiCall } = useApi()

// Real-time tracking
let refreshInterval: NodeJS.Timeout | null = null

// Computed properties
const activeOrders = computed(() => {
  return orders.value.filter(order =>
    ['pending', 'confirmed', 'processing', 'shipped'].includes(order.status)
  )
})

const uniqueSuppliers = computed(() => {
  const suppliers = orders.value
    .map(order => order.supplier)
    .filter(Boolean)
    .filter((supplier, index, self) =>
      index === self.findIndex(s => s?.id === supplier?.id)
    )
  return suppliers
})

const filteredOrders = computed(() => {
  let filtered = orders.value

  if (filters.status) {
    filtered = filtered.filter(order => order.status === filters.status)
  }

  if (filters.supplierId) {
    filtered = filtered.filter(order => order.supplierId === filters.supplierId)
  }

  if (filters.dateFrom) {
    filtered = filtered.filter(order =>
      new Date(order.createdAt) >= new Date(filters.dateFrom)
    )
  }

  if (filters.dateTo) {
    filtered = filtered.filter(order =>
      new Date(order.createdAt) <= new Date(filters.dateTo)
    )
  }

  return filtered
})

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG').format(amount)
}

const isActiveOrder = (order: Order): boolean => {
  return ['pending', 'confirmed', 'processing', 'shipped'].includes(order.status)
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

const getOrderItemsSummary = (items: any[]): string => {
  if (items.length === 0) return 'No items'
  if (items.length === 1) return items[0].gasType?.name || 'Gas cylinder'
  return `${items[0].gasType?.name || 'Gas cylinder'} +${items.length - 1} more`
}

const clearFilters = () => {
  filters.status = ''
  filters.supplierId = ''
  filters.dateFrom = ''
  filters.dateTo = ''
}

// Mock data for now - replace with real API calls
const mockOrders: Order[] = [
  {
    id: '1234567890abcdef',
    customerId: 'user1',
    supplierId: 'supplier1',
    deliveryAddressId: 'addr1',
    type: 'regular',
    status: 'delivered',
    items: [
      {
        id: 'item1',
        gasTypeId: 'lpg_12_5kg',
        quantity: 2,
        unitPrice: 8500,
        totalPrice: 17000
      }
    ],
    totalAmount: 17000,
    deliveryFee: 1500,
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T15:00:00Z',
    supplier: {
      businessName: 'Lagos Gas Co.'
    }
  },
  {
    id: '2345678901bcdefg',
    customerId: 'user1',
    supplierId: 'supplier2',
    deliveryAddressId: 'addr1',
    type: 'regular',
    status: 'out_for_delivery',
    items: [
      {
        id: 'item2',
        gasTypeId: 'lpg_6kg',
        quantity: 1,
        unitPrice: 4500,
        totalPrice: 4500
      }
    ],
    totalAmount: 4500,
    deliveryFee: 1000,
    createdAt: '2025-01-02T08:00:00Z',
    updatedAt: '2025-01-02T12:00:00Z',
    supplier: {
      businessName: 'Abuja Gas Supply'
    }
  }
]

// Initialize with mock data
orders.value = mockOrders
totalOrders.value = mockOrders.length

// Utility functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatStatus = (status: OrderStatus) => {
  const statusMap: Record<OrderStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded'
  }
  return statusMap[status] || status
}

const getStatusColor = (status: OrderStatus) => {
  const colorMap: Record<OrderStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-purple-100 text-purple-800',
    out_for_delivery: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800'
  }
  return colorMap[status] || 'bg-gray-100 text-gray-800'
}

// Filter and pagination functions
const applyFilters = async () => {
  isLoading.value = true
  currentPage.value = 1

  try {
    // TODO: Replace with real API call
    // const response = await apiCall('/api/v1/orders', {
    //   method: 'GET',
    //   query: {
    //     page: currentPage.value,
    //     limit: pageSize.value,
    //     status: filters.status,
    //     dateFrom: filters.dateFrom,
    //     dateTo: filters.dateTo
    //   }
    // })

    // For now, filter mock data
    let filteredOrders = [...mockOrders]

    if (filters.status) {
      filteredOrders = filteredOrders.filter(order => order.status === filters.status)
    }

    if (filters.dateFrom) {
      filteredOrders = filteredOrders.filter(order =>
        new Date(order.createdAt) >= new Date(filters.dateFrom)
      )
    }

    if (filters.dateTo) {
      filteredOrders = filteredOrders.filter(order =>
        new Date(order.createdAt) <= new Date(filters.dateTo)
      )
    }

    orders.value = filteredOrders
    totalOrders.value = filteredOrders.length
  } catch (error) {
    console.error('Error fetching orders:', error)
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

// Real-time refresh functionality
const refreshOrders = async () => {
  if (isRefreshing.value) return

  isRefreshing.value = true

  try {
    // Real API call to get latest orders
    const response = await apiCall('/api/v1/orders', {
      params: {
        page: currentPage.value,
        limit: pageSize.value,
        status: filters.status,
        supplierId: filters.supplierId,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo
      }
    })

    if (response.success) {
      orders.value = response.data.orders || []
      totalOrders.value = response.data.total || 0

      const toast = useNuxtApp().$toast
      if (toast) {
        toast.success('Orders updated')
      }
    } else {
      throw new Error(response.message || 'Failed to load orders')
    }
  } catch (error: any) {
    console.error('Error refreshing orders:', error)

    // Fallback to current filter logic for development
    await applyFilters()

    const toast = useNuxtApp().$toast
    if (toast) {
      toast.warning('Using demo data - API connection failed')
    }
  } finally {
    isRefreshing.value = false
  }
}

// Start real-time updates for active orders
const startRealTimeUpdates = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }

  // Refresh every 30 seconds if there are active orders
  refreshInterval = setInterval(() => {
    if (activeOrders.value.length > 0) {
      refreshOrders()
    }
  }, 30000)
}

// Stop real-time updates
const stopRealTimeUpdates = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
}

// Load orders on mount
onMounted(() => {
  applyFilters()
  startRealTimeUpdates()
})

// Cleanup on unmount
onUnmounted(() => {
  stopRealTimeUpdates()
})

// Watch for active orders changes to manage real-time updates
watch(activeOrders, (newActiveOrders) => {
  if (newActiveOrders.length > 0) {
    startRealTimeUpdates()
  } else {
    stopRealTimeUpdates()
  }
}, { immediate: true })
</script>