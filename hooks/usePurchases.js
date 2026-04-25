import { useState, useCallback } from 'react'
import { loadPurchases, savePurchases } from '../lib/storage'

/**
 * Central hook for purchase state management.
 * All mutations go through here so localStorage stays in sync.
 */
export function usePurchases() {
  const [purchases, setPurchases] = useState(() => loadPurchases())

  const addPurchase = useCallback((entry) => {
    setPurchases(prev => {
      const next = [entry, ...prev]
      savePurchases(next)
      return next
    })
  }, [])

  const updateOutcome = useCallback((id, outcome) => {
    setPurchases(prev => {
      const next = prev.map(p => p.id === id ? { ...p, outcome } : p)
      savePurchases(next)
      return next
    })
  }, [])

  const clearAll = useCallback(() => {
    setPurchases([])
    savePurchases([])
  }, [])

  return { purchases, addPurchase, updateOutcome, clearAll }
}
