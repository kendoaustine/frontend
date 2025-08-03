<template>
  <div class="sos-order-form">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <!-- Header -->
      <div class="flex items-center mb-6">
        <Icon name="heroicons:exclamation-triangle" class="w-8 h-8 text-red-600 mr-3" />
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Emergency Gas Order</h2>
          <p class="text-sm text-gray-600">Priority delivery within 30 minutes</p>
        </div>
      </div>

      <!-- Emergency Alert -->
      <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div class="flex">
          <Icon name="heroicons:information-circle" class="w-5 h-5 text-red-400 mr-2 mt-0.5" />
          <div>
            <h3 class="text-sm font-medium text-red-800">Emergency Service Active</h3>
            <p class="text-sm text-red-700 mt-1">
              Emergency orders are prioritized and may include additional fees. 
              Estimated delivery: 15-30 minutes.
            </p>
          </div>
        </div>
      </div>

      <form @submit.prevent="submitOrder" class="space-y-6">
        <!-- Emergency Details -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Emergency Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Emergency Type *
            </label>
            <select
              v-model="form.emergencyType"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              :class="{ 'border-red-300': errors.emergencyType }"
              required
            >
              <option value="">Select emergency type</option>
              <option value="medical">Medical Emergency</option>
              <option value="cooking">Cooking Emergency</option>
              <option value="heating">Heating Emergency</option>
              <option value="business">Business Critical</option>
              <option value="other">Other</option>
            </select>
            <p v-if="errors.emergencyType" class="mt-1 text-sm text-red-600">
              {{ errors.emergencyType }}
            </p>
          </div>

          <!-- Urgency Level -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Urgency Level *
            </label>
            <select
              v-model="form.urgencyLevel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              :class="{ 'border-red-300': errors.urgencyLevel }"
              required
            >
              <option value="">Select urgency</option>
              <option value="critical">Critical (0-15 min)</option>
              <option value="high">High (15-30 min)</option>
              <option value="medium">Medium (30-60 min)</option>
            </select>
            <p v-if="errors.urgencyLevel" class="mt-1 text-sm text-red-600">
              {{ errors.urgencyLevel }}
            </p>
          </div>
        </div>

        <!-- Gas Requirements -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Gas Requirements</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Gas Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Gas Type *
              </label>
              <select
                v-model="form.gasType"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                :class="{ 'border-red-300': errors.gasType }"
                required
              >
                <option value="">Select gas type</option>
                <option value="lpg_3kg">LPG 3kg</option>
                <option value="lpg_6kg">LPG 6kg</option>
                <option value="lpg_12_5kg">LPG 12.5kg</option>
                <option value="lpg_25kg">LPG 25kg</option>
                <option value="lpg_50kg">LPG 50kg</option>
                <option value="medical_oxygen">Medical Oxygen</option>
                <option value="industrial_oxygen">Industrial Oxygen</option>
                <option value="acetylene">Acetylene</option>
                <option value="argon">Argon</option>
                <option value="nitrogen">Nitrogen</option>
              </select>
              <p v-if="errors.gasType" class="mt-1 text-sm text-red-600">
                {{ errors.gasType }}
              </p>
            </div>

            <!-- Quantity -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                v-model.number="form.quantity"
                type="number"
                min="1"
                max="20"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                :class="{ 'border-red-300': errors.quantity }"
                required
              />
              <p v-if="errors.quantity" class="mt-1 text-sm text-red-600">
                {{ errors.quantity }}
              </p>
            </div>

            <!-- Cylinder Exchange -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Cylinder Exchange
              </label>
              <select
                v-model="form.cylinderExchange"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="yes">Yes - Exchange empty cylinder</option>
                <option value="no">No - Keep existing cylinder</option>
                <option value="new">New cylinder needed</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Primary Contact *
              </label>
              <input
                v-model="form.primaryContact"
                type="tel"
                placeholder="+234 XXX XXX XXXX"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                :class="{ 'border-red-300': errors.primaryContact }"
                required
              />
              <p v-if="errors.primaryContact" class="mt-1 text-sm text-red-600">
                {{ errors.primaryContact }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Alternative Contact
              </label>
              <input
                v-model="form.alternativeContact"
                type="tel"
                placeholder="+234 XXX XXX XXXX"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </div>

        <!-- Delivery Address -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Delivery Address</h3>
          
          <!-- Address Selection -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select Address *
            </label>
            <select
              v-model="form.selectedAddress"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              :class="{ 'border-red-300': errors.selectedAddress }"
              required
            >
              <option value="">Select delivery address</option>
              <option
                v-for="address in addresses"
                :key="address.id"
                :value="address.id"
              >
                {{ address.label }} - {{ address.street }}, {{ address.city }}
              </option>
            </select>
            <p v-if="errors.selectedAddress" class="mt-1 text-sm text-red-600">
              {{ errors.selectedAddress }}
            </p>
          </div>

          <!-- Special Instructions -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Special Delivery Instructions
            </label>
            <textarea
              v-model="form.deliveryInstructions"
              rows="3"
              placeholder="Building access, landmarks, special instructions..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            ></textarea>
          </div>
        </div>

        <!-- Emergency Description -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Emergency Description</h3>
          <textarea
            v-model="form.emergencyDescription"
            rows="4"
            placeholder="Describe the emergency situation in detail..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            :class="{ 'border-red-300': errors.emergencyDescription }"
            required
          ></textarea>
          <p v-if="errors.emergencyDescription" class="mt-1 text-sm text-red-600">
            {{ errors.emergencyDescription }}
          </p>
        </div>

        <!-- Cost Estimate -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-medium text-gray-900 mb-2">Estimated Cost</h4>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between">
              <span>Base Price:</span>
              <span>₦{{ basePrice.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-red-600">
              <span>Emergency Fee:</span>
              <span>₦{{ emergencyFee.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between font-medium border-t pt-1">
              <span>Total Estimate:</span>
              <span>₦{{ totalEstimate.toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex space-x-4">
          <button
            type="submit"
            :disabled="isLoading || !canSubmit"
            class="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="isLoading" class="flex items-center justify-center">
              <Icon name="heroicons:arrow-path" class="w-5 h-5 mr-2 animate-spin" />
              Submitting Emergency Order...
            </span>
            <span v-else class="flex items-center justify-center">
              <Icon name="heroicons:bolt" class="w-5 h-5 mr-2" />
              Submit Emergency Order
            </span>
          </button>
          
          <button
            type="button"
            @click="$emit('cancel')"
            class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  addresses?: Array<{
    id: string
    label: string
    street: string
    city: string
  }>
}

const props = withDefaults(defineProps<Props>(), {
  addresses: () => []
})

// Reactive state
const form = reactive({
  emergencyType: '',
  urgencyLevel: '',
  gasType: '',
  quantity: 1,
  cylinderExchange: 'yes',
  primaryContact: '',
  alternativeContact: '',
  selectedAddress: '',
  deliveryInstructions: '',
  emergencyDescription: ''
})

const errors = reactive<Record<string, string>>({})
const isLoading = ref(false)

// Computed
const basePrice = computed(() => {
  const prices: Record<string, number> = {
    'lpg_3kg': 2500,
    'lpg_6kg': 4500,
    'lpg_12_5kg': 8500,
    'lpg_25kg': 16000,
    'lpg_50kg': 30000,
    'medical_oxygen': 15000,
    'industrial_oxygen': 12000,
    'acetylene': 18000,
    'argon': 20000,
    'nitrogen': 15000
  }
  return (prices[form.gasType] || 0) * form.quantity
})

const emergencyFee = computed(() => {
  const feeMultipliers: Record<string, number> = {
    'critical': 0.5, // 50% emergency fee
    'high': 0.3,     // 30% emergency fee
    'medium': 0.2    // 20% emergency fee
  }
  return basePrice.value * (feeMultipliers[form.urgencyLevel] || 0)
})

const totalEstimate = computed(() => basePrice.value + emergencyFee.value)

const canSubmit = computed(() => {
  return form.emergencyType && 
         form.urgencyLevel && 
         form.gasType && 
         form.quantity > 0 && 
         form.primaryContact && 
         form.selectedAddress && 
         form.emergencyDescription
})

// Methods
const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key])

  if (!form.emergencyType) errors.emergencyType = 'Emergency type is required'
  if (!form.urgencyLevel) errors.urgencyLevel = 'Urgency level is required'
  if (!form.gasType) errors.gasType = 'Gas type is required'
  if (!form.quantity || form.quantity < 1) errors.quantity = 'Valid quantity is required'
  if (!form.primaryContact) errors.primaryContact = 'Primary contact is required'
  if (!form.selectedAddress) errors.selectedAddress = 'Delivery address is required'
  if (!form.emergencyDescription) errors.emergencyDescription = 'Emergency description is required'

  return Object.keys(errors).length === 0
}

const submitOrder = async () => {
  if (!validateForm()) return

  isLoading.value = true

  try {
    // Mock API call - replace with actual emergency order API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const orderData = {
      ...form,
      basePrice: basePrice.value,
      emergencyFee: emergencyFee.value,
      totalEstimate: totalEstimate.value,
      timestamp: new Date().toISOString()
    }
    
    emit('order-submitted', orderData)
  } catch (error) {
    console.error('Emergency order submission failed:', error)
    // Handle error
  } finally {
    isLoading.value = false
  }
}

// Emits
const emit = defineEmits<{
  'order-submitted': [data: any]
  'cancel': []
}>()
</script>
