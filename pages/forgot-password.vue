<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <NuxtLink to="/login" class="font-medium text-blue-600 hover:text-blue-500">
            back to sign in
          </NuxtLink>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div>
          <label for="email" class="sr-only">Email address</label>
          <input
            id="email"
            v-model="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
          />
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isLoading ? 'Sending...' : 'Send reset link' }}
          </button>
        </div>

        <div v-if="message" class="text-center text-sm text-green-600">
          {{ message }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// Set page meta
definePageMeta({
  layout: false,
  auth: false
})

// Set head
useHead({
  title: 'Reset Password - GasConnect',
  meta: [
    {
      name: 'description',
      content: 'Reset your GasConnect account password.'
    }
  ]
})

// Reactive state
const email = ref('')
const message = ref('')
const isLoading = ref(false)

// Form submission
const handleSubmit = async () => {
  isLoading.value = true
  
  try {
    // TODO: Implement password reset functionality
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    message.value = 'If an account with that email exists, we\'ve sent you a reset link.'
    email.value = ''
  } catch (error) {
    console.error('Password reset error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
