import type { KakaoBookDocument } from '@/apis/book-search'
import { Button } from '@/components/ui/button'
import { BookLikeButton } from './book-like-button'
import { formatKrw } from '@/lib/book-text'
import { ExpandChevron } from './expand-chevron'

interface BookListItemCollapsedProps {
  book: KakaoBookDocument
  isLiked: boolean
  onToggleExpand: () => void
  onToggleLike: () => void
}

export function BookListItemCollapsed({
  book,
  isLiked,
  onToggleExpand,
  onToggleLike,
}: BookListItemCollapsedProps) {
  const thumbnailUrl = (book.thumbnail ?? '').trim()
  const hasThumbnail = thumbnailUrl.length > 0

  return (
    <article className="flex h-[100px] items-center border-b border-[#d2d6da] pl-12 pr-4">
      <div className="relative h-[68px] w-12">
        {hasThumbnail ? (
          <img src={thumbnailUrl} alt="" className="size-full object-cover" loading="lazy" />
        ) : (
          <div className="size-full bg-(--color-palette-light-gray)" aria-hidden />
        )}
        <BookLikeButton isLiked={isLiked} onToggle={onToggleLike} size="sm" />
      </div>

      <div className="ml-6 flex min-w-0 flex-1 items-center gap-4 overflow-hidden">
        <h3 className="typo-title3 truncate text-(--color-text-primary)">{book.title}</h3>
        <p className="typo-body2 text-(--color-text-secondary) block">
          {book.authors.join(', ')}
        </p>
      </div>

      <p className="typo-title3 mx-4 hidden w-[120px] text-right text-(--color-text-primary) sm:block">
        {formatKrw(book.sale_price !== -1 ? book.sale_price : book.price)}
      </p>

      <div className="ml-auto flex items-center gap-2">
        <Button
          type="button"
          variant="primary"
          className="text-center"
          onClick={() => window.open(book.url, '_blank')}
        >
          구매하기
        </Button>
        <Button type="button" variant="secondary" className="gap-1 pr-3" onClick={onToggleExpand}>
          상세보기
          <ExpandChevron expanded={false} />
        </Button>
      </div>
    </article>
  )
}
