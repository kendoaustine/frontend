<template>
  <div class="payment-success-page">
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <!-- Success Icon -->
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
            <Icon name="heroicons:check-circle" class="h-16 w-16 text-green-600" />
          </div>
          
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h2>
          
          <p class="text-gray-600 mb-8">
            Your payment has been processed successfully. Your order is now being prepared for delivery.
          </p>
        </div>

        <!-- Payment Details -->
        <div v-if="paymentDetails" class="bg-white rounded-lg shadow p-6 space-y-4">
          <h3 class="text-lg font-medium text-gray-900 border-b pb-2">
            Payment Details
          </h3>
          
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">Reference:</span>
              <span class="font-medium">{{ paymentDetails.reference }}</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-gray-600">Amount:</span>
              <span class="font-medium">₦{{ paymentDetails.amount.toLocaleString() }}</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-gray-600">Payment Method:</span>
              <span class="font-medium">{{ getPaymentMethodName(paymentDetails.paymentMethod) }}</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-gray-600">Status:</span>
              <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                {{ paymentDetails.status }}
              </span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-gray-600">Date:</span>
              <span class="font-medium">{{ formatDate(paymentDetails.createdAt) }}</span>
            </div>
          </div>
        </div>

        <!-- Order Details -->
        <div v-if="orderDetails" class="bg-white rounded-lg shadow p-6 space-y-4">
          <h3 class="text-lg font-medium text-gray-900 border-b pb-2">
            Order Details
          </h3>
          
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">Order ID:</span>
              <span class="font-medium">{{ orderDetails.id }}</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-gray-600">Status:</span>
              <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                {{ orderDetails.status }}
              </span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-gray-600">Estimated Delivery:</span>
              <span class="font-medium">{{ orderDetails.estimatedDelivery }}</span>
            </div>
          </div>
        </div>

        <!-- Next Steps -->
        <div class="bg-blue-50 rounded-lg p-6">
          <h3 class="text-lg font-medium text-blue-900 mb-3">
            What's Next?
          </h3>
          
          <ul class="space-y-2 text-sm text-blue-800">
            <li class="flex items-start">
              <Icon name="heroicons:check" class="w-4 h-4 mt-0.5 mr-2 text-blue-600" />
              You will receive an SMS confirmation shortly
            </li>
            <li class="flex items-start">
              <Icon name="heroicons:check" class="w-4 h-4 mt-0.5 mr-2 text-blue-600" />
              Our delivery team will contact you before delivery
            </li>
            <li class="flex items-start">
              <Icon name="heroicons:check" class="w-4 h-4 mt-0.5 mr-2 text-blue-600" />
              You can track your order in real-time
            </li>
            <li class="flex items-start">
              <Icon name="heroicons:check" class="w-4 h-4 mt-0.5 mr-2 text-blue-600" />
              A receipt has been sent to your email
            </li>
          </ul>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <NuxtLink
            to="/orders"
            class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium text-center hover:bg-blue-700 transition-colors block"
          >
            Track Your Order
          </NuxtLink>
          
          <NuxtLink
            to="/dashboard"
            class="w-full bg-white text-gray-700 py-3 px-4 rounded-lg font-medium text-center border border-gray-300 hover:bg-gray-50 transition-colors block"
          >
            Back to Dashboard
          </NuxtLink>
        </div>

        <!-- Support -->
        <div class="text-center text-sm text-gray-500">
          <p>Need help? Contact our support team</p>
          <div class="flex justify-center space-x-4 mt-2">
            <a href="tel:+2348000000000" class="text-blue-600 hover:text-blue-800">
              📞 Call Support
            </a>
            <a href="mailto:support@gasconnect.ng" class="text-blue-600 hover:text-blue-800">
              ✉️ Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PaymentData } from '~/types'

// Page metadata
definePageMeta({
  middleware: 'auth',
  layout: false
})

// Composables
const route = useRoute()
const { getPaymentMethodName } = usePayment()

// Reactive state
const paymentDetails = ref<PaymentData | null>(null)
const orderDetails = ref<any>(null)
const isLoading = ref(true)

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

const loadPaymentDetails = async () => {
  try {
    const reference = route.query.reference as string
    
    if (!reference) {
      throw new Error('Payment reference not found')
    }

    // Mock payment details - replace with actual API call
    paymentDetails.value = {
      id: '1',
      reference: reference,
      amount: 25000,
      currency: 'NGN',
      status: 'success',
      paymentMethod: 'card',
      customerEmail: 'user@example.com',
      customerPhone: '+2348012345678',
      orderId: 'ORD-123456',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Mock order details - replace with actual API call
    orderDetails.value = {
      id: 'ORD-123456',
      status: 'confirmed',
      estimatedDelivery: '2-3 hours'
    }
  } catch (error) {
    console.error('Failed to load payment details:', error)
    // Redirect to error page or show error message
    await navigateTo('/payment/error')
  } finally {
    isLoading.value = false
  }
}

// Load payment details on mount
onMounted(() => {
  loadPaymentDetails()
})

// SEO
useHead({
  title: 'Payment Successful - GasConnect',
  meta: [
    {
      name: 'description',
      content: 'Your payment has been processed successfully. Your gas order is being prepared for delivery.'
    }
  ]
})
</script>
