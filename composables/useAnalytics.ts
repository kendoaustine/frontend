interface AnalyticsData {
  orders: {
    total: number
    pending: number
    completed: number
    cancelled: number
    revenue: number
    averageOrderValue: number
  }
  delivery: {
    onTime: number
    delayed: number
    averageDeliveryTime: number
    activeDeliveries: number
  }
  customers: {
    total: number
    active: number
    new: number
    retention: number
  }
  inventory: {
    totalProducts: number
    lowStock: number
    outOfStock: number
    topSellingProducts: Array<{
      id: string
      name: string
      sales: number
      revenue: number
    }>
  }
  realTimeMetrics: {
    activeUsers: number
    ordersToday: number
    revenueToday: number
    deliveriesInProgress: number
  }
}

interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
    fill?: boolean
  }>
}

interface MetricUpdate {
  metric: string
  value: number
  change: number
  timestamp: string
}

export const useAnalytics = (timeRange: 'today' | 'week' | 'month' | 'year' = 'week') => {
  const { apiCall } = useApi()
  const { on, off, isConnected } = useWebSocket()
  const { user } = useAuth()

  // Reactive state
  const analyticsData = ref<AnalyticsData | null>(null)
  const isLoading = ref(true)
  const error = ref<string | null>(null)
  const lastUpdate = ref<Date | null>(null)

  // Real-time updates
  const realtimeUpdates = ref<MetricUpdate[]>([])

  // Polling for non-real-time data
  let pollingInterval: NodeJS.Timeout | null = null
  const pollingIntervalMs = 60000 // 1 minute

  /**
   * Fetch analytics data from API
   */
  const fetchAnalyticsData = async (): Promise<AnalyticsData | null> => {
    try {
      const response = await apiCall(`/api/v1/analytics/dashboard?timeRange=${timeRange}`)
      
      if (response.success && response.data) {
        return response.data as AnalyticsData
      }
      
      // Fallback to mock data for development
      return generateMockAnalyticsData()
    } catch (err: any) {
      console.error('Error fetching analytics data:', err)
      
      // Return mock data for development
      return generateMockAnalyticsData()
    }
  }

  /**
   * Generate mock analytics data for development
   */
  const generateMockAnalyticsData = (): AnalyticsData => {
    const baseOrders = Math.floor(Math.random() * 1000) + 500
    const completedOrders = Math.floor(baseOrders * 0.8)
    const pendingOrders = Math.floor(baseOrders * 0.15)
    const cancelledOrders = baseOrders - completedOrders - pendingOrders

    return {
      orders: {
        total: baseOrders,
        pending: pendingOrders,
        completed: completedOrders,
        cancelled: cancelledOrders,
        revenue: completedOrders * 2500 + Math.random() * 10000,
        averageOrderValue: 2500 + Math.random() * 1000
      },
      delivery: {
        onTime: Math.floor(completedOrders * 0.85),
        delayed: Math.floor(completedOrders * 0.15),
        averageDeliveryTime: 45 + Math.random() * 30, // minutes
        activeDeliveries: Math.floor(Math.random() * 20) + 5
      },
      customers: {
        total: Math.floor(Math.random() * 5000) + 2000,
        active: Math.floor(Math.random() * 1000) + 500,
        new: Math.floor(Math.random() * 100) + 50,
        retention: 0.75 + Math.random() * 0.2
      },
      inventory: {
        totalProducts: Math.floor(Math.random() * 50) + 20,
        lowStock: Math.floor(Math.random() * 5) + 2,
        outOfStock: Math.floor(Math.random() * 3),
        topSellingProducts: [
          { id: '1', name: '12.5kg Gas Cylinder', sales: 150, revenue: 375000 },
          { id: '2', name: '6kg Gas Cylinder', sales: 120, revenue: 180000 },
          { id: '3', name: '3kg Gas Cylinder', sales: 80, revenue: 80000 },
          { id: '4', name: 'Gas Regulator', sales: 60, revenue: 30000 },
          { id: '5', name: 'Gas Hose', sales: 45, revenue: 22500 }
        ]
      },
      realTimeMetrics: {
        activeUsers: Math.floor(Math.random() * 100) + 20,
        ordersToday: Math.floor(Math.random() * 50) + 10,
        revenueToday: Math.floor(Math.random() * 100000) + 50000,
        deliveriesInProgress: Math.floor(Math.random() * 15) + 5
      }
    }
  }

  /**
   * Generate chart data for orders over time
   */
  const getOrdersChartData = (): ChartData => {
    const days = timeRange === 'today' ? 24 : timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365
    const labels: string[] = []
    const orderData: number[] = []
    const revenueData: number[] = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      if (timeRange === 'today') {
        labels.push(date.getHours().toString().padStart(2, '0') + ':00')
      } else {
        labels.push(date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }))
      }
      
      orderData.push(Math.floor(Math.random() * 20) + 5)
      revenueData.push(Math.floor(Math.random() * 50000) + 10000)
    }

    return {
      labels,
      datasets: [
        {
          label: 'Orders',
          data: orderData,
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderColor: 'rgb(59, 130, 246)',
          fill: true
        },
        {
          label: 'Revenue (₦)',
          data: revenueData,
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderColor: 'rgb(16, 185, 129)',
          fill: true
        }
      ]
    }
  }

  /**
   * Generate chart data for delivery performance
   */
  const getDeliveryChartData = (): ChartData => {
    if (!analyticsData.value) return { labels: [], datasets: [] }

    return {
      labels: ['On Time', 'Delayed'],
      datasets: [
        {
          label: 'Deliveries',
          data: [
            analyticsData.value.delivery.onTime,
            analyticsData.value.delivery.delayed
          ],
          backgroundColor: [
            'rgba(16, 185, 129, 0.8)',
            'rgba(239, 68, 68, 0.8)'
          ]
        }
      ]
    }
  }

  /**
   * Handle real-time metric updates
   */
  const handleMetricUpdate = (data: MetricUpdate) => {
    if (!analyticsData.value) return

    // Update the specific metric
    const metricPath = data.metric.split('.')
    let target: any = analyticsData.value

    for (let i = 0; i < metricPath.length - 1; i++) {
      target = target[metricPath[i]]
    }

    if (target) {
      target[metricPath[metricPath.length - 1]] = data.value
    }

    // Add to real-time updates list
    realtimeUpdates.value.unshift(data)
    
    // Keep only last 10 updates
    if (realtimeUpdates.value.length > 10) {
      realtimeUpdates.value = realtimeUpdates.value.slice(0, 10)
    }

    lastUpdate.value = new Date()
  }

  /**
   * Load initial analytics data
   */
  const loadAnalyticsData = async () => {
    isLoading.value = true
    error.value = null

    try {
      const data = await fetchAnalyticsData()
      if (data) {
        analyticsData.value = data
        lastUpdate.value = new Date()
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to load analytics data'
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Start real-time updates
   */
  const startRealTimeUpdates = () => {
    if (isConnected.value) {
      // Register for real-time metric updates
      on('metric_update', handleMetricUpdate)
      console.log('Real-time analytics updates started')
    }
    
    // Start polling for non-real-time data
    startPolling()
  }

  /**
   * Stop real-time updates
   */
  const stopRealTimeUpdates = () => {
    off('metric_update', handleMetricUpdate)
    stopPolling()
    console.log('Real-time analytics updates stopped')
  }

  /**
   * Start polling
   */
  const startPolling = () => {
    if (pollingInterval) return

    pollingInterval = setInterval(async () => {
      try {
        const data = await fetchAnalyticsData()
        if (data) {
          analyticsData.value = data
          lastUpdate.value = new Date()
        }
      } catch (err) {
        console.error('Analytics polling error:', err)
      }
    }, pollingIntervalMs)
  }

  /**
   * Stop polling
   */
  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
  }

  /**
   * Refresh analytics data manually
   */
  const refresh = async () => {
    await loadAnalyticsData()
  }

  // Computed properties
  const ordersChartData = computed(() => getOrdersChartData())
  const deliveryChartData = computed(() => getDeliveryChartData())

  const growthMetrics = computed(() => {
    if (!analyticsData.value) return null

    return {
      orderGrowth: Math.random() * 20 - 10, // Mock growth percentage
      revenueGrowth: Math.random() * 30 - 15,
      customerGrowth: Math.random() * 15 - 5,
      deliveryPerformance: (analyticsData.value.delivery.onTime / 
        (analyticsData.value.delivery.onTime + analyticsData.value.delivery.delayed)) * 100
    }
  })

  // Lifecycle
  onMounted(() => {
    loadAnalyticsData()
    
    // Only start real-time updates for suppliers and admins
    if (user.value && ['supplier', 'admin'].includes(user.value.role)) {
      startRealTimeUpdates()
    }
  })

  onUnmounted(() => {
    stopRealTimeUpdates()
  })

  // Watch for time range changes
  watch(() => timeRange, () => {
    loadAnalyticsData()
  })

  return {
    // State
    analyticsData: readonly(analyticsData),
    isLoading: readonly(isLoading),
    error: readonly(error),
    lastUpdate: readonly(lastUpdate),
    realtimeUpdates: readonly(realtimeUpdates),
    
    // Computed
    ordersChartData: readonly(ordersChartData),
    deliveryChartData: readonly(deliveryChartData),
    growthMetrics: readonly(growthMetrics),
    
    // Methods
    refresh,
    startRealTimeUpdates,
    stopRealTimeUpdates
  }
}
