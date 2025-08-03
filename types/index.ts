// User types
export interface User {
  id: string
  email: string
  phoneNumber: string
  firstName: string
  lastName: string
  role: UserRole
  isEmailVerified: boolean
  isPhoneVerified: boolean
  profilePicture?: string
  createdAt: string
  updatedAt: string
}

export type UserRole = 'household' | 'hospital' | 'artisan' | 'supplier' | 'delivery_driver' | 'delivery_driver' | 'platform_admin'

export interface UserProfile {
  id: string
  userId: string
  businessName?: string
  businessType?: string
  businessRegistrationNumber?: string
  taxIdentificationNumber?: string
  bankAccountDetails?: BankAccountDetails
  emergencyContact?: EmergencyContact
  preferences?: UserPreferences
  createdAt: string
  updatedAt: string
}

export interface BankAccountDetails {
  accountName: string
  accountNumber: string
  bankName: string
  bankCode: string
}

export interface EmergencyContact {
  name: string
  phoneNumber: string
  relationship: string
}

export interface UserPreferences {
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
  language: string
  currency: string
  timezone: string
}

// Address types
export interface Address {
  id: string
  userId: string
  type: AddressType
  street: string
  city: string
  state: string
  postalCode?: string
  country: string
  isDefault: boolean
  coordinates?: {
    latitude: number
    longitude: number
  }
  deliveryInstructions?: string
  createdAt: string
  updatedAt: string
}

export type AddressType = 'home' | 'work' | 'business' | 'other'

// Authentication types
export interface LoginCredentials {
  identifier: string // email or phone
  password: string
}

export interface RegisterData {
  email: string
  phone: string // Changed from phoneNumber to match backend
  firstName: string
  lastName: string
  password: string
  role: UserRole
  businessName?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

// Order types
export interface Order {
  id: string
  customerId: string
  supplierId: string
  deliveryAddressId: string
  type: OrderType
  status: OrderStatus
  items: OrderItem[]
  totalAmount: number
  deliveryFee: number
  scheduledDeliveryDate?: string
  actualDeliveryDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export type OrderType = 'regular' | 'emergency_sos' | 'recurring'
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'refunded'

export interface OrderItem {
  id: string
  gasTypeId: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

// Supplier types
export interface Supplier {
  id: string
  userId: string
  businessName: string
  businessType: string
  verificationStatus: VerificationStatus
  rating: number
  totalOrders: number
  isActive: boolean
  serviceAreas: string[]
  createdAt: string
  updatedAt: string
}

export type VerificationStatus = 'pending' | 'verified' | 'rejected'

export interface InventoryItem {
  id: string
  supplierId: string
  gasTypeId: string
  quantity: number
  unitPrice: number
  isAvailable: boolean
  lastUpdated: string
}

// Gas types
export interface GasType {
  id: string
  name: string
  category: GasCategory
  description: string
  unit: string
  specifications: Record<string, any>
}

export type GasCategory = 'lpg' | 'industrial' | 'medical'

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Error types
export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string[]>
}

// Common utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface TableColumn<T = any> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: any, row: T) => any
}

export interface FilterOption {
  key: string
  label: string
  type: 'text' | 'select' | 'date' | 'dateRange'
  options?: SelectOption[]
}