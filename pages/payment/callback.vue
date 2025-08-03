<template>
  <div class="payment-callback-page">
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full text-center">
        <!-- Loading State -->
        <div v-if="isVerifying" class="space-y-6">
          <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-100">
            <Icon name="heroicons:arrow-path" class="h-12 w-12 text-blue-600 animate-spin" />
          </div>
          
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">
              Verifying Payment
            </h2>
            <p class="text-gray-600">
              Please wait while we confirm your payment...
            </p>
          </div>
          
          <!-- Progress Steps -->
          <div class="space-y-3">
            <div class="flex items-center justify-center space-x-2">
              <div class="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
              <span class="text-sm text-gray-600">Verifying transaction</span>
            </div>
            <div class="flex items-center justify-center space-x-2">
              <div class="w-3 h-3 bg-gray-300 rounded-full" :class="{ 'bg-blue-600 animate-pulse': step >= 2 }"></div>
              <span class="text-sm text-gray-600">Processing order</span>
            </div>
            <div class="flex items-center justify-center space-x-2">
              <div class="w-3 h-3 bg-gray-300 rounded-full" :class="{ 'bg-blue-600 animate-pulse': step >= 3 }"></div>
              <span class="text-sm text-gray-600">Sending confirmation</span>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="verificationError" class="space-y-6">
          <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100">
            <Icon name="heroicons:x-circle" class="h-12 w-12 text-red-600" />
          </div>
          
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h2>
            <p class="text-gray-600 mb-6">
              {{ verificationError }}
            </p>
            
            <div class="space-y-3">
              <button
                @click="retryVerification"
                class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Retry Verification
              </button>
              
              <NuxtLink
                to="/payment/error"
                class="w-full bg-white text-gray-700 py-3 px-4 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors block"
              >
                Go to Error Page
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page metadata
definePageMeta({
  layout: false
})

// Composables
const route = useRoute()
const router = useRouter()
const { verifyPayment } = usePayment()

// Reactive state
const isVerifying = ref(true)
const verificationError = ref('')
const step = ref(1)

// Methods
const handlePaymentCallback = async () => {
  try {
    const reference = route.query.reference as string
    const trxref = route.query.trxref as string
    
    // Use reference from query params (Paystack sends both reference and trxref)
    const paymentReference = reference || trxref
    
    if (!paymentReference) {
      throw new Error('Payment reference not found in callback')
    }

    // Step 1: Verify transaction with Paystack
    step.value = 1
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate delay
    
    const verificationResult = await verifyPayment(paymentReference)
    
    if (!verificationResult.success) {
      throw new Error(verificationResult.error || 'Payment verification failed')
    }

    // Step 2: Process order
    step.value = 2
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate delay
    
    // Here you would typically:
    // 1. Update order status in database
    // 2. Send confirmation emails/SMS
    // 3. Trigger delivery process
    // 4. Update inventory
    
    // Step 3: Send confirmation
    step.value = 3
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate delay

    // Redirect to success page with payment details
    await router.push({
      path: '/payment/success',
      query: {
        reference: paymentReference,
        amount: verificationResult.amount?.toString(),
        status: verificationResult.status
      }
    })

  } catch (error: any) {
    console.error('Payment callback error:', error)
    verificationError.value = error.message || 'An unexpected error occurred'
    isVerifying.value = false
  }
}

const retryVerification = async () => {
  verificationError.value = ''
  isVerifying.value = true
  step.value = 1
  await handlePaymentCallback()
}

// Handle payment callback on mount
onMounted(() => {
  // Check if this is a valid callback with required parameters
  const reference = route.query.reference as string
  const trxref = route.query.trxref as string
  
  if (!reference && !trxref) {
    // No payment reference found, redirect to error page
    router.push({
      path: '/payment/error',
      query: {
        error: 'Invalid payment callback - no reference found'
      }
    })
    return
  }

  // Start verification process
  handlePaymentCallback()
})

// SEO
useHead({
  title: 'Processing Payment - GasConnect',
  meta: [
    {
      name: 'description',
      content: 'Processing your payment. Please wait while we verify your transaction.'
    },
    {
      name: 'robots',
      content: 'noindex, nofollow'
    }
  ]
})
</script>
