import type { KakaoBookDocument } from '@/apis/book-search'
import { Button } from '@/components/@ui/button'
import { BookLikeButton } from './book-like-button'
import { formatKrw } from '@/lib/book-text'
import { ExpandChevron } from './expand-chevron'

interface BookListItemExpandedProps {
  book: KakaoBookDocument
  isLiked: boolean
  onToggleExpand: () => void
  onToggleLike: () => void
}

export function BookListItemExpanded({
  book,
  isLiked,
  onToggleExpand,
  onToggleLike,
}: BookListItemExpandedProps) {
  const showDiscount = book.sale_price !== -1
  const thumbnailUrl = (book.thumbnail ?? '').trim()
  const hasThumbnail = thumbnailUrl.length > 0

  return (
    <li className="border-b border-[#d2d6da] pl-[54px] pt-[24px] pr-[16px] pb-[40px]">
      <div className="flex flex-row gap-8">
        <div className="relative h-[280px] w-[210px]">
          {hasThumbnail ? (
            <img src={thumbnailUrl} alt="" className="size-full object-cover" loading="lazy" />
          ) : (
            <div className="size-full bg-(--color-palette-light-gray)" aria-hidden />
          )}
          <BookLikeButton isLiked={isLiked} onToggle={onToggleLike} size="lg" />
        </div>

        <div className="flex flex-1 flex-col mt-5">
          <div className="flex flex-wrap items-center gap-4">
            <h3 className="typo-title3 text-(--color-text-primary) leading-[26px]!">
              {book.title}
            </h3>
            <p className="typo-body2 text-(--color-text-subtitle)">{book.authors.join(', ')}</p>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <p className="typo-body2-bold text-(--color-text-primary)">책 소개</p>
            <p className="typo-small text-(--color-text-primary) leading-[16px]! whitespace-pre-wrap wrap-break-word">
              {book.contents}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between gap-4">
          <Button variant="secondary" className="w-[115px] gap-1 pr-3" onClick={onToggleExpand}>
            상세보기
            <ExpandChevron expanded />
          </Button>
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-end gap-2">
                <span className="typo-small w-[37px] text-right text-(--color-text-subtitle)">
                  원가
                </span>
                <span
                  className={`typo-title3 text-(--color-text-primary) ${showDiscount ? 'line-through decoration-solid' : ''}`}
                >
                  {formatKrw(book.price)}
                </span>
              </div>
              {showDiscount && (
                <div className="flex items-center justify-end gap-2">
                  <span className="typo-small w-[37px] text-right text-(--color-text-subtitle)">
                    할인가
                  </span>
                  <span className="typo-title3 text-(--color-text-primary)">
                    {formatKrw(book.sale_price)}
                  </span>
                </div>
              )}
            </div>

            <Button
              variant="primary"
              className="w-[240px] max-w-full text-center"
              onClick={() => window.open(book.url, '_blank')}
            >
              구매하기
            </Button>
          </div>
        </div>
      </div>
    </li>
  )
}
