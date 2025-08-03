<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <NuxtLink to="/login" class="font-medium text-blue-600 hover:text-blue-500">
            sign in to your existing account
          </NuxtLink>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <!-- Role Selection -->
          <div>
            <label for="role" class="block text-sm font-medium text-gray-700">Account Type</label>
            <select
              id="role"
              v-model="form.role"
              name="role"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-300': errors.role }"
            >
              <option value="">Select account type</option>
              <option value="household">Household Customer</option>
              <option value="hospital">Hospital/Medical Facility</option>
              <option value="artisan">Artisan/Workshop</option>
              <option value="supplier">Gas Supplier</option>
            </select>
            <p v-if="errors.role" class="mt-1 text-sm text-red-600">
              {{ errors.role }}
            </p>
          </div>

          <!-- Personal Information -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
              <input
                id="firstName"
                v-model="form.firstName"
                name="firstName"
                type="text"
                autocomplete="given-name"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                :class="{ 'border-red-300': errors.firstName }"
                placeholder="First name"
              />
              <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">
                {{ errors.firstName }}
              </p>
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                id="lastName"
                v-model="form.lastName"
                name="lastName"
                type="text"
                autocomplete="family-name"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                :class="{ 'border-red-300': errors.lastName }"
                placeholder="Last name"
              />
              <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">
                {{ errors.lastName }}
              </p>
            </div>
          </div>

          <!-- Contact Information -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-300': errors.email }"
              placeholder="Email address"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">
              {{ errors.email }}
            </p>
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              id="phone"
              v-model="form.phone"
              name="phone"
              type="tel"
              autocomplete="tel"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-300': errors.phone }"
              placeholder="+2348012345678"
              @input="formatPhoneNumber"
            />
            <p v-if="errors.phone" class="mt-1 text-sm text-red-600">
              {{ errors.phone }}
            </p>
            <p class="mt-1 text-xs text-gray-500">
              Enter your phone number in international format (e.g., +2348012345678)
            </p>
          </div>

          <!-- Business Information (for suppliers) -->
          <div v-if="form.role === 'supplier'" class="space-y-4">
            <div>
              <label for="businessName" class="block text-sm font-medium text-gray-700">Business Name</label>
              <input
                id="businessName"
                v-model="form.businessName"
                name="businessName"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                :class="{ 'border-red-300': errors.businessName }"
                placeholder="Your business name"
              />
              <p v-if="errors.businessName" class="mt-1 text-sm text-red-600">
                {{ errors.businessName }}
              </p>
            </div>
            <div>
              <label for="businessType" class="block text-sm font-medium text-gray-700">Business Type</label>
              <select
                id="businessType"
                v-model="form.businessType"
                name="businessType"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                :class="{ 'border-red-300': errors.businessType }"
              >
                <option value="">Select business type</option>
                <option value="lpg_dealer">LPG Dealer</option>
                <option value="industrial_gas">Industrial Gas Supplier</option>
                <option value="medical_gas">Medical Gas Supplier</option>
                <option value="mixed">Mixed Gas Supplier</option>
              </select>
              <p v-if="errors.businessType" class="mt-1 text-sm text-red-600">
                {{ errors.businessType }}
              </p>
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-300': errors.password }"
              placeholder="Password"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">
              {{ errors.password }}
            </p>
            <p class="mt-1 text-xs text-gray-500">
              Must be at least 8 characters with uppercase, lowercase, number and special character
            </p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              autocomplete="new-password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-300': errors.confirmPassword }"
              placeholder="Confirm password"
            />
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">
              {{ errors.confirmPassword }}
            </p>
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
            {{ isLoading ? 'Creating account...' : 'Create account' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { RegisterData, UserRole } from '~/types'
import { VALIDATION_PATTERNS, ERROR_MESSAGES } from '~/constants'

// Set page meta
definePageMeta({
  layout: false,
  auth: false
})

// Set head
useHead({
  title: 'Create Account - GasConnect',
  meta: [
    {
      name: 'description',
      content: 'Create your GasConnect account to access gas supply services across Nigeria.'
    }
  ]
})

// Form validation schema
const registerSchema = z.object({
  role: z.enum(['household', 'hospital', 'artisan', 'supplier', 'delivery_driver'] as const, {
    required_error: ERROR_MESSAGES.REQUIRED
  }),
  firstName: z.string().min(1, ERROR_MESSAGES.REQUIRED),
  lastName: z.string().min(1, ERROR_MESSAGES.REQUIRED),
  email: z.string()
    .min(1, ERROR_MESSAGES.REQUIRED)
    .regex(VALIDATION_PATTERNS.EMAIL, ERROR_MESSAGES.INVALID_EMAIL),
  phone: z.string()
    .min(1, ERROR_MESSAGES.REQUIRED)
    .regex(VALIDATION_PATTERNS.NIGERIAN_PHONE, ERROR_MESSAGES.INVALID_NIGERIAN_PHONE),
  password: z.string()
    .min(1, ERROR_MESSAGES.REQUIRED)
    .regex(VALIDATION_PATTERNS.PASSWORD, ERROR_MESSAGES.WEAK_PASSWORD),
  confirmPassword: z.string().min(1, ERROR_MESSAGES.REQUIRED),
  businessName: z.string().optional(),
  businessType: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: ERROR_MESSAGES.PASSWORDS_DONT_MATCH,
  path: ['confirmPassword']
}).refine((data) => {
  if (data.role === 'supplier') {
    return data.businessName && data.businessName.length > 0
  }
  return true
}, {
  message: 'Business name is required for suppliers',
  path: ['businessName']
}).refine((data) => {
  if (data.role === 'supplier') {
    return data.businessType && data.businessType.length > 0
  }
  return true
}, {
  message: 'Business type is required for suppliers',
  path: ['businessType']
})

// Reactive state
const form = reactive<RegisterData & { confirmPassword: string }>({
  role: '' as UserRole,
  firstName: '',
  lastName: '',
  email: '',
  phone: '', // Changed from phoneNumber to match backend
  password: '',
  confirmPassword: '',
  businessName: ''
})

const errors = reactive<Record<string, string>>({})
const errorMessage = ref('')
const isLoading = ref(false)

// Composables
const { register } = useAuth()
const router = useRouter()

// Phone number formatting
const formatPhoneNumber = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '') // Remove non-digits

  // If starts with 0, replace with 234
  if (value.startsWith('0')) {
    value = '234' + value.slice(1)
  }

  // If starts with 234, add +
  if (value.startsWith('234')) {
    value = '+' + value
  }

  // If doesn't start with +234, add it
  if (!value.startsWith('+234') && value.length > 0) {
    value = '+234' + value
  }

  // Limit to correct length (+234 + 10 digits = 14 characters)
  if (value.length > 14) {
    value = value.slice(0, 14)
  }

  form.phone = value
}

// Form submission
const handleSubmit = async () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => delete errors[key])
  errorMessage.value = ''

  // Validate form
  try {
    registerSchema.parse(form)
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
    const registerData: RegisterData = {
      role: form.role,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone, // Changed from phoneNumber to match backend
      password: form.password
    }

    // Add business info for suppliers
    if (form.role === 'supplier') {
      registerData.businessName = form.businessName
    }

    await register(registerData)

    // Redirect to dashboard or intended page
    await router.push('/dashboard')
  } catch (error: any) {
    console.error('Registration error:', error)

    // Handle validation errors from backend
    if (error.status === 400 && error.errors) {
      // Map backend validation errors to form fields
      error.errors.forEach((err: any) => {
        if (err.field && err.message) {
          errors[err.field] = err.message
        }
      })
      errorMessage.value = 'Please check the form for errors and try again.'
    } else {
      errorMessage.value = error.message || 'Registration failed. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

// Redirect if already authenticated
const { isAuthenticated } = useAuth()
if (isAuthenticated.value) {
  await navigateTo('/dashboard')
}
</script>