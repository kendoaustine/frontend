import { z } from 'zod'

interface FormOptions<T> {
  initialValues: T
  validationSchema?: z.ZodSchema<T>
  onSubmit?: (values: T) => Promise<void> | void
}

export const useCustomForm = <T extends Record<string, any>>(options: FormOptions<T>) => {
  const { initialValues, validationSchema, onSubmit } = options

  // Form state
  const values = reactive<T>({ ...initialValues })
  const errors = reactive<Partial<Record<keyof T, string>>>({})
  const touched = reactive<Partial<Record<keyof T, boolean>>>({})
  const isSubmitting = ref(false)
  const isValid = ref(true)

  // Reset form to initial values
  const reset = () => {
    Object.assign(values, initialValues)
    Object.keys(errors).forEach(key => delete errors[key])
    Object.keys(touched).forEach(key => delete touched[key])
    isSubmitting.value = false
    isValid.value = true
  }

  // Set field value
  const setFieldValue = (field: keyof T, value: any) => {
    values[field] = value
    touched[field] = true
    validateField(field)
  }

  // Set field error
  const setFieldError = (field: keyof T, error: string) => {
    errors[field] = error
    isValid.value = Object.keys(errors).length === 0
  }

  // Clear field error
  const clearFieldError = (field: keyof T) => {
    delete errors[field]
    isValid.value = Object.keys(errors).length === 0
  }

  // Validate single field
  const validateField = (field: keyof T) => {
    if (!validationSchema) return true

    try {
      // Create a partial schema for the specific field
      const fieldSchema = validationSchema.pick({ [field]: true } as any)
      fieldSchema.parse({ [field]: values[field] })
      clearFieldError(field)
      return true
    } catch (error: any) {
      if (error.errors && error.errors[0]) {
        setFieldError(field, error.errors[0].message)
      }
      return false
    }
  }

  // Validate entire form
  const validate = () => {
    if (!validationSchema) return true

    try {
      validationSchema.parse(values)
      Object.keys(errors).forEach(key => delete errors[key])
      isValid.value = true
      return true
    } catch (error: any) {
      if (error.errors) {
        error.errors.forEach((err: any) => {
          const field = err.path[0] as keyof T
          errors[field] = err.message
        })
      }
      isValid.value = false
      return false
    }
  }

  // Handle form submission
  const handleSubmit = async (event?: Event) => {
    if (event) {
      event.preventDefault()
    }

    // Mark all fields as touched
    Object.keys(values).forEach(key => {
      touched[key as keyof T] = true
    })

    // Validate form
    if (!validate()) {
      return
    }

    if (!onSubmit) {
      return
    }

    isSubmitting.value = true

    try {
      await onSubmit(values)
    } catch (error: any) {
      // Handle submission errors
      if (error.fieldErrors) {
        Object.entries(error.fieldErrors).forEach(([field, message]) => {
          setFieldError(field as keyof T, message as string)
        })
      }
      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  // Get field props for input binding
  const getFieldProps = (field: keyof T) => {
    return {
      value: values[field],
      error: errors[field],
      touched: touched[field],
      onChange: (value: any) => setFieldValue(field, value),
      onBlur: () => {
        touched[field] = true
        validateField(field)
      }
    }
  }

  // Check if field has error
  const hasError = (field: keyof T) => {
    return !!(touched[field] && errors[field])
  }

  // Get error message for field
  const getError = (field: keyof T) => {
    return hasError(field) ? errors[field] : undefined
  }

  return {
    // Form state
    values: readonly(values),
    errors: readonly(errors),
    touched: readonly(touched),
    isSubmitting: readonly(isSubmitting),
    isValid: readonly(isValid),

    // Form methods
    reset,
    setFieldValue,
    setFieldError,
    clearFieldError,
    validateField,
    validate,
    handleSubmit,
    getFieldProps,
    hasError,
    getError
  }
}