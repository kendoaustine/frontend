interface PerformanceMetrics {
  loadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  firstInputDelay: number
  cumulativeLayoutShift: number
  timeToInteractive: number
}

interface NetworkInfo {
  effectiveType: string
  downlink: number
  rtt: number
  saveData: boolean
}

interface DeviceInfo {
  memory: number
  cores: number
  platform: string
  userAgent: string
  isMobile: boolean
  isLowEnd: boolean
}

export const usePerformance = () => {
  // Reactive state
  const metrics = ref<Partial<PerformanceMetrics>>({})
  const networkInfo = ref<Partial<NetworkInfo>>({})
  const deviceInfo = ref<Partial<DeviceInfo>>({})
  const isLowEndDevice = ref(false)
  const shouldOptimize = ref(false)

  /**
   * Collect performance metrics
   */
  const collectMetrics = () => {
    if (!process.client) return

    try {
      // Navigation Timing API
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        metrics.value.loadTime = navigation.loadEventEnd - navigation.loadEventStart
      }

      // Paint Timing API
      const paintEntries = performance.getEntriesByType('paint')
      paintEntries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          metrics.value.firstContentfulPaint = entry.startTime
        }
      })

      // Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          metrics.value.largestContentfulPaint = lastEntry.startTime
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            metrics.value.firstInputDelay = entry.processingStart - entry.startTime
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })

        // Cumulative Layout Shift
        let clsValue = 0
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value
            }
          }
          metrics.value.cumulativeLayoutShift = clsValue
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      }

    } catch (error) {
      console.warn('Performance metrics collection failed:', error)
    }
  }

  /**
   * Detect network conditions
   */
  const detectNetworkConditions = () => {
    if (!process.client) return

    try {
      // Network Information API
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection

      if (connection) {
        networkInfo.value = {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        }

        // Listen for network changes
        connection.addEventListener('change', () => {
          networkInfo.value = {
            effectiveType: connection.effectiveType,
            downlink: connection.downlink,
            rtt: connection.rtt,
            saveData: connection.saveData
          }
          updateOptimizationStrategy()
        })
      }
    } catch (error) {
      console.warn('Network detection failed:', error)
    }
  }

  /**
   * Detect device capabilities
   */
  const detectDeviceCapabilities = () => {
    if (!process.client) return

    try {
      const nav = navigator as any

      deviceInfo.value = {
        memory: nav.deviceMemory || 4, // Default to 4GB if not available
        cores: nav.hardwareConcurrency || 4, // Default to 4 cores
        platform: nav.platform || 'unknown',
        userAgent: nav.userAgent || '',
        isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(nav.userAgent),
        isLowEnd: false
      }

      // Determine if device is low-end
      const memory = deviceInfo.value.memory || 4
      const cores = deviceInfo.value.cores || 4
      const isMobile = deviceInfo.value.isMobile

      isLowEndDevice.value = (
        memory <= 2 || // Less than 2GB RAM
        cores <= 2 || // Less than 2 CPU cores
        (isMobile && memory <= 4) // Mobile with less than 4GB RAM
      )

      deviceInfo.value.isLowEnd = isLowEndDevice.value

    } catch (error) {
      console.warn('Device detection failed:', error)
    }
  }

  /**
   * Update optimization strategy based on conditions
   */
  const updateOptimizationStrategy = () => {
    const slowNetwork = networkInfo.value.effectiveType === 'slow-2g' || 
                       networkInfo.value.effectiveType === '2g' ||
                       networkInfo.value.saveData

    const lowEndDevice = isLowEndDevice.value

    shouldOptimize.value = slowNetwork || lowEndDevice

    // Apply optimizations
    if (shouldOptimize.value) {
      applyPerformanceOptimizations()
    }
  }

  /**
   * Apply performance optimizations
   */
  const applyPerformanceOptimizations = () => {
    if (!process.client) return

    try {
      // Reduce image quality for slow networks
      if (networkInfo.value.saveData || networkInfo.value.effectiveType === '2g') {
        document.documentElement.classList.add('reduce-images')
      }

      // Disable animations for low-end devices
      if (isLowEndDevice.value) {
        document.documentElement.classList.add('reduce-motion')
      }

      // Lazy load non-critical resources
      if (shouldOptimize.value) {
        document.documentElement.classList.add('optimize-performance')
      }

    } catch (error) {
      console.warn('Performance optimization failed:', error)
    }
  }

  /**
   * Preload critical resources
   */
  const preloadCriticalResources = (resources: string[]) => {
    if (!process.client || shouldOptimize.value) return

    resources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource
      
      if (resource.endsWith('.js')) {
        link.as = 'script'
      } else if (resource.endsWith('.css')) {
        link.as = 'style'
      } else if (resource.match(/\.(jpg|jpeg|png|webp|svg)$/)) {
        link.as = 'image'
      }
      
      document.head.appendChild(link)
    })
  }

  /**
   * Lazy load images with intersection observer
   */
  const lazyLoadImages = () => {
    if (!process.client || !('IntersectionObserver' in window)) return

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          if (img.dataset.src) {
            img.src = img.dataset.src
            img.classList.remove('lazy')
            imageObserver.unobserve(img)
          }
        }
      })
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    })

    // Observe all lazy images
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img)
    })
  }

  /**
   * Optimize bundle loading
   */
  const optimizeBundleLoading = () => {
    if (!process.client) return

    // Prefetch next page resources on hover/touch
    const prefetchLinks = document.querySelectorAll('a[href^="/"]')
    
    prefetchLinks.forEach(link => {
      const prefetchOnInteraction = () => {
        const href = (link as HTMLAnchorElement).href
        if (href && !document.querySelector(`link[href="${href}"]`)) {
          const prefetchLink = document.createElement('link')
          prefetchLink.rel = 'prefetch'
          prefetchLink.href = href
          document.head.appendChild(prefetchLink)
        }
      }

      link.addEventListener('mouseenter', prefetchOnInteraction, { once: true })
      link.addEventListener('touchstart', prefetchOnInteraction, { once: true })
    })
  }

  /**
   * Monitor Core Web Vitals
   */
  const monitorCoreWebVitals = () => {
    if (!process.client) return

    const vitals = {
      lcp: 0,
      fid: 0,
      cls: 0
    }

    // Report vitals to analytics (mock implementation)
    const reportVitals = () => {
      console.log('Core Web Vitals:', vitals)
      
      // In production, send to analytics service
      // analytics.track('core_web_vitals', vitals)
    }

    // LCP
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        vitals.lcp = lastEntry.startTime
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // FID
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          vitals.fid = entry.processingStart - entry.startTime
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })

      // CLS
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        vitals.cls = clsValue
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })

      // Report after page load
      window.addEventListener('load', () => {
        setTimeout(reportVitals, 1000)
      })
    }
  }

  // Initialize on mount
  onMounted(() => {
    collectMetrics()
    detectNetworkConditions()
    detectDeviceCapabilities()
    updateOptimizationStrategy()
    lazyLoadImages()
    optimizeBundleLoading()
    monitorCoreWebVitals()
  })

  return {
    // State
    metrics: readonly(metrics),
    networkInfo: readonly(networkInfo),
    deviceInfo: readonly(deviceInfo),
    isLowEndDevice: readonly(isLowEndDevice),
    shouldOptimize: readonly(shouldOptimize),
    
    // Methods
    collectMetrics,
    detectNetworkConditions,
    detectDeviceCapabilities,
    preloadCriticalResources,
    lazyLoadImages,
    optimizeBundleLoading,
    monitorCoreWebVitals
  }
}
