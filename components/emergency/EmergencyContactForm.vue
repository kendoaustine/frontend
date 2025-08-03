<template>
  <div class="emergency-contact-form">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <!-- Header -->
      <div class="flex items-center mb-6">
        <Icon name="heroicons:phone" class="w-8 h-8 text-blue-600 mr-3" />
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Emergency Contacts</h2>
          <p class="text-sm text-gray-600">Manage your emergency contact information</p>
        </div>
      </div>

      <!-- Current Emergency Contacts -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Current Emergency Contacts</h3>
        
        <div v-if="emergencyContacts.length === 0" class="text-center py-8 text-gray-500">
          <Icon name="heroicons:user-plus" class="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No emergency contacts added yet</p>
          <p class="text-sm">Add contacts who can be reached during emergencies</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="(contact, index) in emergencyContacts"
            :key="contact.id"
            class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icon name="heroicons:user" class="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 class="font-medium text-gray-900">{{ contact.name }}</h4>
                  <p class="text-sm text-gray-600">{{ contact.relationship }}</p>
                  <p class="text-sm text-gray-500">{{ contact.phone }}</p>
                  <p v-if="contact.email" class="text-sm text-gray-500">{{ contact.email }}</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-2">
                <span
                  v-if="contact.isPrimary"
                  class="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full"
                >
                  Primary
                </span>
                <button
                  @click="editContact(contact)"
                  class="p-2 text-gray-400 hover:text-gray-600"
                >
                  <Icon name="heroicons:pencil" class="w-4 h-4" />
                </button>
                <button
                  @click="deleteContact(contact.id)"
                  class="p-2 text-red-400 hover:text-red-600"
                >
                  <Icon name="heroicons:trash" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Contact Form -->
      <div class="border-t pt-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ editingContact ? 'Edit Contact' : 'Add Emergency Contact' }}
        </h3>

        <form @submit.prevent="saveContact" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                v-model="form.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-300': errors.name }"
                placeholder="Enter full name"
                required
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600">
                {{ errors.name }}
              </p>
            </div>

            <!-- Relationship -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Relationship *
              </label>
              <select
                v-model="form.relationship"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-300': errors.relationship }"
                required
              >
                <option value="">Select relationship</option>
                <option value="spouse">Spouse</option>
                <option value="parent">Parent</option>
                <option value="child">Child</option>
                <option value="sibling">Sibling</option>
                <option value="friend">Friend</option>
                <option value="colleague">Colleague</option>
                <option value="neighbor">Neighbor</option>
                <option value="other">Other</option>
              </select>
              <p v-if="errors.relationship" class="mt-1 text-sm text-red-600">
                {{ errors.relationship }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Phone -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                v-model="form.phone"
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

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                v-model="form.email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-300': errors.email }"
                placeholder="email@example.com"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">
                {{ errors.email }}
              </p>
            </div>
          </div>

          <!-- Primary Contact -->
          <div class="flex items-center">
            <input
              v-model="form.isPrimary"
              type="checkbox"
              id="isPrimary"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="isPrimary" class="ml-2 block text-sm text-gray-700">
              Set as primary emergency contact
            </label>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              v-model="form.notes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional information about this contact..."
            ></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-4">
            <button
              type="submit"
              :disabled="isLoading"
              class="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="isLoading" class="flex items-center">
                <Icon name="heroicons:arrow-path" class="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </span>
              <span v-else>
                {{ editingContact ? 'Update Contact' : 'Add Contact' }}
              </span>
            </button>
            
            <button
              v-if="editingContact"
              type="button"
              @click="cancelEdit"
              class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Emergency Contact Guidelines -->
      <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 class="font-medium text-blue-900 mb-2">Emergency Contact Guidelines</h4>
        <ul class="text-sm text-blue-800 space-y-1">
          <li>• Add at least 2 emergency contacts for redundancy</li>
          <li>• Ensure contacts are available 24/7 during emergencies</li>
          <li>• Primary contact will be called first during emergencies</li>
          <li>• Keep contact information up to date</li>
          <li>• Inform your contacts about being listed as emergency contacts</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface EmergencyContact {
  id: string
  name: string
  relationship: string
  phone: string
  email?: string
  isPrimary: boolean
  notes?: string
}

// Reactive state
const emergencyContacts = ref<EmergencyContact[]>([
  // Mock data - replace with actual API data
  {
    id: '1',
    name: 'John Doe',
    relationship: 'spouse',
    phone: '+2348012345678',
    email: 'john.doe@example.com',
    isPrimary: true,
    notes: 'Available 24/7'
  },
  {
    id: '2',
    name: 'Jane Smith',
    relationship: 'friend',
    phone: '+2347012345678',
    email: 'jane.smith@example.com',
    isPrimary: false,
    notes: 'Lives nearby'
  }
])

const form = reactive({
  name: '',
  relationship: '',
  phone: '',
  email: '',
  isPrimary: false,
  notes: ''
})

const errors = reactive<Record<string, string>>({})
const isLoading = ref(false)
const editingContact = ref<EmergencyContact | null>(null)

// Methods
const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key])

  if (!form.name.trim()) errors.name = 'Name is required'
  if (!form.relationship) errors.relationship = 'Relationship is required'
  if (!form.phone.trim()) errors.phone = 'Phone number is required'
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Valid email address is required'
  }

  return Object.keys(errors).length === 0
}

