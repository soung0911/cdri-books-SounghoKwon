import type { KakaoBookDocument } from '@/apis/book-search'
import { useBookLike } from '@/hooks/use-book-like'
import { BookListItem } from './book-list-item'

function bookRowId(book: { isbn: string }, index: number): string {
  return `${book.isbn}-${index}`
}

export interface BookListProps {
  books: KakaoBookDocument[]
  expandedId: string | null
  onToggleExpand: (id: string) => void
}

export function BookList({ books, expandedId, onToggleExpand }: BookListProps) {
  const { likedIds, toggleLike } = useBookLike()

  if (books.length === 0) return null

  return (
    <div className="mt-6">
      {books.map((book, index) => {
        const id = bookRowId(book, index)
        return (
          <BookListItem
            key={id}
            book={book}
            isExpanded={expandedId === id}
            isLiked={likedIds.has(id)}
            onToggleExpand={() => onToggleExpand(id)}
            onToggleLike={() => toggleLike(id)}
          />
        )
      })}
    </div>
  )
}
