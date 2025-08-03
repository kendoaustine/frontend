<template>
  <div class="mobile-layout min-h-screen bg-gray-50">
    <!-- Mobile Header -->
    <header class="sticky top-0 z-30 bg-white border-b border-gray-200 safe-area-pt">
      <div class="flex items-center justify-between px-4 py-3">
        <!-- Left Side -->
        <div class="flex items-center space-x-3">
          <!-- Back Button (conditional) -->
          <button
            v-if="showBackButton"
            @click="goBack"
            class="p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Icon name="heroicons:arrow-left" class="w-5 h-5" />
          </button>
          
          <!-- Logo/Title -->
          <div v-else class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">G</span>
            </div>
            <h1 class="text-lg font-semibold text-gray-900">{{ pageTitle }}</h1>
          </div>
          
          <!-- Page Title (when back button is shown) -->
          <h1 v-if="showBackButton" class="text-lg font-semibold text-gray-900 truncate">
            {{ pageTitle }}
          </h1>
        </div>

        <!-- Right Side -->
        <div class="flex items-center space-x-2">
          <!-- Connection Status -->
          <ConnectionStatus :compact="true" />
          
          <!-- Notifications -->
          <NotificationCenter />
          
          <!-- User Avatar -->
          <button
            @click="showUserMenu = !showUserMenu"
            class="relative w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center"
          >
            <span class="text-sm font-medium text-gray-700">
              {{ user?.firstName?.charAt(0) }}{{ user?.lastName?.charAt(0) }}
            </span>
          </button>
        </div>
      </div>

      <!-- User Menu Dropdown -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="showUserMenu"
          class="absolute top-full right-4 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-40"
          @click.stop
        >
          <div class="py-1">
            <NuxtLink
              to="/profile"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              @click="showUserMenu = false"
            >
              Your Profile
            </NuxtLink>
            <NuxtLink
              to="/settings"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              @click="showUserMenu = false"
            >
              Settings
            </NuxtLink>
            <NuxtLink
              to="/help"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              @click="showUserMenu = false"
            >
              Help & Support
            </NuxtLink>
            <div class="border-t border-gray-100"></div>
            <button
              @click="handleLogout"
              class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Sign Out
            </button>
          </div>
        </div>
      </Transition>
    </header>

    <!-- Main Content -->
    <main class="flex-1 pb-20">
      <!-- Page Content -->
      <div class="px-4 py-6">
        <slot />
      </div>
    </main>

    <!-- Mobile Bottom Navigation -->
    <MobileBottomNav />

    <!-- Offline Indicator -->
    <OfflineIndicator />

    <!-- Click outside to close user menu -->
    <div
      v-if="showUserMenu"
      class="fixed inset-0 z-30"
      @click="showUserMenu = false"
    ></div>

    <!-- PWA Install Prompt -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="transform translate-y-full opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-full opacity-0"
    >
      <div
        v-if="showInstallPrompt"
        class="fixed bottom-20 left-4 right-4 z-40 bg-blue-600 text-white rounded-lg p-4 shadow-lg"
      >
        <div class="flex items-start space-x-3">
          <Icon name="heroicons:arrow-down-tray" class="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div class="flex-1">
            <h3 class="font-medium">Install GasConnect</h3>
            <p class="text-sm text-blue-100 mt-1">
              Add to your home screen for quick access and offline features.
            </p>
          </div>
        </div>
        
        <div class="flex space-x-3 mt-4">
          <button
            @click="installPWA"
            class="flex-1 bg-white text-blue-600 py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors"
          >
            Install
          </button>
          <button
            @click="dismissInstallPrompt"
            class="flex-1 bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors"
          >
            Not Now
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
// Composables
const route = useRoute()
const router = useRouter()
const { user, logout } = useAuth()

// Reactive state
const showUserMenu = ref(false)
const showInstallPrompt = ref(false)
const deferredPrompt = ref<any>(null)

// Computed properties
const pageTitle = computed(() => {
  // Extract page title from route meta or generate from path
  if (route.meta.title) {
    return route.meta.title as string
  }
  
  const pathSegments = route.path.split('/').filter(Boolean)
  if (pathSegments.length === 0) return 'GasConnect'
  
  const lastSegment = pathSegments[pathSegments.length - 1]
  return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
})

const showBackButton = computed(() => {
  // Show back button for non-root pages
  const rootPaths = ['/dashboard', '/orders', '/suppliers', '/profile']
  return !rootPaths.includes(route.path)
})

// Methods
const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/dashboard')
  }
}

const handleLogout = async () => {
  showUserMenu.value = false
  await logout()
  router.push('/auth/login')
}

const installPWA = async () => {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice
    
    if (outcome === 'accepted') {
      console.log('PWA installed')
    }
    
    deferredPrompt.value = null
    showInstallPrompt.value = false
  }
}

const dismissInstallPrompt = () => {
  showInstallPrompt.value = false
  
  // Remember user dismissed the prompt
  localStorage.setItem('pwa-install-dismissed', 'true')
}

// PWA Install Prompt Logic
if (process.client) {
  // Listen for the beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
    
    // Check if user has previously dismissed the prompt
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (!dismissed) {
      // Show prompt after a delay
      setTimeout(() => {
        showInstallPrompt.value = true
      }, 10000) // 10 seconds after page load
    }
  })

  // Listen for app installation
  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed')
    showInstallPrompt.value = false
    deferredPrompt.value = null
  })
}

// Handle hardware back button on Android
if (process.client) {
  const handleBackButton = (event: PopStateEvent) => {
    if (showUserMenu.value) {
      event.preventDefault()
      showUserMenu.value = false
    }
  }

  onMounted(() => {
    window.addEventListener('popstate', handleBackButton)
  })

  onUnmounted(() => {
    window.removeEventListener('popstate', handleBackButton)
  })
}

// Close user menu when route changes
watch(() => route.path, () => {
  showUserMenu.value = false
})

// Handle safe area insets for devices with notches
onMounted(() => {
  // Set CSS custom properties for safe area insets
  const updateSafeAreaInsets = () => {
    const root = document.documentElement
    root.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)')
    root.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)')
    root.style.setProperty('--safe-area-inset-left', 'env(safe-area-inset-left)')
    root.style.setProperty('--safe-area-inset-right', 'env(safe-area-inset-right)')
  }
  
  updateSafeAreaInsets()
  
  // Update on orientation change
  window.addEventListener('orientationchange', updateSafeAreaInsets)
  
  onUnmounted(() => {
    window.removeEventListener('orientationchange', updateSafeAreaInsets)
  })
})
</script>

<style scoped>
.safe-area-pt {
  padding-top: env(safe-area-inset-top);
}

/* Handle notch/safe area for iPhone X+ */
@supports (padding: max(0px)) {
  .safe-area-pt {
    padding-top: max(12px, env(safe-area-inset-top));
  }
}

/* Smooth scrolling for better mobile experience */
.mobile-layout {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

/* Prevent zoom on input focus (iOS) */
.mobile-layout input,
.mobile-layout select,
.mobile-layout textarea {
  font-size: 16px;
}

/* Improve touch targets */
.mobile-layout button,
.mobile-layout a {
  min-height: 44px;
  min-width: 44px;
}
</style>
