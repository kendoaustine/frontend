<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="transform -translate-y-full opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform -translate-y-full opacity-0"
  >
    <div
      v-if="!isOnline"
      class="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-4 py-3 text-center text-sm font-medium"
    >
      <div class="flex items-center justify-center space-x-2">
        <Icon name="heroicons:wifi-slash" class="w-4 h-4" />
        <span>You're offline. Some features may not be available.</span>
        <button
          @click="retryConnection"
          class="ml-2 underline hover:no-underline"
        >
          Retry
        </button>
      </div>
    </div>
  </Transition>

  <!-- Offline Page Overlay -->
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="showOfflinePage"
      class="fixed inset-0 z-40 bg-white flex items-center justify-center"
    >
      <div class="text-center px-6 py-8 max-w-md">
        <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <Icon name="heroicons:wifi-slash" class="w-12 h-12 text-gray-400" />
        </div>
        
        <h2 class="text-2xl font-bold text-gray-900 mb-4">
          You're Offline
        </h2>
        
        <p class="text-gray-600 mb-6">
          It looks like you've lost your internet connection. Don't worry, you can still:
        </p>
        
        <div class="space-y-3 mb-8 text-left">
          <div class="flex items-center space-x-3">
            <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600" />
            <span class="text-gray-700">View your recent orders</span>
          </div>
          <div class="flex items-center space-x-3">
            <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600" />
            <span class="text-gray-700">Browse cached supplier information</span>
          </div>
          <div class="flex items-center space-x-3">
            <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600" />
            <span class="text-gray-700">Access your profile and settings</span>
          </div>
        </div>
        
        <div class="space-y-3">
          <button
            @click="retryConnection"
            :disabled="isRetrying"
            class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isRetrying ? 'Checking Connection...' : 'Try Again' }}
          </button>
          
          <button
            @click="continueOffline"
            class="w-full bg-gray-200 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Continue Offline
          </button>
        </div>
        
        <div class="mt-6 text-xs text-gray-500">
          <p>Your data will sync automatically when you're back online.</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
// Composables
const { isOnline } = useOnline()
const { addNotification } = useNotifications()

// Reactive state
const showOfflinePage = ref(false)
const isRetrying = ref(false)
const offlineStartTime = ref<Date | null>(null)
const hasShownOfflineNotification = ref(false)

// Methods
const retryConnection = async () => {
  isRetrying.value = true
  
  try {
    // Test connection with a simple fetch
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    const response = await fetch('/api/health', {
      method: 'HEAD',
      signal: controller.signal,
      cache: 'no-cache'
    })
    
    clearTimeout(timeoutId)
    
    if (response.ok) {
      // Connection restored
      showOfflinePage.value = false
      hasShownOfflineNotification.value = false
      offlineStartTime.value = null
      
      addNotification({
        type: 'success',
        title: 'Back Online',
        message: 'Your connection has been restored',
        duration: 3000
      })
    } else {
      throw new Error('Server not responding')
    }
  } catch (error) {
    // Still offline
    addNotification({
      type: 'error',
      title: 'Still Offline',
      message: 'Unable to connect. Please check your internet connection.',
      duration: 5000
    })
  } finally {
    isRetrying.value = false
  }
}

const continueOffline = () => {
  showOfflinePage.value = false
  
  addNotification({
    type: 'info',
    title: 'Offline Mode',
    message: 'You can still access cached content and features',
    duration: 5000
  })
}

const checkOfflineDuration = () => {
  if (!isOnline.value && offlineStartTime.value) {
    const offlineDuration = Date.now() - offlineStartTime.value.getTime()
    
    // Show offline page after 10 seconds of being offline
    if (offlineDuration > 10000 && !showOfflinePage.value) {
      showOfflinePage.value = true
    }
  }
}

// Watch for online/offline changes
watch(isOnline, (online) => {
  if (!online) {
    // Just went offline
    offlineStartTime.value = new Date()
    
    if (!hasShownOfflineNotification.value) {
      hasShownOfflineNotification.value = true
      
      // Show notification after a short delay to avoid false positives
      setTimeout(() => {
        if (!isOnline.value) {
          addNotification({
            type: 'warning',
            title: 'Connection Lost',
            message: 'You appear to be offline. Some features may not work.',
            duration: 5000
          })
        }
      }, 2000)
    }
    
    // Start checking offline duration
    const durationCheck = setInterval(() => {
      if (isOnline.value) {
        clearInterval(durationCheck)
      } else {
        checkOfflineDuration()
      }
    }, 1000)
    
  } else {
    // Back online
    if (offlineStartTime.value) {
      const offlineDuration = Date.now() - offlineStartTime.value.getTime()
      
      // Only show notification if we were offline for more than 5 seconds
      if (offlineDuration > 5000) {
        addNotification({
          type: 'success',
          title: 'Back Online',
          message: 'Your connection has been restored',
          duration: 3000
        })
      }
    }
    
    // Reset offline state
    showOfflinePage.value = false
    hasShownOfflineNotification.value = false
    offlineStartTime.value = null
  }
}, { immediate: true })

// Auto-retry connection every 30 seconds when offline
let retryInterval: NodeJS.Timeout | null = null

watch(isOnline, (online) => {
  if (!online) {
    // Start auto-retry
    retryInterval = setInterval(() => {
      if (!isRetrying.value && !showOfflinePage.value) {
        retryConnection()
      }
    }, 30000)
  } else {
    // Stop auto-retry
    if (retryInterval) {
      clearInterval(retryInterval)
      retryInterval = null
    }
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (retryInterval) {
    clearInterval(retryInterval)
  }
})

// Handle PWA update events
if (process.client) {
  // Listen for service worker updates
  navigator.serviceWorker?.addEventListener('message', (event) => {
    if (event.data?.type === 'CACHE_UPDATED') {
      addNotification({
        type: 'info',
        title: 'App Updated',
        message: 'New content is available. Refresh to update.',
        duration: 10000
      })
    }
  })
}
</script>
