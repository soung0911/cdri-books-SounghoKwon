interface SearchResultCountProps {
  total: number
}

export function SearchResultCount({ total }: SearchResultCountProps) {
  return (
    <div className="mt-6 flex flex-wrap items-baseline gap-4 text-(--color-text-primary)">
      <p className="typo-caption leading-6">도서 검색 결과</p>
      <p className="typo-caption leading-6">
        <span>총 </span>
        <span className="text-(--color-palette-primary)">{total}</span>
        <span>건</span>
      </p>
    </div>
  )
}
