import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export function AppLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-(--color-palette-white)">
      <Header />
      <main className="w-full flex-1 mx-auto pt-[80px]">
        <Outlet />
      </main>
    </div>
  )
}
