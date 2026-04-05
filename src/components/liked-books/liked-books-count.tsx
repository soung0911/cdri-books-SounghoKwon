interface LikedBooksCountProps {
  total: number
  className?: string
}

export function LikedBooksCount({ total, className = '' }: LikedBooksCountProps) {
  return (
    <div className={`flex flex-wrap items-baseline gap-4 text-(--color-text-primary) ${className}`}>
      <p className="typo-caption leading-6">찜한 책</p>
      <p className="typo-caption leading-6">
        <span>총 </span>
        <span className="text-(--color-palette-primary)">{total}</span>
        <span>건</span>
      </p>
    </div>
  )
}
