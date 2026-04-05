import ExpandIcon from '@/assets/svgs/expand.svg?react'

interface ExpandChevronProps {
  expanded: boolean
}

export function ExpandChevron({ expanded }: ExpandChevronProps) {
  return (
    <ExpandIcon
      aria-hidden
      width={14}
      height={8}
      className={`transition-transform duration-200 ${expanded ? 'rotate-180' : 'rotate-0'}`}
    />
  )
}
