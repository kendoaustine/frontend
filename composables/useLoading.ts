export const useLoading = () => {
  const loadingStates = ref<Record<string, boolean>>({})

  // Set loading state for a specific key
  const setLoading = (key: string, loading: boolean) => {
    loadingStates.value[key] = loading
  }

  // Get loading state for a specific key
  const isLoading = (key: string): boolean => {
    return loadingStates.value[key] || false
  }

  // Check if any loading state is active
  const isAnyLoading = computed(() => {
    return Object.values(loadingStates.value).some(loading => loading)
  })

  // Execute async function with loading state
  const withLoading = async <T>(
    key: string,
    asyncFn: () => Promise<T>
  ): Promise<T> => {
    setLoading(key, true)
    try {
      return await asyncFn()
    } finally {
      setLoading(key, false)
    }
  }

  // Clear all loading states
  const clearLoading = () => {
    Object.keys(loadingStates.value).forEach(key => {
      loadingStates.value[key] = false
    })
  }

  return {
    loadingStates: readonly(loadingStates),
    setLoading,
    isLoading,
    isAnyLoading,
    withLoading,
    clearLoading
  }
}

// Global loading state
const globalLoading = useLoading()

export const useGlobalLoading = () => globalLoading