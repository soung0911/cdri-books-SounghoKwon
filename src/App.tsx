import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout'
import { ROUTES } from '@/constants'

function EmptyPage() {
  return null
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={ROUTES.HOME} element={<EmptyPage />} />
        <Route path={ROUTES.LIKE} element={<EmptyPage />} />
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Route>
    </Routes>
  )
}
