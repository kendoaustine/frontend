<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Profile Settings</h1>
      <p class="mt-2 text-sm text-gray-700">
        Manage your account information and preferences.
      </p>
    </div>

    <div class="space-y-8">
      <!-- Personal Information -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            Personal Information
          </h3>

          <form @submit.prevent="updatePersonalInfo" class="space-y-6">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  v-model="personalForm.firstName"
                  type="text"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  :class="{ 'border-red-300': personalErrors.firstName }"
                />
                <p v-if="personalErrors.firstName" class="mt-1 text-sm text-red-600">
                  {{ personalErrors.firstName }}
                </p>
              </div>

              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  v-model="personalForm.lastName"
                  type="text"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  :class="{ 'border-red-300': personalErrors.lastName }"
                />
                <p v-if="personalErrors.lastName" class="mt-1 text-sm text-red-600">
                  {{ personalErrors.lastName }}
                </p>
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                v-model="personalForm.email"
                type="email"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                :class="{ 'border-red-300': personalErrors.email }"
              />
              <p v-if="personalErrors.email" class="mt-1 text-sm text-red-600">
                {{ personalErrors.email }}
              </p>
              <p v-if="!user?.isEmailVerified" class="mt-1 text-sm text-yellow-600">
                Email not verified. <button @click="sendEmailVerification" class="text-blue-600 hover:text-blue-500">Send verification</button>
              </p>
            </div>

            <div>
              <label for="phoneNumber" class="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                v-model="personalForm.phoneNumber"
                type="tel"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                :class="{ 'border-red-300': personalErrors.phoneNumber }"
              />
              <p v-if="personalErrors.phoneNumber" class="mt-1 text-sm text-red-600">
                {{ personalErrors.phoneNumber }}
              </p>
              <p v-if="!user?.isPhoneVerified" class="mt-1 text-sm text-yellow-600">
                Phone not verified. <button @click="sendPhoneVerification" class="text-blue-600 hover:text-blue-500">Send verification</button>
              </p>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="isUpdatingPersonal"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <span v-if="isUpdatingPersonal" class="mr-2">
                  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ isUpdatingPersonal ? 'Updating...' : 'Update Information' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { VALIDATION_PATTERNS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '~/constants'

// Set page meta
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

// Set head
useHead({
  title: 'Profile - GasConnect',
  meta: [
    {
      name: 'description',
      content: 'Manage your GasConnect profile and account settings.'
    }
  ]
})

// Composables
const { user } = useAuth()
const { isSupplier } = useRoles()
const { apiCall } = useApi()

// Personal information form
const personalForm = reactive({
  firstName: user.value?.firstName || '',
  lastName: user.value?.lastName || '',
  email: user.value?.email || '',
  phoneNumber: user.value?.phoneNumber || ''
})

const personalErrors = reactive<Record<string, string>>({})
const isUpdatingPersonal = ref(false)

// Business information form (for suppliers)
const businessForm = reactive({
  businessName: '',
  businessType: '',
  businessRegistrationNumber: '',
  taxIdentificationNumber: ''
})

const businessErrors = reactive<Record<string, string>>({})
const isUpdatingBusiness = ref(false)

// Validation schemas
const personalSchema = z.object({
  firstName: z.string().min(1, ERROR_MESSAGES.REQUIRED),
  lastName: z.string().min(1, ERROR_MESSAGES.REQUIRED),
  email: z.string()
    .min(1, ERROR_MESSAGES.REQUIRED)
    .regex(VALIDATION_PATTERNS.EMAIL, ERROR_MESSAGES.INVALID_EMAIL),
  phoneNumber: z.string()
    .min(1, ERROR_MESSAGES.REQUIRED)
    .regex(VALIDATION_PATTERNS.NIGERIAN_PHONE, ERROR_MESSAGES.INVALID_NIGERIAN_PHONE)
})

const businessSchema = z.object({
  businessName: z.string().min(1, ERROR_MESSAGES.REQUIRED),
  businessType: z.string().min(1, ERROR_MESSAGES.REQUIRED),
  businessRegistrationNumber: z.string().optional(),
  taxIdentificationNumber: z.string().optional()
})

// Update personal information
const updatePersonalInfo = async () => {
  // Clear previous errors
  Object.keys(personalErrors).forEach(key => delete personalErrors[key])

  // Validate form
  try {
    personalSchema.parse(personalForm)
  } catch (error: any) {
    if (error.errors) {
      error.errors.forEach((err: any) => {
        personalErrors[err.path[0]] = err.message
      })
    }
    return
  }

  isUpdatingPersonal.value = true

  try {
    // Real API call to update profile
    const response = await apiCall('/api/v1/profiles', {
      method: 'PUT',
      body: {
        firstName: personalForm.firstName,
        lastName: personalForm.lastName,
        email: personalForm.email,
        phone: personalForm.phoneNumber // Map to backend field name
      }
    })

    if (!response.success) {
      throw new Error(response.message || 'Failed to update profile')
    }

    // Update user data in auth store
    if (user.value) {
      user.value.firstName = personalForm.firstName
      user.value.lastName = personalForm.lastName
      user.value.email = personalForm.email
      user.value.phoneNumber = personalForm.phoneNumber
    }

    // Show success message
    const toast = useNuxtApp().$toast
    if (toast) {
      toast.success(SUCCESS_MESSAGES.PROFILE_UPDATED)
    }
  } catch (error: any) {
    console.error('Error updating profile:', error)
    const toast = useNuxtApp().$toast
    if (toast) {
      toast.error(error.message || 'Failed to update profile')
    }
  } finally {
    isUpdatingPersonal.value = false
  }
}

// Update business information
const updateBusinessInfo = async () => {
  // Clear previous errors
  Object.keys(businessErrors).forEach(key => delete businessErrors[key])

  // Validate form
  try {
    businessSchema.parse(businessForm)
  } catch (error: any) {
    if (error.errors) {
      error.errors.forEach((err: any) => {
        businessErrors[err.path[0]] = err.message
      })
    }
    return
  }

  isUpdatingBusiness.value = true

  try {
    // TODO: Replace with real API call
    // const response = await apiCall('/api/v1/supplier/profile', {
    //   method: 'PUT',
    //   body: businessForm
    // })

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Show success message
    const toast = useNuxtApp().$toast
    if (toast) {
      toast.success('Business information updated successfully')
    }
  } catch (error: any) {
    console.error('Error updating business info:', error)
    const toast = useNuxtApp().$toast
    if (toast) {
      toast.error(error.message || 'Failed to update business information')
    }
  } finally {
    isUpdatingBusiness.value = false
  }
}

// Send email verification
const sendEmailVerification = async () => {
  try {
    // Real API call to send email verification
    const response = await apiCall('/api/v1/auth/send-email-verification', {
      method: 'POST'
    })

    if (!response.success) {
      throw new Error(response.message || 'Failed to send verification email')
    }

    const toast = useNuxtApp().$toast
    if (toast) {
      toast.success('Verification email sent')
    }
  } catch (error: any) {
    console.error('Error sending email verification:', error)
    const toast = useNuxtApp().$toast
    if (toast) {
      toast.error(error.message || 'Failed to send verification email')
    }
  }
}

// Send phone verification
const sendPhoneVerification = async () => {
  try {
    // Real API call to send phone verification
    const response = await apiCall('/api/v1/auth/send-phone-verification', {
      method: 'POST'
    })

    if (!response.success) {
      throw new Error(response.message || 'Failed to send verification SMS')
    }

    const toast = useNuxtApp().$toast
    if (toast) {
      toast.success('Verification SMS sent')
    }
  } catch (error: any) {
    console.error('Error sending phone verification:', error)
    const toast = useNuxtApp().$toast
    if (toast) {
      toast.error(error.message || 'Failed to send verification SMS')
    }
  }
}

// Load business information for suppliers
onMounted(async () => {
  if (isSupplier.value) {
    try {
      // TODO: Load business profile from API
      // const response = await apiCall('/api/v1/supplier/profile')
      // if (response.success && response.data) {
      //   Object.assign(businessForm, response.data)
      // }
    } catch (error) {
      console.error('Error loading business profile:', error)
    }
  }
})
</script>