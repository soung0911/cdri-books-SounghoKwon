import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { KakaoBookSearchTarget } from '@/apis'
import { SEARCH_HISTORY_STORAGE_KEY } from '@/constants'
import { BookSearch } from '../book-search'

function ControlledBookSearch(props: {
  initialValue?: string
  onSubmit?: (q: string) => void
  onDetailSearch?: (p: { query: string; target: KakaoBookSearchTarget }) => void
}) {
  const [value, setValue] = useState(props.initialValue ?? '')
  return (
    <BookSearch
      value={value}
      onChange={setValue}
      onSubmit={props.onSubmit ?? vi.fn()}
      onDetailSearch={props.onDetailSearch ?? vi.fn()}
    />
  )
}

describe('BookSearch', () => {
  beforeEach(() => {
    localStorage.removeItem(SEARCH_HISTORY_STORAGE_KEY)
  })

  it('검색어 입력 후 Enter면 trim한 값으로 onSubmit을 호출하고 기록에 남긴다', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<ControlledBookSearch onSubmit={onSubmit} />, { reactStrictMode: false })

    const input = screen.getAllByLabelText('검색어').at(-1)!
    await user.click(input)
    await user.keyboard('  토비의 스프링  ')
    await user.keyboard('{Enter}')

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith('토비의 스프링')

    const raw = localStorage.getItem(SEARCH_HISTORY_STORAGE_KEY)
    expect(raw).toBeTruthy()
    expect(JSON.parse(raw!)).toContain('토비의 스프링')
  })

  it('빈 검색어로 Enter면 onSubmit을 호출하지 않는다', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<ControlledBookSearch initialValue="   " onSubmit={onSubmit} />, {
      reactStrictMode: false,
    })

    const input = screen.getAllByLabelText('검색어').at(-1)!
    await user.click(input)
    await user.keyboard('{Enter}')

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('검색 기록이 있으면 포커스 시 기록을 보여주고 항목 클릭 시 검색한다', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(['이전검색']))

    render(<ControlledBookSearch onSubmit={onSubmit} />, { reactStrictMode: false })

    const input = screen.getAllByLabelText('검색어').at(-1)!
    await user.click(input)

    const listbox = screen.getAllByRole('listbox', { name: '검색 기록' }).at(-1)!
    await user.click(within(listbox).getByRole('button', { name: '이전검색' }))

    expect(onSubmit).toHaveBeenCalledWith('이전검색')
  })

  it('상세검색 버튼을 누르면 다이얼로그가 열린다', async () => {
    const user = userEvent.setup()

    render(<ControlledBookSearch />, { reactStrictMode: false })

    const triggers = screen.getAllByRole('button', { name: '상세검색' })
    await user.click(triggers.at(-1)!)

    const dialogs = screen.getAllByRole('dialog', { name: '상세 검색' })
    expect(dialogs.length).toBeGreaterThan(0)
  })

  it('상세검색에서 검색하기를 누르면 onDetailSearch를 호출한다', async () => {
    const user = userEvent.setup()
    const onDetailSearch = vi.fn()

    render(<ControlledBookSearch onDetailSearch={onDetailSearch} />, { reactStrictMode: false })

    await user.click(screen.getAllByRole('button', { name: '상세검색' }).at(-1)!)

    const dialog = screen.getAllByRole('dialog', { name: '상세 검색' }).at(-1)!
    const queryInput = within(dialog).getByPlaceholderText('검색어 입력')
    await user.clear(queryInput)
    await user.type(queryInput, '저자찾기')

    await user.click(within(dialog).getByRole('button', { name: '검색하기' }))

    expect(onDetailSearch).toHaveBeenCalledTimes(1)
    expect(onDetailSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        query: '저자찾기',
        target: expect.any(String),
      }),
    )
  })
})
