import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { SEARCH_HISTORY_MAX_ITEMS, SEARCH_HISTORY_STORAGE_KEY } from '@/constants'
import { useSearchHistory } from '../use-search-history'

describe('useSearchHistory', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('trim한 검색어를 맨 앞에 넣고 localStorage에 저장한다', () => {
    const { result } = renderHook(() => useSearchHistory())
    act(() => {
      result.current.add('  hello  ')
    })
    expect(result.current.items).toEqual(['hello'])
    expect(JSON.parse(localStorage.getItem(SEARCH_HISTORY_STORAGE_KEY)!)).toEqual(['hello'])
  })

  it('중복이면 맨 앞으로 옮긴다', () => {
    const { result } = renderHook(() => useSearchHistory())
    act(() => {
      result.current.add('a')
      result.current.add('b')
      result.current.add('a')
    })
    expect(result.current.items).toEqual(['a', 'b'])
  })

  it('빈 문자열은 추가하지 않는다', () => {
    const { result } = renderHook(() => useSearchHistory())
    act(() => {
      result.current.add('   ')
    })
    expect(result.current.items).toEqual([])
  })

  it('remove로 항목을 제거한다', () => {
    const { result } = renderHook(() => useSearchHistory())
    act(() => {
      result.current.add('x')
      result.current.remove('x')
    })
    expect(result.current.items).toEqual([])
    expect(localStorage.getItem(SEARCH_HISTORY_STORAGE_KEY)).toBe('[]')
  })

  it('최대 개수를 넘지 않는다', () => {
    const { result } = renderHook(() => useSearchHistory())
    act(() => {
      for (let i = 0; i < SEARCH_HISTORY_MAX_ITEMS + 3; i++) {
        result.current.add(`q${i}`)
      }
    })
    expect(result.current.items).toHaveLength(SEARCH_HISTORY_MAX_ITEMS)
  })
})
