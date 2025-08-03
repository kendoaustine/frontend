<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <!-- Error Icon -->
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
          <svg class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        <!-- Error Title -->
        <h1 class="mt-6 text-3xl font-extrabold text-gray-900">
          {{ errorTitle }}
        </h1>

        <!-- Error Message -->
        <p class="mt-2 text-sm text-gray-600">
          {{ errorMessage }}
        </p>

        <!-- Actions -->
        <div class="mt-8 space-y-4">
          <button
            @click="handleRetry"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </button>

          <button
            @click="goHome"
            class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Homepage
          </button>

          <button
            @click="goBack"
            class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go Back
          </button>
        </div>

        <!-- Support Information -->
        <div class="mt-8 text-center">
          <p class="text-xs text-gray-500">
            If this problem persists, please contact our support team.
          </p>
          <a
            href="mailto:support@gasconnect.ng"
            class="text-xs text-blue-600 hover:text-blue-500"
          >
            support@gasconnect.ng
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Get error from route params or props
const route = useRoute()
const error = ref<Error | null>(null)

// Set page meta
definePageMeta({
  layout: false
})

// Set head
useHead({
  title: 'Error - GasConnect',
  meta: [
    {
      name: 'description',
      content: 'An error occurred while processing your request.'
    }
  ]
})

// Error details
const errorTitle = computed(() => {
  if (error.value?.statusCode === 404) {
    return 'Page Not Found'
  }
  if (error.value?.statusCode === 403) {
    return 'Access Denied'
  }
  if (error.value?.statusCode === 500) {
    return 'Server Error'
  }
  return 'Something went wrong'
})

const errorMessage = computed(() => {
  if (error.value?.statusCode === 404) {
    return 'The page you are looking for could not be found.'
  }
  if (error.value?.statusCode === 403) {
    return 'You do not have permission to access this resource.'
  }
  if (error.value?.statusCode === 500) {
    return 'An internal server error occurred. Please try again later.'
  }
  return error.value?.message || 'An unexpected error occurred. Please try again.'
})

// Actions
const handleRetry = () => {
  window.location.reload()
}

const goHome = () => {
  navigateTo('/')
}

const goBack = () => {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    navigateTo('/')
  }
}
</script>