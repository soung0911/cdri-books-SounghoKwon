import type { KakaoBookDocument } from '@/apis/book-search'
import { getKakaoBookId } from '@/lib/kakao-book-id'
import { useBookLike } from '@/hooks/use-book-like'
import { BookListItem } from './book-list-item'

export interface BookListProps {
  books: KakaoBookDocument[]
  expandedId: string | null
  onToggleExpand: (id: string) => void
}

export function BookList({ books, expandedId, onToggleExpand }: BookListProps) {
  const { isLiked, toggleLike } = useBookLike()

  if (books.length === 0) return null

  return (
    <ul className="mt-6 list-none p-0">
      {books.map((book) => {
        const id = getKakaoBookId(book)
        return (
          <BookListItem
            key={id}
            book={book}
            isExpanded={expandedId === id}
            isLiked={isLiked(book)}
            onToggleExpand={() => onToggleExpand(id)}
            onToggleLike={() => toggleLike(book)}
          />
        )
      })}
    </ul>
  )
}
