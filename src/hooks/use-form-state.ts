"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"

/**
 * Props for the useFormState hook
 */
interface UseFormStateProps {
  initialError?: string | null
  initialIsFormValid?: boolean
}

/**
 * Custom hook for managing form state
 * Handles loading states, validation, errors and success messages
 */
export function useFormState({ 
  initialError = null, 
  initialIsFormValid = false 
}: UseFormStateProps = {}) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [isFormValid, setIsFormValid] = useState(initialIsFormValid)
  const [error, setError] = useState<string | null>(initialError)
  const [success, setSuccess] = useState<string | null>(null)

  /**
   * Sets a specific section to loading state and clears messages
   */
  const startLoading = (sectionId: string = 'default') => {
    setLoadingStates(prev => ({ ...prev, [sectionId]: true }))
    setError(null)
    setSuccess(null)
  }

  /**
   * Stops the loading state for a specific section
   */
  const stopLoading = (sectionId: string = 'default') => {
    setLoadingStates(prev => ({ ...prev, [sectionId]: false }))
  }

  /**
   * Checks if a specific section is loading
   */
  const isLoading = (sectionId: string = 'default') => {
    return loadingStates[sectionId] || false
  }

  /**
   * Sets an error message and displays a toast notification
   */
  const setFormError = useCallback((message: string) => {
    setError(message)
    setSuccess(null)
    toast.error(message)
  }, [])

  /**
   * Sets a success message and displays a toast notification
   */
  const setFormSuccess = useCallback((message: string) => {
    setSuccess(message)
    setError(null)
    toast.success(message)
  }, [])

  /**
   * Resets all form state to initial values
   */
  const resetFormState = () => {
    setLoadingStates({})
    setError(null)
    setSuccess(null)
  }

  return {
    isLoading,
    error,
    success,
    isFormValid,
    startLoading,
    stopLoading,
    setFormError,
    setFormSuccess,
    setIsFormValid,
    resetFormState
  }
}