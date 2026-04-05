import BookIllustration from '@/assets/svgs/book.svg?react'

export function BookSearchEmpty() {
  return (
    <div className="flex flex-col items-center gap-4 py-16">
      <BookIllustration aria-hidden width={80} height={80} className="size-20" />
      <p className="typo-caption text-(--color-text-secondary)">검색된 결과가 없습니다.</p>
    </div>
  )
}
