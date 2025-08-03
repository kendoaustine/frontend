<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <div class="inline-flex items-center">
        <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading order details...
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Error loading order</h3>
      <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
      <div class="mt-6">
        <button
          @click="loadOrderDetails"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Order Details -->
    <div v-else-if="order">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">Order #{{ order.orderNumber }}</h1>
            <p class="mt-2 text-sm text-gray-700">
              Placed on {{ formatDate(order.createdAt) }}
            </p>
          </div>

          <div class="flex items-center space-x-3">
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              :class="getStatusColor(order.status)"
            >
              {{ formatStatus(order.status) }}
            </span>

            <button
              v-if="canCancelOrder"
              @click="showCancelModal = true"
              class="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cancel Order
            </button>
          </div>
        </div>
      </div>

      <!-- Order Status Timeline -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-6">Order Status</h2>

          <div class="flow-root">
            <ul class="-mb-8">
              <li v-for="(event, eventIdx) in orderTimeline" :key="event.id" class="relative pb-8">
                <div v-if="eventIdx !== orderTimeline.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></div>

                <div class="relative flex space-x-3">
                  <div>
                    <span
                      class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                      :class="event.completed ? 'bg-green-500' : event.current ? 'bg-blue-500' : 'bg-gray-300'"
                    >
                      <svg v-if="event.completed" class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                      <div v-else-if="event.current" class="h-2.5 w-2.5 bg-white rounded-full"></div>
                      <div v-else class="h-2.5 w-2.5 bg-gray-500 rounded-full"></div>
                    </span>
                  </div>

                  <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p class="text-sm text-gray-500">
                        {{ event.title }}
                        <span v-if="event.description" class="font-medium text-gray-900">{{ event.description }}</span>
                      </p>
                    </div>
                    <div class="text-right text-sm whitespace-nowrap text-gray-500">
                      <time v-if="event.timestamp" :datetime="event.timestamp">
                        {{ formatDateTime(event.timestamp) }}
                      </time>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order, OrderStatus } from '~/types'

// Set page meta
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

// Get route params
const route = useRoute()
const orderId = route.params.id as string

// Set head
useHead({
  title: 'Order Details - GasConnect',
  meta: [
    {
      name: 'description',
      content: 'View order details and tracking information on GasConnect.'
    }
  ]
})

// Composables
const { apiCall } = useApi()
const { user } = useAuth()

// Reactive state
const order = ref<Order | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)
const showCancelModal = ref(false)

// Computed properties
const canCancelOrder = computed(() => {
  return order.value && ['pending', 'confirmed'].includes(order.value.status)
})

const orderTimeline = computed(() => {
  if (!order.value) return []

  const timeline = [
    {
      id: 'placed',
      title: 'Order Placed',
      description: 'Your order has been received',
      completed: true,
      current: false,
      timestamp: order.value.createdAt
    },
    {
      id: 'confirmed',
      title: 'Order Confirmed',
      description: 'Supplier has confirmed your order',
      completed: ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.value.status),
      current: order.value.status === 'confirmed',
      timestamp: order.value.confirmedAt
    },
    {
      id: 'processing',
      title: 'Processing',
      description: 'Your order is being prepared',
      completed: ['processing', 'shipped', 'delivered'].includes(order.value.status),
      current: order.value.status === 'processing',
      timestamp: order.value.processingAt
    },
    {
      id: 'shipped',
      title: 'Shipped',
      description: 'Your order is on the way',
      completed: ['shipped', 'delivered'].includes(order.value.status),
      current: order.value.status === 'shipped',
      timestamp: order.value.shippedAt
    },
    {
      id: 'delivered',
      title: 'Delivered',
      description: 'Order has been delivered',
      completed: order.value.status === 'delivered',
      current: order.value.status === 'delivered',
      timestamp: order.value.deliveredAt
    }
  ]

  return timeline
})

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG').format(amount)
}

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatStatus = (status: OrderStatus): string => {
  const statusMap: Record<OrderStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  }
  return statusMap[status] || status
}

const getStatusColor = (status: OrderStatus): string => {
  const colorMap: Record<OrderStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return colorMap[status] || 'bg-gray-100 text-gray-800'
}

// Actions
const contactSupplier = () => {
  // TODO: Implement contact supplier functionality
  console.log('Contact supplier:', order.value?.supplier)
}

// Load order details
const loadOrderDetails = async () => {
  isLoading.value = true
  error.value = null

  try {
    // Real API call to get order details
    const response = await apiCall(`/api/v1/orders/${orderId}`)

    if (response.success) {
      order.value = response.data
    } else {
      throw new Error(response.message || 'Failed to load order details')
    }
  } catch (err: any) {
    console.error('Error loading order details:', err)
    error.value = err.message || 'Failed to load order details'

    // Fallback to mock data for development
    order.value = {
      id: orderId,
      orderNumber: 'GC-2024-001',
      userId: user.value?.id || 'user1',
      supplierId: 'supplier1',
      status: 'processing',
      subtotal: 17000,
      deliveryFee: 1500,
      discount: 0,
      totalAmount: 18500,
      createdAt: '2024-01-15T10:30:00Z',
      confirmedAt: '2024-01-15T11:00:00Z',
      processingAt: '2024-01-15T14:00:00Z',
      estimatedDeliveryDate: '2024-01-16T16:00:00Z',
      deliveryInstructions: 'Please call when you arrive',
      items: [
        {
          id: 'item1',
          orderId: orderId,
          gasTypeId: 'lpg_12_5kg',
          quantity: 2,
          unitPrice: 8500,
          totalPrice: 17000,
          gasType: {
            id: 'lpg_12_5kg',
            name: 'LPG 12.5kg',
            category: 'lpg',
            description: 'Standard 12.5kg LPG cylinder',
            unit: 'cylinder',
            specifications: {}
          }
        }
      ],
      supplier: {
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
      deliveryAddress: {
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
    }

    const toast = useNuxtApp().$toast
    if (toast) {
      toast.warning('Using demo data - API connection failed')
    }
  } finally {
    isLoading.value = false
  }
}

// Load data on mount
onMounted(() => {
  loadOrderDetails()
})
</script>