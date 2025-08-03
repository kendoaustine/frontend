<template>
  <div class="notification-center">
    <!-- Notification Bell Icon -->
    <div class="relative">
      <button
        @click="toggleNotifications"
        class="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg transition-colors"
        :class="{ 'text-blue-600': hasUnread }"
      >
        <Icon name="heroicons:bell" class="w-6 h-6" />
        
        <!-- Unread Badge -->
        <span
          v-if="unreadCount > 0"
          class="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"
        >
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </span>
      </button>

      <!-- Notifications Dropdown -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="showNotifications"
          class="absolute right-0 z-50 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          @click.stop
        >
          <!-- Header -->
          <div class="px-4 py-3 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">Notifications</h3>
              <div class="flex items-center space-x-2">
                <button
                  v-if="hasUnread"
                  @click="markAllAsRead"
                  class="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Mark all read
                </button>
                <button
                  @click="clearAll"
                  class="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              </div>
            </div>
          </div>

          <!-- Notifications List -->
          <div class="max-h-96 overflow-y-auto">
            <div v-if="notifications.length === 0" class="px-4 py-8 text-center">
              <Icon name="heroicons:bell-slash" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p class="text-gray-500">No notifications yet</p>
            </div>

            <div v-else class="divide-y divide-gray-200">
              <div
                v-for="notification in notifications"
                :key="notification.id"
                class="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                :class="{ 'bg-blue-50': !notification.read }"
                @click="handleNotificationClick(notification)"
              >
                <div class="flex items-start space-x-3">
                  <!-- Icon -->
                  <div class="flex-shrink-0">
                    <div
                      class="w-8 h-8 rounded-full flex items-center justify-center"
                      :class="getNotificationIconClass(notification.type)"
                    >
                      <Icon :name="getNotificationIcon(notification.type)" class="w-4 h-4" />
                    </div>
                  </div>

                  <!-- Content -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-medium text-gray-900 truncate">
                        {{ notification.title }}
                      </p>
                      <div class="flex items-center space-x-1">
                        <span class="text-xs text-gray-500">
                          {{ formatTime(notification.timestamp) }}
                        </span>
                        <div
                          v-if="!notification.read"
                          class="w-2 h-2 bg-blue-600 rounded-full"
                        ></div>
                      </div>
                    </div>
                    
                    <p class="text-sm text-gray-600 mt-1 line-clamp-2">
                      {{ notification.message }}
                    </p>

                    <!-- Action Buttons -->
                    <div v-if="notification.actions" class="mt-2 flex space-x-2">
                      <button
                        v-for="action in notification.actions"
                        :key="action.label"
                        @click.stop="handleAction(notification, action)"
                        class="text-xs px-2 py-1 rounded font-medium transition-colors"
                        :class="action.primary 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
                      >
                        {{ action.label }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div v-if="notifications.length > 0" class="px-4 py-3 border-t border-gray-200">
            <NuxtLink
              to="/notifications"
              class="block text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
              @click="showNotifications = false"
            >
              View all notifications
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Click outside to close -->
    <div
      v-if="showNotifications"
      class="fixed inset-0 z-40"
      @click="showNotifications = false"
    ></div>
  </div>
</template>

<script setup lang="ts">
interface NotificationAction {
  label: string
  action: string
  primary?: boolean
}

interface Notification {
  id: string
  type: 'order_update' | 'delivery_update' | 'emergency' | 'system' | 'payment'
  title: string
  message: string
  timestamp: string
  read: boolean
  orderId?: string
  actions?: NotificationAction[]
}

// Composables
const { on, off } = useWebSocket()
const router = useRouter()

// Reactive state
const showNotifications = ref(false)
const notifications = ref<Notification[]>([])

// Computed properties
const unreadCount = computed(() => 
  notifications.value.filter(n => !n.read).length
)

const hasUnread = computed(() => unreadCount.value > 0)

// Methods
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const getNotificationIcon = (type: string): string => {
  const icons: Record<string, string> = {
    order_update: 'heroicons:shopping-bag',
    delivery_update: 'heroicons:truck',
    emergency: 'heroicons:exclamation-triangle',
    system: 'heroicons:cog-6-tooth',
    payment: 'heroicons:credit-card'
  }
  return icons[type] || 'heroicons:bell'
}

const getNotificationIconClass = (type: string): string => {
  const classes: Record<string, string> = {
    order_update: 'bg-blue-100 text-blue-600',
    delivery_update: 'bg-green-100 text-green-600',
    emergency: 'bg-red-100 text-red-600',
    system: 'bg-gray-100 text-gray-600',
    payment: 'bg-yellow-100 text-yellow-600'
  }
  return classes[type] || 'bg-gray-100 text-gray-600'
}

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return date.toLocaleDateString()
}

