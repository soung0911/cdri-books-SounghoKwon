import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'
import type { KakaoBookDocument } from '@/apis/book-search'
import { BOOK_LIKE_STORAGE_KEY } from '@/constants/book-like'

/** Context 시절 `{ order, books }` 직렬화 → zustand persist `{ state, version }` 형식으로 읽기 */
const bookLikeStorage: StateStorage = {
  getItem: (name) => {
    try {
      const raw = localStorage.getItem(name)
      if (raw == null) return null
      const parsed = JSON.parse(raw) as unknown
      if (parsed && typeof parsed === 'object' && 'state' in parsed) {
        return raw
      }
      if (
        parsed &&
        typeof parsed === 'object' &&
        'order' in parsed &&
        'books' in parsed
      ) {
        const p = parsed as { order: unknown; books: unknown }
        if (Array.isArray(p.order) && p.books !== null && typeof p.books === 'object') {
          return JSON.stringify({
            state: { order: p.order, books: p.books },
            version: 0,
          })
        }
      }
      return null
    } catch {
      return null
    }
  },
  setItem: (name, value) => localStorage.setItem(name, value),
  removeItem: (name) => localStorage.removeItem(name),
}

interface BookLikeStore {
  order: string[]
  books: Record<string, KakaoBookDocument>
  toggleLike: (book: KakaoBookDocument) => void
  isLiked: (book: KakaoBookDocument) => boolean
}

export const useBookLikeStore = create<BookLikeStore>()(
  persist(
    (set, get) => ({
      order: [],
      books: {},
      toggleLike: (book) => {
        const key = book.isbn
        set((prev) => {
          if (prev.books[key]) {
            const order = prev.order.filter((k) => k !== key)
            const books = { ...prev.books }
            delete books[key]
            return { order, books }
          }
          return {
            order: [key, ...prev.order],
            books: { ...prev.books, [key]: book },
          }
        })
      },
      isLiked: (book) => book.isbn in get().books,
    }),
    {
      name: BOOK_LIKE_STORAGE_KEY,
      storage: createJSONStorage(() => bookLikeStorage),
      partialize: (state) => ({ order: state.order, books: state.books }),
    },
  ),
)
