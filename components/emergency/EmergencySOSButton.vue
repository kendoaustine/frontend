<template>
  <div class="emergency-sos">
    <!-- Emergency SOS Button -->
    <button
      @click="showSOSModal = true"
      class="emergency-sos-button"
      :class="{ 'pulse': isPulsing }"
      :disabled="isLoading"
    >
      <Icon name="heroicons:exclamation-triangle" class="w-6 h-6" />
      <span class="font-bold">EMERGENCY SOS</span>
      <span class="text-xs">Urgent Gas Delivery</span>
    </button>

    <!-- SOS Modal -->
    <div
      v-if="showSOSModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-red-600 flex items-center">
            <Icon name="heroicons:exclamation-triangle" class="w-6 h-6 mr-2" />
            Emergency Gas Request
          </h2>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600"
          >
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>
        </div>

        <div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-700">
            <strong>Emergency Service:</strong> This will prioritize your order for urgent delivery.
            Additional emergency fees may apply.
          </p>
        </div>

        <!-- Emergency Type Selection -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Emergency Type
          </label>
          <div class="space-y-2">
            <label
              v-for="type in emergencyTypes"
              :key="type.value"
              class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
              :class="{ 'border-red-500 bg-red-50': selectedType === type.value }"
            >
              <input
                v-model="selectedType"
                type="radio"
                :value="type.value"
                class="sr-only"
              />
              <Icon :name="type.icon" class="w-5 h-5 mr-3 text-red-600" />
              <div>
                <div class="font-medium">{{ type.label }}</div>
                <div class="text-sm text-gray-500">{{ type.description }}</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Gas Type Selection -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Gas Type Needed
          </label>
          <select
            v-model="selectedGasType"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
          </select>
        </div>

        <!-- Quantity -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <input
            v-model.number="quantity"
            type="number"
            min="1"
            max="10"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <!-- Emergency Contact -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Emergency Contact Number
          </label>
          <input
            v-model="emergencyContact"
            type="tel"
            placeholder="+234 XXX XXX XXXX"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <!-- Additional Notes -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Additional Details
          </label>
          <textarea
            v-model="additionalNotes"
            rows="3"
            placeholder="Describe the emergency situation..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          ></textarea>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-3">
          <button
            @click="submitEmergencyRequest"
            :disabled="!canSubmit || isLoading"
            class="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="flex items-center justify-center">
              <Icon name="heroicons:arrow-path" class="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </span>
            <span v-else>Submit Emergency Request</span>
          </button>
          <button
            @click="closeModal"
            class="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div
      v-if="showSuccessModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="text-center">
          <Icon name="heroicons:check-circle" class="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 class="text-lg font-bold text-gray-900 mb-2">Emergency Request Submitted</h3>
          <p class="text-gray-600 mb-4">
            Your emergency gas request has been submitted. A supplier will contact you within 15 minutes.
          </p>
          <p class="text-sm text-gray-500 mb-6">
            Reference ID: <strong>{{ emergencyRequestId }}</strong>
          </p>
          <button
            @click="closeSuccessModal"
            class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface EmergencyType {
  value: string
  label: string
  description: string
  icon: string
}

// Props
interface Props {
  isPulsing?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isPulsing: false
})

// Reactive state
const showSOSModal = ref(false)
const showSuccessModal = ref(false)
const isLoading = ref(false)
const selectedType = ref('')
const selectedGasType = ref('')
const quantity = ref(1)
const emergencyContact = ref('')
const additionalNotes = ref('')
const emergencyRequestId = ref('')

// Emergency types
const emergencyTypes: EmergencyType[] = [
  {
    value: 'medical',
    label: 'Medical Emergency',
    description: 'Hospital or medical facility needs',
    icon: 'heroicons:heart'
  },
  {
    value: 'cooking',
    label: 'Cooking Emergency',
    description: 'Urgent cooking gas needed',
    icon: 'heroicons:fire'
  },
  {
    value: 'heating',
    label: 'Heating Emergency',
    description: 'Heating or hot water emergency',
    icon: 'heroicons:home'
  },
  {
    value: 'business',
    label: 'Business Critical',
    description: 'Business operations affected',
    icon: 'heroicons:building-office'
  }
]

// Computed
const canSubmit = computed(() => {
  return selectedType.value && 
         selectedGasType.value && 
         quantity.value > 0 && 
         emergencyContact.value.length > 0
})

// Methods
const closeModal = () => {
  showSOSModal.value = false
  resetForm()
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  emergencyRequestId.value = ''
}

const resetForm = () => {
  selectedType.value = ''
  selectedGasType.value = ''
  quantity.value = 1
  emergencyContact.value = ''
  additionalNotes.value = ''
}

const submitEmergencyRequest = async () => {
  if (!canSubmit.value) return

  isLoading.value = true

  try {
    // Mock API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate mock request ID
    emergencyRequestId.value = `SOS-${Date.now().toString().slice(-6)}`
    
    showSOSModal.value = false
    showSuccessModal.value = true
    resetForm()
    
    // Emit event for parent component
    emit('emergency-submitted', {
      type: selectedType.value,
      gasType: selectedGasType.value,
      quantity: quantity.value,
      contact: emergencyContact.value,
      notes: additionalNotes.value,
      requestId: emergencyRequestId.value
    })
  } catch (error) {
    console.error('Emergency request failed:', error)
    // Handle error
  } finally {
    isLoading.value = false
  }
}

// Emits
const emit = defineEmits<{
  'emergency-submitted': [data: any]
}>()
</script>

<style scoped>
.emergency-sos-button {
  @apply bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg hover:bg-red-700 transition-all duration-200 flex flex-col items-center space-y-1 min-w-[140px];
}

.emergency-sos-button.pulse {
  animation: pulse-red 2s infinite;
}

@keyframes pulse-red {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
  }
}
</style>