const handleNotificationClick = (notification: Notification) => {
  // Mark as read
  notification.read = true
  
  // Navigate to relevant page
  if (notification.orderId) {
    router.push(`/orders/${notification.orderId}`)
  }
  
  showNotifications.value = false
}

const handleAction = (notification: Notification, action: NotificationAction) => {
  // Handle different actions
  switch (action.action) {
    case 'view_order':
      if (notification.orderId) {
        router.push(`/orders/${notification.orderId}`)
      }
      break
    case 'track_delivery':
      if (notification.orderId) {
        router.push(`/orders/${notification.orderId}/tracking`)
      }
      break
    case 'contact_support':
      router.push('/support')
      break
    default:
      console.log('Unknown action:', action.action)
  }
  
  // Mark as read and close
  notification.read = true
  showNotifications.value = false
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
}

const clearAll = () => {
  notifications.value = []
}

const addNotification = (notification: Omit<Notification, 'id' | 'read'>) => {
  const newNotification: Notification = {
    id: Date.now().toString(),
    read: false,
    ...notification
  }
  
  notifications.value.unshift(newNotification)
  
  // Keep only last 50 notifications
  if (notifications.value.length > 50) {
    notifications.value = notifications.value.slice(0, 50)
  }
}

// Handle real-time notifications
const handleDeliveryNotification = (data: any) => {
  addNotification({
    type: 'delivery_update',
    title: data.title,
    message: data.message,
    timestamp: data.timestamp,
    orderId: data.orderId,
    actions: [
      { label: 'Track', action: 'track_delivery', primary: true },
      { label: 'View Order', action: 'view_order' }
    ]
  })
}

const handleOrderStatusUpdate = (data: any) => {
  addNotification({
    type: 'order_update',
    title: 'Order Status Updated',
    message: `Order ${data.orderId.slice(-8)} is now ${data.status}`,
    timestamp: data.timestamp,
    orderId: data.orderId,
    actions: [
      { label: 'View Order', action: 'view_order', primary: true }
    ]
  })
}

const handleEmergencyAlert = (data: any) => {
  addNotification({
    type: 'emergency',
    title: 'Emergency Alert',
    message: data.message,
    timestamp: data.timestamp,
    orderId: data.orderId,
    actions: [
      { label: 'Contact Support', action: 'contact_support', primary: true }
    ]
  })
}

// Lifecycle
onMounted(() => {
  // Register for real-time notifications
  on('delivery_notification', handleDeliveryNotification)
  on('order_status_changed', handleOrderStatusUpdate)
  on('emergency_alert', handleEmergencyAlert)
  
  // Load initial notifications (mock data for now)
  notifications.value = [
    {
      id: '1',
      type: 'order_update',
      title: 'Order Confirmed',
      message: 'Your order #12345 has been confirmed by the supplier',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      read: false,
      orderId: '12345'
    },
    {
      id: '2',
      type: 'delivery_update',
      title: 'Driver Assigned',
      message: 'John Doe has been assigned to deliver your order',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      read: true,
      orderId: '12345'
    }
  ]
})

onUnmounted(() => {
  // Cleanup event listeners
  off('delivery_notification', handleDeliveryNotification)
  off('order_status_changed', handleOrderStatusUpdate)
  off('emergency_alert', handleEmergencyAlert)
})

// Close notifications when clicking outside
onClickOutside(showNotifications, () => {
  showNotifications.value = false
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
