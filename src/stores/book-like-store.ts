import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'
import type { KakaoBookDocument } from '@/apis/book-search'
import { getKakaoBookId } from '@/lib/kakao-book-id'
import { BOOK_LIKE_STORAGE_KEY } from '@/constants/book-like'

function normalizeLikePersistState(state: {
  order: string[]
  books: Record<string, KakaoBookDocument>
}): { order: string[]; books: Record<string, KakaoBookDocument> } {
  const { order, books } = state
  const newBooks: Record<string, KakaoBookDocument> = {}
  for (const doc of Object.values(books)) {
    newBooks[getKakaoBookId(doc)] = doc
  }
  const seen = new Set<string>()
  const newOrder: string[] = []
  for (const oldKey of order) {
    const doc = books[oldKey]
    if (!doc) continue
    const id = getKakaoBookId(doc)
    if (seen.has(id)) continue
    seen.add(id)
    newOrder.push(id)
  }
  for (const id of Object.keys(newBooks)) {
    if (!seen.has(id)) newOrder.push(id)
  }
  return { order: newOrder, books: newBooks }
}

function serializePersistedLikes(
  state: { order: string[]; books: Record<string, KakaoBookDocument> },
  version = 0,
) {
  return JSON.stringify({ state: normalizeLikePersistState(state), version })
}

/** Context 시절 `{ order, books }` 직렬화 → zustand persist `{ state, version }` 형식으로 읽기 */
const bookLikeStorage: StateStorage = {
  getItem: (name) => {
    try {
      const raw = localStorage.getItem(name)
      if (raw == null) return null
      const parsed = JSON.parse(raw) as unknown
      if (parsed && typeof parsed === 'object' && 'state' in parsed) {
        const rest = parsed as { state: unknown; version?: number }
        const st = rest.state
        if (
          st &&
          typeof st === 'object' &&
          st !== null &&
          'order' in st &&
          'books' in st
        ) {
          return serializePersistedLikes(
            st as { order: string[]; books: Record<string, KakaoBookDocument> },
            rest.version ?? 0,
          )
        }
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
          return serializePersistedLikes({
            order: p.order as string[],
            books: p.books as Record<string, KakaoBookDocument>,
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
        const key = getKakaoBookId(book)
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
      isLiked: (book) => getKakaoBookId(book) in get().books,
    }),
    {
      name: BOOK_LIKE_STORAGE_KEY,
      storage: createJSONStorage(() => bookLikeStorage),
      partialize: (state) => ({ order: state.order, books: state.books }),
    },
  ),
)
