<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Supplier Verification</h1>
      <p class="mt-2 text-sm text-gray-700">
        Complete your business verification to start selling on GasConnect.
      </p>
    </div>

    <!-- Progress Steps -->
    <div class="mb-8">
      <nav aria-label="Progress">
        <ol class="flex items-center">
          <li v-for="(step, stepIdx) in steps" :key="step.name" :class="[stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '', 'relative']">
            <div v-if="step.status === 'complete'" class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="h-0.5 w-full bg-blue-600"></div>
            </div>
            <div v-else-if="step.status === 'current'" class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="h-0.5 w-full bg-gray-200"></div>
            </div>
            <div v-else class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="h-0.5 w-full bg-gray-200"></div>
            </div>

            <div :class="[
              step.status === 'complete' ? 'bg-blue-600 hover:bg-blue-900' :
              step.status === 'current' ? 'border-2 border-blue-600 bg-white' :
              'border-2 border-gray-300 bg-white hover:border-gray-400',
              'relative w-8 h-8 flex items-center justify-center rounded-full'
            ]">
              <svg v-if="step.status === 'complete'" class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span v-else-if="step.status === 'current'" class="text-blue-600 font-medium text-sm">{{ stepIdx + 1 }}</span>
              <span v-else class="text-gray-500 font-medium text-sm">{{ stepIdx + 1 }}</span>
            </div>
            <span class="absolute top-10 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-500">{{ step.name }}</span>
          </li>
        </ol>
      </nav>
    </div>

    <!-- Step Content -->
    <div class="bg-white shadow rounded-lg">
      <!-- Business Information Step -->
      <div v-if="currentStep === 0" class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
          Business Information
        </h3>

        <form @submit.prevent="submitBusinessInfo" class="space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="businessName" class="block text-sm font-medium text-gray-700">
                Business Name *
              </label>
              <input
                id="businessName"
                v-model="businessForm.businessName"
                type="text"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                :class="{ 'border-red-300': businessErrors.businessName }"
              />
              <p v-if="businessErrors.businessName" class="mt-1 text-sm text-red-600">
                {{ businessErrors.businessName }}
              </p>
            </div>

            <div>
              <label for="businessType" class="block text-sm font-medium text-gray-700">
                Business Type *
              </label>
              <select
                id="businessType"
                v-model="businessForm.businessType"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                :class="{ 'border-red-300': businessErrors.businessType }"
              >
                <option value="">Select business type</option>
                <option value="lpg_dealer">LPG Dealer</option>
                <option value="industrial_gas">Industrial Gas Supplier</option>
                <option value="medical_gas">Medical Gas Supplier</option>
                <option value="mixed">Mixed Gas Supplier</option>
              </select>
              <p v-if="businessErrors.businessType" class="mt-1 text-sm text-red-600">
                {{ businessErrors.businessType }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="registrationNumber" class="block text-sm font-medium text-gray-700">
                CAC Registration Number *
              </label>
              <input
                id="registrationNumber"
                v-model="businessForm.registrationNumber"
                type="text"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                :class="{ 'border-red-300': businessErrors.registrationNumber }"
              />
              <p v-if="businessErrors.registrationNumber" class="mt-1 text-sm text-red-600">
                {{ businessErrors.registrationNumber }}
              </p>
            </div>

            <div>
              <label for="taxNumber" class="block text-sm font-medium text-gray-700">
                Tax Identification Number
              </label>
              <input
                id="taxNumber"
                v-model="businessForm.taxNumber"
                type="text"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label for="businessAddress" class="block text-sm font-medium text-gray-700">
              Business Address *
            </label>
            <textarea
              id="businessAddress"
              v-model="businessForm.businessAddress"
              rows="3"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-300': businessErrors.businessAddress }"
            ></textarea>
            <p v-if="businessErrors.businessAddress" class="mt-1 text-sm text-red-600">
              {{ businessErrors.businessAddress }}
            </p>
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <span v-if="isSubmitting" class="mr-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ isSubmitting ? 'Saving...' : 'Continue' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { VALIDATION_PATTERNS, ERROR_MESSAGES } from '~/constants'

// Set page meta
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role']
})

// Set head
useHead({
  title: 'Supplier Onboarding - GasConnect',
  meta: [
    {
      name: 'description',
      content: 'Complete your supplier verification on GasConnect.'
    }
  ]
})

// Composables
const { isSupplier } = useRoles()
const { apiCall } = useApi()

// Redirect if not supplier
if (!isSupplier.value) {
  throw createError({
    statusCode: 403,
    statusMessage: 'Access denied - Supplier role required'
  })
}

// Steps configuration
const steps = ref([
  { name: 'Business Info', status: 'current' },
  { name: 'Documents', status: 'upcoming' },
  { name: 'Verification', status: 'upcoming' }
])

const currentStep = ref(0)
const isSubmitting = ref(false)

// Business form
const businessForm = reactive({
  businessName: '',
  businessType: '',
  registrationNumber: '',
  taxNumber: '',
  businessAddress: '',
  contactPerson: '',
  contactPhone: ''
})

const businessErrors = reactive<Record<string, string>>({})

// Validation schema
const businessSchema = z.object({
  businessName: z.string().min(1, ERROR_MESSAGES.REQUIRED),
  businessType: z.string().min(1, ERROR_MESSAGES.REQUIRED),
  registrationNumber: z.string().min(1, ERROR_MESSAGES.REQUIRED),
  taxNumber: z.string().optional(),
  businessAddress: z.string().min(1, ERROR_MESSAGES.REQUIRED),
  contactPerson: z.string().min(1, ERROR_MESSAGES.REQUIRED),
  contactPhone: z.string()
    .min(1, ERROR_MESSAGES.REQUIRED)
    .regex(VALIDATION_PATTERNS.NIGERIAN_PHONE, ERROR_MESSAGES.INVALID_NIGERIAN_PHONE)
})

// Submit business information
const submitBusinessInfo = async () => {
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

  isSubmitting.value = true

  try {
    // Real API call to update supplier profile
    const response = await apiCall('/api/v1/profiles', {
      method: 'PUT',
      body: {
        businessName: businessForm.businessName,
        // Map frontend fields to backend structure
        metadata: {
          businessType: businessForm.businessType,
          registrationNumber: businessForm.registrationNumber,
          taxNumber: businessForm.taxNumber,
          businessAddress: businessForm.businessAddress,
          contactPerson: businessForm.contactPerson,
          contactPhone: businessForm.contactPhone
        }
      }
    })

    if (!response.success) {
      throw new Error(response.message || 'Failed to save business information')
    }

    // Update step status
    steps.value[0].status = 'complete'
    steps.value[1].status = 'current'
    currentStep.value = 1

    // Show success message
    const toast = useNuxtApp().$toast
    if (toast) {
      toast.success('Business information saved successfully')
    }
  } catch (error: any) {
    console.error('Error submitting business info:', error)
    const toast = useNuxtApp().$toast
    if (toast) {
      toast.error(error.message || 'Failed to save business information')
    }
  } finally {
    isSubmitting.value = false
  }
}

// Load existing data if available
onMounted(async () => {
  try {
    // TODO: Load existing business profile if available
    // const response = await apiCall('/api/v1/supplier/profile')
    // if (response.success && response.data) {
    //   Object.assign(businessForm, response.data)
    // }
  } catch (error) {
    console.error('Error loading business profile:', error)
  }
})
</script>