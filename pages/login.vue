<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <NuxtLink to="/register" class="font-medium text-blue-600 hover:text-blue-500">
            create a new account
          </NuxtLink>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="identifier" class="sr-only">Email or Phone</label>
            <input
              id="identifier"
              v-model="form.identifier"
              name="identifier"
              type="text"
              autocomplete="username"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              :class="{ 'border-red-300': errors.identifier }"
              placeholder="Email address or phone number"
            />
            <p v-if="errors.identifier" class="mt-1 text-sm text-red-600">
              {{ errors.identifier }}
            </p>
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              :class="{ 'border-red-300': errors.password }"
              placeholder="Password"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">
              {{ errors.password }}
            </p>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.rememberMe"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div class="text-sm">
            <NuxtLink to="/forgot-password" class="font-medium text-blue-600 hover:text-blue-500">
              Forgot your password?
            </NuxtLink>
          </div>
        </div>

        <div v-if="errorMessage" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ errorMessage }}
              </h3>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { LoginCredentials } from '~/types'
import { VALIDATION_PATTERNS, ERROR_MESSAGES } from '~/constants'

// Set page meta
definePageMeta({
  layout: false,
  auth: false
})

// Set head
useHead({
  title: 'Sign In - GasConnect',
  meta: [
    {
      name: 'description',
      content: 'Sign in to your GasConnect account to access gas supply services.'
    }
  ]
})

// Form validation schema
const loginSchema = z.object({
  identifier: z.string()
    .min(1, ERROR_MESSAGES.REQUIRED)
    .refine((val) => {
      return VALIDATION_PATTERNS.EMAIL.test(val) || VALIDATION_PATTERNS.NIGERIAN_PHONE.test(val)
    }, 'Please enter a valid email address or Nigerian phone number'),
  password: z.string()
    .min(1, ERROR_MESSAGES.REQUIRED),
  rememberMe: z.boolean().optional()
})

// Reactive state
const form = reactive<LoginCredentials & { rememberMe?: boolean }>({
  identifier: '',
  password: '',
  rememberMe: false
})

const errors = reactive<Record<string, string>>({})
const errorMessage = ref('')
const isLoading = ref(false)

// Composables
const { login } = useAuth()
const router = useRouter()

// Form submission
const handleSubmit = async () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => delete errors[key])
  errorMessage.value = ''

  // Validate form
  try {
    loginSchema.parse(form)
  } catch (error: any) {
    if (error.errors) {
      error.errors.forEach((err: any) => {
        errors[err.path[0]] = err.message
      })
    }
    return
  }

  isLoading.value = true

  try {
    console.log('🔐 Starting login process...')
    const result = await login({
      identifier: form.identifier,
      password: form.password
    })

    console.log('✅ Login result:', result)

    if (result.success) {
      console.log('🎉 Login successful, user:', result.user)

      // Show success message
      const toast = useNuxtApp().$toast
      if (toast) {
        toast.success('Login successful! Redirecting...')
      }

      // Small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100))

      // Check auth state before redirect
      const { isAuthenticated, user } = useAuth()
      console.log('🔍 Auth state before redirect:', {
        isAuthenticated: isAuthenticated.value,
        user: user.value
      })

      // Redirect to dashboard or intended page
      const redirect = useRoute().query.redirect as string
      const targetUrl = redirect || '/dashboard'
      console.log('🚀 Redirecting to:', targetUrl)
      await navigateTo(targetUrl)
    } else {
      console.log('❌ Login failed: result.success is false')
      errorMessage.value = 'Login failed. Please try again.'
    }
  } catch (error: any) {
    console.error('❌ Login error:', error)
    errorMessage.value = error.message || 'Login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Redirect if already authenticated (check on mount)
const { isAuthenticated } = useAuth()

onMounted(async () => {
  if (isAuthenticated.value) {
    await navigateTo('/dashboard')
  }
})
</script>