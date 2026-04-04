import { Route, Routes } from 'react-router-dom'

function HomePage() {
  return null
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  )
}
