import { io, Socket } from 'socket.io-client'

interface WebSocketState {
  socket: Socket | null
  isConnected: boolean
  isConnecting: boolean
  reconnectAttempts: number
  maxReconnectAttempts: number
}

interface OrderStatusUpdate {
  orderId: string
  status: string
  message?: string
  timestamp: string
}

interface LocationUpdate {
  orderId: string
  latitude: number
  longitude: number
  timestamp: string
  driverName?: string
}

interface NotificationData {
  id: string
  type: 'order_update' | 'delivery_update' | 'emergency' | 'system'
  title: string
  message: string
  orderId?: string
  timestamp: string
  read: boolean
}

export const useWebSocket = () => {
  const config = useRuntimeConfig()
  const { user } = useAuth()
  const { addNotification } = useNotifications()

  // Global WebSocket state
  const state = useState<WebSocketState>('websocket', () => ({
    socket: null,
    isConnected: false,
    isConnecting: false,
    reconnectAttempts: 0,
    maxReconnectAttempts: 5
  }))

  // Event handlers storage
  const eventHandlers = new Map<string, Function[]>()

  /**
   * Connect to WebSocket server
   */
  const connect = async (): Promise<Socket | null> => {
    if (state.value.socket?.connected) {
      return state.value.socket
    }

    if (state.value.isConnecting) {
      return null
    }

    state.value.isConnecting = true

    try {
      const token = useCookie('auth-token').value
      if (!token || !user.value) {
        console.warn('Cannot connect to WebSocket: No authentication token or user')
        return null
      }

      const socket = io(config.public.ordersServiceUrl || 'http://localhost:3002', {
        auth: {
          token,
          userId: user.value.id,
          role: user.value.role
        },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: state.value.maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000
      })

      // Connection event handlers
      socket.on('connect', () => {
        console.log('WebSocket connected')
        state.value.isConnected = true
        state.value.isConnecting = false
        state.value.reconnectAttempts = 0
        
        addNotification({
          type: 'success',
          title: 'Connected',
          message: 'Real-time updates enabled',
          duration: 3000
        })
      })

      socket.on('disconnect', (reason) => {
        console.log('WebSocket disconnected:', reason)
        state.value.isConnected = false
        
        if (reason === 'io server disconnect') {
          // Server initiated disconnect, try to reconnect
          socket.connect()
        }
      })

      socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error)
        state.value.isConnecting = false
        state.value.reconnectAttempts++
        
        if (state.value.reconnectAttempts >= state.value.maxReconnectAttempts) {
          addNotification({
            type: 'error',
            title: 'Connection Failed',
            message: 'Unable to establish real-time connection. Using polling fallback.',
            persistent: true
          })
        }
      })

      // Real-time event handlers
      socket.on('order_status_changed', (data: OrderStatusUpdate) => {
        console.log('Order status update:', data)
        
        // Trigger registered handlers
        const handlers = eventHandlers.get('order_status_changed') || []
        handlers.forEach(handler => handler(data))
        
        // Show notification
        addNotification({
          type: 'info',
          title: 'Order Update',
          message: `Order ${data.orderId.slice(-8)} status: ${data.status}`,
          duration: 5000
        })
      })

      socket.on('driver_location', (data: LocationUpdate) => {
        console.log('Driver location update:', data)
        
        // Trigger registered handlers
        const handlers = eventHandlers.get('driver_location') || []
        handlers.forEach(handler => handler(data))
      })

      socket.on('delivery_notification', (data: NotificationData) => {
        console.log('Delivery notification:', data)
        
        // Trigger registered handlers
        const handlers = eventHandlers.get('delivery_notification') || []
        handlers.forEach(handler => handler(data))
        
        // Show notification
        addNotification({
          type: data.type === 'emergency' ? 'error' : 'info',
          title: data.title,
          message: data.message,
          duration: data.type === 'emergency' ? 0 : 5000,
          persistent: data.type === 'emergency'
        })
      })

      socket.on('emergency_alert', (data: any) => {
        console.log('Emergency alert:', data)
        
        // Trigger registered handlers
        const handlers = eventHandlers.get('emergency_alert') || []
        handlers.forEach(handler => handler(data))
        
        // Show critical notification
        addNotification({
          type: 'error',
          title: 'Emergency Alert',
          message: data.message || 'Emergency situation detected',
          persistent: true
        })
      })

      state.value.socket = socket
      return socket

    } catch (error) {
      console.error('Failed to connect to WebSocket:', error)
      state.value.isConnecting = false
      return null
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  const disconnect = () => {
    if (state.value.socket) {
      state.value.socket.disconnect()
      state.value.socket = null
      state.value.isConnected = false
      state.value.isConnecting = false
      eventHandlers.clear()
    }
  }

  /**
   * Subscribe to order updates
   */
  const subscribeToOrder = (orderId: string) => {
    if (state.value.socket?.connected) {
      state.value.socket.emit('subscribe_order', orderId)
      console.log('Subscribed to order:', orderId)
    }
  }

  /**
   * Unsubscribe from order updates
   */
  const unsubscribeFromOrder = (orderId: string) => {
    if (state.value.socket?.connected) {
      state.value.socket.emit('unsubscribe_order', orderId)
      console.log('Unsubscribed from order:', orderId)
    }
  }

  /**
   * Subscribe to delivery tracking
   */
  const subscribeToDelivery = (orderId: string) => {
    if (state.value.socket?.connected) {
      state.value.socket.emit('subscribe_delivery', orderId)
      console.log('Subscribed to delivery:', orderId)
    }
  }

  /**
   * Send emergency SOS
   */
  const sendEmergencySOS = (data: {
    orderId: string
    location: { latitude: number; longitude: number }
    message: string
  }) => {
    if (state.value.socket?.connected) {
      state.value.socket.emit('emergency_sos', data)
      console.log('Emergency SOS sent:', data)
    }
  }

  /**
   * Register event handler
   */
  const on = (event: string, handler: Function) => {
    if (!eventHandlers.has(event)) {
      eventHandlers.set(event, [])
    }
    eventHandlers.get(event)!.push(handler)
  }

  /**
   * Unregister event handler
   */
  const off = (event: string, handler: Function) => {
    const handlers = eventHandlers.get(event)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  /**
   * Emit event to server
   */
  const emit = (event: string, data?: any) => {
    if (state.value.socket?.connected) {
      state.value.socket.emit(event, data)
    }
  }

  // Auto-connect when user is authenticated
  watch(() => user.value, (newUser) => {
    if (newUser && !state.value.socket) {
      connect()
    } else if (!newUser && state.value.socket) {
      disconnect()
    }
  }, { immediate: true })

  // Cleanup on unmount
  onUnmounted(() => {
    disconnect()
  })

  return {
    // State
    isConnected: readonly(computed(() => state.value.isConnected)),
    isConnecting: readonly(computed(() => state.value.isConnecting)),
    socket: readonly(computed(() => state.value.socket)),
    
    // Methods
    connect,
    disconnect,
    subscribeToOrder,
    unsubscribeFromOrder,
    subscribeToDelivery,
    sendEmergencySOS,
    on,
    off,
    emit
  }
}
