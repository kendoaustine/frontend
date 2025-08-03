<template>
  <div class="connection-status">
    <!-- Connection Indicator -->
    <div
      class="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm"
      :class="statusClass"
    >
      <div
        class="w-2 h-2 rounded-full"
        :class="indicatorClass"
      ></div>
      <span class="font-medium">{{ statusText }}</span>
      
      <!-- Reconnect Button -->
      <button
        v-if="!isConnected && !isConnecting"
        @click="reconnect"
        class="ml-2 text-xs underline hover:no-underline"
      >
        Reconnect
      </button>
    </div>

    <!-- Detailed Status Modal -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="showDetails"
        class="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
        @click.stop
      >
        <div class="p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Connection Status</h3>
            <button
              @click="showDetails = false"
              class="text-gray-400 hover:text-gray-600"
            >
              <Icon name="heroicons:x-mark" class="w-5 h-5" />
            </button>
          </div>

          <!-- Connection Details -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">WebSocket Status</span>
              <span
                class="text-sm font-medium"
                :class="isConnected ? 'text-green-600' : 'text-red-600'"
              >
                {{ isConnected ? 'Connected' : 'Disconnected' }}
              </span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Real-time Updates</span>
              <span
                class="text-sm font-medium"
                :class="isConnected ? 'text-green-600' : 'text-yellow-600'"
              >
                {{ isConnected ? 'Active' : 'Polling Fallback' }}
              </span>
            </div>

            <div v-if="lastConnectionTime" class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Last Connected</span>
              <span class="text-sm text-gray-900">
                {{ formatTime(lastConnectionTime) }}
              </span>
            </div>

            <div v-if="reconnectAttempts > 0" class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Reconnect Attempts</span>
              <span class="text-sm text-gray-900">
                {{ reconnectAttempts }}
              </span>
            </div>
          </div>

          <!-- Features Status -->
          <div class="mt-4 pt-4 border-t border-gray-200">
            <h4 class="text-sm font-medium text-gray-900 mb-3">Features</h4>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Order Tracking</span>
                <div class="flex items-center space-x-1">
                  <div
                    class="w-2 h-2 rounded-full"
                    :class="isConnected ? 'bg-green-500' : 'bg-yellow-500'"
                  ></div>
                  <span class="text-xs text-gray-500">
                    {{ isConnected ? 'Live' : 'Polling' }}
                  </span>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Notifications</span>
                <div class="flex items-center space-x-1">
                  <div
                    class="w-2 h-2 rounded-full"
                    :class="isConnected ? 'bg-green-500' : 'bg-red-500'"
                  ></div>
                  <span class="text-xs text-gray-500">
                    {{ isConnected ? 'Real-time' : 'Disabled' }}
                  </span>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Analytics</span>
                <div class="flex items-center space-x-1">
                  <div
                    class="w-2 h-2 rounded-full"
                    :class="isConnected ? 'bg-green-500' : 'bg-yellow-500'"
                  ></div>
                  <span class="text-xs text-gray-500">
                    {{ isConnected ? 'Live' : 'Cached' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
            <button
              v-if="!isConnected"
              @click="reconnect"
              :disabled="isConnecting"
              class="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isConnecting ? 'Connecting...' : 'Reconnect' }}
            </button>
            
            <button
              @click="testConnection"
              class="flex-1 bg-gray-200 text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-300"
            >
              Test Connection
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Click outside to close -->
    <div
      v-if="showDetails"
      class="fixed inset-0 z-40"
      @click="showDetails = false"
    ></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  showText?: boolean
  showDetails?: boolean
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showText: true,
  showDetails: false,
  compact: false
})

// Composables
const { isConnected, isConnecting, connect } = useWebSocket()
const { addNotification } = useNotifications()

// Reactive state
const showDetails = ref(props.showDetails)
const lastConnectionTime = ref<Date | null>(null)
const reconnectAttempts = ref(0)

// Computed properties
const statusClass = computed(() => {
  if (isConnected.value) {
    return 'bg-green-50 text-green-800 border border-green-200'
  } else if (isConnecting.value) {
    return 'bg-yellow-50 text-yellow-800 border border-yellow-200'
  } else {
    return 'bg-red-50 text-red-800 border border-red-200'
  }
})

const indicatorClass = computed(() => {
  if (isConnected.value) {
    return 'bg-green-500 animate-pulse'
  } else if (isConnecting.value) {
    return 'bg-yellow-500 animate-pulse'
  } else {
    return 'bg-red-500'
  }
})

const statusText = computed(() => {
  if (!props.showText) return ''
  
  if (isConnected.value) {
    return props.compact ? 'Online' : 'Real-time Active'
  } else if (isConnecting.value) {
    return props.compact ? 'Connecting' : 'Connecting...'
  } else {
    return props.compact ? 'Offline' : 'Offline Mode'
  }
})

// Methods
const reconnect = async () => {
  try {
    reconnectAttempts.value++
    await connect()
    
    if (isConnected.value) {
      lastConnectionTime.value = new Date()
      addNotification({
        type: 'success',
        title: 'Reconnected',
        message: 'Real-time features are now active',
        duration: 3000
      })
    }
  } catch (error) {
    console.error('Reconnection failed:', error)
    addNotification({
      type: 'error',
      title: 'Connection Failed',
      message: 'Unable to establish real-time connection',
      duration: 5000
    })
  }
}

const testConnection = async () => {
  try {
    // Simple connectivity test
    const response = await fetch('/api/health', { 
      method: 'HEAD',
      signal: AbortSignal.timeout(5000)
    })
    
    if (response.ok) {
      addNotification({
        type: 'success',
        title: 'Connection Test',
        message: 'Network connectivity is working',
        duration: 3000
      })
    } else {
      throw new Error('Server not responding')
    }
  } catch (error) {
    addNotification({
      type: 'error',
      title: 'Connection Test Failed',
      message: 'Network connectivity issues detected',
      duration: 5000
    })
  }
}

const formatTime = (date: Date): string => {
  return date.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const toggleDetails = () => {
  showDetails.value = !showDetails.value
}

// Watch for connection changes
watch(isConnected, (connected) => {
  if (connected) {
    lastConnectionTime.value = new Date()
    reconnectAttempts.value = 0
  }
})

// Auto-hide details when connected
watch(isConnected, (connected) => {
  if (connected && showDetails.value) {
    setTimeout(() => {
      showDetails.value = false
    }, 2000)
  }
})

// Expose methods for parent components
defineExpose({
  toggleDetails,
  reconnect,
  testConnection
})
</script>

<style scoped>
.connection-status {
  position: relative;
  display: inline-block;
}
</style>
