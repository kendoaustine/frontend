<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Hero Section -->
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
        Welcome to <span class="text-blue-600">GasConnect</span>
      </h1>
      <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
        Nigeria's premier gas supply platform. Connect with verified suppliers, place orders, and get gas delivered to your doorstep.
      </p>
      <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
        <div class="rounded-md shadow">
          <NuxtLink
            to="/register"
            class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
          >
            Get Started
          </NuxtLink>
        </div>
        <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
          <NuxtLink
            to="/login"
            class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
          >
            Sign In
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="mt-20">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900">
          Why Choose GasConnect?
        </h2>
        <p class="mt-4 text-lg text-gray-600">
          Everything you need for reliable gas supply in Nigeria
        </p>
      </div>

      <div class="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div class="text-center">
          <div class="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Verified Suppliers</h3>
          <p class="mt-2 text-base text-gray-500">
            All suppliers are thoroughly vetted and verified for quality and reliability.
          </p>
        </div>

        <div class="text-center">
          <div class="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Fast Delivery</h3>
          <p class="mt-2 text-base text-gray-500">
            Quick and reliable delivery to your location across Nigeria.
          </p>
        </div>

        <div class="text-center">
          <div class="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Secure Payments</h3>
          <p class="mt-2 text-base text-gray-500">
            Safe and secure payment processing with multiple payment options.
          </p>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="mt-20 bg-blue-600 rounded-lg">
      <div class="px-6 py-12 sm:px-12 sm:py-16 lg:px-16">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-white">
            Ready to get started?
          </h2>
          <p class="mt-4 text-lg text-blue-100">
            Join thousands of satisfied customers across Nigeria
          </p>
          <div class="mt-8">
            <NuxtLink
              to="/register"
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50"
            >
              Create Account
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Set page meta
definePageMeta({
  layout: 'default'
})

// Set head
useHead({
  title: 'GasConnect - Nigerian Gas Supply Platform',
  meta: [
    {
      name: 'description',
      content: 'Nigeria\'s premier gas supply platform. Connect with verified suppliers, place orders, and get gas delivered to your doorstep.'
    }
  ]
})
</script>