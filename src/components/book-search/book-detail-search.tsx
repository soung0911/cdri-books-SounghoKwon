import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react'
import type { KakaoBookSearchTarget } from '@/apis'
import { DEFAULT_DETAIL_SEARCH_TARGET } from '@/constants'
import { usePopoverState } from '@/hooks/use-popover'
import { BookDetailSearchPopover } from './book-detail-search-popover'

export interface BookDetailSearchHandle {
  resetAndClose: () => void
}

export interface BookDetailSearchProps {
  onSearch: (payload: { query: string; target: KakaoBookSearchTarget }) => void
  onAfterSearch?: () => void
}

export const BookDetailSearch = forwardRef<BookDetailSearchHandle, BookDetailSearchProps>(
  function BookDetailSearch({ onSearch, onAfterSearch }, ref) {
    const { open, anchorRef, toggle, close } = usePopoverState()
    const [target, setTarget] = useState<KakaoBookSearchTarget>(DEFAULT_DETAIL_SEARCH_TARGET)
    const [query, setQuery] = useState('')

    const resetAndClose = useCallback(() => {
      setQuery('')
      setTarget(DEFAULT_DETAIL_SEARCH_TARGET)
      close()
    }, [close])

    useImperativeHandle(ref, () => ({ resetAndClose }), [resetAndClose])

    const commitSearch = useCallback(() => {
      const q = query.trim()
      if (!q) return
      onSearch({ query: q, target })
      close()
      onAfterSearch?.()
    }, [close, onAfterSearch, onSearch, query, target])

    return (
      <div className="relative" ref={anchorRef}>
        <button
          className="typo-body2 rounded-lg border border-solid border-(--color-text-subtitle) bg-(--color-palette-white) px-[10px] h-[35px] text-(--color-text-subtitle)"
          aria-expanded={open}
          aria-haspopup="dialog"
          onClick={toggle}
        >
          상세검색
        </button>
        {open && (
          <BookDetailSearchPopover
            onClose={close}
            target={target}
            onTargetChange={setTarget}
            query={query}
            onQueryChange={setQuery}
            onSearch={commitSearch}
            anchorRef={anchorRef}
          />
        )}
      </div>
    )
  },
)
