<template>
  <div class="paystack-checkout">
    <!-- Payment Summary -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Payment Summary</h3>
      
      <div class="space-y-3">
        <div class="flex justify-between">
          <span class="text-gray-600">Subtotal:</span>
          <span class="font-medium">₦{{ subtotal.toLocaleString() }}</span>
        </div>
        <div v-if="deliveryFee > 0" class="flex justify-between">
          <span class="text-gray-600">Delivery Fee:</span>
          <span class="font-medium">₦{{ deliveryFee.toLocaleString() }}</span>
        </div>
        <div v-if="emergencyFee > 0" class="flex justify-between">
          <span class="text-red-600">Emergency Fee:</span>
          <span class="font-medium text-red-600">₦{{ emergencyFee.toLocaleString() }}</span>
        </div>
        <div v-if="discount > 0" class="flex justify-between">
          <span class="text-green-600">Discount:</span>
          <span class="font-medium text-green-600">-₦{{ discount.toLocaleString() }}</span>
        </div>
        <div class="border-t pt-3 flex justify-between">
          <span class="text-lg font-medium text-gray-900">Total:</span>
          <span class="text-lg font-bold text-gray-900">₦{{ total.toLocaleString() }}</span>
        </div>
      </div>
    </div>

    <!-- Payment Methods -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
      
      <div class="space-y-4">
        <!-- Card Payment -->
        <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50" 
               :class="{ 'border-blue-500 bg-blue-50': selectedMethod === 'card' }">
          <input
            v-model="selectedMethod"
            type="radio"
            value="card"
            class="sr-only"
          />
          <div class="flex items-center space-x-3">
            <Icon name="heroicons:credit-card" class="w-6 h-6 text-blue-600" />
            <div>
              <div class="font-medium">Debit/Credit Card</div>
              <div class="text-sm text-gray-500">Visa, Mastercard, Verve</div>
            </div>
          </div>
          <div class="ml-auto">
            <div class="w-4 h-4 border-2 rounded-full" 
                 :class="selectedMethod === 'card' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'">
              <div v-if="selectedMethod === 'card'" class="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
            </div>
          </div>
        </label>

        <!-- Bank Transfer -->
        <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
               :class="{ 'border-blue-500 bg-blue-50': selectedMethod === 'bank_transfer' }">
          <input
            v-model="selectedMethod"
            type="radio"
            value="bank_transfer"
            class="sr-only"
          />
          <div class="flex items-center space-x-3">
            <Icon name="heroicons:building-library" class="w-6 h-6 text-green-600" />
            <div>
              <div class="font-medium">Bank Transfer</div>
              <div class="text-sm text-gray-500">Direct bank transfer</div>
            </div>
          </div>
          <div class="ml-auto">
            <div class="w-4 h-4 border-2 rounded-full" 
                 :class="selectedMethod === 'bank_transfer' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'">
              <div v-if="selectedMethod === 'bank_transfer'" class="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
            </div>
          </div>
        </label>

        <!-- USSD -->
        <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
               :class="{ 'border-blue-500 bg-blue-50': selectedMethod === 'ussd' }">
          <input
            v-model="selectedMethod"
            type="radio"
            value="ussd"
            class="sr-only"
          />
          <div class="flex items-center space-x-3">
            <Icon name="heroicons:device-phone-mobile" class="w-6 h-6 text-purple-600" />
            <div>
              <div class="font-medium">USSD</div>
              <div class="text-sm text-gray-500">*737#, *894#, *901#</div>
            </div>
          </div>
          <div class="ml-auto">
            <div class="w-4 h-4 border-2 rounded-full" 
                 :class="selectedMethod === 'ussd' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'">
              <div v-if="selectedMethod === 'ussd'" class="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
            </div>
          </div>
        </label>

        <!-- Mobile Money -->
        <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
               :class="{ 'border-blue-500 bg-blue-50': selectedMethod === 'mobile_money' }">
          <input
            v-model="selectedMethod"
            type="radio"
            value="mobile_money"
            class="sr-only"
          />
          <div class="flex items-center space-x-3">
            <Icon name="heroicons:device-phone-mobile" class="w-6 h-6 text-orange-600" />
            <div>
              <div class="font-medium">Mobile Money</div>
              <div class="text-sm text-gray-500">MTN, Airtel, 9mobile</div>
            </div>
          </div>
          <div class="ml-auto">
            <div class="w-4 h-4 border-2 rounded-full" 
                 :class="selectedMethod === 'mobile_money' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'">
              <div v-if="selectedMethod === 'mobile_money'" class="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
            </div>
          </div>
        </label>

        <!-- Cash on Delivery -->
        <label v-if="allowCashOnDelivery" 
               class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
               :class="{ 'border-blue-500 bg-blue-50': selectedMethod === 'cash_on_delivery' }">
          <input
            v-model="selectedMethod"
            type="radio"
            value="cash_on_delivery"
            class="sr-only"
          />
          <div class="flex items-center space-x-3">
            <Icon name="heroicons:banknotes" class="w-6 h-6 text-yellow-600" />
            <div>
              <div class="font-medium">Cash on Delivery</div>
              <div class="text-sm text-gray-500">Pay when you receive your order</div>
            </div>
          </div>
          <div class="ml-auto">
            <div class="w-4 h-4 border-2 rounded-full" 
                 :class="selectedMethod === 'cash_on_delivery' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'">
              <div v-if="selectedMethod === 'cash_on_delivery'" class="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
            </div>
          </div>
        </label>
      </div>
    </div>

    <!-- Customer Information -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            v-model="customerInfo.email"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-300': errors.email }"
            placeholder="your@email.com"
            required
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">
            {{ errors.email }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            v-model="customerInfo.phone"
            type="tel"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-300': errors.phone }"
            placeholder="+234 XXX XXX XXXX"
            required
          />
          <p v-if="errors.phone" class="mt-1 text-sm text-red-600">
            {{ errors.phone }}
          </p>
        </div>
      </div>
    </div>

    <!-- Payment Button -->
    <div class="bg-white rounded-lg shadow-lg p-6">
      <button
        @click="initiatePayment"
        :disabled="!canProceed || isProcessing"
        class="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span v-if="isProcessing" class="flex items-center justify-center">
          <Icon name="heroicons:arrow-path" class="w-5 h-5 mr-2 animate-spin" />
          Processing Payment...
        </span>
        <span v-else class="flex items-center justify-center">
          <Icon name="heroicons:lock-closed" class="w-5 h-5 mr-2" />
          {{ paymentButtonText }}
        </span>
      </button>

      <!-- Security Notice -->
      <div class="mt-4 flex items-center justify-center text-sm text-gray-500">
        <Icon name="heroicons:shield-check" class="w-4 h-4 mr-1" />
        Secured by Paystack - Your payment information is encrypted and secure
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  subtotal: number
  deliveryFee?: number
  emergencyFee?: number
  discount?: number
  allowCashOnDelivery?: boolean
  orderData?: any
}

