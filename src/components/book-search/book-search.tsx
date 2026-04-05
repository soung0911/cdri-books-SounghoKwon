import { useCallback, useRef, useState } from 'react'
import type { KakaoBookSearchTarget } from '@/apis'
import CloseIcon from '@/assets/svgs/close.svg?react'
import SearchIcon from '@/assets/svgs/search.svg?react'
import { DEFAULT_ADVANCED_SEARCH_TARGET } from '@/constants'
import { useSearchHistory } from '@/hooks/use-search-history'
import { BookDetailSearchPopover } from './book-detail-search-popover'

interface BookSearchProps {
  value: string
  onChange: (value: string) => void
  /** 검색 실행 시 trim 된 검색어가 전달됩니다. */
  onSubmit: (query: string) => void
  /** 상세 검색 실행 시 메인 입력은 비우고 API `target`과 함께 검색합니다. */
  onAdvancedSearch: (payload: { query: string; target: KakaoBookSearchTarget }) => void
}

export function BookSearch({ value, onChange, onSubmit, onAdvancedSearch }: BookSearchProps) {
  const { items, add, remove } = useSearchHistory()
  const [historyOpen, setHistoryOpen] = useState(false)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [advancedTarget, setAdvancedTarget] = useState<KakaoBookSearchTarget>(
    DEFAULT_ADVANCED_SEARCH_TARGET,
  )
  const [advancedQuery, setAdvancedQuery] = useState('')
  const advancedAnchorRef = useRef<HTMLDivElement>(null)

  const openHistory = useCallback(() => {
    if (items.length > 0) setHistoryOpen(true)
  }, [items.length])

  const resetAdvancedForm = useCallback(() => {
    setAdvancedQuery('')
    setAdvancedTarget(DEFAULT_ADVANCED_SEARCH_TARGET)
  }, [])

  const runSearch = useCallback(
    (query: string) => {
      const q = query.trim()
      if (!q) return
      resetAdvancedForm()
      setAdvancedOpen(false)
      add(q)
      onSubmit(q)
      setHistoryOpen(false)
    },
    [add, onSubmit, resetAdvancedForm]
  )

  const toggleAdvancedPopover = useCallback(() => {
    setAdvancedOpen((open) => !open)
  }, [])

  const runAdvancedSearch = useCallback(() => {
    const q = advancedQuery.trim()
    if (!q) return
    onAdvancedSearch({ query: q, target: advancedTarget })
    setAdvancedOpen(false)
    setHistoryOpen(false)
  }, [advancedQuery, advancedTarget, onAdvancedSearch])

  return (
    <div className="relative w-full max-w-[568px]">
      <h2 className="typo-title2 text-(--color-text-title)">도서 검색</h2>
      <form
        className="mt-6 flex w-full flex-row flex-wrap items-center gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          runSearch(value)
        }}
      >
        <div className="relative min-w-0 flex-1">
          <div
            className={`flex items-center gap-2 rounded-full bg-(--color-palette-light-gray) py-[10px] pl-[10px] pr-4 ${historyOpen ? 'rounded-t-[24px] rounded-b-none' : ''}`}
            onClick={openHistory}
          >
            <SearchIcon
              aria-hidden
              className="size-[30px]"
              width={30}
              height={30}
            />
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={openHistory}
              onBlur={() => setHistoryOpen(false)}
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
                        type="button"
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
                        type="button"
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
        <div className="relative" ref={advancedAnchorRef}>
          <button
            type="button"
            className="typo-body2 rounded-lg border border-solid border-(--color-text-subtitle) bg-(--color-palette-white) px-[10px] h-[35px] text-(--color-text-subtitle)"
            aria-expanded={advancedOpen}
            aria-haspopup="dialog"
            onClick={toggleAdvancedPopover}
          >
            상세검색
          </button>
          {advancedOpen && (
            <BookDetailSearchPopover
              onClose={() => setAdvancedOpen(false)}
              target={advancedTarget}
              onTargetChange={setAdvancedTarget}
              query={advancedQuery}
              onQueryChange={setAdvancedQuery}
              onSearch={runAdvancedSearch}
              anchorRef={advancedAnchorRef}
            />
          )}
        </div>
      </form>
    </div>
  )
}
