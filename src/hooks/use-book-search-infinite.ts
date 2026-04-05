import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { getSearchBooks, type KakaoBookDocument, type KakaoBookSearchTarget } from '@/apis'
import { BOOK_SEARCH_INFINITE_ROOT_MARGIN_PX, BOOK_SEARCH_PAGE_SIZE } from '@/constants'

export interface UseBookSearchInfiniteResult {
  books: KakaoBookDocument[]
  totalCount: number
  sentinelRef: RefObject<HTMLDivElement | null>
  hasNextPage: boolean
  isFetchingNextPage: boolean
  isInitialLoading: boolean
}

export function useBookSearchInfinite(
  searchQuery: string,
  searchTarget?: KakaoBookSearchTarget,
): UseBookSearchInfiniteResult {
  const enabled = searchQuery.length > 0

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ['kakao-books-infinite', searchQuery, searchTarget ?? 'all'],
    queryFn: ({ pageParam }) =>
      getSearchBooks({
        query: searchQuery,
        size: BOOK_SEARCH_PAGE_SIZE,
        page: pageParam,
        ...(searchTarget ? { target: searchTarget } : {}),
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.meta.is_end ? undefined : (lastPageParam as number) + 1,
    enabled,
  })

  const books = useMemo(
    () => data?.pages.flatMap((page) => page.documents) ?? [],
    [data?.pages],
  )

  const totalCount = data?.pages[0]?.meta.total_count ?? 0

  const isInitialLoading = enabled && !data && isFetching

  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!enabled) return
    const node = sentinelRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        void fetchNextPage()
      },
      { root: null, rootMargin: `${BOOK_SEARCH_INFINITE_ROOT_MARGIN_PX}px`, threshold: 0 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [enabled, searchQuery, fetchNextPage, isInitialLoading, books.length])

  return {
    books,
    totalCount,
    sentinelRef,
    hasNextPage,
    isFetchingNextPage,
    isInitialLoading,
  }
}
