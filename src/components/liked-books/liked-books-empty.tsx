import BookIllustration from '@/assets/svgs/book.svg?react'

export function LikedBooksEmpty() {
  return (
    <div className="flex flex-col items-center gap-4 py-16">
      <BookIllustration aria-hidden width={80} height={80} className="size-20" />
      <p className="typo-caption text-(--color-text-secondary)">찜한 책이 없습니다.</p>
    </div>
  )
}