const props = withDefaults(defineProps<Props>(), {
  deliveryFee: 0,
  emergencyFee: 0,
  discount: 0,
  allowCashOnDelivery: true
})

// Reactive state
const selectedMethod = ref('card')
const isProcessing = ref(false)

const customerInfo = reactive({
  email: '',
  phone: ''
})

const errors = reactive<Record<string, string>>({})

// Computed
const total = computed(() => {
  return props.subtotal + props.deliveryFee + props.emergencyFee - props.discount
})

const canProceed = computed(() => {
  return selectedMethod.value && 
         customerInfo.email && 
         customerInfo.phone &&
         Object.keys(errors).length === 0
})

const paymentButtonText = computed(() => {
  if (selectedMethod.value === 'cash_on_delivery') {
    return 'Place Order (Cash on Delivery)'
  }
  return `Pay ₦${total.value.toLocaleString()}`
})

// Methods
const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key])

  if (!customerInfo.email) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
    errors.email = 'Valid email is required'
  }

  if (!customerInfo.phone) {
    errors.phone = 'Phone number is required'
  } else if (!/^\+234[789][01]\d{8}$/.test(customerInfo.phone)) {
    errors.phone = 'Valid Nigerian phone number is required'
  }

  return Object.keys(errors).length === 0
}

