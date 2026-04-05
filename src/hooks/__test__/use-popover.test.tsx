import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { usePopoverState } from '../use-popover'

describe('usePopoverState', () => {
  it('toggle으로 열고 닫는다', () => {
    const { result } = renderHook(() => usePopoverState())
    expect(result.current.open).toBe(false)
    act(() => {
      result.current.toggle()
    })
    expect(result.current.open).toBe(true)
    act(() => {
      result.current.toggle()
    })
    expect(result.current.open).toBe(false)
  })

  it('close는 항상 닫는다', () => {
    const { result } = renderHook(() => usePopoverState(true))
    expect(result.current.open).toBe(true)
    act(() => {
      result.current.close()
    })
    expect(result.current.open).toBe(false)
  })

  it('setOpen으로 직접 제어한다', () => {
    const { result } = renderHook(() => usePopoverState())
    act(() => {
      result.current.setOpen(true)
    })
    expect(result.current.open).toBe(true)
  })

  it('초기값 initialOpen을 반영한다', () => {
    const { result } = renderHook(() => usePopoverState(true))
    expect(result.current.open).toBe(true)
  })
})
