import { act } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import type { KakaoBookDocument } from '@/apis/book-search'
import { BOOK_LIKE_STORAGE_KEY } from '@/constants/book-like'
import { useBookLikeStore } from '@/stores/book-like-store'

function makeBook(overrides: Partial<KakaoBookDocument> = {}): KakaoBookDocument {
  return {
    title: '테스트 도서',
    contents: '본문',
    url: 'https://example.com/book',
    isbn: '978-test-isbn',
    datetime: '2024-01-01T00:00:00',
    authors: ['홍길동'],
    publisher: '테스트출판',
    translators: [],
    price: 15000,
    sale_price: 12000,
    thumbnail: '',
    status: '정상',
    ...overrides,
  }
}

describe('book-like-store', () => {
  beforeEach(() => {
    localStorage.removeItem(BOOK_LIKE_STORAGE_KEY)
    useBookLikeStore.setState({ order: [], books: {} })
  })

  it('toggleLike으로 찜하면 isLiked가 true이고 order 앞에 isbn이 온다', () => {
    const book = makeBook({ isbn: 'a' })
    act(() => {
      useBookLikeStore.getState().toggleLike(book)
    })
    expect(useBookLikeStore.getState().isLiked(book)).toBe(true)
    expect(useBookLikeStore.getState().order).toEqual(['a'])
    expect(useBookLikeStore.getState().books.a).toEqual(book)
  })

  it('같은 책을 다시 toggleLike하면 찜이 해제된다', () => {
    const book = makeBook()
    act(() => {
      useBookLikeStore.getState().toggleLike(book)
      useBookLikeStore.getState().toggleLike(book)
    })
    expect(useBookLikeStore.getState().isLiked(book)).toBe(false)
    expect(useBookLikeStore.getState().order).toEqual([])
    expect(useBookLikeStore.getState().books[book.isbn]).toBeUndefined()
  })

  it('여러 권을 찜하면 최근 것이 order 맨 앞에 온다', () => {
    const b1 = makeBook({ isbn: '1', title: '첫' })
    const b2 = makeBook({ isbn: '2', title: '둘' })
    act(() => {
      useBookLikeStore.getState().toggleLike(b1)
      useBookLikeStore.getState().toggleLike(b2)
    })
    expect(useBookLikeStore.getState().order).toEqual(['2', '1'])
  })
})
