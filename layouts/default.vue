<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center">
              <h1 class="text-xl font-bold text-blue-600">GasConnect</h1>
            </NuxtLink>
          </div>

          <div class="flex items-center space-x-4">
            <template v-if="isAuthenticated">
              <span class="text-sm text-gray-700">
                Welcome, {{ user?.firstName }}
              </span>
              <button
                @click="handleLogout"
                class="btn-secondary"
              >
                Logout
              </button>
            </template>
            <template v-else>
              <NuxtLink to="/login" class="btn-primary">
                Login
              </NuxtLink>
              <NuxtLink to="/register" class="btn-secondary">
                Register
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <p>&copy; 2025 GasConnect. All rights reserved.</p>
          <p class="text-sm text-gray-400 mt-2">
            Nigerian Gas Supply Platform
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { user, isAuthenticated, logout } = useAuth()

const handleLogout = async () => {
  try {
    await logout()
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Initialize auth on mount
onMounted(() => {
  const { initAuth } = useAuth()
  initAuth()
})
</script>