import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { KakaoBookDocument } from '@/apis/book-search'
import { BookListItem } from '../book-list-item'

function renderItem(ui: ReactElement) {
  return render(ui, { reactStrictMode: false })
}

function collapsedRow() {
  const rows = screen.getAllByRole('listitem')
  const match = rows.filter((el) => within(el).queryByText('책 소개') === null)
  expect(match.length).toBeGreaterThan(0)
  return within(match.at(-1)!)
}

function expandedRow() {
  const rows = screen.getAllByRole('listitem')
  const match = rows.filter((el) => within(el).queryByText('책 소개') !== null)
  expect(match.length).toBeGreaterThan(0)
  return within(match.at(-1)!)
}

const sampleBook: KakaoBookDocument = {
  title: '리액트 테스트',
  contents: '책 소개 본문입니다.',
  url: 'https://example.com/purchase',
  isbn: '978-list-item',
  datetime: '2024-06-01T00:00:00',
  authors: ['김저자'],
  publisher: '출판사',
  translators: [],
  price: 20000,
  sale_price: 18000,
  thumbnail: '',
  status: '정상',
}

describe('BookListItem', () => {
  let openSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
  })

  afterEach(() => {
    openSpy.mockRestore()
  })

  it('접힌 상태에서 상세보기를 누르면 onToggleExpand가 호출된다', async () => {
    const user = userEvent.setup()
    const onToggleExpand = vi.fn()

    renderItem(
      <BookListItem
        book={sampleBook}
        isExpanded={false}
        isLiked={false}
        onToggleExpand={onToggleExpand}
        onToggleLike={vi.fn()}
      />
    )

    await user.click(collapsedRow().getByRole('button', { name: /상세보기/i }))
    expect(onToggleExpand).toHaveBeenCalledTimes(1)
  })

  it('접힌 상태에서 구매하기를 누르면 새 탭으로 book.url을 연다', async () => {
    const user = userEvent.setup()

    renderItem(
      <BookListItem
        book={sampleBook}
        isExpanded={false}
        isLiked={false}
        onToggleExpand={vi.fn()}
        onToggleLike={vi.fn()}
      />
    )

    await user.click(collapsedRow().getByRole('button', { name: /구매하기/i }))
    expect(openSpy).toHaveBeenCalledWith(sampleBook.url, '_blank')
  })

  it('펼친 상태에서 책 소개와 본문이 보인다', () => {
    renderItem(
      <BookListItem
        book={sampleBook}
        isExpanded
        isLiked={false}
        onToggleExpand={vi.fn()}
        onToggleLike={vi.fn()}
      />
    )

    const row = expandedRow()
    expect(row.getByText('책 소개')).toBeInTheDocument()
    expect(row.getByText(sampleBook.contents)).toBeInTheDocument()
  })

  it('펼친 상태에서 상세보기를 누르면 onToggleExpand가 호출된다', async () => {
    const user = userEvent.setup()
    const onToggleExpand = vi.fn()

    renderItem(
      <BookListItem
        book={sampleBook}
        isExpanded
        isLiked={false}
        onToggleExpand={onToggleExpand}
        onToggleLike={vi.fn()}
      />
    )

    await user.click(expandedRow().getByRole('button', { name: /상세보기/i }))
    expect(onToggleExpand).toHaveBeenCalledTimes(1)
  })

  it('펼친 상태에서 구매하기를 누르면 새 탭으로 book.url을 연다', async () => {
    const user = userEvent.setup()

    renderItem(
      <BookListItem
        book={sampleBook}
        isExpanded
        isLiked={false}
        onToggleExpand={vi.fn()}
        onToggleLike={vi.fn()}
      />
    )

    await user.click(expandedRow().getByRole('button', { name: /구매하기/i }))
    expect(openSpy).toHaveBeenCalledWith(sampleBook.url, '_blank')
  })

  it('찜하기 버튼을 누르면 onToggleLike가 호출된다', async () => {
    const user = userEvent.setup()
    const onToggleLike = vi.fn()

    renderItem(
      <BookListItem
        book={sampleBook}
        isExpanded={false}
        isLiked={false}
        onToggleExpand={vi.fn()}
        onToggleLike={onToggleLike}
      />
    )

    await user.click(collapsedRow().getByRole('button', { name: '찜하기' }))
    expect(onToggleLike).toHaveBeenCalledTimes(1)
  })

  it('찜된 상태에서는 찜 해제 버튼이 보인다', async () => {
    const user = userEvent.setup()
    const onToggleLike = vi.fn()

    renderItem(
      <BookListItem
        book={sampleBook}
        isExpanded={false}
        isLiked
        onToggleExpand={vi.fn()}
        onToggleLike={onToggleLike}
      />
    )

    await user.click(collapsedRow().getByRole('button', { name: '찜 해제' }))
    expect(onToggleLike).toHaveBeenCalledTimes(1)
  })
})
