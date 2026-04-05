import { useState } from 'react'
import type { KakaoBookSearchTarget } from '@/apis'
import { BookSearchResults } from '@/components/book-search-results'
import { BookSearch } from '@/components/book-search/book-search'

export function HomePage() {
  const [input, setInput] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [searchTarget, setSearchTarget] = useState<KakaoBookSearchTarget | undefined>(undefined)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <>
      <BookSearch
        value={input}
        onChange={setInput}
        onSubmit={(query) => {
          setExpandedId(null)
          setSearchTarget(undefined)
          setSubmittedQuery(query)
        }}
        onAdvancedSearch={({ query, target }) => {
          setExpandedId(null)
          setInput('')
          setSearchTarget(target)
          setSubmittedQuery(query)
        }}
      />
      <BookSearchResults
        submittedQuery={submittedQuery}
        searchTarget={searchTarget}
        expandedId={expandedId}
        setExpandedId={setExpandedId}
      />
    </>
  )
}
