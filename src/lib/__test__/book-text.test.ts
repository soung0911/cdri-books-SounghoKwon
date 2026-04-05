import { describe, expect, it } from 'vitest'
import { formatKrw } from '../book-text'

describe('formatKrw', () => {
  it('한국 로케일 숫자와 원 접미사를 붙인다', () => {
    expect(formatKrw(12000)).toBe(
      `${new Intl.NumberFormat('ko-KR').format(12000)}원`,
    )
  })

  it('0원을 처리한다', () => {
    expect(formatKrw(0)).toBe('0원')
  })
})
