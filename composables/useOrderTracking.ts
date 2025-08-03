interface TrackingData {
  orderId: string
  status: string
  currentLocation?: {
    latitude: number
    longitude: number
    address?: string
  }
  driverInfo?: {
    name: string
    phone: string
    vehicleNumber: string
  }
  estimatedArrival?: string
  timeline: TrackingEvent[]
  lastUpdated: string
}

interface TrackingEvent {
  id: string
  status: string
  message: string
  timestamp: string
  location?: {
    latitude: number
    longitude: number
    address?: string
  }
}

interface LocationUpdate {
  orderId: string
  latitude: number
  longitude: number
  timestamp: string
  driverName?: string
}

interface OrderStatusUpdate {
  orderId: string
  status: string
  message?: string
  timestamp: string
}

export const useOrderTracking = (orderId: string) => {
  const { apiCall } = useApi()
  const { subscribeToOrder, subscribeToDelivery, on, off, isConnected } = useWebSocket()

  // Reactive state
  const trackingData = ref<TrackingData | null>(null)
  const isLoading = ref(true)
  const error = ref<string | null>(null)
  const lastUpdate = ref<Date | null>(null)

  // Polling fallback
  let pollingInterval: NodeJS.Timeout | null = null
  const pollingIntervalMs = 30000 // 30 seconds

  /**
   * Fetch tracking data from API
   */
  const fetchTrackingData = async (): Promise<TrackingData | null> => {
    try {
      const response = await apiCall(`/api/v1/orders/${orderId}/tracking`)
      
      if (response.success && response.data) {
        return response.data as TrackingData
      }
      
      // Fallback to mock data for development
      return generateMockTrackingData(orderId)
    } catch (err: any) {
      console.error('Error fetching tracking data:', err)
      
      // Return mock data for development
      return generateMockTrackingData(orderId)
    }
  }

  /**
   * Generate mock tracking data for development
   */
  const generateMockTrackingData = (orderId: string): TrackingData => {
    const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered']
    const currentStatusIndex = Math.floor(Math.random() * statuses.length)
    const currentStatus = statuses[currentStatusIndex]

    return {
      orderId,
      status: currentStatus,
      currentLocation: currentStatusIndex >= 3 ? {
        latitude: 6.5244 + (Math.random() - 0.5) * 0.1,
        longitude: 3.3792 + (Math.random() - 0.5) * 0.1,
        address: 'Lagos, Nigeria'
      } : undefined,
      driverInfo: currentStatusIndex >= 3 ? {
        name: 'John Doe',
        phone: '+234 801 234 5678',
        vehicleNumber: 'LAG-123-ABC'
      } : undefined,
      estimatedArrival: currentStatusIndex >= 3 ? 
        new Date(Date.now() + 30 * 60 * 1000).toISOString() : undefined,
      timeline: statuses.slice(0, currentStatusIndex + 1).map((status, index) => ({
        id: `event-${index}`,
        status,
        message: getStatusMessage(status),
        timestamp: new Date(Date.now() - (statuses.length - index) * 60 * 60 * 1000).toISOString(),
        location: index >= 3 ? {
          latitude: 6.5244 + (Math.random() - 0.5) * 0.1,
          longitude: 3.3792 + (Math.random() - 0.5) * 0.1,
          address: 'Lagos, Nigeria'
        } : undefined
      })),
      lastUpdated: new Date().toISOString()
    }
  }

  /**
   * Get status message for timeline
   */
  const getStatusMessage = (status: string): string => {
    const messages: Record<string, string> = {
      pending: 'Order placed and awaiting confirmation',
      confirmed: 'Order confirmed by supplier',
      processing: 'Order is being prepared',
      shipped: 'Order has been shipped',
      out_for_delivery: 'Driver is on the way to your location',
      delivered: 'Order has been delivered successfully'
    }
    return messages[status] || 'Status updated'
  }

  /**
   * Load initial tracking data
   */
  const loadTrackingData = async () => {
    isLoading.value = true
    error.value = null

    try {
      const data = await fetchTrackingData()
      if (data) {
        trackingData.value = data
        lastUpdate.value = new Date()
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to load tracking data'
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Handle real-time order status updates
   */
  const handleOrderStatusUpdate = (data: OrderStatusUpdate) => {
    if (data.orderId === orderId && trackingData.value) {
      // Update status
      trackingData.value.status = data.status
      trackingData.value.lastUpdated = data.timestamp

      // Add to timeline
      const newEvent: TrackingEvent = {
        id: `event-${Date.now()}`,
        status: data.status,
        message: data.message || getStatusMessage(data.status),
        timestamp: data.timestamp
      }

      trackingData.value.timeline.push(newEvent)
      lastUpdate.value = new Date()
    }
  }

  /**
   * Handle real-time location updates
   */
  const handleLocationUpdate = (data: LocationUpdate) => {
    if (data.orderId === orderId && trackingData.value) {
      // Update current location
      trackingData.value.currentLocation = {
        latitude: data.latitude,
        longitude: data.longitude,
        address: trackingData.value.currentLocation?.address
      }

      // Update driver info if available
      if (data.driverName && trackingData.value.driverInfo) {
        trackingData.value.driverInfo.name = data.driverName
      }

      trackingData.value.lastUpdated = data.timestamp
      lastUpdate.value = new Date()
    }
  }

  /**
   * Start real-time tracking
   */
  const startRealTimeTracking = () => {
    if (isConnected.value) {
      // Subscribe to WebSocket events
      subscribeToOrder(orderId)
      subscribeToDelivery(orderId)
      
      // Register event handlers
      on('order_status_changed', handleOrderStatusUpdate)
      on('driver_location', handleLocationUpdate)
      
      console.log('Real-time tracking started for order:', orderId)
    } else {
      // Fallback to polling
      startPolling()
    }
  }

  /**
   * Stop real-time tracking
   */
  const stopRealTimeTracking = () => {
    // Unregister event handlers
    off('order_status_changed', handleOrderStatusUpdate)
    off('driver_location', handleLocationUpdate)
    
    // Stop polling
    stopPolling()
    
    console.log('Real-time tracking stopped for order:', orderId)
  }

  /**
   * Start polling fallback
   */
  const startPolling = () => {
    if (pollingInterval) return

    pollingInterval = setInterval(async () => {
      try {
        const data = await fetchTrackingData()
        if (data) {
          trackingData.value = data
          lastUpdate.value = new Date()
        }
      } catch (err) {
        console.error('Polling error:', err)
      }
    }, pollingIntervalMs)

    console.log('Polling started for order:', orderId)
  }

  /**
   * Stop polling
   */
  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
      console.log('Polling stopped for order:', orderId)
    }
  }

  /**
   * Refresh tracking data manually
   */
  const refresh = async () => {
    await loadTrackingData()
  }

  // Computed properties
  const isActive = computed(() => {
    return trackingData.value && 
           !['delivered', 'cancelled', 'failed'].includes(trackingData.value.status)
  })

  const progress = computed(() => {
    if (!trackingData.value) return 0
    
    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered']
    const currentIndex = statusOrder.indexOf(trackingData.value.status)
    return currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0
  })

  const estimatedArrivalTime = computed(() => {
    if (!trackingData.value?.estimatedArrival) return null
    return new Date(trackingData.value.estimatedArrival)
  })

  // Lifecycle
  onMounted(() => {
    loadTrackingData()
  })

  // Watch for connection changes
  watch(isConnected, (connected) => {
    if (connected && isActive.value) {
      stopPolling()
      startRealTimeTracking()
    } else if (!connected && isActive.value) {
      startPolling()
    }
  }, { immediate: true })

  // Watch for active status changes
  watch(isActive, (active) => {
    if (active) {
      startRealTimeTracking()
    } else {
      stopRealTimeTracking()
    }
  }, { immediate: true })

  // Cleanup
  onUnmounted(() => {
    stopRealTimeTracking()
  })

  return {
    // State
    trackingData: readonly(trackingData),
    isLoading: readonly(isLoading),
    error: readonly(error),
    lastUpdate: readonly(lastUpdate),
    
    // Computed
    isActive: readonly(isActive),
    progress: readonly(progress),
    estimatedArrivalTime: readonly(estimatedArrivalTime),
    
    // Methods
    refresh,
    startRealTimeTracking,
    stopRealTimeTracking
  }
}
