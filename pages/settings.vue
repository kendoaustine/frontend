<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Settings</h1>
      <p class="mt-2 text-sm text-gray-700">
        Manage your account preferences and security settings.
      </p>
    </div>

    <div class="space-y-8">
      <!-- Notification Preferences -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            Notification Preferences
          </h3>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900">Email Notifications</h4>
                <p class="text-sm text-gray-500">Receive order updates and important announcements via email</p>
              </div>
              <button
                @click="toggleNotification('email')"
                :class="[
                  preferences.notifications.email ? 'bg-blue-600' : 'bg-gray-200',
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                ]"
              >
                <span
                  :class="[
                    preferences.notifications.email ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                  ]"
                />
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900">SMS Notifications</h4>
                <p class="text-sm text-gray-500">Receive order updates and delivery notifications via SMS</p>
              </div>
              <button
                @click="toggleNotification('sms')"
                :class="[
                  preferences.notifications.sms ? 'bg-blue-600' : 'bg-gray-200',
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                ]"
              >
                <span
                  :class="[
                    preferences.notifications.sms ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                  ]"
                />
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900">Push Notifications</h4>
                <p class="text-sm text-gray-500">Receive real-time notifications in your browser</p>
              </div>
              <button
                @click="toggleNotification('push')"
                :class="[
                  preferences.notifications.push ? 'bg-blue-600' : 'bg-gray-200',
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                ]"
              >
                <span
                  :class="[
                    preferences.notifications.push ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                  ]"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Language and Region -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            Language & Region
          </h3>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="language" class="block text-sm font-medium text-gray-700">
                Language
              </label>
              <select
                id="language"
                v-model="preferences.language"
                @change="updatePreferences"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="en">English</option>
                <option value="ha">Hausa</option>
                <option value="yo">Yoruba</option>
                <option value="ig">Igbo</option>
              </select>
            </div>

            <div>
              <label for="currency" class="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                id="currency"
                v-model="preferences.currency"
                @change="updatePreferences"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="NGN">Nigerian Naira (₦)</option>
                <option value="USD">US Dollar ($)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            Security Settings
          </h3>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900">Change Password</h4>
                <p class="text-sm text-gray-500">Update your account password</p>
              </div>
              <button
                @click="showPasswordModal = true"
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Change Password
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                <p class="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <button
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Enable 2FA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserPreferences } from '~/types'

// Set page meta
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

// Set head
useHead({
  title: 'Settings - GasConnect',
  meta: [
    {
      name: 'description',
      content: 'Manage your GasConnect account settings and preferences.'
    }
  ]
})

// Composables
const { apiCall } = useApi()

// User preferences
const preferences = reactive<UserPreferences>({
  notifications: {
    email: true,
    sms: true,
    push: false
  },
  language: 'en',
  currency: 'NGN',
  timezone: 'Africa/Lagos'
})

// Modal states
const showPasswordModal = ref(false)
const showDeleteModal = ref(false)

// Password change form
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordErrors = reactive<Record<string, string>>({})
const isChangingPassword = ref(false)

// Toggle notification preference
const toggleNotification = async (type: 'email' | 'sms' | 'push') => {
  preferences.notifications[type] = !preferences.notifications[type]
  await updatePreferences()
}

// Update preferences
const updatePreferences = async () => {
  try {
    // TODO: Replace with real API call
    // await apiCall('/api/v1/auth/preferences', {
    //   method: 'PUT',
    //   body: preferences
    // })

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    const toast = useNuxtApp().$toast
    if (toast) {
      toast.success('Preferences updated successfully')
    }
  } catch (error: any) {
    console.error('Error updating preferences:', error)
    const toast = useNuxtApp().$toast
    if (toast) {
      toast.error('Failed to update preferences')
    }
  }
}

// Change password
const changePassword = async () => {
  // Clear previous errors
  Object.keys(passwordErrors).forEach(key => delete passwordErrors[key])

  // Basic validation
  if (!passwordForm.currentPassword) {
    passwordErrors.currentPassword = 'Current password is required'
  }

  if (!passwordForm.newPassword) {
    passwordErrors.newPassword = 'New password is required'
  } else if (passwordForm.newPassword.length < 8) {
    passwordErrors.newPassword = 'Password must be at least 8 characters'
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordErrors.confirmPassword = 'Passwords do not match'
  }

  if (Object.keys(passwordErrors).length > 0) {
    return
  }

  isChangingPassword.value = true

  try {
    // TODO: Replace with real API call
    // await apiCall('/api/v1/auth/change-password', {
    //   method: 'POST',
    //   body: {
    //     currentPassword: passwordForm.currentPassword,
    //     newPassword: passwordForm.newPassword
    //   }
    // })

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Reset form and close modal
    Object.assign(passwordForm, {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    showPasswordModal.value = false

    const toast = useNuxtApp().$toast
    if (toast) {
      toast.success('Password changed successfully')
    }
  } catch (error: any) {
    console.error('Error changing password:', error)
    const toast = useNuxtApp().$toast
    if (toast) {
      toast.error(error.message || 'Failed to change password')
    }
  } finally {
    isChangingPassword.value = false
  }
}

// Load user preferences on mount
onMounted(async () => {
  try {
    // TODO: Load preferences from API
    // const response = await apiCall('/api/v1/auth/preferences')
    // if (response.success && response.data) {
    //   Object.assign(preferences, response.data)
    // }
  } catch (error) {
    console.error('Error loading preferences:', error)
  }
})
</script>