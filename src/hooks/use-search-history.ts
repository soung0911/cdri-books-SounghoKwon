import { useCallback, useState } from 'react'
import { SEARCH_HISTORY_MAX_ITEMS, SEARCH_HISTORY_STORAGE_KEY } from '@/constants'

function readFromStorage(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(SEARCH_HISTORY_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown

    if (Array.isArray(parsed)) {
      return parsed.filter((x): x is string => typeof x === 'string')
    }

    if (parsed && typeof parsed === 'object' && 'state' in parsed) {
      const state = (parsed as { state?: unknown }).state
      if (
        state &&
        typeof state === 'object' &&
        state !== null &&
        'items' in state &&
        Array.isArray((state as { items: unknown }).items)
      ) {
        return (state as { items: unknown[] }).items.filter((x): x is string => typeof x === 'string')
      }
    }

    return []
  } catch {
    return []
  }
}

function writeToStorage(items: string[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(items))
  } catch {
    /* quota / private mode */
  }
}

export interface UseSearchHistoryResult {
  items: string[]
  add: (query: string) => void
  remove: (query: string) => void
}

export function useSearchHistory(): UseSearchHistoryResult {
  const [items, setItems] = useState<string[]>(() => readFromStorage())

  const add = useCallback((query: string) => {
    const trimmed = query.trim()
    if (!trimmed) return
    setItems((prev) => {
      const next = [trimmed, ...prev.filter((x) => x !== trimmed)].slice(0, SEARCH_HISTORY_MAX_ITEMS)
      writeToStorage(next)
      return next
    })
  }, [])

  const remove = useCallback((query: string) => {
    setItems((prev) => {
      const next = prev.filter((x) => x !== query)
      writeToStorage(next)
      return next
    })
  }, [])

  return { items, add, remove }
}
