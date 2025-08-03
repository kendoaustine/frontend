// Application constants
export const APP_CONFIG = {
  name: 'GasConnect',
  version: '1.0.0',
  description: 'Nigerian Gas Supply Platform',
  supportEmail: 'support@gasconnect.ng',
  supportPhone: '+234-800-GAS-CONNECT'
}

// User roles
export const USER_ROLES = {
  HOUSEHOLD: 'household',
  HOSPITAL: 'hospital',
  ARTISAN: 'artisan',
  SUPPLIER: 'supplier',
  DELIVERY_DRIVER: 'delivery_driver',
  PLATFORM_ADMIN: 'platform_admin'
} as const

// Address types
export const ADDRESS_TYPES = {
  HOME: 'home',
  WORK: 'work',
  BUSINESS: 'business',
  OTHER: 'other'
} as const

// Order statuses
export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
} as const

// Gas types
export const GAS_TYPES = {
  LPG_3KG: 'lpg_3kg',
  LPG_6KG: 'lpg_6kg',
  LPG_12_5KG: 'lpg_12_5kg',
  LPG_25KG: 'lpg_25kg',
  LPG_50KG: 'lpg_50kg',
  INDUSTRIAL_OXYGEN: 'industrial_oxygen',
  MEDICAL_OXYGEN: 'medical_oxygen',
  ACETYLENE: 'acetylene',
  ARGON: 'argon',
  NITROGEN: 'nitrogen'
} as const

// Payment methods
export const PAYMENT_METHODS = {
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer',
  USSD: 'ussd',
  MOBILE_MONEY: 'mobile_money',
  CASH_ON_DELIVERY: 'cash_on_delivery'
} as const

// Nigerian states
export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi',
  'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
  'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
]

// Local storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'gasconnect_access_token',
  REFRESH_TOKEN: 'gasconnect_refresh_token',
  USER_DATA: 'gasconnect_user_data',
  THEME: 'gasconnect_theme',
  LANGUAGE: 'gasconnect_language'
} as const

// Validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  NIGERIAN_PHONE: /^\+234[789][01]\d{8}$/, // Strict E.164 format for backend compatibility
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  POSTAL_CODE: /^\d{6}$/
} as const

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_NIGERIAN_PHONE: 'Please enter a valid Nigerian phone number (e.g., +2348012345678)',
  WEAK_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, number and special character',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  FORBIDDEN: 'Access denied',
  NOT_FOUND: 'The requested resource was not found',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again'
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back!',
  REGISTER_SUCCESS: 'Account created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully',
  ADDRESS_ADDED: 'Address added successfully',
  ADDRESS_UPDATED: 'Address updated successfully',
  ADDRESS_DELETED: 'Address deleted successfully',
  ORDER_PLACED: 'Order placed successfully',
  ORDER_CANCELLED: 'Order cancelled successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  EMAIL_VERIFIED: 'Email verified successfully',
  PHONE_VERIFIED: 'Phone number verified successfully'
} as const

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100
} as const

// File upload constraints
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.pdf']
} as const