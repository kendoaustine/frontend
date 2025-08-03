<template>
  <div class="emergency-page">
    <DashboardLayout>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Page Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Emergency Services</h1>
              <p class="mt-2 text-gray-600">
                Quick access to emergency gas delivery and contact management
              </p>
            </div>
            
            <!-- Emergency SOS Button -->
            <EmergencySOSButton
              :is-pulsing="true"
              @emergency-submitted="handleEmergencySubmitted"
            />
          </div>
        </div>

        <!-- Emergency Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <Icon name="heroicons:clock" class="w-8 h-8 text-green-600" />
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Average Response</p>
                <p class="text-2xl font-bold text-gray-900">15 min</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <Icon name="heroicons:truck" class="w-8 h-8 text-blue-600" />
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Active Drivers</p>
                <p class="text-2xl font-bold text-gray-900">24/7</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <Icon name="heroicons:check-circle" class="w-8 h-8 text-green-600" />
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Success Rate</p>
                <p class="text-2xl font-bold text-gray-900">99.8%</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <Icon name="heroicons:phone" class="w-8 h-8 text-red-600" />
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Emergency Line</p>
                <p class="text-lg font-bold text-gray-900">0800-GAS-SOS</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Navigation -->
        <div class="mb-8">
          <nav class="flex space-x-8">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
              :class="activeTab === tab.id 
                ? 'border-red-500 text-red-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              <Icon :name="tab.icon" class="w-5 h-5 inline mr-2" />
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- Emergency Order Tab -->
          <div v-if="activeTab === 'order'" class="space-y-6">
            <SOSOrderForm
              :addresses="userAddresses"
              @order-submitted="handleOrderSubmitted"
              @cancel="handleOrderCancelled"
            />
          </div>

          <!-- Emergency Contacts Tab -->
          <div v-if="activeTab === 'contacts'" class="space-y-6">
            <EmergencyContactForm
              @contact-saved="handleContactSaved"
              @contact-deleted="handleContactDeleted"
            />
          </div>

          <!-- Emergency History Tab -->
          <div v-if="activeTab === 'history'" class="space-y-6">
            <div class="bg-white rounded-lg shadow">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900">Emergency Order History</h3>
              </div>
              
              <div class="p-6">
                <div v-if="emergencyHistory.length === 0" class="text-center py-12">
                  <Icon name="heroicons:document-text" class="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p class="text-gray-500">No emergency orders yet</p>
                  <p class="text-sm text-gray-400">Your emergency order history will appear here</p>
                </div>

                <div v-else class="space-y-4">
                  <div
                    v-for="order in emergencyHistory"
                    :key="order.id"
                    class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    <div class="flex items-center justify-between">
                      <div>
                        <div class="flex items-center space-x-2">
                          <span class="font-medium">{{ order.gasType }}</span>
                          <span class="text-gray-500">×{{ order.quantity }}</span>
                          <span
                            class="px-2 py-1 text-xs font-medium rounded-full"
                            :class="getStatusClass(order.status)"
                          >
                            {{ order.status }}
                          </span>
                        </div>
                        <p class="text-sm text-gray-600 mt-1">{{ order.emergencyType }} - {{ order.urgencyLevel }}</p>
                        <p class="text-xs text-gray-500">{{ formatDate(order.createdAt) }}</p>
                      </div>
                      <div class="text-right">
                        <p class="font-medium">₦{{ order.totalAmount.toLocaleString() }}</p>
                        <p class="text-sm text-gray-500">{{ order.deliveryTime }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Emergency Guidelines Tab -->
          <div v-if="activeTab === 'guidelines'" class="space-y-6">
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Emergency Service Guidelines</h3>
              
              <div class="space-y-6">
                <div>
                  <h4 class="font-medium text-gray-900 mb-2">When to Use Emergency Service</h4>
                  <ul class="text-sm text-gray-600 space-y-1">
                    <li>• Medical facilities running out of oxygen</li>
                    <li>• Complete gas outage affecting cooking or heating</li>
                    <li>• Business operations critically affected</li>
                    <li>• Safety-critical situations requiring immediate gas supply</li>
                  </ul>
                </div>

                <div>
                  <h4 class="font-medium text-gray-900 mb-2">Response Times</h4>
                  <ul class="text-sm text-gray-600 space-y-1">
                    <li>• <strong>Critical:</strong> 0-15 minutes (50% emergency fee)</li>
                    <li>• <strong>High:</strong> 15-30 minutes (30% emergency fee)</li>
                    <li>• <strong>Medium:</strong> 30-60 minutes (20% emergency fee)</li>
                  </ul>
                </div>

                <div>
                  <h4 class="font-medium text-gray-900 mb-2">Emergency Contacts</h4>
                  <ul class="text-sm text-gray-600 space-y-1">
                    <li>• <strong>24/7 Emergency Line:</strong> 0800-GAS-SOS</li>
                    <li>• <strong>WhatsApp Emergency:</strong> +234-800-GAS-SOS</li>
                    <li>• <strong>Email:</strong> emergency@gasconnect.ng</li>
                  </ul>
                </div>

                <div>
                  <h4 class="font-medium text-gray-900 mb-2">Payment & Pricing</h4>
                  <ul class="text-sm text-gray-600 space-y-1">
                    <li>• Emergency fees are added to standard pricing</li>
                    <li>• Payment can be made on delivery or via mobile payment</li>
                    <li>• Corporate accounts available for hospitals and businesses</li>
                    <li>• Insurance claims supported for medical emergencies</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  </div>
</template>

<script setup lang="ts">
// Page metadata
definePageMeta({
  middleware: 'auth',
  layout: false
})

// Reactive state
const activeTab = ref('order')

const tabs = [
  { id: 'order', name: 'Emergency Order', icon: 'heroicons:bolt' },
  { id: 'contacts', name: 'Emergency Contacts', icon: 'heroicons:phone' },
  { id: 'history', name: 'Order History', icon: 'heroicons:clock' },
  { id: 'guidelines', name: 'Guidelines', icon: 'heroicons:information-circle' }
]

// Mock data - replace with actual API calls
const userAddresses = ref([
  {
    id: '1',
    label: 'Home',
    street: '123 Lagos Street',
    city: 'Lagos'
  },
  {
    id: '2',
    label: 'Office',
    street: '456 Victoria Island',
    city: 'Lagos'
  }
])

const emergencyHistory = ref([
  {
    id: '1',
    gasType: 'LPG 12.5kg',
    quantity: 2,
    emergencyType: 'Cooking Emergency',
    urgencyLevel: 'High',
    status: 'Delivered',
    totalAmount: 22100,
    deliveryTime: '18 minutes',
    createdAt: '2025-08-01T10:30:00Z'
  },
  {
    id: '2',
    gasType: 'Medical Oxygen',
    quantity: 1,
    emergencyType: 'Medical Emergency',
    urgencyLevel: 'Critical',
    status: 'Delivered',
    totalAmount: 22500,
    deliveryTime: '12 minutes',
    createdAt: '2025-07-28T14:15:00Z'
  }
])

// Methods
const handleEmergencySubmitted = (data: any) => {
  console.log('Emergency submitted:', data)
  // Handle emergency submission
  activeTab.value = 'history'
}

const handleOrderSubmitted = (data: any) => {
  console.log('Order submitted:', data)
  // Add to history
  emergencyHistory.value.unshift({
    id: Date.now().toString(),
    gasType: data.gasType,
    quantity: data.quantity,
    emergencyType: data.emergencyType,
    urgencyLevel: data.urgencyLevel,
    status: 'Processing',
    totalAmount: data.totalEstimate,
    deliveryTime: 'Pending',
    createdAt: new Date().toISOString()
  })
  activeTab.value = 'history'
}

const handleOrderCancelled = () => {
  console.log('Order cancelled')
}

const handleContactSaved = (data: any) => {
  console.log('Contact saved:', data)
  // Handle contact save
}

const handleContactDeleted = (contact: any) => {
  console.log('Contact deleted:', contact)
  // Handle contact deletion
}

const getStatusClass = (status: string) => {
  const classes = {
    'Processing': 'bg-yellow-100 text-yellow-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
    'In Transit': 'bg-blue-100 text-blue-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
