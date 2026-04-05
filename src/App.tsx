import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/@layout'
import { ROUTES } from '@/constants'
import { HomePage, LikePage } from '@/pages'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.LIKE} element={<LikePage />} />
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Route>
    </Routes>
  )
}