const resetForm = () => {
  form.name = ''
  form.relationship = ''
  form.phone = ''
  form.email = ''
  form.isPrimary = false
  form.notes = ''
  editingContact.value = null
  Object.keys(errors).forEach(key => delete errors[key])
}

const saveContact = async () => {
  if (!validateForm()) return

  isLoading.value = true

  try {
    // Mock API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (editingContact.value) {
      // Update existing contact
      const index = emergencyContacts.value.findIndex(c => c.id === editingContact.value!.id)
      if (index !== -1) {
        emergencyContacts.value[index] = {
          ...editingContact.value,
          ...form
        }
      }
    } else {
      // Add new contact
      const newContact: EmergencyContact = {
        id: Date.now().toString(),
        ...form
      }
      emergencyContacts.value.push(newContact)
    }

    // If setting as primary, remove primary from others
    if (form.isPrimary) {
      emergencyContacts.value.forEach(contact => {
        if (contact.id !== editingContact.value?.id) {
          contact.isPrimary = false
        }
      })
    }

    resetForm()
    
    // Emit success event
    emit('contact-saved', {
      action: editingContact.value ? 'updated' : 'added',
      contact: editingContact.value || emergencyContacts.value[emergencyContacts.value.length - 1]
    })
  } catch (error) {
    console.error('Failed to save contact:', error)
    // Handle error
  } finally {
    isLoading.value = false
  }
}

const editContact = (contact: EmergencyContact) => {
  editingContact.value = contact
  form.name = contact.name
  form.relationship = contact.relationship
  form.phone = contact.phone
  form.email = contact.email || ''
  form.isPrimary = contact.isPrimary
  form.notes = contact.notes || ''
}

const cancelEdit = () => {
  resetForm()
}

const deleteContact = async (contactId: string) => {
  if (!confirm('Are you sure you want to delete this emergency contact?')) return

  try {
    // Mock API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = emergencyContacts.value.findIndex(c => c.id === contactId)
    if (index !== -1) {
      const deletedContact = emergencyContacts.value.splice(index, 1)[0]
      
      // Emit delete event
      emit('contact-deleted', deletedContact)
    }
  } catch (error) {
    console.error('Failed to delete contact:', error)
    // Handle error
  }
}

// Emits
const emit = defineEmits<{
  'contact-saved': [data: { action: string, contact: EmergencyContact }]
  'contact-deleted': [contact: EmergencyContact]
}>()
</script>
