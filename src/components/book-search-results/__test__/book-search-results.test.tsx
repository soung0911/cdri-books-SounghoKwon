import { render, screen } from '@testing-library/react'
import type { RefObject } from 'react'
import { useState } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { KakaoBookSearchTarget } from '@/apis'
import type { KakaoBookDocument } from '@/apis/book-search'
import { BOOK_LIKE_STORAGE_KEY } from '@/constants/book-like'
import type { UseBookSearchInfiniteResult } from '@/hooks/use-book-search-infinite'
import { useBookSearchInfinite } from '@/hooks/use-book-search-infinite'
import { useBookLikeStore } from '@/stores/book-like-store'
import { BookSearchResults } from '../book-search-results'

vi.mock('@/hooks/use-book-search-infinite', () => ({
  useBookSearchInfinite: vi.fn(),
}))

const mockUseBookSearchInfinite = vi.mocked(useBookSearchInfinite)

function makeBook(overrides: Partial<KakaoBookDocument> = {}): KakaoBookDocument {
  return {
    title: '모킹 도서',
    contents: '소개',
    url: 'https://buy.example',
    isbn: '978-mock-1',
    datetime: '',
    authors: ['작가'],
    publisher: '출판',
    translators: [],
    price: 10000,
    sale_price: 9000,
    thumbnail: '',
    status: '',
    ...overrides,
  }
}

function createSentinelRef(): RefObject<HTMLDivElement | null> {
  return { current: null }
}

function baseInfiniteMock(
  overrides: Partial<UseBookSearchInfiniteResult> = {},
): UseBookSearchInfiniteResult {
  return {
    books: [],
    totalCount: 0,
    sentinelRef: createSentinelRef(),
    hasNextPage: false,
    isFetchingNextPage: false,
    isInitialLoading: false,
    ...overrides,
  }
}

function ResultsHarness(props: { submittedQuery: string; searchTarget?: KakaoBookSearchTarget }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  return (
    <BookSearchResults
      submittedQuery={props.submittedQuery}
      searchTarget={props.searchTarget}
      expandedId={expandedId}
      setExpandedId={setExpandedId}
    />
  )
}

describe('BookSearchResults', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseBookSearchInfinite.mockReturnValue(baseInfiniteMock())
    localStorage.removeItem(BOOK_LIKE_STORAGE_KEY)
    useBookLikeStore.setState({ order: [], books: {} })
  })

  it('검색어가 비어 있으면 건수 0과 빈 결과 안내를 보여준다', () => {
    render(<ResultsHarness submittedQuery="" />, { reactStrictMode: false })

    expect(screen.getAllByText('도서 검색 결과').length).toBeGreaterThan(0)
    expect(screen.getAllByText('검색된 결과가 없습니다.').length).toBeGreaterThan(0)
  })

  it('공백만 있는 검색어는 빈 것과 동일하게 처리한다', () => {
    render(<ResultsHarness submittedQuery="   " />, { reactStrictMode: false })

    expect(screen.getAllByText('검색된 결과가 없습니다.').length).toBeGreaterThan(0)
  })

  it('첫 로딩 중이면 검색 중 문구를 보여준다', () => {
    mockUseBookSearchInfinite.mockReturnValue(
      baseInfiniteMock({ isInitialLoading: true, isFetchingNextPage: false }),
    )

    render(<ResultsHarness submittedQuery="리액트" />, { reactStrictMode: false })

    expect(screen.getByText('검색 중…')).toBeInTheDocument()
  })

  it('도서가 있으면 제목과 총 건수를 보여준다', () => {
    const book = makeBook({ title: '특별한 제목', isbn: 'isbn-a' })
    mockUseBookSearchInfinite.mockReturnValue(
      baseInfiniteMock({ books: [book], totalCount: 42, isInitialLoading: false }),
    )

    render(<ResultsHarness submittedQuery="query" />, { reactStrictMode: false })

    expect(screen.getByText('특별한 제목')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('검색은 했으나 목록이 비면 빈 결과 안내를 보여준다', () => {
    mockUseBookSearchInfinite.mockReturnValue(
      baseInfiniteMock({ books: [], totalCount: 0, isInitialLoading: false }),
    )

    render(<ResultsHarness submittedQuery="없는키워드" />, { reactStrictMode: false })

    expect(screen.getAllByText('검색된 결과가 없습니다.').length).toBeGreaterThan(0)
  })

  it('다음 페이지 로딩 중이면 안내 문구를 보여준다', () => {
    mockUseBookSearchInfinite.mockReturnValue(
      baseInfiniteMock({
        books: [makeBook()],
        totalCount: 11,
        isInitialLoading: false,
        isFetchingNextPage: true,
      }),
    )

    render(<ResultsHarness submittedQuery="q" />, { reactStrictMode: false })

    expect(screen.getByText('더 불러오는 중…')).toBeInTheDocument()
  })
})
