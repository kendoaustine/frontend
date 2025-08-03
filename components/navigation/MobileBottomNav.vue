<template>
  <div class="mobile-bottom-nav md:hidden">
    <!-- Bottom Navigation Bar -->
    <div class="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 safe-area-pb">
      <div class="grid grid-cols-5 h-16">
        <!-- Home -->
        <NuxtLink
          to="/dashboard"
          class="flex flex-col items-center justify-center space-y-1 text-xs font-medium transition-colors"
          :class="isActive('/dashboard') ? 'text-blue-600' : 'text-gray-500'"
        >
          <Icon 
            :name="isActive('/dashboard') ? 'heroicons:home-solid' : 'heroicons:home'" 
            class="w-6 h-6" 
          />
          <span>Home</span>
        </NuxtLink>

        <!-- Orders -->
        <NuxtLink
          to="/orders"
          class="flex flex-col items-center justify-center space-y-1 text-xs font-medium transition-colors relative"
          :class="isActive('/orders') ? 'text-blue-600' : 'text-gray-500'"
        >
          <Icon 
            :name="isActive('/orders') ? 'heroicons:shopping-bag-solid' : 'heroicons:shopping-bag'" 
            class="w-6 h-6" 
          />
          <span>Orders</span>
          
          <!-- Active Orders Badge -->
          <div
            v-if="activeOrdersCount > 0"
            class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
          >
            {{ activeOrdersCount > 9 ? '9+' : activeOrdersCount }}
          </div>
        </NuxtLink>

        <!-- Quick Order (Center FAB) -->
        <div class="flex items-center justify-center">
          <button
            @click="showQuickOrder = true"
            class="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transform -translate-y-2 hover:bg-blue-700 transition-all duration-200 active:scale-95"
          >
            <Icon name="heroicons:plus" class="w-8 h-8" />
          </button>
        </div>

        <!-- Suppliers -->
        <NuxtLink
          to="/suppliers"
          class="flex flex-col items-center justify-center space-y-1 text-xs font-medium transition-colors"
          :class="isActive('/suppliers') ? 'text-blue-600' : 'text-gray-500'"
        >
          <Icon 
            :name="isActive('/suppliers') ? 'heroicons:building-storefront-solid' : 'heroicons:building-storefront'" 
            class="w-6 h-6" 
          />
          <span>Suppliers</span>
        </NuxtLink>

        <!-- Profile -->
        <NuxtLink
          to="/profile"
          class="flex flex-col items-center justify-center space-y-1 text-xs font-medium transition-colors"
          :class="isActive('/profile') ? 'text-blue-600' : 'text-gray-500'"
        >
          <Icon 
            :name="isActive('/profile') ? 'heroicons:user-solid' : 'heroicons:user'" 
            class="w-6 h-6" 
          />
          <span>Profile</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Quick Order Modal -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="showQuickOrder"
        class="fixed inset-0 z-50 flex items-end justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black bg-opacity-50"
          @click="showQuickOrder = false"
        ></div>

        <!-- Modal Content -->
        <div class="relative bg-white rounded-t-2xl w-full max-w-md pb-safe">
          <!-- Handle -->
          <div class="flex justify-center pt-4 pb-2">
            <div class="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>

          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">Quick Order</h3>
              <button
                @click="showQuickOrder = false"
                class="text-gray-400 hover:text-gray-600"
              >
                <Icon name="heroicons:x-mark" class="w-6 h-6" />
              </button>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="p-6 space-y-4">
            <!-- Regular Order -->
            <button
              @click="navigateToOrder('regular')"
              class="w-full flex items-center space-x-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Icon name="heroicons:shopping-bag" class="w-6 h-6 text-white" />
              </div>
              <div class="flex-1 text-left">
                <h4 class="font-medium text-gray-900">Regular Order</h4>
                <p class="text-sm text-gray-600">Browse suppliers and place an order</p>
              </div>
              <Icon name="heroicons:chevron-right" class="w-5 h-5 text-gray-400" />
            </button>

            <!-- Emergency Order -->
            <button
              @click="navigateToOrder('emergency')"
              class="w-full flex items-center space-x-4 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <Icon name="heroicons:exclamation-triangle" class="w-6 h-6 text-white" />
              </div>
              <div class="flex-1 text-left">
                <h4 class="font-medium text-gray-900">Emergency Order</h4>
                <p class="text-sm text-gray-600">Urgent gas delivery needed</p>
              </div>
              <Icon name="heroicons:chevron-right" class="w-5 h-5 text-gray-400" />
            </button>

            <!-- Reorder -->
            <button
              v-if="lastOrder"
              @click="reorderLast"
              class="w-full flex items-center space-x-4 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div class="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <Icon name="heroicons:arrow-path" class="w-6 h-6 text-white" />
              </div>
              <div class="flex-1 text-left">
                <h4 class="font-medium text-gray-900">Reorder</h4>
                <p class="text-sm text-gray-600">Order again from {{ lastOrder.supplier }}</p>
              </div>
              <Icon name="heroicons:chevron-right" class="w-5 h-5 text-gray-400" />
            </button>

            <!-- Find Suppliers -->
            <button
              @click="navigateToSuppliers"
              class="w-full flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div class="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                <Icon name="heroicons:map-pin" class="w-6 h-6 text-white" />
              </div>
              <div class="flex-1 text-left">
                <h4 class="font-medium text-gray-900">Find Suppliers</h4>
                <p class="text-sm text-gray-600">Browse suppliers near you</p>
              </div>
              <Icon name="heroicons:chevron-right" class="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Spacer for fixed bottom nav -->
    <div class="h-16"></div>
  </div>
