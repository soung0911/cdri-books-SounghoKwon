import type { KakaoBookDocument } from '@/apis/book-search'
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
      {books.map((book) => (
        <BookListItem
          key={book.isbn}
          book={book}
          isExpanded={expandedId === book.isbn}
          isLiked={isLiked(book)}
          onToggleExpand={() => onToggleExpand(book.isbn)}
          onToggleLike={() => toggleLike(book)}
        />
      ))}
    </ul>
  )
}
