import { Outlet } from 'react-router-dom'
import Header from './header'

export default function AppLayout() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full mx-auto max-w-[960px] pt-[80px] px-6 py-8">
        <Outlet />
      </main>
    </>
  )
}