</template>

<script setup lang="ts">
// Composables
const route = useRoute()
const router = useRouter()
const { user } = useAuth()

// Reactive state
const showQuickOrder = ref(false)
const activeOrdersCount = ref(2) // Mock data
const lastOrder = ref({
  id: '12345',
  supplier: 'Lagos Gas Co.'
}) // Mock data

// Methods
const isActive = (path: string): boolean => {
  return route.path.startsWith(path)
}

const navigateToOrder = (type: 'regular' | 'emergency') => {
  showQuickOrder.value = false
  
  if (type === 'emergency') {
    router.push('/emergency')
  } else {
    router.push('/orders/new')
  }
}

const navigateToSuppliers = () => {
  showQuickOrder.value = false
  router.push('/suppliers')
}

const reorderLast = () => {
  showQuickOrder.value = false
  
  if (lastOrder.value) {
    router.push(`/orders/reorder/${lastOrder.value.id}`)
  }
}

// Handle hardware back button on Android
if (process.client) {
  const handleBackButton = (event: PopStateEvent) => {
    if (showQuickOrder.value) {
      event.preventDefault()
      showQuickOrder.value = false
    }
  }

  onMounted(() => {
    window.addEventListener('popstate', handleBackButton)
  })

  onUnmounted(() => {
    window.removeEventListener('popstate', handleBackButton)
  })
}

// Close modal when route changes
watch(() => route.path, () => {
  showQuickOrder.value = false
})

// Haptic feedback for supported devices
const triggerHaptic = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(50)
  }
}

// Add haptic feedback to FAB
const handleFABClick = () => {
  triggerHaptic()
  showQuickOrder.value = true
}
</script>

<style scoped>
.safe-area-pb {
  padding-bottom: env(safe-area-inset-bottom);
}

.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}

/* Ensure the FAB is properly elevated */
.mobile-bottom-nav button {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Smooth transitions for active states */
.mobile-bottom-nav a {
  transition: all 0.2s ease-in-out;
}

/* Handle notch/safe area for iPhone X+ */
@supports (padding: max(0px)) {
  .safe-area-pb {
    padding-bottom: max(16px, env(safe-area-inset-bottom));
  }
  
  .pb-safe {
    padding-bottom: max(24px, env(safe-area-inset-bottom));
  }
}
</style>
