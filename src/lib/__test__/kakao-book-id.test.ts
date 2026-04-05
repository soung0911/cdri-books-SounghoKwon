import { describe, expect, it } from 'vitest'
import type { KakaoBookDocument } from '@/apis/book-search'
import { getKakaoBookId } from '../kakao-book-id'

function makeDoc(overrides: Partial<KakaoBookDocument> = {}): KakaoBookDocument {
  return {
    title: '기본 제목',
    contents: '',
    url: '',
    isbn: '978-default',
    datetime: '2024-01-01T00:00:00',
    authors: [],
    publisher: '',
    translators: [],
    price: 0,
    sale_price: 0,
    thumbnail: '',
    status: '',
    ...overrides,
  }
}

describe('getKakaoBookId', () => {
  it('trim한 url이 있으면 url을 id로 쓴다', () => {
    expect(
      getKakaoBookId(makeDoc({ url: '  https://purchase.example/item/1  ' })),
    ).toBe('https://purchase.example/item/1')
  })

  it('url이 비어 있으면 isbn·datetime·title을 구분자로 이어 붙인다', () => {
    const book = makeDoc({
      url: '',
      isbn: '978-abc',
      datetime: '2025-01-01',
      title: '책',
    })
    expect(getKakaoBookId(book)).toBe('978-abc|2025-01-01|책')
  })

  it('공백만 있는 url은 없는 것과 같이 fallback을 쓴다', () => {
    const book = makeDoc({
      url: '   \t  ',
      isbn: 'x',
      datetime: 'y',
      title: 'z',
    })
    expect(getKakaoBookId(book)).toBe('x|y|z')
  })

  it('같은 isbn이라도 url이 다르면 서로 다른 id다', () => {
    const a = makeDoc({ isbn: '978-same', url: 'https://a' })
    const b = makeDoc({ isbn: '978-same', url: 'https://b' })
    expect(getKakaoBookId(a)).not.toBe(getKakaoBookId(b))
  })

  it('url이 없을 때 제목이 다르면 fallback id도 다르다', () => {
    const base = { url: '', isbn: '978-same', datetime: '2024-06-01' }
    expect(getKakaoBookId(makeDoc({ ...base, title: '상' }))).not.toBe(
      getKakaoBookId(makeDoc({ ...base, title: '하' })),
    )
  })
})
