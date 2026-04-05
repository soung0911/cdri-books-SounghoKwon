import type { KakaoBookDocument } from '@/apis/book-search'
import { BookListItemCollapsed } from './book-list-item-collapsed'
import { BookListItemExpanded } from './book-list-item-expanded'

interface BookListItemProps {
  book: KakaoBookDocument
  isExpanded: boolean
  isLiked: boolean
  onToggleExpand: () => void
  onToggleLike: () => void
}

export function BookListItem({
  book,
  isExpanded,
  isLiked,
  onToggleExpand,
  onToggleLike,
}: BookListItemProps) {
  const shared = { book, isLiked, onToggleExpand, onToggleLike }

  if (isExpanded) {
    return <BookListItemExpanded {...shared} />
  }

  return <BookListItemCollapsed {...shared} />
}
