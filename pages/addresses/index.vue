<template>
  <div>
    <!-- Header -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Delivery Addresses</h1>
        <p class="mt-2 text-sm text-gray-700">
          Manage your delivery addresses for gas orders.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <NuxtLink
          to="/addresses/new"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
        >
          Add Address
        </NuxtLink>
      </div>
    </div>

    <!-- Addresses List -->
    <div class="mt-8 space-y-4">
      <div
        v-for="address in addresses"
        :key="address.id"
        class="bg-white shadow rounded-lg p-6"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center">
              <h3 class="text-lg font-medium text-gray-900">
                {{ address.type.charAt(0).toUpperCase() + address.type.slice(1) }} Address
              </h3>
              <span v-if="address.isDefault" class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Default
              </span>
            </div>
            <p class="mt-1 text-sm text-gray-600">
              {{ address.street }}
            </p>
            <p class="text-sm text-gray-600">
              {{ address.city }}, {{ address.state }} {{ address.postalCode }}
            </p>
            <p class="text-sm text-gray-600">
              {{ address.country }}
            </p>
            <p v-if="address.deliveryInstructions" class="mt-2 text-sm text-gray-500">
              <span class="font-medium">Instructions:</span> {{ address.deliveryInstructions }}
            </p>
          </div>
          <div class="flex space-x-2">
            <NuxtLink
              :to="`/addresses/${address.id}/edit`"
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit
            </NuxtLink>
            <button
              v-if="!address.isDefault"
              @click="setAsDefault(address.id)"
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Set Default
            </button>
            <button
              v-if="!address.isDefault"
              @click="deleteAddress(address.id)"
              class="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="addresses.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No addresses</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by adding your first delivery address.</p>
      <div class="mt-6">
        <NuxtLink
          to="/addresses/new"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Address
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Address } from '~/types'

// Set page meta
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

// Set head
useHead({
  title: 'Addresses - GasConnect',
  meta: [
    {
      name: 'description',
      content: 'Manage your delivery addresses for gas orders.'
    }
  ]
})

// Reactive state
const isLoading = ref(false)
const addresses = ref<Address[]>([])

// Load addresses from API
const loadAddresses = async () => {
  isLoading.value = true
  try {
    // Real API call to get addresses
    const response = await apiCall('/api/v1/addresses')

    if (response.success) {
      addresses.value = response.data || []
    } else {
      throw new Error(response.message || 'Failed to load addresses')
    }
  } catch (error: any) {
    console.error('Error loading addresses:', error)

    // Fallback to mock data for development
    addresses.value = [
      {
        id: 'addr1',
        userId: 'user1',
        type: 'home',
        street: '123 Main Street, Victoria Island',
        city: 'Lagos',
        state: 'Lagos',
        postalCode: '101001',
        country: 'Nigeria',
        isDefault: true,
        deliveryInstructions: 'Ring the bell twice',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'addr2',
        userId: 'user1',
        type: 'work',
        street: '456 Business District, Ikoyi',
        city: 'Lagos',
        state: 'Lagos',
        postalCode: '101001',
        country: 'Nigeria',
        isDefault: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ]

    const toast = useNuxtApp().$toast
    if (toast) {
      toast.warning('Using demo data - API connection failed')
    }
  } finally {
    isLoading.value = false
  }
}

// Methods
const setAsDefault = async (addressId: string) => {
  try {
    // Real API call to update default address
    const response = await apiCall(`/api/v1/addresses/${addressId}/default`, {
      method: 'PUT'
    })

    if (response.success) {
      // Update local state
      addresses.value.forEach(addr => {
        addr.isDefault = addr.id === addressId
      })

      const toast = useNuxtApp().$toast
      if (toast) {
        toast.success('Default address updated')
      }
    } else {
      throw new Error(response.message || 'Failed to update default address')
    }
  } catch (error: any) {
    console.error('Error setting default address:', error)
    const toast = useNuxtApp().$toast
    if (toast) {
      toast.error(error.message || 'Failed to update default address')
    }
  }
}

const deleteAddress = async (addressId: string) => {
  if (confirm('Are you sure you want to delete this address?')) {
    try {
      // Real API call to delete address
      const response = await apiCall(`/api/v1/addresses/${addressId}`, {
        method: 'DELETE'
      })

      if (response.success) {
        // Remove from local state
        addresses.value = addresses.value.filter(addr => addr.id !== addressId)

        const toast = useNuxtApp().$toast
        if (toast) {
          toast.success('Address deleted successfully')
        }
      } else {
        throw new Error(response.message || 'Failed to delete address')
      }
    } catch (error: any) {
      console.error('Error deleting address:', error)
      const toast = useNuxtApp().$toast
      if (toast) {
        toast.error(error.message || 'Failed to delete address')
      }
    }
  }
}

// Load addresses on mount
onMounted(() => {
  loadAddresses()
})
</script>