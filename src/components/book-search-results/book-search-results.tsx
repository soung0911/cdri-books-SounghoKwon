import type { Dispatch, SetStateAction } from 'react'
import type { KakaoBookSearchTarget } from '@/apis'
import { BookList } from '@/components/book-list'
import { useBookSearchInfinite } from '@/hooks/use-book-search-infinite'
import { BookSearchEmpty } from './book-search-empty'
import { SearchResultCount } from './search-result-count'

export interface BookSearchResultsProps {
  submittedQuery: string
  /** 없으면 전체 필드 검색, 있으면 해당 필드만 상세 검색 */
  searchTarget?: KakaoBookSearchTarget
  expandedId: string | null
  setExpandedId: Dispatch<SetStateAction<string | null>>
}

export function BookSearchResults({
  submittedQuery,
  searchTarget,
  expandedId,
  setExpandedId,
}: BookSearchResultsProps) {
  const query = submittedQuery.trim()

  const { books, totalCount, sentinelRef, isFetchingNextPage, isInitialLoading } =
    useBookSearchInfinite(query, searchTarget)

  if (query.length === 0) {
    return (
      <>
        <SearchResultCount total={0} />
        <BookSearchEmpty />
      </>
    )
  }

  if (isInitialLoading) {
    return (
      <>
        <SearchResultCount total={0} />
        <p className="typo-caption mt-6 text-(--color-text-secondary)">검색 중…</p>
      </>
    )
  }

  return (
    <>
      <SearchResultCount total={totalCount} />
      {books.length === 0 ? (
        <BookSearchEmpty />
      ) : (
        <>
          <BookList
            books={books}
            expandedId={expandedId}
            onToggleExpand={(id) => setExpandedId((cur) => (cur === id ? null : id))}
          />
          <div ref={sentinelRef} className="pointer-events-none h-1 w-full" aria-hidden />
          {isFetchingNextPage && (
            <p className="typo-caption mt-4 text-center text-(--color-text-secondary)">
              더 불러오는 중…
            </p>
          )}
        </>
      )}
    </>
  )
}