const initiatePayment = async () => {
  if (!validateForm()) return

  isProcessing.value = true

  try {
    if (selectedMethod.value === 'cash_on_delivery') {
      // Handle cash on delivery
      await handleCashOnDelivery()
    } else {
      // Handle Paystack payment
      await handlePaystackPayment()
    }
  } catch (error) {
    console.error('Payment failed:', error)
    emit('payment-failed', error)
  } finally {
    isProcessing.value = false
  }
}

const handleCashOnDelivery = async () => {
  const orderData = {
    ...props.orderData,
    paymentMethod: 'cash_on_delivery',
    customerInfo: customerInfo,
    totalAmount: total.value,
    paymentStatus: 'pending'
  }

  emit('payment-success', {
    method: 'cash_on_delivery',
    orderData,
    reference: `COD-${Date.now()}`
  })
}

const handlePaystackPayment = async () => {
  const config = useRuntimeConfig()

  // Initialize Paystack payment
  const paystackConfig = {
    key: config.public.paystackPublicKey,
    email: customerInfo.email,
    amount: total.value * 100, // Paystack expects amount in kobo
    currency: 'NGN',
    ref: `GAS-${Date.now()}`,
    channels: getPaymentChannels(),
    callback: (response: any) => {
      handlePaystackCallback(response)
    },
    onClose: () => {
      isProcessing.value = false
      emit('payment-cancelled')
    }
  }

  // Load Paystack script and initialize payment
  await loadPaystackScript()
  
  // @ts-ignore
  const handler = PaystackPop.setup(paystackConfig)
  handler.openIframe()
}

const getPaymentChannels = () => {
  const channelMap: Record<string, string[]> = {
    'card': ['card'],
    'bank_transfer': ['bank'],
    'ussd': ['ussd'],
    'mobile_money': ['mobile_money']
  }
  
  return channelMap[selectedMethod.value] || ['card']
}

const loadPaystackScript = () => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && (window as any).PaystackPop) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.onload = () => resolve(true)
    script.onerror = () => reject(new Error('Failed to load Paystack script'))
    document.head.appendChild(script)
  })
}

const handlePaystackCallback = async (response: any) => {
  if (response.status === 'success') {
    // Verify payment on backend
    try {
      const verificationResult = await verifyPayment(response.reference)
      
      if (verificationResult.success) {
        const orderData = {
          ...props.orderData,
          paymentMethod: selectedMethod.value,
          customerInfo: customerInfo,
          totalAmount: total.value,
          paymentStatus: 'completed',
          paymentReference: response.reference
        }

        emit('payment-success', {
          method: selectedMethod.value,
          orderData,
          reference: response.reference,
          verificationResult
        })
      } else {
        throw new Error('Payment verification failed')
      }
    } catch (error) {
      emit('payment-failed', error)
    }
  } else {
    emit('payment-failed', new Error('Payment was not successful'))
  }
}

const verifyPayment = async (reference: string) => {
  // Mock verification - replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  return {
    success: true,
    reference,
    amount: total.value,
    status: 'success'
  }
}

// Emits
const emit = defineEmits<{
  'payment-success': [data: any]
  'payment-failed': [error: any]
  'payment-cancelled': []
}>()

// Initialize customer info from user data if available
onMounted(() => {
  const { user } = useAuth()
  if (user.value) {
    customerInfo.email = user.value.email || ''
    customerInfo.phone = user.value.phone || ''
  }
})
</script>
