import { useState } from 'react'
import { BookList } from '@/components/book-list'
import { LikedBooksCount, LikedBooksEmpty } from '@/components/liked-books'
import { useBookLike } from '@/hooks/use-book-like'

export function LikePage() {
  const { likedBooks } = useBookLike()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const total = likedBooks.length

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <h1 className="typo-title2 text-(--color-text-title)">내가 찜한 책</h1>
      <LikedBooksCount total={total} className="mt-4" />

      {total === 0 ? (
        <LikedBooksEmpty />
      ) : (
        <>
          <BookList
            books={likedBooks}
            expandedId={expandedId}
            onToggleExpand={(id) => setExpandedId((cur) => (cur === id ? null : id))}
          />
        </>
      )}
    </div>
  )
}
