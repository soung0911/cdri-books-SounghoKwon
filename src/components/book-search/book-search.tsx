import { useCallback, useRef, useState } from 'react'
import type { KakaoBookSearchTarget } from '@/apis'
import CloseIcon from '@/assets/svgs/close.svg?react'
import SearchIcon from '@/assets/svgs/search.svg?react'
import { useSearchHistory } from '@/hooks/use-search-history'
import {
  BookDetailSearch,
  type BookDetailSearchHandle,
} from './book-detail-search'

interface BookSearchProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (query: string) => void
  onDetailSearch: (payload: { query: string; target: KakaoBookSearchTarget }) => void
}

export function BookSearch({ value, onChange, onSubmit, onDetailSearch }: BookSearchProps) {
  const { items, add, remove } = useSearchHistory()
  const [historyOpen, setHistoryOpen] = useState(false)
  const detailSearchRef = useRef<BookDetailSearchHandle>(null)

  const openHistory = useCallback(() => {
    if (items.length > 0) setHistoryOpen(true)
  }, [items.length])

  const runSearch = useCallback(
    (query: string) => {
      const q = query.trim()
      if (!q) return
      detailSearchRef.current?.resetAndClose()
      add(q)
      onSubmit(q)
      setHistoryOpen(false)
    },
    [add, onSubmit]
  )

  return (
    <div className="relative z-10 w-full max-w-[568px]">
      <h2 className="typo-title2 text-(--color-text-title)">도서 검색</h2>
      <div className="mt-6 flex w-full flex-row flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <div
            className={`flex items-center gap-2 rounded-full bg-(--color-palette-light-gray) py-[10px] pl-[10px] pr-4 ${historyOpen ? 'rounded-t-[24px] rounded-b-none' : ''}`}
            onClick={openHistory}
          >
            <SearchIcon aria-hidden className="size-[30px]" width={30} height={30} />
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={openHistory}
              onBlur={() => setHistoryOpen(false)}
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return
                e.preventDefault()
                runSearch(value)
              }}
              placeholder="검색어 입력"
              aria-label="검색어"
              autoComplete="off"
              className="typo-caption min-w-0 flex-1 border-0 bg-transparent text-(--color-text-primary) outline-none placeholder:text-(--color-text-subtitle)"
            />
          </div>

          {historyOpen && (
            <div
              className="absolute left-0 right-0 z-20 rounded-b-[24px] bg-(--color-palette-light-gray) pl-[51px] pr-[25px] pt-[17px] pb-[24px]"
              role="listbox"
              aria-label="검색 기록"
            >
              <ul className="mt-3 flex flex-col gap-4 overflow-y-auto">
                {items.map((q) => (
                  <li key={q}>
                    <div className="flex">
                      <button
                        className="typo-caption flex-1 text-left text-(--color-text-subtitle)"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          onChange(q)
                          runSearch(q)
                        }}
                      >
                        {q}
                      </button>

                      <button
                        aria-label={`${q} 기록 삭제`}
                        className="flex size-6 items-center justify-center rounded-md text-(--color-text-subtitle) transition-colors"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => remove(q)}
                      >
                        <CloseIcon />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <BookDetailSearch
          ref={detailSearchRef}
          onSearch={onDetailSearch}
          onAfterSearch={() => setHistoryOpen(false)}
        />
      </div>
    </div>
  )
}
