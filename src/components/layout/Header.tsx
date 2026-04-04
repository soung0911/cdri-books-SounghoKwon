import { Link, useLocation } from 'react-router-dom'
import { NAV_ITEMS, ROUTES } from '@/constants'

export function Header() {
  const { pathname } = useLocation()

  return (
    <header className="flex h-[80px] w-full items-center bg-(--color-palette-white) px-[160px] py-[24px]">
      <div className="flex min-w-0 flex-1 items-center gap-[400px]">
        <Link
          to={ROUTES.HOME}
          className="typo-title1 w-fit shrink-0 text-(--color-text-primary)"
        >
          CERTICOS BOOKS
        </Link>
        <nav className="flex gap-[56px]" aria-label="주요 메뉴">
          {NAV_ITEMS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`typo-body1 border-b-2 pb-1 text-(--color-text-primary) ${
                pathname === to ? 'border-(--color-palette-primary)' : 'border-transparent'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
