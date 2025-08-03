<template>
  <div class="real-time-tracker">
    <!-- Connection Status -->
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <div
          class="w-3 h-3 rounded-full"
          :class="isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'"
        ></div>
        <span class="text-sm text-gray-600">
          {{ isConnected ? 'Live tracking active' : 'Using offline mode' }}
        </span>
      </div>
      
      <div class="flex items-center space-x-2">
        <span v-if="lastUpdate" class="text-xs text-gray-500">
          Updated {{ formatTime(lastUpdate) }}
        </span>
        <button
          @click="refresh"
          :disabled="isLoading"
          class="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          <Icon 
            name="heroicons:arrow-path" 
            class="w-4 h-4"
            :class="{ 'animate-spin': isLoading }"
          />
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !trackingData" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Loading tracking information...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <Icon name="heroicons:exclamation-triangle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
      <p class="text-red-600 mb-4">{{ error }}</p>
      <button
        @click="refresh"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>

    <!-- Tracking Content -->
    <div v-else-if="trackingData" class="space-y-6">
      <!-- Progress Bar -->
      <div class="bg-white rounded-lg p-6 shadow-sm border">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Order Progress</h3>
          <span class="text-sm font-medium text-blue-600">{{ Math.round(progress) }}% Complete</span>
        </div>
        
        <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
        
        <div class="flex justify-between text-sm text-gray-600">
          <span>Order Placed</span>
          <span>In Transit</span>
          <span>Delivered</span>
        </div>
      </div>

      <!-- Current Status -->
      <div class="bg-white rounded-lg p-6 shadow-sm border">
        <div class="flex items-center space-x-4">
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center"
            :class="getStatusIconClass(trackingData.status)"
          >
            <Icon :name="getStatusIcon(trackingData.status)" class="w-6 h-6" />
          </div>
          
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 capitalize">
              {{ trackingData.status.replace('_', ' ') }}
            </h3>
            <p class="text-gray-600">
              {{ getStatusMessage(trackingData.status) }}
            </p>
          </div>
          
          <div v-if="estimatedArrivalTime" class="text-right">
            <p class="text-sm text-gray-500">Estimated Arrival</p>
            <p class="font-semibold text-gray-900">
              {{ formatEstimatedTime(estimatedArrivalTime) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Driver Information -->
      <div v-if="trackingData.driverInfo" class="bg-white rounded-lg p-6 shadow-sm border">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Driver Information</h3>
        
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Icon name="heroicons:user" class="w-6 h-6 text-blue-600" />
          </div>
          
          <div class="flex-1">
            <p class="font-medium text-gray-900">{{ trackingData.driverInfo.name }}</p>
            <p class="text-sm text-gray-600">{{ trackingData.driverInfo.vehicleNumber }}</p>
          </div>
          
          <a
            :href="`tel:${trackingData.driverInfo.phone}`"
            class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Icon name="heroicons:phone" class="w-4 h-4" />
            <span>Call</span>
          </a>
        </div>
      </div>

      <!-- Live Location Map -->
      <div v-if="trackingData.currentLocation" class="bg-white rounded-lg p-6 shadow-sm border">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Live Location</h3>
        
        <div class="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
          <div class="text-center">
            <Icon name="heroicons:map-pin" class="w-12 h-12 text-blue-600 mx-auto mb-2" />
            <p class="text-gray-600">Map integration coming soon</p>
            <p class="text-sm text-gray-500 mt-2">
              Current location: {{ trackingData.currentLocation.address || 'Lagos, Nigeria' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div class="bg-white rounded-lg p-6 shadow-sm border">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h3>
        
        <div class="space-y-4">
          <div
            v-for="(event, index) in trackingData.timeline"
            :key="event.id"
            class="flex items-start space-x-4"
          >
            <div class="flex flex-col items-center">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center"
                :class="index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'"
              >
                <Icon :name="getTimelineIcon(event.status)" class="w-4 h-4" />
              </div>
              <div
                v-if="index < trackingData.timeline.length - 1"
                class="w-0.5 h-8 mt-2"
                :class="index === 0 ? 'bg-blue-600' : 'bg-gray-200'"
              ></div>
            </div>
            
            <div class="flex-1 pb-8">
              <div class="flex items-center justify-between">
                <h4 class="font-medium text-gray-900 capitalize">
                  {{ event.status.replace('_', ' ') }}
                </h4>
                <span class="text-sm text-gray-500">
                  {{ formatEventTime(event.timestamp) }}
                </span>
              </div>
              <p class="text-gray-600 mt-1">{{ event.message }}</p>
              
              <div v-if="event.location" class="mt-2 text-sm text-gray-500">
                <Icon name="heroicons:map-pin" class="w-4 h-4 inline mr-1" />
                {{ event.location.address || 'Lagos, Nigeria' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Emergency SOS Button -->
      <div v-if="isActive" class="bg-red-50 border border-red-200 rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-red-900">Emergency Assistance</h3>
            <p class="text-red-700">Need immediate help with your delivery?</p>
          </div>
          
          <button
            @click="sendEmergencySOS"
            class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            SOS
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  orderId: string
}

const props = defineProps<Props>()

// Composables
const { 
  trackingData, 
  isLoading, 
  error, 
  lastUpdate, 
  isActive, 
  progress, 
  estimatedArrivalTime, 
  refresh 
} = useOrderTracking(props.orderId)

const { isConnected, sendEmergencySOS: sendSOS } = useWebSocket()

// Methods
const getStatusIcon = (status: string): string => {
  const icons: Record<string, string> = {
    pending: 'heroicons:clock',
    confirmed: 'heroicons:check-circle',
    processing: 'heroicons:cog-6-tooth',
    shipped: 'heroicons:truck',
    out_for_delivery: 'heroicons:map-pin',
    delivered: 'heroicons:check-badge'
  }
  return icons[status] || 'heroicons:information-circle'
}

const getStatusIconClass = (status: string): string => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-600',
    confirmed: 'bg-blue-100 text-blue-600',
    processing: 'bg-purple-100 text-purple-600',
    shipped: 'bg-indigo-100 text-indigo-600',
    out_for_delivery: 'bg-green-100 text-green-600',
    delivered: 'bg-emerald-100 text-emerald-600'
  }
  return classes[status] || 'bg-gray-100 text-gray-600'
}

const getStatusMessage = (status: string): string => {
  const messages: Record<string, string> = {
    pending: 'Your order is being reviewed',
    confirmed: 'Order confirmed and being prepared',
    processing: 'Your order is being prepared for shipment',
    shipped: 'Order has been shipped and is on the way',
    out_for_delivery: 'Driver is on the way to your location',
    delivered: 'Order has been delivered successfully'
  }
  return messages[status] || 'Order status updated'
}

const getTimelineIcon = (status: string): string => {
  return getStatusIcon(status)
}

const formatTime = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  
  return date.toLocaleDateString()
}

const formatEventTime = (timestamp: string): string => {
  const date = new Date(timestamp)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatEstimatedTime = (date: Date): string => {
  return date.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

const sendEmergencySOS = async () => {
  try {
    // Get current location if available
    const location = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })

    await sendSOS({
      orderId: props.orderId,
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      },
      message: 'Emergency assistance requested for delivery'
    })

    // Show success notification
    const { addNotification } = useNotifications()
    addNotification({
      type: 'success',
      title: 'Emergency SOS Sent',
      message: 'Help is on the way. You will be contacted shortly.',
      duration: 5000
    })

  } catch (error) {
    console.error('Failed to send emergency SOS:', error)
    
    const { addNotification } = useNotifications()
    addNotification({
      type: 'error',
      title: 'SOS Failed',
      message: 'Unable to send emergency signal. Please call support directly.',
      persistent: true
    })
  }
}
</script>
