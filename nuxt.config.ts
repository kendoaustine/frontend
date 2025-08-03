// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // TypeScript configuration
  typescript: {
    typeCheck: false // Disable for now to avoid vue-tsc issues
  },

  // CSS framework - Tailwind CSS is configured via module

  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/google-fonts',
    '@vee-validate/nuxt',
    '@vite-pwa/nuxt'
  ],

  // Google Fonts
  googleFonts: {
    families: {
      Inter: [300, 400, 500, 600, 700]
    }
  },

  // PWA Configuration
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'GasConnect',
      short_name: 'GasConnect',
      description: 'Nigerian Gas Supply Platform',
      theme_color: '#1f2937',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\./,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 // 24 hours
            }
          }
        }
      ]
    }
  },

  // Runtime config for environment variables
  runtimeConfig: {
    // Private keys (only available on server-side)
    apiSecret: '123',

    // Public keys (exposed to client-side)
    public: {
      authServiceUrl: process.env.NUXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:3001',
      ordersServiceUrl: process.env.NUXT_PUBLIC_ORDERS_SERVICE_URL || 'http://localhost:3002',
      supplierServiceUrl: process.env.NUXT_PUBLIC_SUPPLIER_SERVICE_URL || 'http://localhost:3003',
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost'
    }
  },

  // Nitro configuration for API proxy
  nitro: {
    devProxy: {
      '/api/v1/auth': {
        target: 'http://localhost:3001/api/v1/auth',
        changeOrigin: true
      },
      '/api/v1/orders': {
        target: 'http://localhost:3002/api/v1/orders',
        changeOrigin: true
      },
      '/api/v1/supplier': {
        target: 'http://localhost:3003/api/v1/supplier',
        changeOrigin: true
      }
    }
  },

  // Vite configuration
  vite: {
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    }
  },

  // App configuration
  app: {
    head: {
      title: 'GasConnect - Gas Supply Platform',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'GasConnect - Nigerian Gas Supply Platform' },
        { name: 'theme-color', content: '#1f2937' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.json' }
      ]
    }
  }
})