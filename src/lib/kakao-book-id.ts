import type { KakaoBookDocument } from '@/apis/book-search'

export function getKakaoBookId(book: KakaoBookDocument): string {
  const url = book.url.trim()
  if (url.length > 0) return url
  return [book.isbn, book.datetime, book.title].join('|')
}
