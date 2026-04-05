import LikeFillIcon from '@/assets/svgs/like-fill.svg?react'
import LikeLineIcon from '@/assets/svgs/like-line.svg?react'

type BookLikeButtonSize = 'lg' | 'sm'

interface BookLikeButtonProps {
  isLiked: boolean
  onToggle: () => void
  size: BookLikeButtonSize
}

export function BookLikeButton({ isLiked, onToggle, size }: BookLikeButtonProps) {
  const isLarge = size === 'lg'

  return (
    <button
      aria-pressed={isLiked}
      aria-label={isLiked ? '찜 해제' : '찜하기'}
      className={isLarge ? 'absolute right-2 top-2' : 'absolute right-0 top-0'}
      onClick={onToggle}
    >
      {isLiked ? (
        <LikeFillIcon
          aria-hidden
          width={isLarge ? 24 : 16}
          height={isLarge ? 24 : 16}
          className={isLarge ? 'size-6' : 'size-4'}
        />
      ) : (
        <LikeLineIcon
          aria-hidden
          width={isLarge ? 24 : 16}
          height={isLarge ? 24 : 16}
          className={isLarge ? 'size-6' : 'size-4'}
        />
      )}
    </button>
  )
}
