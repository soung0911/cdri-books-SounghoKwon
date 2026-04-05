import { KAKAO_BOOK_SEARCH_PATH } from '@/constants'
import axiosInstance from './axios-instance'

export type KakaoBookSearchSort = 'accuracy' | 'latest'
export type KakaoBookSearchTarget = 'title' | 'isbn' | 'publisher' | 'person'

export interface KakaoBookSearchParams {
  query: string
  sort?: KakaoBookSearchSort
  page?: number
  size?: number
  target?: KakaoBookSearchTarget
}

export interface KakaoBookDocument {
  title: string
  contents: string
  url: string
  isbn: string
  datetime: string
  authors: string[]
  publisher: string
  translators: string[]
  price: number
  sale_price: number
  thumbnail: string
  status: string
}

export interface KakaoBookSearchResponse {
  meta: {
    total_count: number
    pageable_count: number
    is_end: boolean
  }
  documents: KakaoBookDocument[]
}

export const getSearchBooks = async (
  params: KakaoBookSearchParams
): Promise<KakaoBookSearchResponse> => {
  const { data } = await axiosInstance.get<KakaoBookSearchResponse>(KAKAO_BOOK_SEARCH_PATH, {
    params,
  })
  return data
}
