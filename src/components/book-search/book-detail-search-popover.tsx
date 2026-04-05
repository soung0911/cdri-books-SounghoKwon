import { useCallback, useEffect, useId, useRef, useState, type RefObject } from 'react'
import CloseIcon from '@/assets/svgs/close.svg?react'
import ExpandIcon from '@/assets/svgs/expand.svg?react'
import type { KakaoBookSearchTarget } from '@/apis'
import { ADVANCED_SEARCH_FIELD_OPTIONS } from '@/constants'
import { Button } from '../ui'

export interface BookDetailSearchPopoverProps {
  onClose: () => void
  target: KakaoBookSearchTarget
  onTargetChange: (target: KakaoBookSearchTarget) => void
  query: string
  onQueryChange: (value: string) => void
  onSearch: () => void
  anchorRef: RefObject<HTMLElement | null>
}

export function BookDetailSearchPopover({
  onClose,
  target,
  onTargetChange,
  query,
  onQueryChange,
  onSearch,
  anchorRef,
}: BookDetailSearchPopoverProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const fieldBlockRef = useRef<HTMLDivElement>(null)
  const queryId = useId()
  const fieldOptionsListId = useId()
  const [fieldMenuOpen, setFieldMenuOpen] = useState(false)

  const selectedLabel = ADVANCED_SEARCH_FIELD_OPTIONS.find((o) => o.value === target)?.label ?? ''

  useEffect(() => {
    if (!fieldMenuOpen) return

    const onPointerDown = (e: PointerEvent) => {
      if (fieldBlockRef.current?.contains(e.target as Node)) return
      setFieldMenuOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown, true)
    return () => document.removeEventListener('pointerdown', onPointerDown, true)
  }, [fieldMenuOpen])

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (panelRef.current?.contains(t)) return
      if (anchorRef.current?.contains(t)) return
      onClose()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose, anchorRef])

  const pickField = useCallback(
    (value: KakaoBookSearchTarget) => {
      onTargetChange(value)
      setFieldMenuOpen(false)
    },
    [onTargetChange]
  )

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="상세 검색"
      className="absolute left-1/2 top-[calc(100%+15px)] z-30 w-[360px] -translate-x-1/2 rounded-lg bg-(--color-palette-white) px-6 py-8 shadow-[0px_4px_14px_6px_rgba(151,151,151,0.15)]"
    >
      <div className="relative">
        <button
          type="button"
          className="absolute -right-4 -top-6 flex size-5 items-center justify-center"
          aria-label="상세 검색 닫기"
          onClick={onClose}
        >
          <CloseIcon className="size-5" aria-hidden width={20} height={20} />
        </button>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <div ref={fieldBlockRef} className="relative w-[100px]">
              <button
                type="button"
                aria-expanded={fieldMenuOpen}
                aria-haspopup="listbox"
                aria-controls={fieldMenuOpen ? fieldOptionsListId : undefined}
                aria-label={`검색 조건. 현재 ${selectedLabel}`}
                className="typo-body2-bold flex h-9 w-full cursor-pointer items-center justify-between gap-1 border-0 border-b border-solid border-[#d2d6da] bg-transparent py-2 pr-0 text-left text-(--color-text-primary) outline-none"
                onClick={() => setFieldMenuOpen((v) => !v)}
              >
                <span className="min-w-0 truncate">{selectedLabel}</span>
                <ExpandIcon
                  aria-hidden
                  width={14}
                  height={8}
                  className={`transition-transform duration-200 ${fieldMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {fieldMenuOpen && (
                <ul
                  id={fieldOptionsListId}
                  role="listbox"
                  aria-label="검색 조건 선택"
                  className="absolute left-0 top-[calc(100%+4px)] z-40 w-[100px] overflow-hidden rounded bg-(--color-palette-white) py-1 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]"
                >
                  {ADVANCED_SEARCH_FIELD_OPTIONS.map((opt) => (
                    <li key={opt.value} role="presentation">
                      <button
                        type="button"
                        role="option"
                        aria-selected={opt.value === target}
                        className="typo-body2 flex h-[30px] w-full items-center px-2 text-left text-(--color-text-subtitle) hover:bg-(--color-palette-light-gray)"
                        onClick={() => pickField(opt.value)}
                      >
                        {opt.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <label htmlFor={queryId} className="sr-only">
                검색어
              </label>
              <input
                id={queryId}
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                onFocus={() => setFieldMenuOpen(false)}
                placeholder="검색어 입력"
                autoComplete="off"
                className="typo-body2 h-9 w-full border-0 border-b border-solid border-(--color-palette-primary) bg-transparent py-2 text-(--color-text-primary) outline-none placeholder:text-(--color-text-subtitle)"
              />
            </div>
          </div>

          <Button
            type="button"
            variant="primary"
            className="typo-body2 h-9! w-full"
            disabled={query.trim().length === 0}
            onClick={onSearch}
          >
            검색하기
          </Button>
        </div>
      </div>
    </div>
  )
}
