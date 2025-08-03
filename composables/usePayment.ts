import type { PaymentMethod, PaymentData, PaymentResult } from '~/types'

export const usePayment = () => {
  const { apiCall } = useApi()
  const config = useRuntimeConfig()

  // Reactive state
  const isProcessing = ref(false)
  const paymentHistory = ref<PaymentData[]>([])

  /**
   * Initialize Paystack payment
   */
  const initializePayment = async (paymentData: {
    amount: number
    email: string
    phone: string
    reference?: string
    metadata?: any
    channels?: string[]
  }): Promise<{ authorization_url: string; access_code: string; reference: string }> => {
    isProcessing.value = true

    try {
      const response = await apiCall('/api/v1/payments/initialize', {
        method: 'POST',
        body: {
          ...paymentData,
          amount: paymentData.amount * 100, // Convert to kobo
          currency: 'NGN',
          callback_url: `${config.public.frontendUrl}/payment/callback`,
          reference: paymentData.reference || `GAS-${Date.now()}`
        }
      })

      return response.data
    } catch (error) {
      console.error('Payment initialization failed:', error)
      throw error
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Verify payment with Paystack
   */
  const verifyPayment = async (reference: string): Promise<PaymentResult> => {
    try {
      const response = await apiCall(`/api/v1/payments/verify/${reference}`, {
        method: 'GET'
      })

      return response.data
    } catch (error) {
      console.error('Payment verification failed:', error)
      throw error
    }
  }

  /**
   * Process payment for order
   */
  const processOrderPayment = async (orderData: {
    orderId: string
    amount: number
    paymentMethod: PaymentMethod
    customerInfo: {
      email: string
      phone: string
      firstName?: string
      lastName?: string
    }
    metadata?: any
  }): Promise<PaymentResult> => {
    isProcessing.value = true

    try {
      if (orderData.paymentMethod === 'cash_on_delivery') {
        // Handle cash on delivery
        return await processCashOnDelivery(orderData)
      } else {
        // Handle online payment via Paystack
        return await processOnlinePayment(orderData)
      }
    } catch (error) {
      console.error('Order payment processing failed:', error)
      throw error
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Process cash on delivery payment
   */
  const processCashOnDelivery = async (orderData: any): Promise<PaymentResult> => {
    const response = await apiCall('/api/v1/payments/cash-on-delivery', {
      method: 'POST',
      body: {
        orderId: orderData.orderId,
        amount: orderData.amount,
        customerInfo: orderData.customerInfo,
        metadata: orderData.metadata
      }
    })

    return {
      success: true,
      reference: `COD-${orderData.orderId}`,
      amount: orderData.amount,
      status: 'pending',
      paymentMethod: 'cash_on_delivery',
      data: response.data
    }
  }

  /**
   * Process online payment via Paystack
   */
  const processOnlinePayment = async (orderData: any): Promise<PaymentResult> => {
    // Initialize payment with Paystack
    const initResult = await initializePayment({
      amount: orderData.amount,
      email: orderData.customerInfo.email,
      phone: orderData.customerInfo.phone,
      metadata: {
        orderId: orderData.orderId,
        customerName: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
        ...orderData.metadata
      },
      channels: getPaymentChannels(orderData.paymentMethod)
    })

    // Return initialization result for frontend to handle
    return {
      success: true,
      reference: initResult.reference,
      amount: orderData.amount,
      status: 'initialized',
      paymentMethod: orderData.paymentMethod,
      data: initResult
    }
  }

  /**
   * Get payment channels based on payment method
   */
  const getPaymentChannels = (method: PaymentMethod): string[] => {
    const channelMap: Record<PaymentMethod, string[]> = {
      'card': ['card'],
      'bank_transfer': ['bank'],
      'ussd': ['ussd'],
      'mobile_money': ['mobile_money'],
      'cash_on_delivery': []
    }

    return channelMap[method] || ['card']
  }

  /**
   * Get payment history for user
   */
  const getPaymentHistory = async (filters?: {
    status?: string
    method?: PaymentMethod
    startDate?: string
    endDate?: string
    limit?: number
    offset?: number
  }): Promise<PaymentData[]> => {
    try {
      const response = await apiCall('/api/v1/payments/history', {
        method: 'GET',
        body: filters
      })

      paymentHistory.value = response.data.payments
      return response.data.payments
    } catch (error) {
      console.error('Failed to fetch payment history:', error)
      throw error
    }
  }

  /**
   * Refund payment
   */
  const refundPayment = async (paymentId: string, amount?: number, reason?: string): Promise<any> => {
    try {
      const response = await apiCall(`/api/v1/payments/${paymentId}/refund`, {
        method: 'POST',
        body: {
          amount: amount ? amount * 100 : undefined, // Convert to kobo if specified
          reason
        }
      })

      return response.data
    } catch (error) {
      console.error('Payment refund failed:', error)
      throw error
    }
  }

  /**
   * Get payment methods available for user
   */
  const getAvailablePaymentMethods = (): PaymentMethod[] => {
    // Return all available payment methods for Nigerian market
    return ['card', 'bank_transfer', 'ussd', 'mobile_money', 'cash_on_delivery']
  }

  /**
   * Format amount for display
   */
  const formatAmount = (amount: number, currency: string = 'NGN'): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount)
  }

  /**
   * Get payment method display name
   */
  const getPaymentMethodName = (method: PaymentMethod): string => {
    const names: Record<PaymentMethod, string> = {
      'card': 'Debit/Credit Card',
      'bank_transfer': 'Bank Transfer',
      'ussd': 'USSD',
      'mobile_money': 'Mobile Money',
      'cash_on_delivery': 'Cash on Delivery'
    }

    return names[method] || method
  }

  /**
   * Get payment status color class
   */
  const getPaymentStatusClass = (status: string): string => {
    const statusClasses: Record<string, string> = {
      'success': 'bg-green-100 text-green-800',
      'completed': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'failed': 'bg-red-100 text-red-800',
      'cancelled': 'bg-gray-100 text-gray-800',
      'refunded': 'bg-purple-100 text-purple-800'
    }

    return statusClasses[status] || 'bg-gray-100 text-gray-800'
  }

  /**
   * Load Paystack script dynamically
   */
  const loadPaystackScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && (window as any).PaystackPop) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://js.paystack.co/v1/inline.js'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Paystack script'))
      document.head.appendChild(script)
    })
  }

  /**
   * Open Paystack popup for payment
   */
  const openPaystackPopup = async (config: {
    key: string
    email: string
    amount: number
    currency?: string
    ref: string
    channels?: string[]
    metadata?: any
    callback: (response: any) => void
    onClose?: () => void
  }): Promise<void> => {
    await loadPaystackScript()

    const paystackConfig = {
      ...config,
      currency: config.currency || 'NGN'
    }

    // @ts-ignore
    const handler = PaystackPop.setup(paystackConfig)
    handler.openIframe()
  }

  return {
    // State
    isProcessing: readonly(isProcessing),
    paymentHistory: readonly(paymentHistory),

    // Methods
    initializePayment,
    verifyPayment,
    processOrderPayment,
    getPaymentHistory,
    refundPayment,
    getAvailablePaymentMethods,
    formatAmount,
    getPaymentMethodName,
    getPaymentStatusClass,
    loadPaystackScript,
    openPaystackPopup
  }
}
