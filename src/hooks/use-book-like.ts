import { useMemo } from 'react'
import type { KakaoBookDocument } from '@/apis/book-search'
import { useBookLikeStore } from '@/stores/book-like-store'

export interface UseBookLikeResult {
  likedBooks: KakaoBookDocument[]
  toggleLike: (book: KakaoBookDocument) => void
  isLiked: (book: KakaoBookDocument) => boolean
}

export function useBookLike(): UseBookLikeResult {
  const order = useBookLikeStore((s) => s.order)
  const books = useBookLikeStore((s) => s.books)
  const toggleLike = useBookLikeStore((s) => s.toggleLike)
  const isLiked = useBookLikeStore((s) => s.isLiked)
  const likedBooks = useMemo(
    () => order.map((k) => books[k]).filter(Boolean) as KakaoBookDocument[],
    [order, books],
  )
  return { likedBooks, toggleLike, isLiked }
}
