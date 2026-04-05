import { useCallback, useState } from 'react'

export function useBookLike() {
  const [likedIds, setLikedIds] = useState<Set<string>>(() => new Set())

  const toggleLike = useCallback((id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const isLiked = useCallback((id: string) => likedIds.has(id), [likedIds])

  return { likedIds, toggleLike, isLiked }
}
