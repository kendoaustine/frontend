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
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\./,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 // 24 hours
            },
            networkTimeoutSeconds: 10
          }
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
            }
          }
        },
        {
          urlPattern: /\.(?:js|css)$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-resources'
          }
        }
      ]
    },
    manifest: {
      name: 'GasConnect - Gas Supply Platform',
      short_name: 'GasConnect',
      description: 'Nigerian Gas Supply Platform - Order cooking gas cylinders with fast delivery',
      theme_color: '#2563eb',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait-primary',
      scope: '/',
      start_url: '/?utm_source=pwa',
      lang: 'en-NG',
      categories: ['business', 'utilities', 'shopping'],
      icons: [
        {
          src: '/icon-72x72.png',
          sizes: '72x72',
          type: 'image/png',
          purpose: 'maskable any'
        },
        {
          src: '/icon-96x96.png',
          sizes: '96x96',
          type: 'image/png',
          purpose: 'maskable any'
        },
        {
          src: '/icon-128x128.png',
          sizes: '128x128',
          type: 'image/png',
          purpose: 'maskable any'
        },
        {
          src: '/icon-144x144.png',
          sizes: '144x144',
          type: 'image/png',
          purpose: 'maskable any'
        },
        {
          src: '/icon-152x152.png',
          sizes: '152x152',
          type: 'image/png',
          purpose: 'maskable any'
        },
        {
          src: '/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable any'
        },
        {
          src: '/icon-384x384.png',
          sizes: '384x384',
          type: 'image/png',
          purpose: 'maskable any'
        },
        {
          src: '/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable any'
        }
      ],
      shortcuts: [
        {
          name: 'Place Order',
          short_name: 'Order',
          description: 'Quickly place a new gas order',
          url: '/orders/new',
          icons: [{ src: '/icon-192x192.png', sizes: '192x192' }]
        },
        {
          name: 'Track Orders',
          short_name: 'Track',
          description: 'Track your current orders',
          url: '/orders',
          icons: [{ src: '/icon-192x192.png', sizes: '192x192' }]
        },
        {
          name: 'Emergency SOS',
          short_name: 'SOS',
          description: 'Emergency gas delivery',
          url: '/emergency',
          icons: [{ src: '/icon-192x192.png', sizes: '192x192' }]
        }
      ]
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 20
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  },

  // Runtime config for environment variables
  runtimeConfig: {
    // Private keys (only available on server-side)
    apiSecret: '123',
    paystackSecretKey: process.env.PAYSTACK_SECRET_KEY || '',

    // Public keys (exposed to client-side)
    public: {
      authServiceUrl: process.env.NUXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:3001',
      ordersServiceUrl: process.env.NUXT_PUBLIC_ORDERS_SERVICE_URL || 'http://localhost:3002',
      supplierServiceUrl: process.env.NUXT_PUBLIC_SUPPLIER_SERVICE_URL || 'http://localhost:3003',
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost',
      paystackPublicKey: process.env.NUXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_your_paystack_public_key',
      frontendUrl: process.env.NUXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'
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
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover'
        },
        { name: 'description', content: 'GasConnect - Nigerian Gas Supply Platform for fast cooking gas delivery' },
        { name: 'theme-color', content: '#2563eb' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'GasConnect' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'msapplication-TileColor', content: '#2563eb' },
        { name: 'msapplication-tap-highlight', content: 'no' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.json' }
      ]
    }
  }
})