import { ROUTES } from './routes'

export const NAV_ITEMS = [
  { to: ROUTES.HOME, label: '도서 검색' },
  { to: ROUTES.LIKE, label: '내가 찜한 책' },
] as const
