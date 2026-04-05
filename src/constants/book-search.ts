import type { KakaoBookSearchTarget } from '@/apis'

/** 상세 검색 필드(카카오 `target`과 대응) */
export const ADVANCED_SEARCH_FIELD_OPTIONS: { value: KakaoBookSearchTarget; label: string }[] = [
  { value: 'title', label: '제목' },
  { value: 'isbn', label: 'ISBN' },
  { value: 'publisher', label: '출판사' },
  { value: 'person', label: '저자명' },
]

export const DEFAULT_ADVANCED_SEARCH_TARGET: KakaoBookSearchTarget = 'title'

/** API·무한 스크롤 페이지 크기 (피그마: 페이지당 10개) */
export const BOOK_SEARCH_PAGE_SIZE = 10

/** 무한 스크롤 교차 관찰 rootMargin (px) */
export const BOOK_SEARCH_INFINITE_ROOT_MARGIN_PX = 240

export const SEARCH_HISTORY_STORAGE_KEY = 'cdri-books-search-history'

export const SEARCH_HISTORY_MAX_ITEMS = 8
