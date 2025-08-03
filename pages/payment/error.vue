<template>
  <div class="payment-error-page">
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <!-- Error Icon -->
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-6">
            <Icon name="heroicons:x-circle" class="h-16 w-16 text-red-600" />
          </div>
          
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h2>
          
          <p class="text-gray-600 mb-8">
            {{ errorMessage || 'We encountered an issue processing your payment. Please try again.' }}
          </p>
        </div>

        <!-- Error Details -->
        <div v-if="errorDetails" class="bg-white rounded-lg shadow p-6 space-y-4">
          <h3 class="text-lg font-medium text-gray-900 border-b pb-2">
            Error Details
          </h3>
          
          <div class="space-y-3">
            <div v-if="errorDetails.reference" class="flex justify-between">
              <span class="text-gray-600">Reference:</span>
              <span class="font-medium">{{ errorDetails.reference }}</span>
            </div>
            
            <div v-if="errorDetails.amount" class="flex justify-between">
              <span class="text-gray-600">Amount:</span>
              <span class="font-medium">₦{{ errorDetails.amount.toLocaleString() }}</span>
            </div>
            
            <div v-if="errorDetails.errorCode" class="flex justify-between">
              <span class="text-gray-600">Error Code:</span>
              <span class="font-medium text-red-600">{{ errorDetails.errorCode }}</span>
            </div>
            
            <div v-if="errorDetails.timestamp" class="flex justify-between">
              <span class="text-gray-600">Time:</span>
              <span class="font-medium">{{ formatDate(errorDetails.timestamp) }}</span>
            </div>
          </div>
        </div>

        <!-- Common Issues -->
        <div class="bg-yellow-50 rounded-lg p-6">
          <h3 class="text-lg font-medium text-yellow-900 mb-3">
            Common Issues & Solutions
          </h3>
          
          <ul class="space-y-2 text-sm text-yellow-800">
            <li class="flex items-start">
              <Icon name="heroicons:exclamation-triangle" class="w-4 h-4 mt-0.5 mr-2 text-yellow-600" />
              <div>
                <strong>Insufficient Funds:</strong> Check your account balance and try again
              </div>
            </li>
            <li class="flex items-start">
              <Icon name="heroicons:exclamation-triangle" class="w-4 h-4 mt-0.5 mr-2 text-yellow-600" />
              <div>
                <strong>Card Declined:</strong> Contact your bank or try a different card
              </div>
            </li>
            <li class="flex items-start">
              <Icon name="heroicons:exclamation-triangle" class="w-4 h-4 mt-0.5 mr-2 text-yellow-600" />
              <div>
                <strong>Network Issues:</strong> Check your internet connection and retry
              </div>
            </li>
            <li class="flex items-start">
              <Icon name="heroicons:exclamation-triangle" class="w-4 h-4 mt-0.5 mr-2 text-yellow-600" />
              <div>
                <strong>Transaction Timeout:</strong> The payment took too long to process
              </div>
            </li>
          </ul>
        </div>

        <!-- Alternative Payment Methods -->
        <div class="bg-blue-50 rounded-lg p-6">
          <h3 class="text-lg font-medium text-blue-900 mb-3">
            Try Alternative Payment Methods
          </h3>
          
          <div class="grid grid-cols-2 gap-3">
            <button
              @click="retryWithMethod('bank_transfer')"
              class="flex items-center justify-center p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-colors"
            >
              <Icon name="heroicons:building-library" class="w-5 h-5 text-blue-600 mr-2" />
              <span class="text-sm font-medium text-blue-900">Bank Transfer</span>
            </button>
            
            <button
              @click="retryWithMethod('ussd')"
              class="flex items-center justify-center p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-colors"
            >
              <Icon name="heroicons:device-phone-mobile" class="w-5 h-5 text-blue-600 mr-2" />
              <span class="text-sm font-medium text-blue-900">USSD</span>
            </button>
            
            <button
              @click="retryWithMethod('mobile_money')"
              class="flex items-center justify-center p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-colors"
            >
              <Icon name="heroicons:device-phone-mobile" class="w-5 h-5 text-orange-600 mr-2" />
              <span class="text-sm font-medium text-blue-900">Mobile Money</span>
            </button>
            
            <button
              @click="retryWithMethod('cash_on_delivery')"
              class="flex items-center justify-center p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-colors"
            >
              <Icon name="heroicons:banknotes" class="w-5 h-5 text-yellow-600 mr-2" />
              <span class="text-sm font-medium text-blue-900">Cash on Delivery</span>
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <button
            @click="retryPayment"
            :disabled="isRetrying"
            class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="isRetrying" class="flex items-center justify-center">
              <Icon name="heroicons:arrow-path" class="w-4 h-4 mr-2 animate-spin" />
              Retrying...
            </span>
            <span v-else>
              Try Again
            </span>
          </button>
          
          <NuxtLink
            to="/orders/new"
            class="w-full bg-white text-gray-700 py-3 px-4 rounded-lg font-medium text-center border border-gray-300 hover:bg-gray-50 transition-colors block"
          >
            Start New Order
          </NuxtLink>
          
          <NuxtLink
            to="/dashboard"
            class="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium text-center hover:bg-gray-200 transition-colors block"
          >
            Back to Dashboard
          </NuxtLink>
        </div>

        <!-- Support -->
        <div class="text-center text-sm text-gray-500">
          <p>Still having issues? Our support team is here to help</p>
          <div class="flex justify-center space-x-4 mt-2">
            <a href="tel:+2348000000000" class="text-blue-600 hover:text-blue-800">
              📞 Call Support
            </a>
            <a href="mailto:support@gasconnect.ng" class="text-blue-600 hover:text-blue-800">
              ✉️ Email Support
            </a>
            <a href="https://wa.me/2348000000000" class="text-green-600 hover:text-green-800" target="_blank">
              💬 WhatsApp
            </a>
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

// Reactive state
const errorMessage = ref('')
const errorDetails = ref<any>(null)
const isRetrying = ref(false)

// Methods
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadErrorDetails = () => {
  // Get error details from query parameters
  const error = route.query.error as string
  const reference = route.query.reference as string
  const amount = route.query.amount as string
  const errorCode = route.query.code as string

  if (error) {
    errorMessage.value = decodeURIComponent(error)
  }

  if (reference || amount || errorCode) {
    errorDetails.value = {
      reference,
      amount: amount ? parseInt(amount) : null,
      errorCode,
      timestamp: new Date().toISOString()
    }
  }
}

const retryPayment = async () => {
  isRetrying.value = true
  
  try {
    // Get the original order data from session storage or route params
    const orderId = route.query.orderId as string
    
    if (orderId) {
      // Redirect back to payment page for the order
      await router.push(`/orders/${orderId}/payment`)
    } else {
      // Redirect to new order page
      await router.push('/orders/new')
    }
  } catch (error) {
    console.error('Retry payment failed:', error)
  } finally {
    isRetrying.value = false
  }
}

const retryWithMethod = async (method: string) => {
  const orderId = route.query.orderId as string
  
  if (orderId) {
    await router.push({
      path: `/orders/${orderId}/payment`,
      query: { method }
    })
  } else {
    await router.push({
      path: '/orders/new',
      query: { preferredMethod: method }
    })
  }
}

// Load error details on mount
onMounted(() => {
  loadErrorDetails()
})

// SEO
useHead({
  title: 'Payment Failed - GasConnect',
  meta: [
    {
      name: 'description',
      content: 'Payment processing failed. Try again with alternative payment methods or contact support for assistance.'
    }
  ]
})
</script>
