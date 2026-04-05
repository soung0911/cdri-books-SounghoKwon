import type { KakaoBookSearchTarget } from '@/apis'

export const DETAIL_SEARCH_FIELD_OPTIONS: { value: KakaoBookSearchTarget; label: string }[] = [
  { value: 'person', label: '저자명' },
  { value: 'publisher', label: '출판사' },
]

export const DEFAULT_DETAIL_SEARCH_TARGET: KakaoBookSearchTarget = 'person'

export const BOOK_SEARCH_PAGE_SIZE = 10

export const BOOK_SEARCH_INFINITE_ROOT_MARGIN_PX = 240

export const SEARCH_HISTORY_STORAGE_KEY = 'cdri-books-search-history'

export const SEARCH_HISTORY_MAX_ITEMS = 8
