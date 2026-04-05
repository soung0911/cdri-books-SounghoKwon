import { useCallback, useState } from 'react'
import { SEARCH_HISTORY_MAX_ITEMS, SEARCH_HISTORY_STORAGE_KEY } from '@/constants'

export interface UseSearchHistoryResult {
  items: string[]
  add: (query: string) => void
  remove: (query: string) => void
}

export function useSearchHistory(): UseSearchHistoryResult {
  const [items, setItems] = useState<string[]>(() => {
    const raw = localStorage.getItem(SEARCH_HISTORY_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  })

  const add = useCallback((query: string) => {
    const trimmed = query.trim()
    if (!trimmed) return
    setItems((prev) => {
      const next = [trimmed, ...prev.filter((x) => x !== trimmed)].slice(
        0,
        SEARCH_HISTORY_MAX_ITEMS
      )
      localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const remove = useCallback((query: string) => {
    setItems((prev) => {
      const next = prev.filter((x) => x !== query)
      localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { items, add, remove }
}
