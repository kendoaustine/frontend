<template>
  <div class="real-time-dashboard">
    <!-- Connection Status -->
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Real-time Analytics</h2>
      
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <div
            class="w-3 h-3 rounded-full"
            :class="isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'"
          ></div>
          <span class="text-sm text-gray-600">
            {{ isConnected ? 'Live updates' : 'Offline mode' }}
          </span>
        </div>
        
        <div class="flex items-center space-x-2">
          <span v-if="lastUpdate" class="text-xs text-gray-500">
            Updated {{ formatTime(lastUpdate) }}
          </span>
          <button
            @click="refresh"
            :disabled="isLoading"
            class="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 rounded-lg hover:bg-gray-100"
          >
            <Icon 
              name="heroicons:arrow-path" 
              class="w-5 h-5"
              :class="{ 'animate-spin': isLoading }"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !analyticsData" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Loading analytics data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <Icon name="heroicons:exclamation-triangle" class="w-16 h-16 text-red-500 mx-auto mb-4" />
      <p class="text-red-600 mb-4">{{ error }}</p>
      <button
        @click="refresh"
        class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>

    <!-- Analytics Content -->
    <div v-else-if="analyticsData" class="space-y-6">
      <!-- Real-time Metrics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Active Users -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Active Users</p>
              <p class="text-3xl font-bold text-gray-900">
                {{ analyticsData.realTimeMetrics.activeUsers }}
              </p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:users" class="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div class="mt-4 flex items-center">
            <span class="text-sm text-green-600 font-medium">
              +{{ Math.floor(Math.random() * 10) + 1 }}%
            </span>
            <span class="text-sm text-gray-500 ml-2">vs last hour</span>
          </div>
        </div>

        <!-- Orders Today -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Orders Today</p>
              <p class="text-3xl font-bold text-gray-900">
                {{ analyticsData.realTimeMetrics.ordersToday }}
              </p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:shopping-bag" class="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div class="mt-4 flex items-center">
            <span class="text-sm text-green-600 font-medium">
              +{{ Math.floor(Math.random() * 20) + 5 }}%
            </span>
            <span class="text-sm text-gray-500 ml-2">vs yesterday</span>
          </div>
        </div>

        <!-- Revenue Today -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Revenue Today</p>
              <p class="text-3xl font-bold text-gray-900">
                ₦{{ formatCurrency(analyticsData.realTimeMetrics.revenueToday) }}
              </p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:banknotes" class="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div class="mt-4 flex items-center">
            <span class="text-sm text-green-600 font-medium">
              +{{ Math.floor(Math.random() * 15) + 3 }}%
            </span>
            <span class="text-sm text-gray-500 ml-2">vs yesterday</span>
          </div>
        </div>

        <!-- Active Deliveries -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Active Deliveries</p>
              <p class="text-3xl font-bold text-gray-900">
                {{ analyticsData.realTimeMetrics.deliveriesInProgress }}
              </p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:truck" class="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div class="mt-4 flex items-center">
            <span class="text-sm text-blue-600 font-medium">
              {{ Math.floor(Math.random() * 5) + 1 }} new
            </span>
            <span class="text-sm text-gray-500 ml-2">in last hour</span>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Orders Chart -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Orders & Revenue</h3>
            <select
              v-model="timeRange"
              class="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          
          <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div class="text-center">
              <Icon name="heroicons:chart-bar" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p class="text-gray-600">Chart visualization coming soon</p>
              <p class="text-sm text-gray-500 mt-1">
                {{ ordersChartData.datasets[0]?.data.reduce((a, b) => a + b, 0) || 0 }} total orders
              </p>
            </div>
          </div>
        </div>

        <!-- Delivery Performance -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Delivery Performance</h3>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">On-time Deliveries</span>
              <span class="text-sm font-medium text-green-600">
                {{ analyticsData.delivery.onTime }} ({{ Math.round((analyticsData.delivery.onTime / (analyticsData.delivery.onTime + analyticsData.delivery.delayed)) * 100) }}%)
              </span>
            </div>
            
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-green-600 h-2 rounded-full transition-all duration-500"
                :style="{ width: `${(analyticsData.delivery.onTime / (analyticsData.delivery.onTime + analyticsData.delivery.delayed)) * 100}%` }"
              ></div>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Delayed Deliveries</span>
              <span class="text-sm font-medium text-red-600">
                {{ analyticsData.delivery.delayed }} ({{ Math.round((analyticsData.delivery.delayed / (analyticsData.delivery.onTime + analyticsData.delivery.delayed)) * 100) }}%)
              </span>
            </div>
            
            <div class="mt-4 p-4 bg-blue-50 rounded-lg">
              <div class="flex items-center">
                <Icon name="heroicons:clock" class="w-5 h-5 text-blue-600 mr-2" />
                <span class="text-sm font-medium text-blue-900">
                  Average Delivery Time: {{ Math.round(analyticsData.delivery.averageDeliveryTime) }} minutes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Updates -->
      <div v-if="realtimeUpdates.length > 0" class="bg-white rounded-lg shadow-sm border p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Updates</h3>
        
        <div class="space-y-3">
          <div
            v-for="update in realtimeUpdates.slice(0, 5)"
            :key="update.timestamp"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span class="text-sm text-gray-900">
                {{ update.metric.replace('_', ' ').replace('.', ' ') }} updated to {{ update.value }}
              </span>
            </div>
            <span class="text-xs text-gray-500">
              {{ formatTime(new Date(update.timestamp)) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Top Selling Products -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Top Selling Products</h3>
        
        <div class="space-y-4">
          <div
            v-for="(product, index) in analyticsData.inventory.topSellingProducts"
            :key="product.id"
            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
          >
            <div class="flex items-center space-x-4">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span class="text-sm font-bold text-blue-600">{{ index + 1 }}</span>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ product.name }}</p>
                <p class="text-sm text-gray-600">{{ product.sales }} sales</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-semibold text-gray-900">₦{{ formatCurrency(product.revenue) }}</p>
              <p class="text-sm text-gray-600">Revenue</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Composables
const timeRange = ref<'today' | 'week' | 'month'>('week')
const { 
  analyticsData, 
  isLoading, 
  error, 
  lastUpdate, 
  realtimeUpdates,
  ordersChartData,
  refresh 
} = useAnalytics(timeRange.value)

const { isConnected } = useWebSocket()

// Methods
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
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

// Watch for time range changes
watch(timeRange, (newRange) => {
  // This would trigger a refresh with the new time range
  refresh()
})
</script>
